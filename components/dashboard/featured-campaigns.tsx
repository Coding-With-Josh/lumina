"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Calendar,
  DollarSign,
  Eye,
  Users2,
  TrendingUp,
} from "lucide-react";

interface FeaturedCampaignsProps {
  isCreator: boolean;
  isBrand: boolean;
}

interface CampaignCardProps {
  title: string;
  brand?: string;
  status: "active" | "pending" | "completed";
  progress: number;
  views: number;
  target: number;
  cpm: number;
  deadline: string;
  participants?: number;
  isCreator: boolean;
}

function CampaignCard({
  title,
  brand,
  status,
  progress,
  views,
  target,
  cpm,
  deadline,
  participants,
  isCreator,
}: CampaignCardProps) {
  const statusColors = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <Card className="p-8 hover:shadow-lg transition-all group">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-semibold mb-2 group-hover:text-emerald-600 transition-colors">
              {title}
            </h3>
            {isCreator && brand && (
              <p className="text-muted-foreground">by {brand}</p>
            )}
          </div>
          <Badge className={`${statusColors[status]} capitalize px-4 py-1.5`}>
            {status}
          </Badge>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span className="text-sm font-medium">Views</span>
            </div>
            <p className="text-xl font-bold">
              {views.toLocaleString()}
              <span className="text-sm text-muted-foreground font-normal">
                /{target.toLocaleString()}
              </span>
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">CPM</span>
            </div>
            <p className="text-xl font-bold">${cpm}</p>
          </div>

          {!isCreator && participants && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users2 className="h-4 w-4" />
                <span className="text-sm font-medium">Creators</span>
              </div>
              <p className="text-xl font-bold">{participants}</p>
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Deadline</span>
            </div>
            <p className="text-xl font-bold text-amber-600">{deadline}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">Progress</span>
            <span className="font-bold">{progress}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Action */}
        <div className="pt-2">
          <Button className="w-full group/btn" size="lg">
            {isCreator ? "View Details" : "Manage Campaign"}
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function FeaturedCampaigns({
  isCreator,
  isBrand,
}: FeaturedCampaignsProps) {
  // Mock data
  const campaigns = isCreator
    ? [
        {
          title: "Summer Fashion Launch",
          brand: "StyleCo",
          status: "active" as const,
          progress: 65,
          views: 325000,
          target: 500000,
          cpm: 12.5,
          deadline: "Dec 15",
        },
        {
          title: "Tech Review Series",
          brand: "TechGiant",
          status: "active" as const,
          progress: 40,
          views: 120000,
          target: 300000,
          cpm: 15.0,
          deadline: "Dec 20",
        },
      ]
    : [
        {
          title: "Holiday Collection 2025",
          status: "active" as const,
          progress: 75,
          views: 1250000,
          target: 1500000,
          cpm: 11.5,
          deadline: "Dec 20",
          participants: 24,
        },
        {
          title: "New Year Promo",
          status: "active" as const,
          progress: 35,
          views: 420000,
          target: 1200000,
          cpm: 13.0,
          deadline: "Jan 5",
          participants: 18,
        },
      ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          {isCreator ? "Your Campaigns" : "Active Campaigns"}
        </h2>
        <Button variant="outline">
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {campaigns.map((campaign, index) => (
          <CampaignCard key={index} {...campaign} isCreator={isCreator} />
        ))}
      </div>
    </div>
  );
}
