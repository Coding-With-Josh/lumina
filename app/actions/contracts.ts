"use server";

import { db } from "@/lib/db/drizzle";
import { campaignParticipants, contracts } from "@/lib/db/schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/db/queries";
import { and, eq } from "drizzle-orm";

const createContractSchema = z.object({
  brandId: z.number(),
  creatorId: z.number(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  amount: z.number().min(1, "Amount must be greater than 0"),
  currency: z.string().default("USD"),
  deliverables: z
    .array(z.string())
    .min(1, "At least one deliverable is required"),
  dueDate: z.string().optional(), // ISO string
  campaignId: z.number(),
});

export async function createContract(
  data: z.infer<typeof createContractSchema>
) {
  const user = await getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validate input
  const validated = createContractSchema.safeParse(data);
  if (!validated.success) {
    return { error: "Invalid input", details: validated.error.flatten() };
  }

  try {
    const { deliverables, ...rest } = validated.data;

    const [inserted] = await db
      .insert(contracts)
      .values({
        ...rest,
        deliverables: JSON.stringify(deliverables),
        dueDate: rest.dueDate ? new Date(rest.dueDate) : undefined,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/dashboard/messages");
    return { success: true, contractId: inserted.id };
  } catch (error) {
    console.error("Failed to create contract:", error);
    return { error: "Failed to create offer" };
  }
}

export async function acceptContract(contractId: number) {
  const user = await getUser();
  if (!user) return { error: "Unauthorized" };

  try {
    // Ensure the contract exists and belongs to this creator
    const [contract] = await db
      .select()
      .from(contracts)
      .where(
        and(eq(contracts.id, contractId), eq(contracts.creatorId, user.id))
      );

    if (!contract) {
      return { error: "Offer not found" };
    }

    // Upsert participant into campaign
    if (contract.campaignId) {
      const [existing] = await db
        .select()
        .from(campaignParticipants)
        .where(
          and(
            eq(campaignParticipants.campaignId, contract.campaignId),
            eq(campaignParticipants.creatorId, user.id)
          )
        );

      if (!existing) {
        await db.insert(campaignParticipants).values({
          campaignId: contract.campaignId,
          creatorId: user.id,
          status: "joined",
        });
      }
    }

    await db
      .update(contracts)
      .set({ status: "accepted", updatedAt: new Date() })
      .where(eq(contracts.id, contractId));

    revalidatePath("/dashboard/messages");
    return { success: true };
  } catch (error) {
    console.error("Failed to accept contract:", error);
    return { error: "Failed to accept offer" };
  }
}
