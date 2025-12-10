"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Play,
  Search,
  BarChart3,
  MessageSquare,
  Plus,
  TrendingUp,
  UserPlus,
} from "lucide-react";

interface QuickActionsProps {
  isCreator: boolean;
  isBrand: boolean;
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  variant?: "default" | "outline";
}

function ActionButton({
  icon,
  label,
  description,
  variant = "outline",
}: ActionButtonProps) {
  return (
    <Button
      variant={variant}
      className="h-auto p-5 justify-start text-left hover:scale-[1.02] transition-transform"
    >
      <div className="flex items-start gap-4 w-full">
        <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base mb-1">{label}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Button>
  );
}

export function QuickActions({ isCreator, isBrand }: QuickActionsProps) {
  return (
    <Card className="p-8 relative overflow-hidden">
      {/* Visible background glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-500/15 dark:from-emerald-500/20 to-transparent blur-xl" />

      <h2 className="text-2xl font-semibold mb-6 relative z-10">
        Quick Actions
      </h2>

      <div className="space-y-3 relative z-10">
        {isCreator && (
          <>
            <ActionButton
              icon={<Search className="h-5 w-5" />}
              label="Browse Campaigns"
              description="Find new opportunities"
              variant="default"
            />
            <ActionButton
              icon={<Play className="h-5 w-5" />}
              label="Submit Content"
              description="Upload your work"
            />
            <ActionButton
              icon={<BarChart3 className="h-5 w-5" />}
              label="View Analytics"
              description="Track performance"
            />
            <ActionButton
              icon={<MessageSquare className="h-5 w-5" />}
              label="Messages"
              description="Chat with brands"
            />
          </>
        )}

        {isBrand && (
          <>
            <ActionButton
              icon={<Plus className="h-5 w-5" />}
              label="Create Campaign"
              description="Launch new campaign"
              variant="default"
            />
            <ActionButton
              icon={<UserPlus className="h-5 w-5" />}
              label="Find Creators"
              description="Discover talent"
            />
            <ActionButton
              icon={<TrendingUp className="h-5 w-5" />}
              label="View Analytics"
              description="Campaign insights"
            />
            <ActionButton
              icon={<MessageSquare className="h-5 w-5" />}
              label="Messages"
              description="Chat with creators"
            />
          </>
        )}
      </div>
    </Card>
  );
}
