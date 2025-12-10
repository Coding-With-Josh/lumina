"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useSWR from "swr";
import { User } from "@/lib/db/schema";
import {
  CheckCircle2,
  Shield,
  Link as LinkIcon,
  RefreshCcw,
  Globe2,
  BarChart3,
  Sparkles,
  Eye,
  Clock,
  Users,
  PlayCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const profile = {
  name: "Jordan Lee",
  handle: "@jordancreates",
  niche: "Tech & Productivity",
  country: "USA",
  trustScore: 82,
  verified: true,
  kyc: true,
  twoFA: true,
  availability: "Open to offers",
};

const socials = [
  {
    platform: "TikTok",
    followers: "1.2M",
    engagement: "5.1%",
    lastSynced: "2h ago",
    status: "connected",
  },
  {
    platform: "Instagram",
    followers: "680K",
    engagement: "4.3%",
    lastSynced: "5h ago",
    status: "connected",
  },
  {
    platform: "X",
    followers: "220K",
    engagement: "2.1%",
    lastSynced: "1d ago",
    status: "connected",
  },
  {
    platform: "Threads",
    followers: "95K",
    engagement: "2.8%",
    lastSynced: "1d ago",
    status: "connected",
  },
];

const performance = [
  { label: "30d validated views", value: "4.2M", change: "+12%" },
  { label: "Avg engagement", value: "4.6%", change: "+0.4%" },
  { label: "Avg watch time", value: "32s", change: "+3s" },
  { label: "Top platform", value: "TikTok", change: "↑" },
];

const topPosts = [
  {
    title: "Laptop desk setup",
    platform: "TikTok",
    views: "890K",
    engagement: "6.2%",
    watchTime: "34s",
    status: "Validated",
  },
  {
    title: "Focus tips thread",
    platform: "X",
    views: "310K",
    engagement: "3.4%",
    watchTime: "—",
    status: "Validated",
  },
  {
    title: "Reel: Notion workflow",
    platform: "Instagram",
    views: "420K",
    engagement: "4.1%",
    watchTime: "27s",
    status: "Validated",
  },
];

const campaigns = [
  { title: "Productivity App Launch", status: "completed", earned: "$3,200" },
  { title: "Laptop Accessories Push", status: "active", earned: "$1,050" },
  { title: "Noise-cancel campaign", status: "pending", earned: "$0" },
];

const earnings = {
  available: "$2,480",
  pending: "$1,120",
  nextPayout: "Dec 29",
};

export default function PortfolioPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useSWR<User>(
    "/api/user",
    (url: string) => fetch(url).then((res) => res.json())
  );

  if (!userLoading && user && user.accountType !== "creator") {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              Creator
            </Badge>
            {profile.verified && (
              <Badge className="gap-1 rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-4 w-4" /> Verified
              </Badge>
            )}
            {profile.kyc && (
              <Badge className="gap-1 rounded-full bg-blue-500/10 text-blue-500">
                <Shield className="h-4 w-4" /> KYC
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
          <p className="text-muted-foreground">
            {profile.handle} • {profile.niche} • {profile.country}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Availability: {profile.availability}
            </span>
            <Badge variant="outline" className="rounded-full">
              Trust score {profile.trustScore}%
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => toast.info("Public profile share is coming soon")}
          >
            <Globe2 className="h-4 w-4" />
            Public view
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => router.push("/dashboard/analytics")}
          >
            <Sparkles className="h-4 w-4" />
            Optimize profile
          </Button>
        </div>
      </div>

      {/* Grid layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Performance highlights */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {performance.map((item) => (
              <Card key={item.label} className="border-border/60">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">
                    {item.label}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-semibold">{item.value}</p>
                    <span className="text-xs text-emerald-500">
                      {item.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Social accounts */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Connected socials</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {socials.map((s) => (
                <div
                  key={s.platform}
                  className="p-4 rounded-xl border border-border/50 bg-card/50 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-sm font-semibold text-emerald-500">
                        {s.platform[0]}
                      </div>
                      <div>
                        <p className="font-semibold">{s.platform}</p>
                        <p className="text-xs text-muted-foreground">
                          ER {s.engagement}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="rounded-full text-xs border-emerald-500/40 text-emerald-500"
                    >
                      {s.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{s.followers} followers</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <RefreshCcw className="h-3 w-3" />
                      <span>{s.lastSynced}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/social/refresh", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ platform: s.platform }),
                        });
                        const data = await res.json();
                        if (!res.ok || !data?.success) {
                          throw new Error(data?.message || "Refresh failed");
                        }
                        toast.success(
                          data.message || `Refresh ${s.platform} queued`
                        );
                      } catch (error: any) {
                        toast.error(error.message || "Refresh failed");
                      }
                    }}
                  >
                    Refresh
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top posts */}
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Top performing posts</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Validated views and engagement from connected platforms
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => router.push("/dashboard/analytics")}
              >
                <BarChart3 className="h-4 w-4" />
                View analytics
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {topPosts.map((post) => (
                <div
                  key={post.title}
                  className="p-4 rounded-xl border border-border/50 bg-card/40 flex flex-wrap gap-3 items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {post.platform} • {post.status}
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1 text-emerald-500">
                      <Eye className="h-4 w-4" />
                      {post.views}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {post.engagement}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {post.watchTime}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Earnings snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Available</span>
                <span className="text-xl font-semibold text-emerald-500">
                  {earnings.available}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="text-sm font-medium">{earnings.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Next payout
                </span>
                <span className="text-sm font-medium">
                  {earnings.nextPayout}
                </span>
              </div>
              <Button
                className="w-full mt-2"
                onClick={() => router.push("/dashboard/earnings")}
              >
                View payouts
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Campaign history</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {campaigns.map((c) => (
                <div
                  key={c.title}
                  className="p-3 rounded-lg border border-border/40 bg-card/40 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{c.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {c.status}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">{c.earned}</span>
                </div>
              ))}
              <Button
                variant="ghost"
                className="w-full gap-2"
                onClick={() => router.push("/dashboard/campaigns")}
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Compliance & trust</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>2FA enabled</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>KYC verified</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Disputes</span>
                <Badge variant="secondary" className="rounded-full">
                  0
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Fraud filter quality
                </p>
                <Progress value={78} />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Based on validated views and low bot signals over last 90d.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
