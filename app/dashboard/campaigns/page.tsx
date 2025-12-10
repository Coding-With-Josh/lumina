"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import useSWR from "swr";
import { User } from "@/lib/db/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Eye,
  Sparkles,
  Target,
  CheckCircle2,
  Clock,
  Loader2,
  Plus,
  X,
  ArrowRight,
  MapPin,
  Award,
  BarChart3,
  Heart,
  Share2,
} from "lucide-react";
import { CreatorApplicationForm } from "@/components/campaigns/creator-application-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type CampaignCard = {
  id: number;
  slug: string;
  title: string;
  brand: string;
  category: string;
  budget: string;
  cpm: string;
  slots: number;
  filledSlots: number;
  views: string;
  deadline: string;
  status: string;
  featured: boolean;
};

export default function CampaignsPage() {
  const router = useRouter();
  const { data: user, isLoading } = useSWR<User>("/api/user", fetcher);
  const { data: campaignsData, isLoading: campaignsLoading } = useSWR<{
    campaigns: CampaignCard[];
  }>("/api/campaigns", fetcher);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignCard | null>(
    null
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const isCreator = user?.accountType === "creator" || !user?.accountType;
  const isBrand = user?.accountType === "brand";

  const handleViewDetails = (campaign: CampaignCard) => {
    setSelectedCampaign(campaign);
    setShowApplicationForm(false); // Reset to show details first
    setSheetOpen(true);
  };

  const handleApplyNow = () => {
    setShowApplicationForm(true);
  };

  // Filter campaigns based on search and category
  const campaigns = campaignsData?.campaigns || [];

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      searchQuery === "" ||
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      campaign.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "filled":
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/30 dark:text-gray-400";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  if (isLoading || campaignsLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold tracking-tight">
              {isCreator ? "Campaign Marketplace" : "My Campaigns"}
              <Sparkles className="size-6 text-emerald-500 inline ml-2" />
            </h1>
            <p className="text-muted-foreground">
              {isCreator
                ? "Discover and join amazing campaigns from top brands"
                : "Manage and monitor your active campaigns"}
            </p>
          </div>
          {isCreator ? (
            <Link href="/dashboard/applications">
              <Button
                className="gap-2"
                onClick={() => router.push("/dashboard/applications")}
              >
                <Target className="h-4 w-4" />
                My Applications
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/campaigns/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Campaign
              </Button>
            </Link>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isCreator ? "Active Campaigns" : "Total Campaigns"}
                  </p>
                  <p className="text-3xl font-bold">{isCreator ? "24" : "8"}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isCreator ? "Available Slots" : "Total Creators"}
                  </p>
                  <p className="text-3xl font-bold">
                    {isCreator ? "145" : "156"}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isCreator ? "Total Payout" : "Budget Spent"}
                  </p>
                  <p className="text-3xl font-bold">
                    {isCreator ? "$58K" : "$45.2K"}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isCreator ? "Ending Soon" : "Pending Review"}
                  </p>
                  <p className="text-3xl font-bold">{isCreator ? "8" : "12"}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 justify-between"
      >
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            className="pl-10 h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 justify-center">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px] h-12">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="fashion">Fashion</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="health & fitness">Health & Fitness</SelectItem>
              <SelectItem value="lifestyle">Lifestyle</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
              <SelectItem value="food">Food</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="lg" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            More Filters
          </Button>
        </div>
      </motion.div>

      {/* Campaigns Grid - 3 columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCampaigns.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <Target className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No campaigns found</h3>
            <p className="text-muted-foreground max-w-md">
              Try adjusting your search or filters to find what you're looking
              for
            </p>
          </div>
        ) : (
          filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Card className="relative pt-0 overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer border-s-3 border-emerald-500/20 h-full flex flex-col">
                {/* Subtle glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl group-hover:bg-emerald-500/20 dark:group-hover:bg-emerald-500/25 transition-all duration-500" />

                {campaign.featured && (
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className="bg-emerald-500 text-white dark:text-black gap-1">
                      <Sparkles className="h-3 w-3" />
                      Featured
                    </Badge>
                  </div>
                )}

                <CardContent className="p-0 relative z-10 flex flex-col flex-1">
                  {/* Campaign Image */}
                  <div className="relative h-40 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/20 dark:to-emerald-800/10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <Badge
                      className={`absolute bottom-4 left-4 z-20 ${getStatusColor(
                        campaign.status
                      )}`}
                    >
                      {campaign.status === "filled" ? "Filled" : "Active"}
                    </Badge>
                  </div>

                  {/* Campaign Content */}
                  <div className="p-5 space-y-4 flex flex-col flex-1">
                    <div>
                      <h3 className="text-lg font-semibold mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {campaign.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        by {campaign.brand}
                      </p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">CPM</p>
                          <p className="text-sm font-semibold truncate">
                            {campaign.cpm}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">
                            Target
                          </p>
                          <p className="text-sm font-semibold truncate">
                            {campaign.views}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Slots</p>
                          <p className="text-sm font-semibold truncate">
                            {campaign.filledSlots}/{campaign.slots}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">
                            Deadline
                          </p>
                          <p className="text-sm font-semibold truncate">
                            {campaign.deadline}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          Slots filled
                        </span>
                        <span className="font-semibold">
                          {Math.round(
                            (campaign.filledSlots / campaign.slots) * 100
                          )}
                          %
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all rounded-full"
                          style={{
                            width: `${
                              (campaign.filledSlots / campaign.slots) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full group-hover:scale-[1.02] transition-transform mt-auto"
                      disabled={campaign.status === "filled"}
                      onClick={() => handleViewDetails(campaign)}
                    >
                      {campaign.status === "filled" ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Campaign Filled
                        </>
                      ) : (
                        <>
                          <Target className="h-4 w-4 mr-2" />
                          {isCreator ? "View Details" : "Manage"}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl p-0 h-full">
          <SheetHeader className="sr-only">
            <SheetTitle>Campaign details</SheetTitle>
          </SheetHeader>
          <AnimatePresence mode="wait">
            {selectedCampaign && !showApplicationForm && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full flex flex-col"
              >
                {/* Campaign Details (shown to both brands and creators initially) */}
                <div className="relative h-64 dark:bg-black bg-emerald-200 overflow-hidden flex-shrink-0">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

                  <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white dark:text-white ">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-black/20 text-black border-black/30 dark:bg-white/20 dark:text-white dark:border-white/30">
                        {selectedCampaign.category}
                      </Badge>
                      {selectedCampaign.featured && (
                        <Badge className="bg-amber-500 text-white gap-1">
                          <Sparkles className="h-3 w-3" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-3xl font-bold mb-2 dark:text-white text-black">
                      {selectedCampaign.title}
                    </h2>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <MapPin className="h-4 w-4" />
                      <span>by {selectedCampaign.brand}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8 flex-1 overflow-y-auto">
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/10 p-6"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/20 rounded-full blur-2xl" />
                      <DollarSign className="h-8 w-8 text-emerald-600 mb-3" />
                      <p className="text-sm text-muted-foreground mb-1">
                        CPM Rate
                      </p>
                      <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                        {selectedCampaign.cpm}
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 p-6"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl" />
                      <Eye className="h-8 w-8 text-blue-600 mb-3" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Target Views
                      </p>
                      <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                        {selectedCampaign.views}
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 p-6"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl" />
                      <BarChart3 className="h-8 w-8 text-purple-600 mb-3" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Total Budget
                      </p>
                      <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                        {selectedCampaign.budget}
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10 p-6"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/20 rounded-full blur-2xl" />
                      <Calendar className="h-8 w-8 text-amber-600 mb-3" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Deadline
                      </p>
                      <p className="text-xl font-bold text-amber-900 dark:text-amber-100">
                        {selectedCampaign.deadline}
                      </p>
                    </motion.div>
                  </div>

                  {/* Slots Progress */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-emerald-600" />
                        <h3 className="text-lg font-semibold">Creator Slots</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600">
                          {selectedCampaign.filledSlots}/
                          {selectedCampaign.slots}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(
                            (selectedCampaign.filledSlots /
                              selectedCampaign.slots) *
                              100
                          )}
                          % filled
                        </p>
                      </div>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            (selectedCampaign.filledSlots /
                              selectedCampaign.slots) *
                            100
                          }%`,
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Campaign Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="space-y-3"
                  >
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Award className="h-5 w-5 text-emerald-600" />
                      About This Campaign
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Join this exciting campaign and collaborate with{" "}
                      {selectedCampaign.brand} to create amazing content. This
                      is a great opportunity to showcase your creativity and
                      reach a wider audience while earning competitive rates.
                    </p>
                  </motion.div>

                  {/* Requirements */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      Requirements
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Minimum 10K followers on primary platform",
                        "High-quality content creation capability",
                        "Engagement rate above 3%",
                        "Ability to meet deadlines",
                        "Professional communication",
                      ].map((req, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                        >
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-sm">{req}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-3 pt-4"
                  >
                    <Button
                      className="flex-1 h-12 gap-2"
                      size="lg"
                      onClick={() => {
                        if (isBrand) {
                          // Navigate to full campaign page
                          router.push(
                            `/dashboard/campaigns/${selectedCampaign.slug}`
                          );
                        } else {
                          // Show application form
                          handleApplyNow();
                        }
                      }}
                    >
                      {isCreator ? (
                        <>
                          <Target className="h-5 w-5" />
                          Apply Now
                        </>
                      ) : (
                        <>
                          <ArrowRight className="h-5 w-5" />
                          Manage Campaign
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="lg" className="h-12 gap-2">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="lg" className="h-12 gap-2">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Creator Application Form */}
            {selectedCampaign && showApplicationForm && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <CreatorApplicationForm
                  campaign={selectedCampaign}
                  onClose={() => setSheetOpen(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </SheetContent>
      </Sheet>
    </div>
  );
}
