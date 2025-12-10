"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Download,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Activity,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EarningsChart } from "./earnings-chart";
import { RecentTransactions } from "./recent-transactions";
import { PayoutsOverview } from "./payouts-overview";
import { User } from "@/lib/db/schema";

const summary = {
  total: 12845,
  thisMonth: 3245,
  pending: 1250,
  avgPerItem: 24.5,
  availableNow: 8750,
  nextPayoutDate: "Dec 15, 2025",
  lastPayout: 2400,
};

const platformBreakdown = [
  { name: "TikTok", earnings: 5200, growth: "+14%", isPositive: true },
  { name: "Instagram", earnings: 4100, growth: "+6%", isPositive: true },
  { name: "X", earnings: 1600, growth: "-3%", isPositive: false },
  { name: "Threads", earnings: 945, growth: "+4%", isPositive: true },
];

export default function EarningsPage() {
  const router = useRouter();
  const { data: user, isLoading } = useSWR<User>("/api/user", (url: string) =>
    fetch(url).then((res) => res.json())
  );

  if (!isLoading && user && user.accountType !== "creator") {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="space-y-6 relative">
      {/* Glow effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 dark:bg-primary/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/20 dark:bg-primary/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl -z-10" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold tracking-tight">
            Earnings Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your earnings, growth, and performance
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 relative">
        {/* Grid glow overlay */}
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <StatsCard
          title="Total Earnings"
          value={`$${summary.total.toLocaleString()}`}
          change="+12.5%"
          isPositive
          icon={TrendingUp}
        />
        <StatsCard
          title="This Month"
          value={`$${summary.thisMonth.toLocaleString()}`}
          change="+8.2%"
          isPositive
          icon={Activity}
        />
        <StatsCard
          title="Pending"
          value={`$${summary.pending.toLocaleString()}`}
          change="-3.1%"
          isPositive={false}
          icon={BarChart3}
        />
        <StatsCard
          title="Avg. per Item"
          value={`$${summary.avgPerItem.toFixed(2)}`}
          change="+5.3%"
          isPositive
          icon={TrendingUp}
        />
      </div>

      {/* Payout status bar */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
          <CardContent className="p-5 relative z-10">
            <p className="text-sm text-muted-foreground mb-1">Available Now</p>
            <p className="text-2xl font-bold">
              ${summary.availableNow.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Ready to withdraw or schedule to wallet/bank
            </p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
          <CardContent className="p-5 relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Next Payout</p>
              <p className="text-2xl font-bold">{summary.nextPayoutDate}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Auto every 2 weeks after fraud checks clear
              </p>
            </div>
            <Button variant="outline" size="sm">
              View schedule
            </Button>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
          <CardContent className="p-5 relative z-10">
            <p className="text-sm text-muted-foreground mb-1">Last Payout</p>
            <p className="text-2xl font-bold">
              ${summary.lastPayout.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Paid to wallet — view receipt
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Platform Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {platformBreakdown.map((platform) => (
            <div
              key={platform.name}
              className="p-4 rounded-2xl border border-border/50 bg-card/50 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{platform.name}</p>
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    platform.isPositive
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-red-500/10 text-red-600"
                  )}
                >
                  {platform.growth}
                </span>
              </div>
              <p className="text-xl font-semibold">
                ${platform.earnings.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                After fraud validation and platform fees
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Earnings Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pl-2 pr-2 pb-5">
            <EarningsChart height={420} />
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <RecentTransactions />
          <PayoutsOverview />
        </div>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

function StatsCard({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
}: StatsCardProps) {
  const color = isPositive ? "emerald" : "red";
  const colorValue = isPositive ? "#10B981" : "#EF4444";

  return (
    <div className="relative group">
      <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 bg-card/50 backdrop-blur-sm relative">
        {/* Glow effects */}
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"
          style={{
            backgroundColor: isPositive
              ? "rgba(16, 185, 129, 0.2)"
              : "rgba(239, 68, 68, 0.2)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-24 h-24 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"
          style={{
            backgroundColor: isPositive
              ? "rgba(16, 185, 129, 0.2)"
              : "rgba(239, 68, 68, 0.2)",
          }}
        />

        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {title}
              </p>
              <h3 className="text-2xl font-bold">{value}</h3>
              <div
                className={cn(
                  "mt-2 inline-flex items-center text-sm font-medium",
                  isPositive ? "text-emerald-500" : "text-red-500"
                )}
              >
                {isPositive ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {change}{" "}
                <span className="text-muted-foreground ml-1">
                  vs last period
                </span>
              </div>
            </div>
            <div className="relative">
              <div
                className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center",
                  isPositive ? "bg-emerald-500/10" : "bg-red-500/10"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isPositive ? "text-emerald-500" : "text-red-500"
                  )}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
