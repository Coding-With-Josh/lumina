"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/lib/db/schema";
import useSWR from "swr";
import {
  CheckCircle2,
  Clock,
  FileText,
  Play,
  TrendingUp,
  UserPlus,
  XCircle,
} from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Activity = {
  id: string;
  type: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  iconBg: string;
  metadata?: string;
};

const mockCreatorActivities: Activity[] = [
  {
    id: "1",
    type: "post_validated",
    description: "Post validated for Summer Fashion",
    time: "2 hours ago",
    icon: <CheckCircle2 className="h-4 w-4" />,
    iconBg: "bg-emerald-500/10 text-emerald-500",
    metadata: "+$125 earnings",
  },
  {
    id: "2",
    type: "campaign_joined",
    description: "Joined Tech Review Series",
    time: "5 hours ago",
    icon: <UserPlus className="h-4 w-4" />,
    iconBg: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "3",
    type: "post_submitted",
    description: "Content submitted for review",
    time: "1 day ago",
    icon: <FileText className="h-4 w-4" />,
    iconBg: "bg-purple-500/10 text-purple-500",
  },
  {
    id: "4",
    type: "payout_processed",
    description: "Payout processed successfully",
    time: "2 days ago",
    icon: <TrendingUp className="h-4 w-4" />,
    iconBg: "bg-emerald-500/10 text-emerald-500",
    metadata: "$1,250",
  },
  {
    id: "5",
    type: "review_pending",
    description: "Post under review - Fitness Challenge",
    time: "3 days ago",
    icon: <Clock className="h-4 w-4" />,
    iconBg: "bg-amber-500/10 text-amber-500",
  },
];

const mockBrandActivities: Activity[] = [
  {
    id: "1",
    type: "campaign_launched",
    description: "Holiday Collection campaign launched",
    time: "1 hour ago",
    icon: <Play className="h-4 w-4" />,
    iconBg: "bg-emerald-500/10 text-emerald-500",
    metadata: "24 creators joined",
  },
  {
    id: "2",
    type: "post_approved",
    description: "Approved 3 creator posts",
    time: "3 hours ago",
    icon: <CheckCircle2 className="h-4 w-4" />,
    iconBg: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "3",
    type: "creator_joined",
    description: "New creator joined campaign",
    time: "5 hours ago",
    icon: <UserPlus className="h-4 w-4" />,
    iconBg: "bg-purple-500/10 text-purple-500",
    metadata: "@fashionista_jane",
  },
  {
    id: "4",
    type: "milestone_reached",
    description: "Campaign reached 50% views target",
    time: "1 day ago",
    icon: <TrendingUp className="h-4 w-4" />,
    iconBg: "bg-emerald-500/10 text-emerald-500",
  },
  {
    id: "5",
    type: "post_rejected",
    description: "Returned post for revision",
    time: "2 days ago",
    icon: <XCircle className="h-4 w-4" />,
    iconBg: "bg-red-500/10 text-red-500",
    metadata: "Content guidelines",
  },
];

export function RecentActivity() {
  const { data: user } = useSWR<User>("/api/user", fetcher);

  const isCreator = user?.accountType === "creator" || !user?.accountType;

  const activities = isCreator ? mockCreatorActivities : mockBrandActivities;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          {isCreator
            ? "Your latest campaign activities"
            : "Latest updates across campaigns"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.iconBg}`}
              >
                {activity.icon}
              </div>
              <div className="flex-1 space-y-1.5 min-w-0">
                <p className="text-sm font-medium leading-snug">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                  {activity.metadata && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs font-semibold text-emerald-600">
                        {activity.metadata}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
