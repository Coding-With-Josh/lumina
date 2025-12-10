"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Save,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Steps

import { StepReview } from "@/components/campaigns/wizard/step-review";

import { toast } from "sonner";
import { createCampaign } from "@/app/actions/campaigns";
import { StepBasics } from "@/components/campaigns/wizard/step-basics";
import { StepBudget } from "@/components/campaigns/wizard/step-budget";
import { StepTargeting } from "@/components/campaigns/wizard/step-targeting";

export default function NewCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibility: "public",
    budget: "",
    cpm: "",
    requiredViews: 0,
    startDate: undefined,
    endDate: undefined,
    platforms: [],
    questionnaire: [],
    campaignGoals: "reach",
    engagementDifficulty: "medium",
  });

  const totalSteps = 4;

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateFormData = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSaveDraft = () => {
    toast.info("Draft saving coming soon!");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await createCampaign({
        ...formData,
        budget: Math.round(Number(formData.budget)),
        cpm: Math.round(Number(formData.cpm)),
        requiredViews: Math.round(Number(formData.requiredViews)),
      });

      if (result.error) {
        if (typeof result.error === "string") {
          toast.error(result.error);
        } else {
          // Show first validation error
          const firstError = Object.values(result.error)[0];
          toast.error(
            Array.isArray(firstError) ? firstError[0] : "Validation failed"
          );
        }
        return;
      }

      toast.success("Campaign created successfully!");
      router.push("/dashboard/campaigns");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.title.length >= 3 && formData.description.length > 0;
      case 2:
        return (
          formData.budget &&
          formData.cpm &&
          formData.startDate &&
          formData.endDate &&
          formData.campaignGoals &&
          formData.engagementDifficulty
        );
      case 3:
        return formData.platforms.length > 0;
      default:
        return true;
    }
  };
  return (
    <div className="max-w-5xl mx-auto pb-20 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/50 blur-[100px] -z-10 rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <Button
            variant="ghost"
            className="mb-4 pl-0 hover:bg-transparent hover:text-emerald-500 transition-colors group"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Campaigns
          </Button>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Create New Campaign
          </h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
            Launch a new campaign to connect with creators and amplify your
            brand's reach.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            className="hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-12 relative">
        <div className="flex items-center justify-between relative z-10">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full -z-10" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full -z-10 transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          />

          {[
            { num: 1, label: "Basics" },
            { num: 2, label: "Budget & Goals" },
            { num: 3, label: "Targeting" },
            { num: 4, label: "Review" },
          ].map((s) => (
            <div
              key={s.num}
              className="flex flex-col items-center gap-3 cursor-pointer group"
              onClick={() => {
                // Only allow clicking previous steps or if current step is valid
                if (s.num < step || (s.num === step + 1 && isStepValid())) {
                  setStep(s.num);
                }
              }}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg border-2 transition-all duration-300 shadow-sm",
                  step >= s.num
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] scale-110"
                    : "bg-background border-muted text-muted-foreground group-hover:border-emerald-200 dark:group-hover:border-emerald-800"
                )}
              >
                {step > s.num ? <CheckCircle2 className="h-6 w-6" /> : s.num}
              </div>
              <span
                className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  step >= s.num
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px] bg-card/50 backdrop-blur-xl border border-muted/50 rounded-3xl p-8 shadow-sm relative overflow-hidden">
        {/* Decorative glow elements (Wallet Style) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10"
          >
            {step === 1 && (
              <StepBasics formData={formData} updateFormData={updateFormData} />
            )}
            {step === 2 && (
              <StepBudget formData={formData} updateFormData={updateFormData} />
            )}
            {step === 3 && (
              <StepTargeting
                formData={formData}
                updateFormData={updateFormData}
              />
            )}
            {step === 4 && (
              <StepReview formData={formData} onSubmit={handleSubmit} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t z-40 lg:pl-[22rem]">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1 || isSubmitting}
            size="lg"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={nextStep}
              disabled={!isStepValid() || isSubmitting}
              size="lg"
            >
              Next Step
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Launching...
                </>
              ) : (
                <>
              Launch Campaign
              <CheckCircle2 className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
