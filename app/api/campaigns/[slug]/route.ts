"use server";

import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import {
  campaigns,
  users,
  campaignParticipants,
  posts,
  engagements,
} from "@/lib/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getUser } from "@/lib/db/queries";

const slugify = (title?: string) =>
  (title || "")
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || "campaign";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const requester = await getUser();

    const rows = await db
      .select({
        id: campaigns.id,
        title: campaigns.title,
        description: campaigns.description,
        budget: campaigns.budget,
        cpm: campaigns.cpm,
        requiredViews: campaigns.requiredViews,
        visibility: campaigns.visibility,
        status: campaigns.status,
        platforms: campaigns.platforms,
        startDate: campaigns.startDate,
        endDate: campaigns.endDate,
        createdAt: campaigns.createdAt,
        brandId: campaigns.brandId,
        brandName: users.name,
        brandUsername: users.username,
      })
      .from(campaigns)
      .leftJoin(users, eq(campaigns.brandId, users.id))
      .where(
        requester?.accountType === "brand" && requester?.id
          ? and(eq(campaigns.brandId, requester.id))
          : eq(campaigns.visibility, "public")
      );

    const match = rows.find(
      (row) => slugify(row.title) === params.slug || `${row.id}` === params.slug
    );

    if (!match) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const platforms = match.platforms
      ? (JSON.parse(match.platforms) as string[])
      : [];
    const slug = slugify(match.title);

    // Aggregate creator participation
    const participantStats = await db
      .select({
        status: campaignParticipants.status,
        count: sql<number>`COUNT(*)`,
      })
      .from(campaignParticipants)
      .where(eq(campaignParticipants.campaignId, match.id))
      .groupBy(campaignParticipants.status);

    const creators: {
      approved: number;
      pending: number;
      rejected: number;
      total: number;
    } = {
      approved:
        participantStats.find((p) => p.status === "approved")?.count || 0,
      pending: participantStats.find((p) => p.status === "pending")?.count || 0,
      rejected:
        participantStats.find((p) => p.status === "rejected")?.count || 0,
      total: 0,
    };
    creators.total = creators.approved + creators.pending + creators.rejected;

    const creatorsList = await db
      .select({
        id: campaignParticipants.id,
        status: campaignParticipants.status,
        creatorId: users.id,
        name: users.name,
        username: users.username,
      })
      .from(campaignParticipants)
      .leftJoin(users, eq(campaignParticipants.creatorId, users.id))
      .where(eq(campaignParticipants.campaignId, match.id))
      .limit(15);

    // Posts stats
    const postStats = await db
      .select({
        status: posts.status,
        count: sql<number>`COUNT(*)`,
      })
      .from(posts)
      .leftJoin(
        campaignParticipants,
        eq(posts.participantId, campaignParticipants.id)
      )
      .where(eq(campaignParticipants.campaignId, match.id))
      .groupBy(posts.status);

    const postsSummary: {
      submitted: number;
      approved: number;
      rejected: number;
      total: number;
    } = {
      submitted: postStats.find((p) => p.status === "submitted")?.count || 0,
      approved: postStats.find((p) => p.status === "approved")?.count || 0,
      rejected: postStats.find((p) => p.status === "rejected")?.count || 0,
      total: 0,
    };
    postsSummary.total =
      postsSummary.submitted + postsSummary.approved + postsSummary.rejected;

    const postsList = await db
      .select({
        id: posts.id,
        platform: posts.platform,
        status: posts.status,
        postUrl: posts.postUrl,
        uploadedAt: posts.uploadedAt,
      })
      .from(posts)
      .leftJoin(
        campaignParticipants,
        eq(posts.participantId, campaignParticipants.id)
      )
      .where(eq(campaignParticipants.campaignId, match.id))
      .limit(15);

    // Engagement aggregates
    const engagementAgg = await db
      .select({
        totalViews: sql<number>`COALESCE(SUM(${engagements.validatedViews}),0)`,
        avgEngagement: sql<number>`COALESCE(AVG(${engagements.likes}),0)`,
        avgWatchTime: sql<number>`COALESCE(AVG(${engagements.watchTime}),0)`,
      })
      .from(engagements)
      .leftJoin(posts, eq(engagements.postId, posts.id))
      .leftJoin(
        campaignParticipants,
        eq(posts.participantId, campaignParticipants.id)
      )
      .where(eq(campaignParticipants.campaignId, match.id));

    const analytics = {
      totalViews: engagementAgg[0]?.totalViews || 0,
      avgEngagement: Number((engagementAgg[0]?.avgEngagement || 0).toFixed(2)),
      avgWatchTime: Number((engagementAgg[0]?.avgWatchTime || 0).toFixed(1)),
    };

    const payload = {
      id: match.id,
      slug,
      title: match.title,
      description: match.description,
      budgetValue: match.budget,
      cpmValue: match.cpm,
      requiredViewsValue: match.requiredViews,
      visibility: match.visibility,
      status: match.status || "active",
      platforms,
      startDate: match.startDate
        ? new Date(match.startDate).toISOString()
        : null,
      endDate: match.endDate ? new Date(match.endDate).toISOString() : null,
      createdAt: match.createdAt
        ? new Date(match.createdAt).toISOString()
        : null,
      brand: match.brandName || match.brandUsername || "Brand",
      brandUsername: match.brandUsername,
      creators,
      creatorsList,
      posts: postsSummary,
      postsList,
      analytics,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Failed to fetch campaign detail", error);
    return NextResponse.json(
      { error: "Failed to fetch campaign" },
      { status: 500 }
    );
  }
}
