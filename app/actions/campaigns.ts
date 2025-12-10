"use server";

import { z } from "zod";
import { campaigns, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/queries";
import { db } from "@/lib/db/drizzle";
import { recommendCPM } from "@/lib/ai/cpmRecommender";

const campaignSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  visibility: z.enum(["public", "private"]).default("public"),
  budget: z.coerce.number().min(1, "Budget must be at least $1"),
  // CPM will now be recommended by AI, not directly set by the user
  // cpm: z.coerce.number().min(0.1, "CPM must be at least $0.10"),
  requiredViews: z.coerce.number().min(1, "Required views must be at least 1"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  questionnaire: z.array(z.string()).optional(),

  // New fields for AI CPM recommendation
  campaignGoals: z.enum(["reach", "engagement", "conversions"]),
  engagementDifficulty: z.enum(["low", "medium", "high"]).default("medium"),
});

export async function createCampaign(formData: any) {
  const user = await getUser();

  if (!user || user.accountType !== "brand") {
    throw new Error("Unauthorized: Only brands can create campaigns");
  }

  const result = campaignSchema.safeParse(formData);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const data = result.data;

  try {
    // AI CPM Recommendation
    const recommendedCpm = await recommendCPM({
      campaignGoals: data.campaignGoals,
      platformType: data.platforms[0], // For simplicity, use the first platform for recommendation
      engagementDifficulty: data.engagementDifficulty,
    });

    const budgetInt = Math.round(data.budget);
    const cpmInt = Math.round(recommendedCpm);
    const viewsInt = Math.round(data.requiredViews);

    const [newCampaign] = await db
      .insert(campaigns)
      .values({
        brandId: user.id,
        title: data.title,
        description: data.description,
        visibility: data.visibility,
        budget: budgetInt,
        cpm: cpmInt, // Use AI recommended CPM (rounded)
        requiredViews: viewsInt,
        startDate: data.startDate,
        endDate: data.endDate,
        platforms: JSON.stringify(data.platforms),
        questionnaire: JSON.stringify(data.questionnaire || []),
        status: "active", // Or 'draft' if we want approval flow
      })
      .returning();

    return { success: true, campaignId: newCampaign.id };
  } catch (error) {
    console.error("Failed to create campaign:", error);
    return { error: "Failed to create campaign. Please try again." };
  }
}

export async function getBrandCampaigns() {
  const user = await getUser();
  if (!user || user.accountType !== "brand") return [];

  return await db
    .select({
      id: campaigns.id,
      title: campaigns.title,
    })
    .from(campaigns)
    .where(eq(campaigns.brandId, user.id));
}
