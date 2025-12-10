"use client";

import { useState, useEffect } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  CartesianGrid,
  Rectangle,
} from "recharts";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const chartColors = {
  light: {
    primary: "#10b981", // emerald-500
    primaryLight: "#34d399", // emerald-400
    background: "#f4f4f5", // zinc-100
    grid: "#e4e4e7", // zinc-200
    text: "#18181b", // zinc-900
    tooltipBg: "rgba(255, 255, 255, 0.95)",
    tooltipBorder: "#e4e4e7", // zinc-200
  },
  dark: {
    primary: "#10b981", // emerald-500
    primaryLight: "#34d399", // emerald-400
    background: "#18181b", // zinc-900
    grid: "#27272a", // zinc-800
    text: "#f4f4f5", // zinc-50
    tooltipBg: "rgba(24, 24, 27, 0.95)",
    tooltipBorder: "#27272a", // zinc-800
  },
};

const seriesByRange: Record<string, { name: string; earnings: number }[]> = {
  "90d": [
    { name: "Week 1", earnings: 2450 },
    { name: "Week 2", earnings: 3120 },
    { name: "Week 3", earnings: 2890 },
    { name: "Week 4", earnings: 4100 },
    { name: "Week 5", earnings: 3650 },
    { name: "Week 6", earnings: 4550 },
    { name: "Week 7", earnings: 4980 },
    { name: "Week 8", earnings: 5250 },
    { name: "Week 9", earnings: 5610 },
    { name: "Week 10", earnings: 5890 },
    { name: "Week 11", earnings: 6180 },
    { name: "Week 12", earnings: 6425 },
  ],
  "6m": [
    { name: "Jun", earnings: 6390 },
    { name: "Jul", earnings: 7490 },
    { name: "Aug", earnings: 8000 },
    { name: "Sep", earnings: 9500 },
    { name: "Oct", earnings: 11000 },
    { name: "Nov", earnings: 13000 },
  ],
  "1y": [
  { name: "Jan", earnings: 4000 },
  { name: "Feb", earnings: 3000 },
  { name: "Mar", earnings: 5000 },
  { name: "Apr", earnings: 2780 },
  { name: "May", earnings: 4890 },
  { name: "Jun", earnings: 6390 },
  { name: "Jul", earnings: 7490 },
  { name: "Aug", earnings: 8000 },
  { name: "Sep", earnings: 9500 },
  { name: "Oct", earnings: 11000 },
  { name: "Nov", earnings: 13000 },
  { name: "Dec", earnings: 15420 },
  ],
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const isDark = document.documentElement.classList.contains("dark");
    const colors = isDark ? chartColors.dark : chartColors.light;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 rounded-lg border shadow-xl"
        style={{
          background: colors.tooltipBg,
          borderColor: `${colors.primary}40`, // Slight emerald tint to border
          color: colors.text,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: `0 4px 20px ${
            isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"
          }`,
        }}
      >
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            {label} 2023
          </p>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.primary }}
            />
            <p className="font-bold" style={{ color: colors.primary }}>
              ${payload[0].value.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }
  return null;
};

type EarningsChartProps = {
  height?: number;
};

export function EarningsChart({ height = 380 }: EarningsChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [range, setRange] = useState<"90d" | "6m" | "1y">("90d");
  const isDark =
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false;
  const colors = isDark ? chartColors.dark : chartColors.light;
  const data = seriesByRange[range];
  const latest = data[data.length - 1]?.earnings ?? 0;
  const first = data[0]?.earnings ?? latest;
  const delta = latest - first;
  const deltaPct = first ? (delta / first) * 100 : 0;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        className="w-full bg-muted/20 animate-pulse rounded-lg"
        style={{ height }}
      />
    );
  }

  return (
    <div className="relative group w-full px-3" style={{ height }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-muted-foreground">Earnings trend</p>
          <div className="flex items-center gap-2">
            <p className="text-xl font-semibold">${latest.toLocaleString()}</p>
            <span
              className={cn(
                "text-xs px-2 py-1 rounded-full font-medium",
                delta >= 0
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-red-500/10 text-red-600"
              )}
            >
              {delta >= 0 ? "+" : ""}
              {deltaPct.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {(["90d", "6m", "1y"] as const).map((key) => (
            <Button
              key={key}
              size="sm"
              variant={range === key ? "default" : "outline"}
              onClick={() => setRange(key)}
            >
              {key.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Enhanced glow and vertical rhythm */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[200%] h-[200%] bg-gradient-to-b from-primary/10 via-primary/20 to-transparent rounded-full blur-3xl animate-pulse-slow"
          style={{ backgroundColor: colors.primary }}
        />
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent, transparent 8%, rgba(255,255,255,0.05) 8%, rgba(255,255,255,0.05) 10%)",
            mixBlendMode: "soft-light",
          }}
        />
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 12, right: 12, left: 12, bottom: 6 }}
          className="relative z-10"
        >
          <defs>
            {/* Enhanced gradient for the area */}
            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.primary} stopOpacity={1} />
              <stop
                offset="100%"
                stopColor={colors.primaryLight}
                stopOpacity={0.2}
              />
            </linearGradient>

            {/* Enhanced glow effect for the line */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>

            {/* Background gradient for better contrast */}
            <linearGradient id="chartBackground" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={colors.background}
                stopOpacity={0.8}
              />
              <stop offset="100%" stopColor={colors.grid} stopOpacity={0.1} />
            </linearGradient>
          </defs>

          {/* Background rectangle with subtle gradient */}
          <Rectangle
            x={0}
            y={0}
            width={100}
            height={100}
            fill="url(#chartBackground)"
          />

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={`${colors.grid}80`}
            vertical
            strokeWidth={0.6}
          />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: colors.text,
              fontSize: 11,
              fontWeight: 500,
            }}
            tickMargin={10}
            padding={{ left: 10, right: 10 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fill: colors.text,
              fontSize: 11,
              fontWeight: 500,
            }}
            tickFormatter={(value) => `$${value / 1000}k`}
            tickMargin={10}
            width={40}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: `${colors.primary}40`,
              strokeWidth: 1.5,
              strokeDasharray: "4 4",
            }}
            contentStyle={{
              background: "transparent",
              border: "none",
              boxShadow: "none",
              backdropFilter: "none",
              WebkitBackdropFilter: "blur(8px)",
              borderWidth: "1px",
            }}
          />

          {/* Enhanced area with stronger gradient */}
          <Area
            type="monotone"
            dataKey="earnings"
            fill="url(#colorEarnings)"
            stroke="none"
            fillOpacity={0.3}
            style={{
              filter: `drop-shadow(0 0 15px ${colors.primary}30)`,
            }}
          />

          {/* Main line with enhanced glow */}
          <Line
            type="monotone"
            dataKey="earnings"
            stroke={colors.primary}
            strokeWidth={4}
            dot={{
              r: 4,
              fill: colors.primary,
              stroke: colors.background,
              strokeWidth: 2,
              className: "pulse",
              style: {
                filter: `drop-shadow(0 0 10px ${colors.primary}90)`,
              },
            }}
            activeDot={{
              r: 10,
              fill: colors.background,
              stroke: colors.primary,
              strokeWidth: 2,
              className: "animate-pulse",
              style: {
                filter: `drop-shadow(0 0 20px ${colors.primary})`,
              },
            }}
            style={{
              filter: `drop-shadow(0 0 30px ${colors.primary}80)`,
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Enhanced animated gradient border */}
      <div className="absolute inset-0 -z-10 rounded-xl overflow-hidden pointer-events-none">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0",
            "group-hover:opacity-100 transition-opacity duration-700"
          )}
          style={{ backgroundColor: colors.primary }}
        />
      </div>

      {/* Additional glow effect that pulses */}
      <div className="absolute inset-0 -z-20 opacity-15 group-hover:opacity-25 transition-opacity duration-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-primary/50 to-transparent animate-pulse-slow" />
      </div>
    </div>
  );
}
