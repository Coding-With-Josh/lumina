"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Briefcase,
  Users,
  TrendingUp,
  Eye,
  Activity,
} from "lucide-react";

interface StatsCardsProps {
  totalSpent: number;
  activeCampaignsCount: number;
  totalHires: number;
  roi: number;
  impressions: number;
  engagementRate: number;
}

export function StatsCards({
  totalSpent,
  activeCampaignsCount,
  totalHires,
  roi,
  impressions,
  engagementRate,
}: StatsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {[
        {
          title: "Total Spent",
          value: `$${totalSpent.toLocaleString()}`,
          sub: "+12% vs last month",
          icon: DollarSign,
          color: "emerald",
          trend: true,
        },
        {
          title: "Active Campaigns",
          value: activeCampaignsCount,
          sub: "Running now",
          icon: Briefcase,
          color: "blue",
        },
        {
          title: "Total Hires",
          value: totalHires,
          sub: "Creators onboarded",
          icon: Users,
          color: "purple",
        },
        {
          title: "Avg. ROI",
          value: `${roi}x`,
          sub: "+0.4x vs last month",
          icon: TrendingUp,
          color: "amber",
          trend: true,
        },
        {
          title: "Impressions",
          value: `${(impressions / 1000).toFixed(1)}k`,
          sub: "Total views",
          icon: Eye,
          color: "pink",
        },
        {
          title: "Engagement",
          value: `${engagementRate}%`,
          sub: "Avg. rate",
          icon: Activity,
          color: "indigo",
        },
      ].map((stat, index) => (
        <Card
          key={index}
          className={`relative overflow-hidden border-muted/40 bg-card/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group`}
          style={{
            boxShadow: `0 0 0 1px rgba(var(--${stat.color}-500), 0.1), 0 8px 40px -12px rgba(var(--${stat.color}-500), 0.3)`,
          }}
        >
          {/* Internal Glow Blob */}
          <div
            className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-${stat.color}-500/20 blur-[50px] transition-all duration-500 group-hover:bg-${stat.color}-500/40`}
          />

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {stat.title}
            </CardTitle>
            <div
              className={`h-10 w-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-500 transition-all duration-300 group-hover:scale-110 group-hover:bg-${stat.color}-500 group-hover:text-white shadow-lg shadow-${stat.color}-500/20`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold tracking-tight">
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              {stat.trend && (
                <span className="text-emerald-500 inline-flex items-center mr-1">
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                </span>
              )}
              {stat.sub}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
