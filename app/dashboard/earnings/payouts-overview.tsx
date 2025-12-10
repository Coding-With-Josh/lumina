"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertCircle, ArrowUpRight, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

type Payout = {
  id: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  method: string;
};

const payouts: Payout[] = [
  {
    id: "PAY-7890",
    amount: 1250.0,
    date: "2025-12-15",
    status: "pending",
    method: "Bank Transfer",
  },
  {
    id: "PAY-6789",
    amount: 980.5,
    date: "2025-11-30",
    status: "completed",
    method: "PayPal",
  },
  {
    id: "PAY-5678",
    amount: 750.25,
    date: "2025-11-15",
    status: "completed",
    method: "Bank Transfer",
  },
];

export function PayoutsOverview() {
  const nextPayoutDate = "2025-12-29";
  const daysUntilPayout = Math.ceil(
    (new Date(nextPayoutDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const progress = Math.max(0, 30 - daysUntilPayout) * (100 / 30);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="mt-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-80" />
      <CardHeader className="pb-2 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Payouts</CardTitle>
          <Button variant="ghost" size="sm" className="gap-2">
            <Wallet className="h-4 w-4" />
            Methods
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Bi-weekly releases after fraud & deletion checks
        </p>
      </CardHeader>
      <CardContent className="relative z-10 space-y-4">
        <div className="p-4 rounded-xl border border-border/50 bg-card/70 shadow-sm">
            <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Next payout</span>
            <span className="font-semibold">
                ${payouts[0].amount.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>
                {new Date(nextPayoutDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span>{daysUntilPayout} days</span>
            </div>
            <Progress value={progress} className="h-2" />
          <p className="text-[11px] text-muted-foreground mt-2">
            Includes validated views after fraud checks; pending items may adjust totals.
          </p>
          </div>

        <div className="space-y-3 pt-1">
            {payouts.map((payout) => (
              <div
                key={payout.id}
              className="flex items-center justify-between text-sm p-2 rounded-lg border border-border/40 bg-card/50"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      payout.status === "completed"
                        ? "bg-green-500"
                        : payout.status === "pending"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    )}
                  />
                <div className="flex flex-col">
                  <span className="font-semibold">
                    ${payout.amount.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {payout.method}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                  <span className="text-muted-foreground text-xs">
                    {new Date(payout.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {getStatusIcon(payout.status)}
                </div>
              </div>
            ))}
          </div>

        <div className="grid sm:grid-cols-2 gap-2 pt-1">
          <Button variant="default" className="w-full" size="sm">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Request Payout
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            Schedule to wallet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
