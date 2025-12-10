"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const ageData = [
  { name: "18-24", value: 35 },
  { name: "25-34", value: 45 },
  { name: "35-44", value: 15 },
  { name: "45+", value: 5 },
];

const genderData = [
  { name: "Male", value: 40 },
  { name: "Female", value: 55 },
  { name: "Other", value: 5 },
];

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"];

export function DemographicsChart() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 col-span-4">
      {/* Age Chart */}
      <Card className="relative overflow-hidden border-muted/40 bg-card/40 backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />

        <CardHeader className="relative z-10">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Audience Age
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData} layout="vertical">
                <defs>
                  <linearGradient id="ageGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={40}
                  tick={{ fontSize: 12, fill: "#888" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                    backdropFilter: "blur(12px)",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="url(#ageGradient)"
                  radius={[0, 4, 4, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gender Chart */}
      <Card className="relative overflow-hidden border-muted/40 bg-card/40 backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

        <CardHeader className="relative z-10">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Audience Gender
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {genderData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="stroke-background hover:opacity-80 transition-opacity"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                    backdropFilter: "blur(12px)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>

            <div className="flex justify-center gap-4 mt-2">
              {genderData.map((entry, index) => (
                <div
                  key={entry.name}
                  className="flex items-center gap-2 text-xs text-muted-foreground font-medium"
                >
                  <div
                    className="w-2 h-2 rounded-full shadow-[0_0_8px] shadow-current"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                      color: COLORS[index % COLORS.length],
                    }}
                  />
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
