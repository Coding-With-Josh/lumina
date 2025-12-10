"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Instagram,
  Video,
  Twitter,
  Plus,
  Trash2,
  MessageSquare,
} from "lucide-react";

interface StepTargetingProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function StepTargeting({
  formData,
  updateFormData,
}: StepTargetingProps) {
  const platforms = [
    {
      id: "instagram",
      label: "Instagram",
      icon: Instagram,
      color: "text-pink-600",
    },
    {
      id: "tiktok",
      label: "TikTok",
      icon: Video,
      color: "text-black dark:text-white",
    },
    { id: "x", label: "X (Twitter)", icon: Twitter, color: "text-blue-500" },
    {
      id: "threads",
      label: "Threads",
      icon: Instagram,
      color: "text-purple-600",
    }, // Using Instagram icon for Threads for now
  ];

  const togglePlatform = (platformId: string) => {
    const currentPlatforms = formData.platforms || [];
    if (currentPlatforms.includes(platformId)) {
      updateFormData({
        platforms: currentPlatforms.filter((p: string) => p !== platformId),
      });
    } else {
      updateFormData({ platforms: [...currentPlatforms, platformId] });
    }
  };

  const addQuestion = () => {
    const currentQuestions = formData.questionnaire || [];
    updateFormData({
      questionnaire: [...currentQuestions, ""],
    });
  };

  const updateQuestion = (index: number, value: string) => {
    const currentQuestions = [...(formData.questionnaire || [])];
    currentQuestions[index] = value;
    updateFormData({ questionnaire: currentQuestions });
  };

  const removeQuestion = (index: number) => {
    const currentQuestions = [...(formData.questionnaire || [])];
    currentQuestions.splice(index, 1);
    updateFormData({ questionnaire: currentQuestions });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Targeting & Requirements</h2>
        <p className="text-muted-foreground">
          Specify where you want content and what you need from creators.
        </p>
      </div>

      {/* Platforms */}
      <div className="space-y-4">
        <Label className="text-base">Target Platforms</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const isSelected = (formData.platforms || []).includes(platform.id);
            return (
              <div
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-muted hover:border-emerald-200 dark:hover:border-emerald-800"
                }`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => togglePlatform(platform.id)}
                  className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                />
                <Icon className={`h-5 w-5 ${platform.color}`} />
                <span className="font-semibold">{platform.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Questionnaire */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">Creator Questionnaire</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addQuestion}
            className="gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Add specific questions you want creators to answer when applying.
        </p>

        <div className="space-y-3">
          {(formData.questionnaire || []).map(
            (question: string, index: number) => (
              <div key={index} className="flex gap-2">
                <div className="relative flex-1">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={question}
                    onChange={(e) => updateQuestion(index, e.target.value)}
                    placeholder={`Question ${index + 1}`}
                    className="pl-9"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(index)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )
          )}
          {(formData.questionnaire || []).length === 0 && (
            <div className="text-center p-8 border-2 border-dashed rounded-xl bg-muted/30 text-muted-foreground">
              No questions added yet. Click "Add Question" to start.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
