"use client";

import useSWR from "swr";
import { getBrandAnalytics } from "@/app/actions/analytics";
import { StatsCards } from "@/components/analytics/stats-cards";
import { RevenueChart } from "@/components/analytics/revenue-chart";
import { RecentActivity } from "@/components/analytics/recent-activity";
import { DemographicsChart } from "@/components/analytics/demographics-chart";
import { TopPerformers } from "@/components/analytics/top-performers";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/db/schema";

export default function AnalyticsPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useSWR<User>(
    "/api/user",
    (url: string) => fetch(url).then((res) => res.json())
  );
  const { data, isLoading } = useSWR("brand-analytics", getBrandAnalytics);

  if (!userLoading && user && user.accountType !== "brand") {
    router.push("/dashboard");
    return null;
  }
  return (
    <div className="space-y-8 relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] -z-10" />

      <div className="flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold tracking-tight">
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Deep dive into your campaign performance and ROI.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      )}

      <div className="relative z-10 space-y-8">
        <StatsCards
          totalSpent={data?.totalSpent || 0}
          activeCampaignsCount={data?.activeCampaignsCount || 0}
          totalHires={data?.totalHires || 0}
          roi={data?.roi || 0}
          impressions={data?.impressions || 0}
          engagementRate={data?.engagementRate || 0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          <RevenueChart data={data?.monthlySpend || []} />
          <RecentActivity payments={data?.recentPayments || []} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
          <DemographicsChart />
          <TopPerformers />
        </div>
      </div>
    </div>
  );
}
