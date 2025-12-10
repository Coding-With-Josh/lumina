"use client";

import { Card } from "@/components/ui/card";
import {
  FileText,
  Calendar,
  Users,
  Target,
  DollarSign,
  TrendingUp,
} from "lucide-react";

interface QuickStatsProps {
  isCreator: boolean;
  isBrand: boolean;
}

interface StatItemProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
}

function StatItem({ value, label, icon, color = "emerald" }: StatItemProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div
          className={`h-14 w-14 rounded-2xl bg-${color}-50 flex items-center justify-center text-${color}-600 group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-3xl font-bold truncate">{value}</p>
          <p className="text-sm text-muted-foreground truncate">{label}</p>
        </div>
      </div>
    </Card>
  );
}

export function QuickStats({ isCreator, isBrand }: QuickStatsProps) {
  if (isCreator) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6">Quick Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatItem
            value="47"
            label="Total Posts"
            icon={<FileText className="h-6 w-6" />}
          />
          <StatItem
            value="24"
            label="Validated"
            icon={<Target className="h-6 w-6" />}
            color="blue"
          />
          <StatItem
            value="8"
            label="Active Campaigns"
            icon={<TrendingUp className="h-6 w-6" />}
            color="purple"
          />
          <StatItem
            value="Dec 15"
            label="Next Payout"
            icon={<Calendar className="h-6 w-6" />}
            color="amber"
          />
        </div>
      </div>
    );
  }

  if (isBrand) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-6">Campaign Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatItem
            value="8"
            label="Active Campaigns"
            icon={<Target className="h-6 w-6" />}
          />
          <StatItem
            value="156"
            label="Total Creators"
            icon={<Users className="h-6 w-6" />}
            color="blue"
          />
          <StatItem
            value="$8.50"
            label="Avg CPM"
            icon={<DollarSign className="h-6 w-6" />}
            color="purple"
          />
          <StatItem
            value="3"
            label="Ending Soon"
            icon={<Calendar className="h-6 w-6" />}
            color="amber"
          />
        </div>
      </div>
    );
  }

  return null;
}
