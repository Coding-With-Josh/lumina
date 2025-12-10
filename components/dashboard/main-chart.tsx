"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";

const data = [
  { date: "Jan 22", value: 4500 },
  { date: "Feb 22", value: 5200 },
  { date: "Mar 22", value: 4800 },
  { date: "Apr 22", value: 6100 },
  { date: "May 22", value: 5500 },
  { date: "Jun 22", value: 6700 },
  { date: "Jul 22", value: 7200 },
  { date: "Aug 22", value: 8400 },
  { date: "Sep 22", value: 8100 },
  { date: "Oct 22", value: 9500 },
  { date: "Nov 22", value: 10200 },
  { date: "Dec 22", value: 11500 },
  { date: "Jan 23", value: 10800 },
  { date: "Feb 23", value: 12400 },
  { date: "Mar 23", value: 13200 },
  { date: "Apr 23", value: 14500 },
  { date: "May 23", value: 15064 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 backdrop-blur-sm border border-border px-4 rounded-xl py-2 shadow-lg">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-lg font-bold text-emerald">
          ${new Intl.NumberFormat("en-US").format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function MainChart() {
  const [activeTab, setActiveTab] = useState("TVL");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="col-span-4 border-border bg-card shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-8">
          <div className="space-y-1">
            <CardTitle className="text-base font-medium text-muted-foreground">
              Total Value Locked
            </CardTitle>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-bold tracking-tight">
                {" "}
                $15,064,496,228.60
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 px-1.5 py-0.5 rounded font-medium flex items-center gap-1`}
                >
                  <TrendingUp className="w-3 h-3" />
                  +10%
                </span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </div>
          </div>
          <div className="flex items-center bg-muted/50 rounded-lg p-1">
            {["TVL", "Withdrawal"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pl-0">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#50C878" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#50C878" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#50C878"
                  opacity={0.2}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "gray", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "gray", fontSize: 12 }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                  dx={-10}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "50C878",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#50C878"
                  strokeWidth={1}
                  fillOpacity={0.1}
                  fill="#50C878"
                  animationDuration={1500}
                  className="border border-white"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
