"use server";

import { db } from "@/lib/db/drizzle";
import {
  conversations,
  messages,
  conversationParticipants,
  users,
  type User,
} from "@/lib/db/schema";
import { eq, and, desc, ne, sql, inArray } from "drizzle-orm";
import { getUser } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

export async function getConversations() {
  const user = await getUser();
  if (!user) return [];

  // 1. Get all conversation IDs where the current user is a participant
  const userConversations = await db
    .select({
      conversationId: conversationParticipants.conversationId,
      lastReadAt: conversationParticipants.lastReadAt,
    })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, user.id));

  if (userConversations.length === 0) return [];

  const conversationIds = userConversations.map((c) => c.conversationId);

  // 2. Fetch details for these conversations, including the OTHER participant and the last message
  // This is a bit complex with Drizzle, so we might do it in a few queries or a join.
  // For simplicity and correctness, let's iterate (or optimize later).
  // Actually, let's try to get the other participant for each conversation.

  const results = await Promise.all(
    userConversations.map(async (uc) => {
      // Get other participant
      const [otherParticipant] = await db
        .select({
          user: users,
        })
        .from(conversationParticipants)
        .innerJoin(users, eq(conversationParticipants.userId, users.id))
        .where(
          and(
            eq(conversationParticipants.conversationId, uc.conversationId),
            ne(conversationParticipants.userId, user.id)
          )
        )
        .limit(1);

      // Get last message
      const [lastMessage] = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, uc.conversationId))
        .orderBy(desc(messages.createdAt))
        .limit(1);

      // Count unread messages
      const [unreadCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(messages)
        .where(
          and(
            eq(messages.conversationId, uc.conversationId),
            uc.lastReadAt
              ? sql`${messages.createdAt} > ${uc.lastReadAt}`
              : sql`1=1` // If never read, all are unread
          )
        );

      return {
        id: uc.conversationId,
        participants: otherParticipant ? [otherParticipant.user] : [],
        lastMessage: lastMessage
          ? {
              ...lastMessage,
              type: "text" as const, // schema doesn't have type yet, assume text
              createdAt: lastMessage.createdAt?.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : null,
        unreadCount: Number(unreadCount?.count || 0),
        isPinned: false, // Schema doesn't have pinned yet
      };
    })
  );

  // Filter out conversations with no messages or no other participant if desired
  // For now, keep them.
  return results.sort((a, b) => {
    // Sort by last message date
    const dateA = a.lastMessage
      ? new Date(a.lastMessage.createdAt || 0)
      : new Date(0);
    const dateB = b.lastMessage
      ? new Date(b.lastMessage.createdAt || 0)
      : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });
}

export async function getMessages(conversationId: number) {
  const user = await getUser();
  if (!user) return [];

  // Verify participation
  const [participation] = await db
    .select()
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, user.id)
      )
    );

  if (!participation) return [];

  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(sql`${messages.createdAt} ASC`); // Oldest first for chat history

  return msgs.map((m) => ({
    ...m,
    type: "text" as const,
    createdAt: m.createdAt?.toISOString?.() || new Date().toISOString(),
  }));
}

export async function sendMessage(conversationId: number, content: string) {
  const user = await getUser();
  if (!user) return { error: "Unauthorized" };

  try {
    const [newMessage] = await db
      .insert(messages)
      .values({
        conversationId,
        senderId: user.id,
        content,
      })
      .returning();

    revalidatePath("/dashboard/messages");
    return { success: true, message: newMessage };
  } catch (error) {
    console.error("Failed to send message:", error);
    return { error: "Failed to send message" };
  }
}

export async function startConversation(otherUserId: number) {
  const user = await getUser();
  if (!user) return { error: "Unauthorized" };

  // Check if conversation already exists (1:1) with both participants
  const userConvs = await db
    .select({ conversationId: conversationParticipants.conversationId })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, user.id));

  const otherConvs = await db
    .select({ conversationId: conversationParticipants.conversationId })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, otherUserId));

  const otherSet = new Set(otherConvs.map((c) => c.conversationId));
  const existingId =
    userConvs.find((c) => otherSet.has(c.conversationId))?.conversationId ??
    null;

  if (existingId) {
    return { success: true, conversationId: existingId };
  }

  try {
    // Create new conversation
    const [newConv] = await db.insert(conversations).values({}).returning();

    // Add participants
    await db.insert(conversationParticipants).values([
      { conversationId: newConv.id, userId: user.id },
      { conversationId: newConv.id, userId: otherUserId },
    ]);

    revalidatePath("/dashboard/messages");
    return { success: true, conversationId: newConv.id };
  } catch (error) {
    return { error: "Failed to start conversation" };
  }
}

export async function startConversationByUsername(username: string) {
  const user = await getUser();
  if (!user) return { error: "Unauthorized" };

  const [target] = await db
    .select()
    .from(users)
    .where(eq(users.username, username));

  if (!target) {
    return { error: "User not found" };
  }

  // Find existing 1:1 conversation between user and target
  const userConvs = await db
    .select({ conversationId: conversationParticipants.conversationId })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, user.id));

  const targetConvs = await db
    .select({ conversationId: conversationParticipants.conversationId })
    .from(conversationParticipants)
    .where(eq(conversationParticipants.userId, target.id));

  const targetSet = new Set(targetConvs.map((c) => c.conversationId));
  const existingId =
    userConvs.find((c) => targetSet.has(c.conversationId))?.conversationId ??
    null;

  if (existingId) {
    return { success: true, conversationId: existingId };
  }

  // Otherwise create new conversation
  try {
    const [newConv] = await db.insert(conversations).values({}).returning();

    await db.insert(conversationParticipants).values([
      { conversationId: newConv.id, userId: user.id },
      { conversationId: newConv.id, userId: target.id },
    ]);

    revalidatePath("/dashboard/messages");
    return { success: true, conversationId: newConv.id };
  } catch (error) {
    return { error: "Failed to start conversation" };
  }
}

export async function deleteConversation(conversationId: number) {
  const user = await getUser();
  if (!user) return { error: "Unauthorized" };

  // Ensure user is a participant
  const [participation] = await db
    .select()
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, user.id)
      )
    );

  if (!participation) return { error: "Forbidden" };

  try {
    await db
      .delete(messages)
      .where(eq(messages.conversationId, conversationId));
    await db
      .delete(conversationParticipants)
      .where(eq(conversationParticipants.conversationId, conversationId));
    await db.delete(conversations).where(eq(conversations.id, conversationId));
    revalidatePath("/dashboard/messages");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete conversation:", error);
    return { error: "Failed to delete conversation" };
  }
}

type RichMessagePayload = {
  type: "text" | "image" | "link" | "voice" | "offer";
  text?: string;
  url?: string;
  durationMs?: number;
  fileName?: string;
  // Offer-specific fields
  contractId?: number;
  campaignId?: number;
  campaignTitle?: string;
  amount?: number;
  currency?: string;
  description?: string;
  deliverables?: string[];
  dueDate?: string;
  status?: "pending" | "accepted";
};

export async function sendRichMessage(
  conversationId: number,
  payload: RichMessagePayload
) {
  const user = await getUser();
  if (!user) return { error: "Unauthorized" };

  // Verify participation
  const [participation] = await db
    .select()
    .from(conversationParticipants)
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, user.id)
      )
    );

  if (!participation) return { error: "Forbidden" };

  const content =
    payload.type === "text" && payload.text
      ? payload.text
      : JSON.stringify(payload);

  try {
    const [newMessage] = await db
      .insert(messages)
      .values({
        conversationId,
        senderId: user.id,
        content,
      })
      .returning();

    revalidatePath("/dashboard/messages");
    return { success: true, message: newMessage };
  } catch (error) {
    console.error("Failed to send message:", error);
    return { error: "Failed to send message" };
  }
}
