"use server";

import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { campaigns, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
      .where(eq(campaigns.visibility, "public"));

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

