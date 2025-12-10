"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  Filter,
  ArrowUpDown,
  Settings2,
  Download,
  Plus,
  MoreHorizontal,
  Star,
  Search,
  PenLine,
  Trash2,
  LayoutGrid as LayoutGridIcon,
  Loader2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { motion } from "motion/react";
import useSWR from "swr";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User } from "@/lib/db/schema";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function CampaignTable() {
  const router = useRouter();

  const { data, isLoading, error, mutate } = useSWR<{ campaigns: any[] }>(
    "/api/campaigns",
    fetcher
  );
  const { data: user } = useSWR<User>("/api/user", fetcher);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "pending" | "ended"
  >("all");
  const [sortKey, setSortKey] = useState<"recent" | "budget" | "slots">(
    "recent"
  );
  const [compact, setCompact] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const campaigns = data?.campaigns ?? [];

  const filtered = useMemo(() => {
    const searchFiltered = campaigns.filter((c) => {
      const hay = `${c.title} ${c.brand} ${c.category}`.toLowerCase();
      return hay.includes(query.toLowerCase());
    });

    const statusFiltered =
      statusFilter === "all"
        ? searchFiltered
        : searchFiltered.filter((c) => c.status === statusFilter);

    const sorted = [...statusFiltered].sort((a, b) => {
      if (sortKey === "budget") {
        return (b.budgetValue || 0) - (a.budgetValue || 0);
      }
      if (sortKey === "slots") {
        return (b.slots || 0) - (a.slots || 0);
      }
      // recent
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bDate - aDate;
    });

    return sorted;
  }, [campaigns, query, statusFilter, sortKey]);

  const handleNewCampaign = () => {
    router.push("/dashboard/campaigns/new");
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const rows = campaigns.map((c) => ({
        title: c.title,
        brand: c.brand,
        budget: c.budgetValue ?? 0,
        cpm: c.cpmValue ?? 0,
        requiredViews: c.requiredViewsValue ?? 0,
        status: c.status,
        createdAt: c.createdAt,
      }));
      const header = Object.keys(rows[0] ?? {});
      const csv = [
        header.join(","),
        ...rows.map((r) =>
          header
            .map((k) => {
              const cell = (r as any)[k] ?? "";
              if (typeof cell === "string" && cell.includes(",")) {
                return `"${cell.replace(/"/g, '""')}"`;
              }
              return cell;
            })
            .join(",")
        ),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "campaigns.csv";
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Campaigns exported");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (deletingId) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/campaigns", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok || json?.error) {
        throw new Error(json?.error || "Failed to delete");
      }
      toast.success("Campaign deleted");
      mutate();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const cycleFilter = () => {
    const order: ("all" | "active" | "pending" | "ended")[] = [
      "all",
      "active",
      "pending",
      "ended",
    ];
    const next = order[(order.indexOf(statusFilter) + 1) % order.length];
    setStatusFilter(next);
    toast.message(`Filter: ${next}`);
  };

  const cycleSort = () => {
    const order: ("recent" | "budget" | "slots")[] = [
      "recent",
      "budget",
      "slots",
    ];
    const next = order[(order.indexOf(sortKey) + 1) % order.length];
    setSortKey(next);
    toast.message(
      next === "recent"
        ? "Sort: Recent"
        : next === "budget"
        ? "Sort: Budget high → low"
        : "Sort: Slots high → low"
    );
  };

  const toggleCompact = () => setCompact((c) => !c);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-card rounded-xl border border-border shadow-sm"
    >
      {/* Toolbar */}
      <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 bg-background"
            onClick={toggleCompact}
            title="Toggle dense view"
          >
            <LayoutGridIcon className="w-4 h-4" />
            {compact ? "Compact" : "Comfort"}
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 bg-background"
            onClick={cycleFilter}
            title="Toggle status filter"
          >
            <Filter className="w-3.5 h-3.5" />
            Filter ({statusFilter})
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 bg-background"
            onClick={cycleSort}
            title="Toggle sort"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortKey === "recent"
              ? "Recent"
              : sortKey === "budget"
              ? "Budget"
              : "Slots"}
          </Button>
          <div className="flex items-center gap-2 ml-2 border-l border-border pl-4">
            <Switch
              id="stats"
              checked={showStats}
              onCheckedChange={(v) => setShowStats(Boolean(v))}
            />
            <label
              htmlFor="stats"
              className="text-sm font-medium cursor-pointer"
            >
              Show Statistics
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 bg-background"
            onClick={() => setShowStats((v) => !v)}
          >
            <Settings2 className="w-3.5 h-3.5" />
            {showStats ? "Hide Stats" : "Show Stats"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 bg-background"
            onClick={handleExport}
            disabled={isExporting || !campaigns.length}
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
          <Button
            size="sm"
            className="h-8 gap-2"
            onClick={handleNewCampaign}
            disabled={user?.accountType !== "brand"}
          >
            <Plus className="w-3.5 h-3.5" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search campaigns..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading campaigns…
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-16 text-red-500 text-sm">
              Failed to load campaigns.
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
              No campaigns found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[40px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>CPM</TableHead>
                  {showStats && <TableHead>Slots</TableHead>}
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((campaign) => (
                  <TableRow
                    key={campaign.id}
                    className={`hover:bg-muted/50 transition-colors ${
                      compact ? "text-sm" : ""
                    }`}
                  >
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                          <Star className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold line-clamp-1">
                            {campaign.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            by {campaign.brand}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{campaign.budget}</TableCell>
                    <TableCell>{campaign.views}</TableCell>
                    <TableCell>{campaign.cpm}</TableCell>
                    {showStats && (
                      <TableCell>
                        {campaign.filledSlots}/{campaign.slots}
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge
                        className={`${
                          campaign.status === "active"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : campaign.status === "pending"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-gray-500/10 text-gray-500"
                        }`}
                      >
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            router.push(`/dashboard/campaigns/${campaign.slug}`)
                          }
                          disabled={user?.accountType !== "brand"}
                        >
                          <PenLine className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(campaign.id)}
                          disabled={
                            user?.accountType !== "brand" ||
                            deletingId === campaign.id
                          }
                        >
                          {deletingId === campaign.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            router.push(`/dashboard/campaigns/${campaign.slug}`)
                          }
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </motion.div>
  );
}
