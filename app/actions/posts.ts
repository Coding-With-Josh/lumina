import { z } from "zod";
import { posts, engagements, socialAccounts, campaignParticipants, fraudLogs } from "@/lib/db/schema";
import { db } from "@/lib/db/drizzle";
import { getUser } from "@/lib/db/queries";
import { fetchPostEngagement } from "@/lib/social/dataFetcher";
import { eq, and } from "drizzle-orm";
import { detectFraud } from "@/lib/ai/fraudDetector";

const createPostSchema = z.object({
  campaignId: z.number(),
  platform: z.string().min(1, "Platform is required"),
  postUrl: z.string().url("Must be a valid URL"),
});

export async function submitPost(formData: FormData) {
  const user = await getUser();
  if (!user || user.accountType !== "creator") {
    throw new Error("Unauthorized: Only creators can submit posts");
  }

  const campaignId = parseInt(formData.get("campaignId") as string);
  const platform = formData.get("platform") as string;
  const postUrl = formData.get("postUrl") as string;

  const result = createPostSchema.safeParse({ campaignId, platform, postUrl });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const data = result.data;

  try {
    // 1. Verify creator is a participant in the campaign
    const [participant] = await db
      .select()
      .from(campaignParticipants)
      .where(and(eq(campaignParticipants.campaignId, data.campaignId), eq(campaignParticipants.creatorId, user.id)));

    if (!participant) {
      throw new Error("Creator is not a participant in this campaign.");
    }

    // 2. Get social account access token
    const [socialAccount] = await db
      .select()
      .from(socialAccounts)
      .where(and(eq(socialAccounts.userId, user.id), eq(socialAccounts.platform, data.platform)));
    
    if (!socialAccount || !socialAccount.accessToken) {
      throw new Error(`No connected ${data.platform} account found or access token is missing.`);
    }

    // 3. Fetch post engagement data (currently dummy data)
    const engagementData = await fetchPostEngagement(data.platform, data.postUrl, socialAccount.accessToken);

    // 4. Run fraud detection
    const { fraudScore, reason, validatedViews } = await detectFraud({
      rawViews: engagementData.rawViews,
      likes: engagementData.likes,
      comments: engagementData.comments,
      shares: engagementData.shares,
      watchTime: engagementData.watchTime,
      clickOffRate: engagementData.clickOffRate,
    });

    // 5. Insert new post
    const [newPost] = await db.insert(posts).values({
      participantId: participant.id,
      platform: data.platform,
      postUrl: data.postUrl,
      externalPostId: engagementData.postId, // From fetched engagement
      status: "pending", // Initial status, awaiting brand approval or AI compliance check
    }).returning();

    // 6. Insert engagement data
    await db.insert(engagements).values({
      postId: newPost.id,
      rawViews: engagementData.rawViews,
      validatedViews: validatedViews, // Use AI validated views
      likes: engagementData.likes,
      comments: engagementData.comments,
      shares: engagementData.shares,
      watchTime: engagementData.watchTime,
      clickOffRate: engagementData.clickOffRate,
      fraudScore: fraudScore, // Use AI fraud score
    });

    // 7. Log fraud if detected
    if (fraudScore > 0) {
      await db.insert(fraudLogs).values({
        postId: newPost.id,
        score: fraudScore,
        reason: reason,
      });
    }

    return { success: true, postId: newPost.id };
  } catch (error: any) {
    console.error("Failed to submit post:", error);
    return { error: error.message || "Failed to submit post. Please try again." };
  }
}
