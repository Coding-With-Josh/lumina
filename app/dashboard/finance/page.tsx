"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Shield,
  CreditCard,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Wallet,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useSWR from "swr";
import { useState } from "react";
import { User } from "@/lib/db/schema";

const summary = [
  { label: "Total spend", value: "$128,400", trend: "+8.4%", positive: true },
  { label: "MTD spend", value: "$18,920", trend: "+3.1%", positive: true },
  {
    label: "Committed (active)",
    value: "$42,600",
    trend: "+12%",
    positive: true,
  },
  { label: "Available", value: "$64,800", trend: "−", positive: true },
];

const payoutsDue = [
  { name: "Dec 29 window", amount: "$7,250", status: "pending", creators: 18 },
  {
    name: "Jan 12 window",
    amount: "$5,430",
    status: "scheduled",
    creators: 12,
  },
  {
    name: "Held (fraud review)",
    amount: "$1,120",
    status: "hold",
    creators: 4,
  },
];

const campaigns = [
  {
    title: "Holiday UGC Push",
    budget: "$18,000",
    spent: "$9,400",
    cpm: "$11.80",
    status: "active",
    nextPayout: "Dec 29",
  },
  {
    title: "Gadget Review Series",
    budget: "$22,500",
    spent: "$15,300",
    cpm: "$13.40",
    status: "active",
    nextPayout: "Dec 29",
  },
  {
    title: "Creator Whitelist",
    budget: "$12,000",
    spent: "$2,950",
    cpm: "$9.60",
    status: "active",
    nextPayout: "Jan 12",
  },
  {
    title: "Retention Remarketing",
    budget: "$8,500",
    spent: "$8,500",
    cpm: "$10.10",
    status: "completed",
    nextPayout: "—",
  },
];

const invoices = [
  { id: "INV-9821", amount: "$4,200", date: "Dec 01", status: "paid" },
  { id: "INV-9764", amount: "$12,500", date: "Nov 15", status: "paid" },
  { id: "INV-9720", amount: "$8,000", date: "Oct 30", status: "paid" },
];

export default function FinancePage() {
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const { data: user, isLoading: userLoading } = useSWR<User>(
    "/api/user",
    (url: string) => fetch(url).then((res) => res.json())
  );

  if (!userLoading && user && user.accountType !== "brand") {
    router.push("/dashboard");
    return null;
  }

  const handleExport = async (scope: string) => {
    try {
      setExporting(true);
      const res = await fetch(`/api/finance/export?scope=${scope}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${scope}-export.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Export ready");
    } catch (error: any) {
      toast.error(error.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
          <p className="text-muted-foreground">
            Spend, commitments, payouts, and billing in one view.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => router.push("/dashboard/settings")}
          >
            <Shield className="h-4 w-4" />
            Billing settings
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => toast.info("Stripe portal wiring pending")}
          >
            <CreditCard className="h-4 w-4" />
            Open Stripe portal
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.label} className="border-border/60">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-semibold">{item.value}</p>
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full font-medium",
                    item.positive
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-red-500/10 text-red-500"
                  )}
                >
                  {item.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg">Burn & cashflow</CardTitle>
              <p className="text-sm text-muted-foreground">
                Weekly spend vs committed budget
              </p>
            </div>
            <Badge variant="outline" className="rounded-full">
              MTD +3.1%
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-48 rounded-xl border border-border/60 bg-card/40 flex items-center justify-center text-muted-foreground">
              Chart placeholder (hook up to real spend data)
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="Spend this week" value="$6,240" positive />
              <Metric label="Committed next 30d" value="$14,200" positive />
              <Metric label="Platform fees collected" value="$3,560" positive />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Payout obligations</CardTitle>
            <p className="text-sm text-muted-foreground">
              Upcoming releases to creators
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {payoutsDue.map((p) => (
              <div
                key={p.name}
                className="p-3 rounded-lg border border-border/50 bg-card/40 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.creators} creators
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{p.amount}</p>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-full text-[11px]",
                      p.status === "pending"
                        ? "bg-amber-500/10 text-amber-500"
                        : p.status === "hold"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-emerald-500/10 text-emerald-500"
                    )}
                  >
                    {p.status}
                  </Badge>
                </div>
              </div>
            ))}
            <Button
              variant="ghost"
              className="w-full gap-2"
              onClick={() => router.push("/dashboard/earnings?tab=payouts")}
            >
              Review payouts
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg">Campaign financials</CardTitle>
              <p className="text-sm text-muted-foreground">
                Budget, spend, CPM, and next payouts
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={exporting}
              onClick={() => handleExport("campaigns")}
            >
              <BarChart3 className="h-4 w-4" />
              {exporting ? "Exporting..." : "Export CSV"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {campaigns.map((c) => (
              <div
                key={c.title}
                className="p-3 rounded-lg border border-border/50 bg-card/40 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <p className="font-semibold">{c.title}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>Budget {c.budget}</span>
                    <span>Spent {c.spent}</span>
                    <span>CPM {c.cpm}</span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-full text-[11px]",
                      c.status === "completed"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-emerald-500/10 text-emerald-500"
                    )}
                  >
                    {c.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Next payout: {c.nextPayout}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Invoices & billing</CardTitle>
            <p className="text-sm text-muted-foreground">
              Stripe receipts and subscription
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg border border-border/50 bg-card/40 flex items-center justify-between">
              <div>
                <p className="font-semibold">Subscription</p>
                <p className="text-xs text-muted-foreground">
                  Pro — renews Jan 5
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() =>
                  toast.info("Managing subscription via Stripe portal")
                }
              >
                <CreditCard className="h-4 w-4" />
                Manage
              </Button>
            </div>
            <div className="space-y-2">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3 rounded-lg border border-border/40 bg-card/30 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{inv.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {inv.date} • {inv.status}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">{inv.amount}</span>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full gap-2"
              onClick={() => toast.info("Opening billing portal (Stripe)")}
            >
              Open billing portal
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="p-3 rounded-lg border border-border/50 bg-card/40">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">{value}</span>
        {positive !== undefined && (
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full",
              positive
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-red-500/10 text-red-500"
            )}
          >
            {positive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
          </span>
        )}
      </div>
    </div>
  );
}
