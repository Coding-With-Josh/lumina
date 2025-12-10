"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Plus,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowDownLeft,
  ArrowUpRightIcon,
} from "lucide-react";
import { motion } from "motion/react";

const data = [
  { name: "Ethereum", value: 45, color: "#627EEA" },
  { name: "USDT", value: 30, color: "#26A17B" },
  { name: "Lumina Clippers", value: 15, color: "#00ff87" },
  { name: "Bitcoin", value: 10, color: "#F7931A" },
];

const assets = [
  {
    name: "Ethereum",
    symbol: "ETH",
    amount: "4.25",
    value: "$8,240.50",
    change: "+2.4%",
    color: "#627EEA",
  },
  {
    name: "Tether",
    symbol: "USDT",
    amount: "5,490.00",
    value: "$5,490.00",
    change: "0.0%",
    color: "#26A17B",
  },
  {
    name: "Lumina Clippers",
    symbol: "LUM",
    amount: "25,000",
    value: "$2,750.00",
    change: "+12.5%",
    color: "#00ff87",
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
    amount: "0.045",
    value: "$1,830.20",
    change: "-1.2%",
    color: "#F7931A",
  },
];

export function WalletOverview() {
  return (
    <Card className="overflow-hidden border-border bg-gradient-to-br from-card via-card to-muted/20 shadow-sm">
      <CardHeader className="pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-2xl bg-card dark:bg-black/90 backdrop-blur-md flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 dark:bg-emerald-500/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/20 dark:bg-emerald-500/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
              <Wallet className="h-5 w-5 text-emerald-600 dark:text-white relative z-10" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Wallet</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Portfolio Overview
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 rounded-full hover:bg-muted"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Total Balance Card */}
        <div className="relative overflow-hidden rounded-3xl dark:bg-black light:bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 shadow-lg border-s-2 border-emerald-500/20 p-6">
          {/* Decorative glow elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

          <div className="relative z-10">
            <p className="text-emerald-700 dark:text-emerald-100 text-sm font-medium mb-2">
              Total Balance
            </p>
            <div className="flex items-baseline gap-3 mb-3">
              <h3 className="text-4xl font-bold text-emerald-900 dark:text-white">
                $18,311
              </h3>
              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 dark:bg-white/20 backdrop-blur-sm rounded-full">
                <TrendingUp className="h-3 w-3 text-emerald-700 dark:text-white" />
                <span className="text-xs font-semibold text-emerald-700 dark:text-white">
                  +5.2%
                </span>
              </div>
            </div>
            <p className="text-emerald-600 dark:text-emerald-100 text-xs">
              +$950.40 this month
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="h-11 gap-2 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 border border-emerald-500/20 dark:text-emerald-400">
            <ArrowDownLeft className="h-4 w-4" />
            Deposit
          </Button>
          <Button className="h-11 gap-2 bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 border border-blue-500/20 dark:text-blue-400">
            <ArrowUpRightIcon className="h-4 w-4" />
            Withdraw
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-6">
        {/* Chart Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Asset Allocation</h4>
            <Badge variant="secondary" className="text-xs">
              4 Assets
            </Badge>
          </div>

          <div className="h-[180px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.85)",
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                    padding: "8px 12px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                  itemStyle={{
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-2xl font-bold">100%</p>
                <p className="text-xs text-muted-foreground">Allocated</p>
              </div>
            </div>
          </div>
        </div>

        {/* Asset List */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold mb-3">Your Assets</h4>
          {assets.map((asset, index) => (
            <motion.div
              key={asset.symbol}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
              className="group flex items-center justify-between p-3 rounded-xl hover:bg-muted/70 transition-all cursor-pointer border border-transparent hover:border-border"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-md"
                  style={{ backgroundColor: asset.color }}
                >
                  {asset.symbol[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold">{asset.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {asset.amount} {asset.symbol}
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                <div>
                  <p className="text-sm font-semibold">{asset.value}</p>
                  <div className="flex items-center justify-end gap-1">
                    {asset.change.startsWith("+") ? (
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                    ) : asset.change.startsWith("-") ? (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    ) : null}
                    <p
                      className={`text-xs font-medium ${
                        asset.change.startsWith("+")
                          ? "text-emerald-500"
                          : asset.change.startsWith("-")
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {asset.change}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
