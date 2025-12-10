"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Instagram,
  Youtube,
  Twitter,
  Users,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Mail,
  Star,
} from "lucide-react";
import { startConversation } from "@/app/actions/messages";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Mock data for creators
const creators = [
  {
    id: 1,
    name: "Sarah Jenkins",
    handle: "@sarahj_style",
    niche: "Fashion & Lifestyle",
    location: "New York, USA",
    followers: "1.2M",
    engagement: "4.8%",
    platforms: ["instagram", "tiktok"],
    rating: 4.9,
    verified: true,
    imageColor: "bg-pink-500",
  },
  {
    id: 2,
    name: "TechReview Pro",
    handle: "@techreview_pro",
    niche: "Technology",
    location: "San Francisco, USA",
    followers: "850K",
    engagement: "6.2%",
    platforms: ["youtube", "twitter"],
    rating: 5.0,
    verified: true,
    imageColor: "bg-blue-500",
  },
  {
    id: 3,
    name: "Chef Marco",
    handle: "@marcocooks",
    niche: "Food & Dining",
    location: "Rome, Italy",
    followers: "2.5M",
    engagement: "3.5%",
    platforms: ["instagram", "youtube"],
    rating: 4.7,
    verified: false,
    imageColor: "bg-orange-500",
  },
  {
    id: 4,
    name: "Fitness with Alex",
    handle: "@alexfit",
    niche: "Health & Fitness",
    location: "London, UK",
    followers: "500K",
    engagement: "8.1%",
    platforms: ["instagram", "tiktok", "youtube"],
    rating: 4.8,
    verified: true,
    imageColor: "bg-emerald-500",
  },
  {
    id: 5,
    name: "Travel Bug",
    handle: "@travelbug_official",
    niche: "Travel",
    location: "Bali, Indonesia",
    followers: "3.1M",
    engagement: "5.5%",
    platforms: ["instagram", "youtube"],
    rating: 4.9,
    verified: true,
    imageColor: "bg-cyan-500",
  },
  {
    id: 6,
    name: "Gaming Zone",
    handle: "@gamingzone_live",
    niche: "Gaming",
    location: "Seoul, South Korea",
    followers: "4.2M",
    engagement: "7.3%",
    platforms: ["twitch", "youtube", "twitter"],
    rating: 4.6,
    verified: true,
    imageColor: "bg-purple-500",
  },
];

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "instagram":
      return <Instagram className="h-4 w-4" />;
    case "youtube":
      return <Youtube className="h-4 w-4" />;
    case "twitter":
      return <Twitter className="h-4 w-4" />;
    case "tiktok":
      // Lucide doesn't have a TikTok icon by default, using a generic video icon or similar
      return <span className="text-[10px] font-bold">TT</span>;
    case "twitch":
      return <span className="text-[10px] font-bold">TW</span>;
    default:
      return <Users className="h-4 w-4" />;
  }
};

export default function CreatorsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="pb-20 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/5 blur-[100px] -z-10 rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
        <h1 className="text-xl lg:text-2xl font-semibold tracking-tight">
            Find Creators{" "}
            <Search
              className="inline text-muted-foreground size-5 ml-2"
              strokeWidth={3}
            />
          </h1>
          <p className="text-muted-foreground">
          Discover and connect with the perfect influencers for your brand.
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, niche, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50 backdrop-blur-sm border-muted/60 focus:border-emerald-500/50 transition-all"
            />
          </div>
          <Button
            variant="outline"
            className="gap-2 bg-background/50 backdrop-blur-sm hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Creators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map((creator, index) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="group relative h-full">
              <Card className="h-full relative pt-0 overflow-hidden rounded-3xl border-muted/60 bg-card/50 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:border-emerald-500/20 dark:hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.1)] hover:-translate-y-1">
                {/* Decorative glow elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />

                {/* Cover Image Effect */}
                <div
                  className={`h-24 w-full ${creator.imageColor} opacity-20 relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
                </div>

                <CardContent className="p-6 pt-0 relative z-10 flex flex-col h-full -mt-12">
                  {/* Header: Avatar & Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div
                        className={`w-20 h-20 rounded-2xl ${creator.imageColor} flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-black/10 border-4 border-background`}
                      >
                        {creator.name.charAt(0)}
                      </div>
                      {creator.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/10" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 mt-12">
                      <Badge
                        variant="outline"
                        className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                      >
                        98% Match
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-1.5 mb-1">
                      {creator.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {creator.handle}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-muted/50 hover:bg-muted"
                      >
                        {creator.niche}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 px-2 py-0.5">
                        <MapPin className="h-3 w-3" />
                        {creator.location}
                      </span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-6 bg-muted/30 rounded-2xl p-3 border border-muted/50">
                    <div className="text-center p-2 rounded-xl hover:bg-background/50 transition-colors">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <Users className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {creator.followers}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                        Followers
                      </p>
                    </div>
                    <div className="text-center p-2 rounded-xl hover:bg-background/50 transition-colors border-x border-muted/50">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <TrendingUp className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {creator.engagement}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                        Engage
                      </p>
                    </div>
                    <div className="text-center p-2 rounded-xl hover:bg-background/50 transition-colors">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <Star className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {creator.rating}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                        Rating
                      </p>
                    </div>
                  </div>

                  {/* Footer: Platforms & Action */}
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-muted/50">
                    <div className="flex items-center -space-x-2">
                      {creator.platforms.map((platform) => (
                        <div
                          key={platform}
                          className="w-8 h-8 rounded-full bg-background border-2 border-muted flex items-center justify-center text-muted-foreground hover:z-10 hover:scale-110 transition-all shadow-sm"
                        >
                          {getPlatformIcon(platform)}
                        </div>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 rounded-xl px-6"
                      onClick={async () => {
                        try {
                          // In a real app, we would use the creator's real ID.
                          // For this demo, we'll assume the mock IDs map to real users or handle the error.
                          // We'll attempt to start a conversation with a hardcoded ID if the mock ID fails,
                          // or just try the mock ID.
                          // Let's assume ID 2 is a valid "other user" for testing if ID 1 is the logged in brand.
                          const result = await startConversation(creator.id);

                          if (result.error) {
                            toast.error(
                              "Could not start conversation. (User might not exist in DB)"
                            );
                            return;
                          }

                          if (result.success) {
                            toast.success(
                              `Conversation started with ${creator.name}`
                            );
                            router.push(
                              `/dashboard/messages?conversationId=${result.conversationId}`
                            );
                          }
                        } catch (error) {
                          toast.error("Something went wrong");
                        }
                      }}
                    >
                      <Mail className="h-4 w-4" />
                      Invite
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
