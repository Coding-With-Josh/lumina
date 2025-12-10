"use client";

import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  Clock,
  UserPlus,
  TrendingUp,
  FileText,
  Play,
  XCircle,
} from "lucide-react";

interface ActivityTimelineProps {
  isCreator: boolean;
  isBrand: boolean;
}

interface TimelineItemProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  time: string;
  metadata?: string;
  showLine?: boolean;
}

function TimelineItem({
  icon,
  iconBg,
  title,
  time,
  metadata,
  showLine = true,
}: TimelineItemProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      {showLine && (
        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
      )}

      {/* Content */}
      <div className="flex gap-4 items-start">
        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg} relative z-10`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <p className="font-medium text-sm leading-snug mb-1">{title}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs text-muted-foreground">{time}</p>
            {metadata && (
              <>
                <span className="text-xs text-muted-foreground">•</span>
                <p className="text-xs font-semibold text-emerald-600">
                  {metadata}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ActivityTimeline({
  isCreator,
  isBrand,
}: ActivityTimelineProps) {
  // Mock data
  const creatorActivities = [
    {
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      iconBg: "bg-emerald-50",
      title: "Post validated for Summer Fashion",
      time: "2 hours ago",
      metadata: "+$125",
    },
    {
      icon: <UserPlus className="h-5 w-5 text-blue-600" />,
      iconBg: "bg-blue-50",
      title: "Joined Tech Review Series",
      time: "5 hours ago",
    },
    {
      icon: <FileText className="h-5 w-5 text-purple-600" />,
      iconBg: "bg-purple-50",
      title: "Content submitted for review",
      time: "1 day ago",
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
      iconBg: "bg-emerald-50",
      title: "Payout processed",
      time: "2 days ago",
      metadata: "$1,250",
    },
    {
      icon: <Clock className="h-5 w-5 text-amber-600" />,
      iconBg: "bg-amber-50",
      title: "Under review - Fitness Challenge",
      time: "3 days ago",
      showLine: false,
    },
  ];

  const brandActivities = [
    {
      icon: <Play className="h-5 w-5 text-emerald-600" />,
      iconBg: "bg-emerald-50",
      title: "Holiday Collection launched",
      time: "1 hour ago",
      metadata: "24 creators joined",
    },
    {
      icon: <CheckCircle2 className="h-5 w-5 text-blue-600" />,
      iconBg: "bg-blue-50",
      title: "Approved 3 creator posts",
      time: "3 hours ago",
    },
    {
      icon: <UserPlus className="h-5 w-5 text-purple-600" />,
      iconBg: "bg-purple-50",
      title: "New creator joined campaign",
      time: "5 hours ago",
      metadata: "@fashionista_jane",
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
      iconBg: "bg-emerald-50",
      title: "Reached 50% views target",
      time: "1 day ago",
    },
    {
      icon: <XCircle className="h-5 w-5 text-red-600" />,
      iconBg: "bg-red-50",
      title: "Returned post for revision",
      time: "2 days ago",
      showLine: false,
    },
  ];

  const activities = isCreator ? creatorActivities : brandActivities;

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>

      <div className="space-y-6">
        {activities.map((activity, index) => (
          <TimelineItem
            key={index}
            {...activity}
            showLine={
              activity.showLine !== undefined
                ? activity.showLine
                : index < activities.length - 1
            }
          />
        ))}
      </div>
    </Card>
  );
}
