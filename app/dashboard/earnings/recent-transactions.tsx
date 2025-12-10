"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

type Transaction = {
  id: string;
  title: string;
  customer: string;
  date: string;
  amount: number;
  isCredit: boolean;
  avatar?: string;
  status?: "completed" | "pending" | "failed";
};

const transactions: Transaction[] = [
  {
    id: "1",
    title: "Premium Content Sale",
    customer: "Alex Johnson",
    date: "2023-06-15T10:30:00Z",
    amount: 149.99,
    isCredit: true,
    avatar: "AJ",
    status: "completed",
  },
  {
    id: "2",
    title: "Monthly Subscription",
    customer: "Sarah Miller",
    date: "2023-06-14T08:45:00Z",
    amount: 29.99,
    isCredit: true,
    avatar: "SM",
    status: "completed",
  },
  {
    id: "3",
    title: "Refund - Video Course",
    customer: "Mike Chen",
    date: "2023-06-12T14:20:00Z",
    amount: 89.99,
    isCredit: false,
    avatar: "MC",
    status: "completed",
  },
  {
    id: "4",
    title: "E-book Purchase",
    customer: "Emma Davis",
    date: "2023-06-10T16:10:00Z",
    amount: 12.99,
    isCredit: true,
    avatar: "ED",
    status: "pending",
  },
  {
    id: "5",
    title: "Consultation Call",
    customer: "David Wilson",
    date: "2023-06-08T11:15:00Z",
    amount: 199.99,
    isCredit: true,
    avatar: "DW",
    status: "completed",
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    completed: {
      text: "Completed",
      className: "bg-green-500/10 text-green-500",
    },
    pending: {
      text: "Pending",
      className: "bg-amber-500/10 text-amber-500",
    },
    failed: {
      text: "Failed",
      className: "bg-red-500/10 text-red-500",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.completed;

  return (
    <span
      className={cn(
        "text-xs px-2 py-0.5 rounded-full font-medium",
        config.className
      )}
    >
      {config.text}
    </span>
  );
};

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative p-3 -mx-3 rounded-lg hover:bg-accent/50 transition-colors"
    >
      <div className="flex items-center">
        <div className="relative">
          <Avatar className="h-10 w-10 bg-gradient-to-br from-primary/20 to-primary/5">
            <AvatarFallback className="bg-transparent text-primary">
              {transaction.avatar}
            </AvatarFallback>
          </Avatar>
          <div
            className={cn(
              "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background",
              transaction.status === "completed"
                ? "bg-green-500"
                : transaction.status === "pending"
                ? "bg-amber-500"
                : "bg-red-500"
            )}
          />
        </div>

        <div className="ml-4 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium truncate">{transaction.title}</p>
            <div
              className={cn(
                "font-medium ml-2 whitespace-nowrap",
                transaction.isCredit ? "text-green-500" : "text-red-500"
              )}
            >
              {transaction.isCredit ? "+" : "-"}${transaction.amount.toFixed(2)}
            </div>
          </div>

          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-muted-foreground truncate">
              {transaction.customer} •{" "}
              {new Date(transaction.date).toLocaleDateString()}
            </p>
            <StatusBadge status={transaction.status || "completed"} />
          </div>
        </div>
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-lg" />
      </div>
    </motion.div>
  );
};

export function RecentTransactions() {
  const [filterType, setFilterType] = useState<"all" | "credit" | "debit">("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "pending" | "failed"
  >("all");

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const typeMatch =
        filterType === "all" ||
        (filterType === "credit" && t.isCredit) ||
        (filterType === "debit" && !t.isCredit);
      const statusMatch = filterStatus === "all" || t.status === filterStatus;
      return typeMatch && statusMatch;
    });
  }, [filterType, filterStatus]);

  const total = filtered.reduce((sum, t) => sum + (t.isCredit ? t.amount : -t.amount), 0);
  const positive = total >= 0;

  return (
    <Card className="relative overflow-hidden group">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold tracking-tight">
            Recent Transactions
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Your latest earnings activity — quick filters below
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            title="More actions"
          >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More</span>
        </Button>
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        {/* Filters + summary */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {(["all", "credit", "debit"] as const).map((type) => (
            <Button
              key={type}
              size="sm"
              variant={filterType === type ? "default" : "outline"}
              onClick={() => setFilterType(type)}
              className="capitalize"
            >
              {type}
            </Button>
          ))}
          <div className="w-px h-6 bg-border mx-1" />
          {(["all", "completed", "pending", "failed"] as const).map((status) => (
            <Button
              key={status}
              size="sm"
              variant={filterStatus === status ? "default" : "outline"}
              onClick={() => setFilterStatus(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>

        <div className="flex items-center justify-between p-3 mb-3 rounded-lg border border-border/60 bg-card/60">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Net over selection
          </div>
          <div
            className={cn(
              "text-sm font-semibold px-2 py-1 rounded-full",
              positive ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
            )}
          >
            {positive ? "+" : "-"}${Math.abs(total).toFixed(2)}
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
          {filtered.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-6">
              No transactions for this filter.
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          className="mt-4 w-full group/button text-primary hover:text-primary/80 transition-colors"
        >
          View all transactions
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
        </Button>
      </CardContent>

      {/* Animated border */}
      <div className="absolute inset-0 -z-10 p-[1px] rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </Card>
  );
}
