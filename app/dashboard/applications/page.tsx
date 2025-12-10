"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data for applications
const applications = [
  {
    id: 1,
    campaign: "Summer Collection Launch 2025",
    brand: "Fashion Nova",
    status: "pending",
    appliedDate: "2024-03-15",
    budget: "$500",
    platform: "Instagram",
  },
  {
    id: 2,
    campaign: "Tech Gadget Review",
    brand: "Sony",
    status: "approved",
    appliedDate: "2024-03-10",
    budget: "$1,200",
    platform: "YouTube",
  },
  {
    id: 3,
    campaign: "Organic Skincare Promo",
    brand: "Glow Recipe",
    status: "rejected",
    appliedDate: "2024-03-01",
    budget: "$300",
    platform: "TikTok",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800";
    case "rejected":
      return "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800";
    case "pending":
      return "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle2 className="h-4 w-4" />;
    case "rejected":
      return <XCircle className="h-4 w-4" />;
    case "pending":
      return <Clock className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="mx-auto space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-semibold tracking-tight">
          My Applications
        </h1>
        <p className="text-muted-foreground">
          Track the status of your campaign applications
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Applications List */}
      <div className="grid gap-6">
        {applications.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="group relative">
              <Card className="relative py-2 overflow-hidden rounded-3xl border-muted/60 bg-card/50 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:border-emerald-500/20 dark:hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.1)]">
                {/* Decorative glow elements (Wallet Style) */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />

                <CardContent className="p-6 sm:p-8 relative z-10">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    {/* Campaign Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="text-xs font-semibold bg-background/50 backdrop-blur-sm border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                        >
                          {app.brand}
                        </Badge>
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          Applied {app.appliedDate}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                          {app.campaign}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/10">
                          <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="font-semibold text-emerald-900 dark:text-emerald-100">
                            {app.budget}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-muted">
                          <span className="font-medium text-foreground">
                            {app.platform}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-4 w-full md:w-auto justify-between md:justify-end">
                      <Badge
                        variant="secondary"
                        className={`gap-2 py-2 px-4 text-sm font-semibold capitalize border shadow-sm transition-all duration-300 ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {getStatusIcon(app.status)}
                        {app.status}
                      </Badge>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 bg-background/50 backdrop-blur-sm"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 hover:bg-emerald-500/10 hover:text-emerald-600"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ))}

        {applications.length === 0 && (
          <div className="text-center py-20 bg-muted/30 rounded-xl border-2 border-dashed">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-6">
              Start exploring campaigns to find your next opportunity
            </p>
            <Button>Browse Campaigns</Button>
          </div>
        )}
      </div>
    </div>
  );
}
