"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  FileText,
  Calendar,
  Users,
  Target,
} from "lucide-react";
import { User } from "@/lib/db/schema";
import useSWR from "swr";
import { useMemo } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-s-3 border-emerald-500/20">
      {/* Visible glow effect */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/15 dark:bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/25 dark:group-hover:bg-emerald-500/35 transition-all duration-500" />

      <CardContent className="p-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <div className="flex items-baseline gap-3">
              <p className="text-3xl lg:text-4xl font-bold">{value}</p>
              {trend && (
                <span
                  className={`text-sm font-semibold ${
                    trend.isPositive ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const { data: user } = useSWR<User>("/api/user", fetcher);
  const { data: campaignsData } = useSWR<{ campaigns: any[] }>(
    "/api/campaigns",
    fetcher
  );

  const isCreator = user?.accountType === "creator" || !user?.accountType;
  const isBrand = user?.accountType === "brand";

  const brandStats = useMemo(() => {
    const campaigns = campaignsData?.campaigns ?? [];
    const active = campaigns.filter((c) => c.status === "active").length;
    const totalBudget = campaigns.reduce(
      (sum, c) => sum + (c.budgetValue || 0),
      0
    );
    const avgCpm =
      campaigns.length > 0
        ? campaigns.reduce((sum, c) => sum + (c.cpmValue || 0), 0) /
          campaigns.length
        : 0;
    const totalViews = campaigns.reduce(
      (sum, c) => sum + (c.requiredViewsValue || 0),
      0
    );

    return {
      active,
      totalBudget,
      avgCpm,
      totalViews,
      total: campaigns.length,
    };
  }, [campaignsData]);

  const creatorStats = useMemo(() => {
    const campaigns = campaignsData?.campaigns ?? [];
    return {
      available: campaigns.length,
      endingSoon: campaigns.filter((c) => c.status === "active").slice(0, 3)
        .length,
    };
  }, [campaignsData]);

  // Creator stats
  if (isCreator) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Live Campaigns"
          value={creatorStats.available.toString()}
          subtitle="Open opportunities"
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatCard
          title="Ending Soon"
          value={creatorStats.endingSoon.toString()}
          subtitle="Spots filling fast"
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <StatCard
          title="Avg CPM"
          value={brandStats.avgCpm ? `$${brandStats.avgCpm.toFixed(2)}` : "—"}
          subtitle="Across visible campaigns"
          icon={<FileText className="h-6 w-6" />}
        />
        <StatCard
          title="Target Views"
          value={
            brandStats.totalViews ? brandStats.totalViews.toLocaleString() : "—"
          }
          subtitle="Aggregate requirements"
          icon={<Calendar className="h-6 w-6" />}
        />
      </div>
    );
  }

  // Brand stats
  if (isBrand) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Campaigns"
          value={brandStats.active.toString()}
          subtitle={`${brandStats.total} total`}
          icon={<Target className="h-6 w-6" />}
        />
        <StatCard
          title="Total Budget"
          value={
            brandStats.totalBudget
              ? `$${brandStats.totalBudget.toLocaleString()}`
              : "$0"
          }
          subtitle="All campaigns"
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Budget Spent"
          value={
            brandStats.totalBudget
              ? `$${Math.round(brandStats.totalBudget * 0.35).toLocaleString()}`
              : "$0"
          }
          subtitle="Projected spend (est.)"
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatCard
          title="Avg CPM"
          value={brandStats.avgCpm ? `$${brandStats.avgCpm.toFixed(2)}` : "—"}
          subtitle="Across campaigns"
          icon={<TrendingUp className="h-6 w-6" />}
        />
      </div>
    );
  }

  // Default fallback
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value={
          brandStats.totalBudget
            ? `$${brandStats.totalBudget.toLocaleString()}`
            : "$0"
        }
        subtitle="Campaign budget"
        icon={<DollarSign className="h-5 w-5" />}
      />
      <StatCard
        title="Growth"
        value="23.5%"
        subtitle="vs last month"
        icon={<TrendingUp className="h-5 w-5" />}
        trend={{ value: 5.2, isPositive: true }}
      />
      <StatCard
        title="Active Items"
        value="145"
        subtitle="12 new today"
        icon={<FileText className="h-5 w-5" />}
      />
      <StatCard
        title="Conversion"
        value="3.2%"
        subtitle="+0.5% from last week"
        icon={<Target className="h-5 w-5" />}
        trend={{ value: 18.7, isPositive: false }}
      />
    </div>
  );
}
