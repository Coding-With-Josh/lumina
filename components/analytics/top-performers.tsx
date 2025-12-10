"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, TrendingUp } from "lucide-react";

const topCreators = [
  {
    name: "Sarah Jenkins",
    role: "Lifestyle",
    roi: "4.5x",
    earnings: "$12,400",
    avatar: "/avatars/01.png",
  },
  {
    name: "Alex Rivera",
    role: "Tech Reviewer",
    roi: "3.8x",
    earnings: "$8,200",
    avatar: "/avatars/02.png",
  },
  {
    name: "Emma Wilson",
    role: "Beauty",
    roi: "3.2x",
    earnings: "$5,100",
    avatar: "/avatars/03.png",
  },
];

export function TopPerformers() {
  return (
    <Card className="col-span-3 relative overflow-hidden border-muted/40 bg-card/40 backdrop-blur-xl shadow-2xl">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-[60px] pointer-events-none" />

      <CardHeader className="relative z-10">
        <CardTitle className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
            <Trophy className="h-5 w-5" />
          </div>
          Top Performing Creators
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-4">
          {topCreators.map((creator, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group border border-transparent hover:border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-background shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <AvatarImage src={creator.avatar} />
                    <AvatarFallback>{creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-background shadow-md ${
                      index === 0
                        ? "bg-yellow-500 shadow-yellow-500/50"
                        : index === 1
                        ? "bg-slate-400 shadow-slate-400/50"
                        : "bg-orange-700 shadow-orange-700/50"
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold leading-none group-hover:text-yellow-500 transition-colors">
                    {creator.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                    {creator.role}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-emerald-500 flex items-center justify-end gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  <TrendingUp className="h-3 w-3" /> {creator.roi} ROI
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                  Generated{" "}
                  <span className="text-foreground">{creator.earnings}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
