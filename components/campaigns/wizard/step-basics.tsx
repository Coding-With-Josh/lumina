"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Globe, Lock } from "lucide-react";

interface StepBasicsProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function StepBasics({ formData, updateFormData }: StepBasicsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Campaign Basics</h2>
        <p className="text-muted-foreground">
          Let's start with the core details of your campaign.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Campaign Title</Label>
          <Input
            id="title"
            placeholder="e.g., Summer Collection Launch 2025"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your campaign goals, theme, and what you're looking for..."
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            className="min-h-[150px]"
          />
        </div>

        <div className="space-y-3">
          <Label>Visibility</Label>
          <RadioGroup
            value={formData.visibility}
            onValueChange={(value) => updateFormData({ visibility: value })}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem
                value="public"
                id="public"
                className="peer sr-only"
              />
              <Label
                htmlFor="public"
                className="flex flex-col items-center justify-between rounded-2xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-500 [&:has([data-state=checked])]:border-emerald-500 cursor-pointer transition-all"
              >
                <Globe className="mb-3 h-6 w-6 text-muted-foreground peer-data-[state=checked]:text-emerald-500" />
                <div className="text-center">
                  <div className="font-semibold text-lg mb-1">Public</div>
                  <div className="text-sm text-muted-foreground">
                    Visible to all creators in the marketplace
                  </div>
                </div>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="private"
                id="private"
                className="peer sr-only"
              />
              <Label
                htmlFor="private"
                className="flex flex-col items-center justify-between rounded-2xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-500 [&:has([data-state=checked])]:border-emerald-500 cursor-pointer transition-all"
              >
                <Lock className="mb-3 h-6 w-6 text-muted-foreground peer-data-[state=checked]:text-emerald-500" />
                <div className="text-center">
                  <div className="font-semibold text-lg mb-1">Private</div>
                  <div className="text-sm text-muted-foreground">
                    Invite-only. Hidden from the marketplace.
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
