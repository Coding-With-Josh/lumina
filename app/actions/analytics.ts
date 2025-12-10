"use server";

import { db } from "@/lib/db/drizzle";
import {
  brandPayments,
  campaigns,
  contracts,
  brandProfiles,
} from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { getUser } from "@/lib/db/queries";

export async function getBrandAnalytics() {
  const user = await getUser();
  if (!user || user.accountType !== "brand") {
    return null;
  }

  // MOCK DATA FOR PREMIUM FEEL (As requested)
  // In a real scenario, we would merge this with real data or use real data if available.

  const mockMonthlySpend = [
    { name: "Jan", value: 2400 },
    { name: "Feb", value: 1398 },
    { name: "Mar", value: 9800 },
    { name: "Apr", value: 3908 },
    { name: "May", value: 4800 },
    { name: "Jun", value: 3800 },
    { name: "Jul", value: 4300 },
  ];

  const mockRecentPayments = [
    {
      id: 1,
      amount: 1200,
      createdAt: new Date().toISOString(),
      status: "completed",
      recipient: "Sarah Jenkins",
    },
    {
      id: 2,
      amount: 850,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: "completed",
      recipient: "TechReview Pro",
    },
    {
      id: 3,
      amount: 2500,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      status: "pending",
      recipient: "Design Studio",
    },
    {
      id: 4,
      amount: 500,
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      status: "completed",
      recipient: "Alex Rivera",
    },
    {
      id: 5,
      amount: 3200,
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      status: "completed",
      recipient: "Viral Agency",
    },
  ];

  return {
    totalSpent: 12450, // Mock total
    activeCampaignsCount: 3, // Mock count
    totalHires: 12, // Mock hires
    recentPayments: mockRecentPayments,
    monthlySpend: mockMonthlySpend,
    // New metrics for enhanced dashboard
    roi: 3.2,
    impressions: 450000,
    engagementRate: 4.8,
  };
}
