"use server";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { campaigns, users } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { getUser } from "@/lib/db/queries";

const slugify = (title?: string) => {
  return (
    (title || "")
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || "campaign"
  );
};

export async function GET() {
  try {
    const user = await getUser();
    const isBrand = user?.accountType === "brand";

    const rows = await db
      .select({
        id: campaigns.id,
        title: campaigns.title,
        budget: campaigns.budget,
        cpm: campaigns.cpm,
        requiredViews: campaigns.requiredViews,
        visibility: campaigns.visibility,
        status: campaigns.status,
        platforms: campaigns.platforms,
        endDate: campaigns.endDate,
        createdAt: campaigns.createdAt,
        brandName: users.name,
        brandUsername: users.username,
      })
      .from(campaigns)
      .leftJoin(users, eq(campaigns.brandId, users.id))
      .where(
        isBrand && user
          ? eq(campaigns.brandId, user.id)
          : eq(campaigns.visibility, "public")
      )
      .orderBy(campaigns.createdAt);

    const campaignsMapped = rows.map((row) => {
      const platforms = row.platforms
        ? (JSON.parse(row.platforms) as string[])
        : [];
      const category = platforms[0] || "General";
      const budgetValue = row.budget ?? 0;
      const cpmValue = row.cpm ?? 0;
      const requiredViewsValue = row.requiredViews ?? 0;
      const slots = Math.max(10, Math.round((row.requiredViews || 0) / 5000));
      const filledSlots = Math.min(
        slots,
        Math.max(0, Math.round(slots * 0.35))
      );
      return {
        id: row.id,
        slug: slugify(row.title),
        title: row.title,
        brand: row.brandName || row.brandUsername || "Brand",
        category,
        budget: budgetValue ? `$${budgetValue.toLocaleString()}` : "Not set",
        budgetValue,
        cpm: cpmValue ? `$${cpmValue}` : "—",
        cpmValue,
        slots,
        filledSlots,
        views: requiredViewsValue
          ? `${requiredViewsValue.toLocaleString()} views`
          : "—",
        requiredViewsValue,
        deadline: row.endDate
          ? new Date(row.endDate).toLocaleDateString()
          : "No deadline",
        status: row.status || "active",
        featured: row.budget ? row.budget > 15000 : false,
        createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : null,
      };
    });

    return NextResponse.json({ campaigns: campaignsMapped });
  } catch (error) {
    console.error("Failed to fetch campaigns", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user || user.accountType !== "brand") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const campaignId = Number(body?.id);

    if (!campaignId || Number.isNaN(campaignId)) {
      return NextResponse.json(
        { error: "Invalid campaign id" },
        { status: 400 }
      );
    }

    const result = await db
      .delete(campaigns)
      .where(and(eq(campaigns.id, campaignId), eq(campaigns.brandId, user.id)))
      .returning({ id: campaigns.id });

    if (!result.length) {
      return NextResponse.json(
        { error: "Campaign not found or not owned by user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, id: campaignId });
  } catch (error) {
    console.error("Failed to delete campaign", error);
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }
}
