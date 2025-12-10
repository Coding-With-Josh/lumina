"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Users,
  Globe2,
  MessageSquare,
  ArrowRight,
  Target,
  Search as SearchIcon,
  Eye,
  BarChart3,
  Calendar,
  Award,
  Sparkles,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

function GradientStat({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-4 border border-border/40 bg-card/80">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-foreground/5 to-transparent opacity-60" />
      <div className="absolute top-0 right-0 w-16 h-16 bg-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
      <div className="relative z-10 space-y-2">
        <div className="h-10 w-10 rounded-xl bg-foreground/10 flex items-center justify-center text-foreground">
          {icon}
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-lg font-semibold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

type Profile = {
  id: number;
  name: string | null;
  username: string | null;
  accountType: "creator" | "brand";
  headline: string | null; // niche or companyName
  country: string | null;
  followers: number;
  engagementRate: number;
  trustScore?: number;
  totalSpent?: number;
  platforms: string[];
  profilePicture?: string | null;
};

type DiscoverResponse = {
  profiles: Profile[];
  viewer: "brand" | "creator";
};

const avatarUrl = (p: Profile) => {
  const base = p.profilePicture;
  if (base && base.trim().length > 0) return base;
  const seed = encodeURIComponent(p.username || p.name || "user");
  return `https://avatar.vercel.sh/${seed}.png?size=160&text=${(
    p.name ||
    p.username ||
    "U"
  )
    .slice(0, 2)
    .toUpperCase()}`;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DiscoverPage() {
  const { data, isLoading } = useSWR<DiscoverResponse>(
    "/api/discover",
    fetcher
  );
  const router = useRouter();
  const [selected, setSelected] = useState<Profile | null>(null);
  const [openSheet, setOpenSheet] = useState(false);
  const [mode, setMode] = useState<"creator" | "brand">("creator");
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<string | null>(null);

  const profiles = data?.profiles ?? [];
  const viewer = data?.viewer ?? "brand";

  useEffect(() => {
    if (!data) return;
    setMode(viewer === "brand" ? "creator" : "brand");
  }, [data, viewer]);

  useEffect(() => {
    setOpenSheet(!!selected);
  }, [selected]);

  const filtered = useMemo(() => {
    return profiles
      .filter((p) => p.accountType === mode)
      .filter((p) => {
        if (!query) return true;
        const hay = `${p.name || ""} ${p.username || ""} ${
          p.headline || ""
        }`.toLowerCase();
        return hay.includes(query.toLowerCase());
      })
      .filter((p) => {
        if (!platform) return true;
        return p.platforms.includes(platform);
      });
  }, [profiles, mode, query, platform]);

  const featured = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-border/60">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full">
                Discover
              </Badge>
              <Badge variant="outline" className="rounded-full">
                {viewer === "brand" ? "You are a brand" : "You are a creator"}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Find the perfect {mode === "creator" ? "creators" : "brands"}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Curated talent and partners tailored to your role. Open a profile
              to message instantly.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={mode === "creator" ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setMode("creator")}
            >
              {viewer === "brand" ? "Creators" : "Browse creators"}
            </Button>
            <Button
              variant={mode === "brand" ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setMode("brand")}
            >
              {viewer === "creator" ? "Brands" : "Browse brands"}
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, handle, niche, or company"
              className="pl-9 h-11"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["tiktok", "instagram", "x", "threads"].map((p) => (
              <Button
                key={p}
                variant={platform === p ? "default" : "outline"}
                size="sm"
                className="rounded-full capitalize"
                onClick={() => setPlatform(platform === p ? null : p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => setPlatform(null)}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-40 animate-pulse bg-muted/30" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="py-10 text-center text-muted-foreground">
            No matches yet. Try adjusting filters.
          </CardContent>
        </Card>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {featured.map((p) => (
              <FeaturedCard
                key={p.id}
                profile={p}
                onView={() => {
                  setSelected(p);
                  setOpenSheet(true);
                }}
              />
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <ProfileCard
                key={p.id}
                profile={p}
                onView={() => {
                  setSelected(p);
                  setOpenSheet(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      <Sheet
        open={openSheet}
        onOpenChange={(open) => {
          setOpenSheet(open);
          if (!open) setSelected(null);
        }}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg px-4 overflow-y-auto"
        >
          {selected && (
            <>
              <div className="mt-4 space-y-6">
                <div className="relative h-56 rounded-2xl overflow-hidden bg-emerald-200 dark:bg-emerald-900/30 flex items-end">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/30 dark:bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
                  <div className="relative z-10 flex items-center gap-4 p-6 text-white dark:text-white w-full">
                    <Avatar className="h-16 w-16 ring-2 ring-emerald-200/20">
                      <AvatarImage
                        src={avatarUrl(selected)}
                        alt={selected.name || selected.username || "Profile"}
                      />
                      <AvatarFallback>
                        {(selected.name || selected.username || "U")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-black/20 text-white border-white/30 capitalize">
                          {selected.accountType}
                        </Badge>
                        {selected.accountType === "creator" &&
                          selected.trustScore !== undefined && (
                            <Badge className="bg-emerald-500 text-white border-emerald-500/40">
                              Trust {selected.trustScore}%
                            </Badge>
                          )}
                        {selected.accountType === "brand" &&
                          selected.totalSpent !== undefined && (
                            <Badge className="bg-amber-500 text-white border-amber-500/40">
                              Spend ${selected.totalSpent.toLocaleString()}
                            </Badge>
                          )}
                        <Badge className="dark:bg-white/20 dark:text-white dark:border-white/30">
                          @{selected.username}
                        </Badge>
                      </div>
                      <h2 className="text-2xl font-bold text-black dark:text-white tracking-tight">
                        {selected.name || selected.username}
                      </h2>
                      <div className="flex items-center gap-2 text-emerald-500">
                        <MapPin className="h-4 w-4" />
                        <span>{selected.country || "Global"}</span>
                        <span>•</span>
                        <span className="capitalize">
                          {selected.platforms.slice(0, 3).join(", ") ||
                            "Multi-platform"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <GradientStat
                    icon={<Users className="h-6 w-6 text-emerald-600" />}
                    title="Followers"
                    value={selected.followers.toLocaleString()}
                  />
                  <GradientStat
                    icon={<Eye className="h-6 w-6 text-blue-600" />}
                    title="Engagement"
                    value={`${selected.engagementRate.toFixed(1)}%`}
                  />
                  {selected.accountType === "creator" ? (
                    <GradientStat
                      icon={<Sparkles className="h-6 w-6 text-purple-600" />}
                      title="Top platforms"
                      value={selected.platforms.slice(0, 2).join(", ") || "—"}
                    />
                  ) : (
                    <GradientStat
                      icon={<BarChart3 className="h-6 w-6 text-purple-600" />}
                      title="Total spent"
                      value={
                        selected.totalSpent !== undefined
                          ? `$${selected.totalSpent.toLocaleString()}`
                          : "—"
                      }
                    />
                  )}
                  <GradientStat
                    icon={<Calendar className="h-6 w-6 text-amber-600" />}
                    title="Country"
                    value={selected.country || "Global"}
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-500" />
                    Highlights
                  </h4>
                  <div className="space-y-2">
                    {(selected.accountType === "creator"
                      ? [
                          `Platforms: ${
                            selected.platforms.slice(0, 3).join(", ") || "—"
                          }`,
                          `Engagement: ${selected.engagementRate.toFixed(1)}%`,
                          `Followers: ${selected.followers.toLocaleString()}`,
                        ]
                      : [
                          `Active brand with spend: ${
                            selected.totalSpent !== undefined
                              ? `$${selected.totalSpent.toLocaleString()}`
                              : "—"
                          }`,
                          `Country: ${selected.country || "Global"}`,
                        ]
                    ).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/40"
                      >
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      router.push(`/dashboard/messages?username=${selected.username}`);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      router.push(
                        selected.accountType === "creator"
                          ? `/creator/${selected.username}`
                          : `/brand/${selected.username}`
                      )
                    }
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    View profile
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function FeaturedCard({
  profile,
  onView,
}: {
  profile: Profile;
  onView: () => void;
}) {
  return (
    <Card className="border-border/60 bg-card/60 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={avatarUrl(profile)}
                alt={profile.name || profile.username || "Profile"}
              />
              <AvatarFallback>
                {(profile.name || profile.username || "U")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg leading-tight">
                {profile.name || profile.username}
              </CardTitle>
              <CardDescription>@{profile.username}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="rounded-full capitalize">
            {profile.accountType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{profile.followers.toLocaleString()} followers</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Target className="h-4 w-4 text-muted-foreground" />
          <span>{profile.headline || "—"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Globe2 className="h-4 w-4 text-muted-foreground" />
          <span>{profile.country || "Global"}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.platforms.slice(0, 3).map((p) => (
            <Badge
              key={p}
              variant="secondary"
              className="rounded-full capitalize"
            >
              {p}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Button className="flex-1" onClick={onView}>
            View & message
          </Button>
          <Button asChild variant="ghost" size="icon" className="shrink-0">
            <Link
              href={
                profile.accountType === "creator"
                  ? `/creator/${profile.username}`
                  : `/brand/${profile.username}`
              }
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileCard({
  profile,
  onView,
}: {
  profile: Profile;
  onView: () => void;
}) {
  return (
    <Card className="border-border/60 hover:border-emerald-500/40 transition-colors">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              {(profile.name || profile.username || "U")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
            <AvatarImage
              src={avatarUrl(profile)}
              alt={profile.name || profile.username || "Profile"}
            />
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold truncate">
                {profile.name || profile.username}
              </p>
              <Badge variant="outline" className="rounded-full capitalize">
                {profile.accountType}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {profile.headline || "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{profile.followers.toLocaleString()} followers</span>
          <span>•</span>
          <span>{profile.engagementRate.toFixed(1)}% ER</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.platforms.slice(0, 3).map((p) => (
            <Badge
              key={p}
              variant="secondary"
              className="rounded-full capitalize"
            >
              {p}
            </Badge>
          ))}
        </div>
        <Button className="w-full" onClick={onView}>
          View & message
        </Button>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-card/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold mt-1">{value}</p>
    </div>
  );
}
