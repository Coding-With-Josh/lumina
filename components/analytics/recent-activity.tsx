"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock } from "lucide-react";

interface RecentActivityProps {
  payments: {
    id: number;
    amount: number;
    createdAt: string;
    status: string;
    recipient: string;
  }[];
}

export function RecentActivity({ payments }: RecentActivityProps) {
  return (
    <Card className="col-span-3 relative overflow-hidden border-muted/40 bg-card/40 backdrop-blur-xl shadow-2xl">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />

      <CardHeader className="relative z-10">
        <CardTitle className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <ActivityIcon className="h-5 w-5" />
          </div>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-6">
          {payments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No recent activity
            </p>
          ) : (
            payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between group p-3 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center border-2 shadow-lg transition-transform duration-300 group-hover:scale-110 ${
                      payment.status === "completed"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-emerald-500/20"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-amber-500/20"
                    }`}
                  >
                    {payment.status === "completed" ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Clock className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none group-hover:text-emerald-500 transition-colors">
                      Payment to {payment.recipient}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5 font-medium flex items-center gap-1">
                      {new Date(payment.createdAt).toLocaleDateString()}
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                      {new Date(payment.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold flex items-center justify-end gap-1">
                    <span className="text-muted-foreground">-</span>$
                    {payment.amount.toLocaleString()}
                  </div>
                  <p
                    className={`text-xs mt-1.5 font-medium px-2 py-0.5 rounded-full inline-block ${
                      payment.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {payment.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
