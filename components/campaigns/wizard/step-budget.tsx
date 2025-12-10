"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, DollarSign, Eye } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface StepBudgetProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function StepBudget({ formData, updateFormData }: StepBudgetProps) {
  // Auto-calculate views when budget or CPM changes
  useEffect(() => {
    const budget = parseFloat(formData.budget);
    const cpm = parseFloat(formData.cpm);

    if (budget && cpm && cpm > 0) {
      const views = Math.floor((budget / cpm) * 1000);
      // We don't update if it's already the same to avoid loops,
      // but here we are just calculating for display or parent state
      // If we want to store it:
      // updateFormData({ requiredViews: views });
      // But updateFormData might trigger re-render.
      // Let's just calculate it for display here, or assume parent handles it?
      // Better to store it in formData so it's ready for submission.
      // To avoid infinite loop, check if value changed.
      if (formData.requiredViews !== views) {
        updateFormData({ requiredViews: views });
      }
    }
  }, [formData.budget, formData.cpm, formData.requiredViews, updateFormData]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Budget & Goals</h2>
        <p className="text-muted-foreground">
          Define your investment and performance expectations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Budget, CPM, and Goals (left column) */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="budget">Total Budget (USD)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="budget"
                type="number"
                placeholder="5000"
                value={formData.budget}
                onChange={(e) => updateFormData({ budget: e.target.value })}
                className="pl-10 text-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpm">Target CPM (USD)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="cpm"
                type="number"
                placeholder="15"
                value={formData.cpm}
                onChange={(e) => updateFormData({ cpm: e.target.value })}
                className="pl-10 text-lg"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Cost Per Mille (1,000 views)
            </p>
          </div>

          {/* Goals */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Primary Goal</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "reach", label: "Reach" },
                  { id: "engagement", label: "Engagement" },
                  { id: "conversions", label: "Conversions" },
                ].map((goal) => (
                  <Button
                    key={goal.id}
                    type="button"
                    variant={
                      formData.campaignGoals === goal.id ? "default" : "outline"
                    }
                    className="w-full"
                    onClick={() => updateFormData({ campaignGoals: goal.id })}
                  >
                    {goal.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Engagement Difficulty</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "low", label: "Low" },
                  { id: "medium", label: "Medium" },
                  { id: "high", label: "High" },
                ].map((diff) => (
                  <Button
                    key={diff.id}
                    type="button"
                    variant={
                      formData.engagementDifficulty === diff.id
                        ? "default"
                        : "outline"
                    }
                    className="w-full"
                    onClick={() =>
                      updateFormData({ engagementDifficulty: diff.id })
                    }
                  >
                    {diff.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calculated Views (right column) */}
        <div className="bg-muted/30 rounded-xl p-6 flex flex-col justify-center items-center text-center border-2 border-dashed border-muted">
          <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <Eye className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Estimated Reach</h3>
          <div className="text-4xl font-bold text-emerald-600 mb-2">
            {formData.requiredViews
              ? formData.requiredViews.toLocaleString()
              : "0"}
          </div>
          <p className="text-sm text-muted-foreground">
            Target Views based on Budget & CPM
          </p>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 flex flex-col">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal h-11",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                {formData.startDate ? (
                  format(formData.startDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => updateFormData({ startDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2 flex flex-col">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal h-11",
                  !formData.endDate && "text-muted-foreground"
                )}
              >
                {formData.endDate ? (
                  format(formData.endDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => updateFormData({ endDate: date })}
                disabled={(date) =>
                  formData.startDate ? date < formData.startDate : false
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
