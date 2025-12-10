"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  DollarSign,
  Eye,
  Globe,
  Lock,
  Instagram,
  Video,
  Twitter,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";

interface StepReviewProps {
  formData: any;
  onSubmit: () => void;
}

export function StepReview({ formData, onSubmit }: StepReviewProps) {
  const getPlatformIcon = (id: string) => {
    switch (id) {
      case "instagram":
        return <Instagram className="h-4 w-4 text-pink-600" />;
      case "tiktok":
        return <Video className="h-4 w-4 text-black dark:text-white" />;
      case "x":
        return <Twitter className="h-4 w-4 text-blue-500" />;
      case "threads":
        return <Instagram className="h-4 w-4 text-purple-600" />;
      default:
        return null;
    }
  };

  const getPlatformLabel = (id: string) => {
    switch (id) {
      case "instagram":
        return "Instagram";
      case "tiktok":
        return "TikTok";
      case "x":
        return "X (Twitter)";
      case "threads":
        return "Threads";
      default:
        return id;
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Review & Launch</h2>
        <p className="text-muted-foreground">
          Double-check everything before launching your campaign.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Campaign Basics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Title</p>
              <p className="font-medium">
                {formData.title || "Untitled Campaign"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-sm line-clamp-3">
                {formData.description || "No description provided."}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Visibility</p>
              <div className="flex items-center gap-2">
                {formData.visibility === "public" ? (
                  <>
                    <Globe className="h-4 w-4 text-emerald-500" />
                    <span>Public Marketplace</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 text-amber-500" />
                    <span>Private (Invite Only)</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget & Goals */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              Budget & Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Budget
                </p>
                <p className="font-medium text-lg">
                  ${parseFloat(formData.budget || "0").toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Target CPM</p>
                <p className="font-medium text-lg">
                  ${parseFloat(formData.cpm || "0").toLocaleString()}
                </p>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                  Estimated Reach
                </span>
              </div>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                {formData.requiredViews?.toLocaleString() || "0"}{" "}
                <span className="text-sm font-normal opacity-70">views</span>
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Duration</p>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 opacity-50" />
                <span>
                  {formData.startDate
                    ? format(formData.startDate, "MMM d, yyyy")
                    : "TBD"}
                </span>
                <span className="text-muted-foreground">→</span>
                <span>
                  {formData.endDate
                    ? format(formData.endDate, "MMM d, yyyy")
                    : "TBD"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Targeting */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Video className="h-4 w-4 text-emerald-500" />
              Targeting & Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Platforms</p>
              <div className="flex flex-wrap gap-2">
                {(formData.platforms || []).length > 0 ? (
                  (formData.platforms || []).map((p: string) => (
                    <Badge
                      key={p}
                      variant="secondary"
                      className="gap-1.5 py-1.5 px-3"
                    >
                      {getPlatformIcon(p)}
                      {getPlatformLabel(p)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    No platforms selected
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Questionnaire
              </p>
              <div className="space-y-2">
                {(formData.questionnaire || []).length > 0 ? (
                  (formData.questionnaire || []).map((q: string, i: number) => (
                    <div
                      key={i}
                      className="flex gap-3 items-start p-3 bg-muted/30 rounded-lg text-sm"
                    >
                      <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                      <span>{q}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    No custom questions
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
