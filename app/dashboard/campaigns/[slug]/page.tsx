"use client";

import { use, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Pause,
  Play,
  Settings,
  Download,
  Eye,
  Shield,
} from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const resolvedParams =
    typeof (params as any)?.then === "function" ? use(params as any) : params;

  const slug = (resolvedParams as { slug?: string })?.slug ?? "";

  const { data, error, isLoading } = useSWR(
    slug ? `/api/campaigns/${slug}` : null,
    fetcher
  );

  const campaign = data;
  const creators = useMemo(
    () =>
      campaign?.creators || {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      },
    [campaign]
  );
  const analytics = useMemo(
    () =>
      campaign?.analytics || {
        totalViews: 0,
        avgEngagement: 0,
        avgWatchTime: 0,
      },
    [campaign]
  );
  const deliverables = useMemo(
    () =>
      campaign?.deliverables || {
        required: campaign?.requiredViewsValue || 0,
      },
    [campaign]
  );
  const creatorsList = campaign?.creatorsList || [];
  const postsList = campaign?.postsList || [];
  const slotsTotal = Math.max(
    10,
    Math.round((campaign?.requiredViewsValue || 0) / 5000)
  );
  const slotsFilled = Math.min(
    slotsTotal,
    Math.round(slotsTotal * 0.35 + (campaign?.creators?.approved || 0))
  );
  const cpmDisplay =
    typeof campaign?.cpm === "number"
      ? campaign.cpm
      : typeof campaign?.cpmValue === "number"
      ? campaign.cpmValue
      : 0;

  const createdAtDisplay = campaign?.createdAt
    ? new Date(campaign.createdAt).toLocaleDateString()
    : "—";
  const startDateDisplay = campaign?.startDate
    ? new Date(campaign.startDate).toLocaleDateString()
    : "—";
  const endDateDisplay = campaign?.endDate
    ? new Date(campaign.endDate).toLocaleDateString()
    : "—";

  const completionPercentage = useMemo(() => {
    const required = campaign?.requiredViewsValue || 0;
    const completed = Math.round(required * 0.35); // placeholder progress
    return required
      ? Math.min(100, Math.round((completed / required) * 100))
      : 0;
  }, [campaign]);

  const budgetPercentage = useMemo(() => {
    const total = campaign?.budgetValue || 0;
    const spent = Math.round(total * 0.4);
    return total ? Math.min(100, Math.round((spent / total) * 100)) : 0;
  }, [campaign]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
      case "active":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "paused":
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400";
      case "completed":
      case "ended":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-12 space-y-6">
        <div className="h-10 w-56 rounded-lg bg-muted animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
        <div className="h-[520px] rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }

  if (error || (!isLoading && !campaign)) {
    return (
      <div className="p-6 lg:p-12 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Campaign not found</h1>
            <p className="text-muted-foreground text-sm">
              We couldn’t load this campaign. It may have been removed.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/campaigns")}
          >
            Back to campaigns
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/campaigns")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {campaign.title}
            </h1>
            <p className="text-muted-foreground mt-1">/{slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getStatusColor(campaign.status)}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
          <Button variant="outline" size="sm" className="gap-2">
            {campaign.status === "live" ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {campaign.status === "live" ? "Pause" : "Resume"}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Budget Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="text-2xl font-bold">
                    ${campaign.budgetValue?.toLocaleString() ?? "0"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Spent</span>
                  <span className="font-semibold">{budgetPercentage}%</span>
                </div>
                <Progress value={budgetPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  $
                  {Math.max(
                    0,
                    (campaign.budgetValue || 0) -
                      Math.round((campaign.budgetValue || 0) * 0.4)
                  ).toLocaleString()}{" "}
                  remaining
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Deliverables Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Deliverables</p>
                  <p className="text-2xl font-bold">
                    {Math.round((campaign.requiredViewsValue || 0) * 0.35)}/
                    {campaign.requiredViewsValue || 0}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {(campaign.requiredViewsValue || 0) -
                    Math.round((campaign.requiredViewsValue || 0) * 0.35)}{" "}
                  remaining
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Creators Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Creators</p>
                  <p className="text-2xl font-bold">{creators.approved}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <p className="text-muted-foreground">Pending</p>
                  <p className="font-semibold text-amber-700 dark:text-amber-400">
                    {creators.pending}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <p className="text-muted-foreground">Rejected</p>
                  <p className="font-semibold text-red-700 dark:text-red-400">
                    {creators.rejected}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">
                    {(analytics.totalViews / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Engagement</span>
                  <span className="font-semibold text-emerald-600">
                    {analytics.avgEngagement}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Watch Time</span>
                  <span className="font-semibold">
                    {analytics.avgWatchTime}s
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabbed Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="creators">Creators & Posts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Campaign metadata */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Date Created
                  </p>
                  <p className="font-semibold">{createdAtDisplay}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Campaign Duration
                  </p>
                  <p className="font-semibold">
                    {startDateDisplay} - {endDateDisplay}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">CPM Rate</p>
                  <p className="font-semibold text-emerald-600">
                    ${cpmDisplay.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Target Deliverables
                  </p>
                  <p className="font-semibold">
                    {deliverables.required.toLocaleString()} posts
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Join this exciting summer fashion campaign and showcase the
                  latest trends. We&apos;re looking for creators who can create
                  engaging content featuring our summer collection. This
                  campaign focuses on authenticity and creativity.
                </p>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="font-semibold mb-3">Content Requirements</h3>
                <div className="grid gap-3">
                  {[
                    "Video length: 30-60 seconds",
                    "Include brand mention in first 5 seconds",
                    "Use hashtags: #SummerStyle2025 #FashionForward",
                    "Show product in natural lighting",
                    "Post frequency: 2-3 times per week",
                  ].map((req, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <h3 className="font-semibold mb-3">Target Audience</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Age Range
                    </p>
                    <p className="font-semibold">18-35</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Gender</p>
                    <p className="font-semibold">All</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Location
                    </p>
                    <p className="font-semibold">US, UK, CA</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Interests
                    </p>
                    <p className="font-semibold">Fashion, Lifestyle</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creators">
          <Card>
            <CardHeader>
              <CardTitle>Creator Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/15">
                  <p className="text-xs text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {creators.approved}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/15">
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {creators.pending}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/15">
                  <p className="text-xs text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {creators.rejected}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/15">
                  <p className="text-xs text-muted-foreground">Slots Filled</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {slotsFilled}/{slotsTotal}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border">
                <div className="grid grid-cols-5 px-4 py-2 text-xs font-medium text-muted-foreground">
                  <span>Name</span>
                  <span>Handle</span>
                  <span>Status</span>
                  <span className="text-right">ID</span>
                  <span className="text-right">Actions</span>
                </div>
                <div className="divide-y divide-border">
                  {creatorsList.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-muted-foreground">
                      No creators yet.
                    </div>
                  ) : (
                    creatorsList.map((c: any) => (
                      <div
                        key={c.id}
                        className="grid grid-cols-5 px-4 py-3 text-sm items-center"
                      >
                        <span className="font-medium">
                          {c.name || "Unnamed"}
                        </span>
                        <span className="text-muted-foreground">
                          @{c.username || "unknown"}
                        </span>
                        <span>
                          <Badge
                            className={
                              c.status === "approved"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : c.status === "pending"
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-red-500/10 text-red-500"
                            }
                          >
                            {c.status || "pending"}
                          </Badge>
                        </span>
                        <span className="text-right text-muted-foreground">
                          {c.creatorId ?? "—"}
                        </span>
                        <span className="text-right text-emerald-500 text-xs">
                          View
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-border">
                <div className="grid grid-cols-5 px-4 py-2 text-xs font-medium text-muted-foreground">
                  <span>Post</span>
                  <span>Platform</span>
                  <span>Status</span>
                  <span className="text-right">Link</span>
                  <span className="text-right">ID</span>
                </div>
                <div className="divide-y divide-border">
                  {postsList.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-muted-foreground">
                      No posts submitted yet.
                    </div>
                  ) : (
                    postsList.map((p: any) => (
                      <div
                        key={p.id}
                        className="grid grid-cols-5 px-4 py-3 text-sm items-center"
                      >
                        <span className="font-medium line-clamp-1">
                          {p.title || "Post"}
                        </span>
                        <span className="text-muted-foreground capitalize">
                          {p.platform || "—"}
                        </span>
                        <span>
                          <Badge
                            className={
                              p.status === "approved"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : p.status === "submitted"
                                ? "bg-amber-500/10 text-amber-500"
                                : p.status === "rejected"
                                ? "bg-red-500/10 text-red-500"
                                : "bg-gray-500/10 text-gray-500"
                            }
                          >
                            {p.status || "pending"}
                          </Badge>
                        </span>
                        <span className="text-right text-emerald-500">
                          {p.postUrl ? (
                            <a
                              href={p.postUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open
                            </a>
                          ) : (
                            "—"
                          )}
                        </span>
                        <span className="text-right text-muted-foreground">
                          {p.id ?? "—"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/10">
                  <p className="text-xs text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {(analytics.totalViews / 1000).toFixed(1)}K
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10">
                  <p className="text-xs text-muted-foreground">Avg CPM</p>
                  <p className="text-2xl font-bold text-blue-700">
                    ${cpmDisplay.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10">
                  <p className="text-xs text-muted-foreground">Engagement</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {analytics.avgEngagement}%
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10">
                  <p className="text-xs text-muted-foreground">Avg Watch</p>
                  <p className="text-2xl font-bold text-amber-700">
                    {analytics.avgWatchTime}s
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Platform mix</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(
                    campaign?.platforms || ["instagram", "tiktok", "youtube"]
                  ).map((plat: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-border flex items-center justify-between"
                    >
                      <span className="capitalize text-sm">{plat}</span>
                      <Badge variant="secondary">
                        {Math.max(10, 100 - idx * 20)}k views
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Conversion funnel</p>
                {[
                  { label: "Impressions", value: 100 },
                  { label: "Clicks", value: 62 },
                  { label: "Signups", value: 24 },
                  { label: "Purchases", value: 8 },
                ].map((step, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {step.label}
                      </span>
                      <span className="font-semibold">{step.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${step.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financials">
          <Card>
            <CardHeader>
              <CardTitle>Budget & Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-bold">
                    ${(campaign?.budgetValue || 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground">Spent (est.)</p>
                  <p className="text-2xl font-bold text-amber-600">
                    $
                    {Math.round(
                      (campaign?.budgetValue || 0) * 0.4
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground">Remaining</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    $
                    {Math.max(
                      0,
                      (campaign?.budgetValue || 0) -
                        Math.round((campaign?.budgetValue || 0) * 0.4)
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Payout schedule</p>
                <div className="rounded-xl border border-border divide-y divide-border">
                  {[
                    { label: "Deposit", amount: 0.3 },
                    { label: "Mid-flight", amount: 0.4 },
                    { label: "Completion", amount: 0.3 },
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-4 py-3 text-sm"
                    >
                      <span>{p.label}</span>
                      <span className="text-muted-foreground">
                        ${(campaign?.budgetValue || 0) * p.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Expenses by platform</p>
                <div className="space-y-3">
                  {(
                    campaign?.platforms || ["instagram", "tiktok", "youtube"]
                  ).map((plat: string, idx: number) => {
                    const pct = 40 - idx * 8;
                    const spent = Math.round(
                      (campaign?.budgetValue || 0) * 0.4
                    );
                    return (
                      <div key={idx}>
                        <div className="flex justify-between text-xs">
                          <span className="capitalize text-muted-foreground">
                            {plat}
                          </span>
                          <span className="font-semibold">
                            ${(spent * (pct / 100)).toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${Math.max(5, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fraud">
          <Card>
            <CardHeader>
              <CardTitle>Fraud & Bot Detection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Bot-likelihood", value: 8 },
                  { label: "Comment spam", value: 18 },
                  { label: "Engagement anomaly", value: 12 },
                  { label: "Geo mismatch", value: 5 },
                ].map((sig, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border border-border space-y-2"
                  >
                    <p className="text-xs text-muted-foreground">{sig.label}</p>
                    <p className="text-xl font-bold text-emerald-600">
                      {sig.value}%
                    </p>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${sig.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Alerts</p>
                <div className="rounded-xl border border-border divide-y divide-border">
                  {[
                    {
                      title: "Comment spike detected",
                      severity: "medium",
                      detail: "Unusual comment volume on Instagram in last 2h",
                    },
                    {
                      title: "Geo mismatch",
                      severity: "low",
                      detail: "5% viewers from blocked region",
                    },
                  ].map((alert, idx) => (
                    <div key={idx} className="px-4 py-3 text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            alert.severity === "medium"
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-emerald-500/10 text-emerald-600"
                          }
                        >
                          {alert.severity}
                        </Badge>
                        <span className="font-semibold">{alert.title}</span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {alert.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
