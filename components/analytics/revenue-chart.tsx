"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData =
    data.length > 0
      ? data
      : [
          { name: "Jan", value: 0 },
          { name: "Feb", value: 0 },
          { name: "Mar", value: 0 },
          { name: "Apr", value: 0 },
          { name: "May", value: 0 },
          { name: "Jun", value: 0 },
        ];

  return (
    <Card className="col-span-4 relative overflow-hidden border-muted/40 bg-card/40 backdrop-blur-xl shadow-2xl">
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

      <CardHeader className="relative z-10">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Spending Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
              </linearGradient>
              <filter id="glow" height="130%">
                <feGaussianBlur
                  in="SourceAlpha"
                  stdDeviation="5"
                  result="blur"
                />
                <feOffset in="blur" dx="0" dy="0" result="offsetBlur" />
                <feFlood
                  floodColor="#10b981"
                  floodOpacity="0.5"
                  result="offsetColor"
                />
                <feComposite
                  in="offsetColor"
                  in2="offsetBlur"
                  operator="in"
                  result="offsetBlur"
                />
                <feMerge>
                  <feMergeNode in="offsetBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
              dx={-10}
            />
            <Tooltip
              cursor={{ fill: "rgba(16, 185, 129, 0.05)" }}
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                backdropFilter: "blur(12px)",
              }}
              formatter={(value: number) => [
                `$${value.toLocaleString()}`,
                "Spent",
              ]}
            />
            <Bar
              dataKey="value"
              fill="url(#barGradient)"
              radius={[8, 8, 0, 0]}
              barSize={50}
              filter="url(#glow)"
              className="transition-all duration-300 hover:opacity-90"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
