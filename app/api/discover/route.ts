import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import {
  users,
  creatorProfiles,
  brandProfiles,
  socialAccounts,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/db/queries";

export async function GET() {
  const viewer = await getUser();
  if (!viewer) {
    return NextResponse.json({ profiles: [], viewer: "brand" }, { status: 401 });
  }

  // Fetch creators
  const creatorsRaw = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      country: users.country,
      niche: creatorProfiles.niche,
      trustScore: creatorProfiles.trustScore,
      profilePicture: users.profilePicture,
      followers: socialAccounts.followers,
      engagementRate: socialAccounts.engagementRate,
      platform: socialAccounts.platform,
    })
    .from(users)
    .leftJoin(creatorProfiles, eq(creatorProfiles.userId, users.id))
    .leftJoin(socialAccounts, eq(socialAccounts.userId, users.id))
    .where(eq(users.accountType, "creator"))
    .limit(60);

  const creatorsMap = new Map<number, any>();
  creatorsRaw.forEach((row) => {
    const existing = creatorsMap.get(row.id) || {
      id: row.id,
      name: row.name,
      username: row.username,
      country: row.country,
      accountType: "creator" as const,
      headline: row.niche,
      trustScore: row.trustScore || 50,
      profilePicture: row.profilePicture,
      followers: 0,
      engagementRate: 0,
      platforms: [] as string[],
    };
    existing.followers += row.followers || 0;
    existing.engagementRate = Math.max(existing.engagementRate, row.engagementRate || 0);
    if (row.platform) existing.platforms.push(row.platform);
    creatorsMap.set(row.id, existing);
  });

  // Fetch brands
  const brandsRaw = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      country: users.country,
      companyName: brandProfiles.companyName,
      totalSpent: brandProfiles.totalSpent,
      profilePicture: users.profilePicture,
    })
    .from(users)
    .leftJoin(brandProfiles, eq(brandProfiles.userId, users.id))
    .where(eq(users.accountType, "brand"))
    .limit(60);

  const profiles = [
    ...Array.from(creatorsMap.values()),
    ...brandsRaw.map((b) => ({
      id: b.id,
      name: b.companyName || b.name,
      username: b.username,
      accountType: "brand" as const,
      headline: b.companyName || "Brand",
      country: b.country,
      profilePicture: b.profilePicture,
      followers: 0,
      engagementRate: 0,
      totalSpent: b.totalSpent || 0,
      platforms: [],
    })),
  ];

  return NextResponse.json({ profiles, viewer: viewer.accountType || "brand" });
}

