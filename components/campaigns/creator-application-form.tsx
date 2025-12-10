"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Instagram,
  Twitter,
  Video,
  Upload,
  Users,
  TrendingUp,
  MapPin,
  Sparkles,
} from "lucide-react";

interface CreatorApplicationFormProps {
  campaign: any;
  onClose: () => void;
}

export function CreatorApplicationForm({
  campaign,
  onClose,
}: CreatorApplicationFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Platform Selection
    platforms: {
      instagram: false,
      tiktok: false,
      x: false,
      threads: false,
    },
    usernames: {
      instagram: "",
      tiktok: "",
      x: "",
      threads: "",
    },
    followers: {
      instagram: "",
      tiktok: "",
      x: "",
      threads: "",
    },
    // Step 2: Audience Demographics
    ageRange: "18-35",
    location: "",
    interests: "",
    engagementRate: "",
    // Step 3: Application
    whyJoin: "",
    sampleLinks: ["", "", ""],
    acceptedTerms: false,
  });

  const totalSteps = 3;

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log("Application submitted:", formData);
    alert("Application submitted successfully!");
    onClose();
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const selectedPlatforms = Object.entries(formData.platforms).filter(
    ([_, selected]) => selected
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-br from-emerald-500 dark:from-emerald-900/40 via-emerald-600 dark:via-emerald-800/30 to-emerald-700 dark:to-emerald-700/40 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

        <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
          <h2 className="text-2xl font-bold mb-1">Join Campaign</h2>
          <p className="text-emerald-100 text-sm">
            {campaign.brand} • {campaign.category}
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="px-8 py-6 border-b">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-full font-semibold ${
                  step >= num
                    ? "bg-emerald-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > num ? <CheckCircle2 className="h-5 w-5" /> : num}
              </div>
              {num < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full ${
                    step > num ? "bg-emerald-500" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Platform</span>
          <span>Demographics</span>
          <span>Submit</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Platform Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Select Your Platforms
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose the platforms where you'll create content for this
                  campaign
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Instagram */}
                <div
                  onClick={() =>
                    updateFormData("platforms", {
                      ...formData.platforms,
                      instagram: !formData.platforms.instagram,
                    })
                  }
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.platforms.instagram
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-muted hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Instagram className="h-6 w-6 text-pink-600" />
                    <span className="font-semibold">Instagram</span>
                    {formData.platforms.instagram && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 ml-auto" />
                    )}
                  </div>
                  {formData.platforms.instagram && (
                    <div
                      className="space-y-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div>
                        <Label htmlFor="ig-username" className="text-xs">
                          Username
                        </Label>
                        <Input
                          id="ig-username"
                          placeholder="@username"
                          value={formData.usernames.instagram}
                          onChange={(e) =>
                            updateFormData("usernames", {
                              ...formData.usernames,
                              instagram: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ig-followers" className="text-xs">
                          Followers
                        </Label>
                        <Input
                          id="ig-followers"
                          type="number"
                          placeholder="10,000"
                          value={formData.followers.instagram}
                          onChange={(e) =>
                            updateFormData("followers", {
                              ...formData.followers,
                              instagram: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* TikTok */}
                <div
                  onClick={() =>
                    updateFormData("platforms", {
                      ...formData.platforms,
                      tiktok: !formData.platforms.tiktok,
                    })
                  }
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.platforms.tiktok
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-muted hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Video className="h-6 w-6 text-black dark:text-white" />
                    <span className="font-semibold">TikTok</span>
                    {formData.platforms.tiktok && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 ml-auto" />
                    )}
                  </div>
                  {formData.platforms.tiktok && (
                    <div
                      className="space-y-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div>
                        <Label htmlFor="tt-username" className="text-xs">
                          Username
                        </Label>
                        <Input
                          id="tt-username"
                          placeholder="@username"
                          value={formData.usernames.tiktok}
                          onChange={(e) =>
                            updateFormData("usernames", {
                              ...formData.usernames,
                              tiktok: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tt-followers" className="text-xs">
                          Followers
                        </Label>
                        <Input
                          id="tt-followers"
                          type="number"
                          placeholder="10,000"
                          value={formData.followers.tiktok}
                          onChange={(e) =>
                            updateFormData("followers", {
                              ...formData.followers,
                              tiktok: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* X (Twitter) */}
                <div
                  onClick={() =>
                    updateFormData("platforms", {
                      ...formData.platforms,
                      x: !formData.platforms.x,
                    })
                  }
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.platforms.x
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-muted hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Twitter className="h-6 w-6 text-blue-500" />
                    <span className="font-semibold">X (Twitter)</span>
                    {formData.platforms.x && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 ml-auto" />
                    )}
                  </div>
                  {formData.platforms.x && (
                    <div
                      className="space-y-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div>
                        <Label htmlFor="x-username" className="text-xs">
                          Username
                        </Label>
                        <Input
                          id="x-username"
                          placeholder="@username"
                          value={formData.usernames.x}
                          onChange={(e) =>
                            updateFormData("usernames", {
                              ...formData.usernames,
                              x: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="x-followers" className="text-xs">
                          Followers
                        </Label>
                        <Input
                          id="x-followers"
                          type="number"
                          placeholder="10,000"
                          value={formData.followers.x}
                          onChange={(e) =>
                            updateFormData("followers", {
                              ...formData.followers,
                              x: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Threads */}
                <div
                  onClick={() =>
                    updateFormData("platforms", {
                      ...formData.platforms,
                      threads: !formData.platforms.threads,
                    })
                  }
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.platforms.threads
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-muted hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Instagram className="h-6 w-6 text-purple-600" />
                    <span className="font-semibold">Threads</span>
                    {formData.platforms.threads && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 ml-auto" />
                    )}
                  </div>
                  {formData.platforms.threads && (
                    <div
                      className="space-y-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div>
                        <Label htmlFor="th-username" className="text-xs">
                          Username
                        </Label>
                        <Input
                          id="th-username"
                          placeholder="@username"
                          value={formData.usernames.threads}
                          onChange={(e) =>
                            updateFormData("usernames", {
                              ...formData.usernames,
                              threads: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="th-followers" className="text-xs">
                          Followers
                        </Label>
                        <Input
                          id="th-followers"
                          type="number"
                          placeholder="10,000"
                          value={formData.followers.threads}
                          onChange={(e) =>
                            updateFormData("followers", {
                              ...formData.followers,
                              threads: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedPlatforms.length > 0 && (
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                    ✓ {selectedPlatforms.length} platform
                    {selectedPlatforms.length > 1 ? "s" : ""} selected
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Audience Demographics */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Audience Demographics
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tell us about your audience to match with campaign
                  requirements
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="age-range">Primary Age Range</Label>
                  <Input
                    id="age-range"
                    placeholder="e.g., 18-35"
                    value={formData.ageRange}
                    onChange={(e) => updateFormData("ageRange", e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Primary Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., United States, United Kingdom"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="interests">Audience Interests</Label>
                  <Input
                    id="interests"
                    placeholder="e.g., Fashion, Lifestyle, Beauty"
                    value={formData.interests}
                    onChange={(e) =>
                      updateFormData("interests", e.target.value)
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="engagement">
                    Average Engagement Rate (%)
                  </Label>
                  <Input
                    id="engagement"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 4.5"
                    value={formData.engagementRate}
                    onChange={(e) =>
                      updateFormData("engagementRate", e.target.value)
                    }
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Calculate: (Likes + Comments) ÷ Followers × 100
                  </p>
                </div>
              </div>

              {/* Audience Preview */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border border-emerald-200 dark:border-emerald-800">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  Your Audience Profile
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span className="text-muted-foreground">Age:</span>
                    <span className="font-semibold">
                      {formData.ageRange || "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-semibold truncate">
                      {formData.location || "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="text-muted-foreground">Interests:</span>
                    <span className="font-semibold truncate">
                      {formData.interests || "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-amber-600" />
                    <span className="text-muted-foreground">Engagement:</span>
                    <span className="font-semibold">
                      {formData.engagementRate
                        ? `${formData.engagementRate}%`
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Application & Submit */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Complete Your Application
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tell us why you're excited about this campaign
                </p>
              </div>

              <div>
                <Label htmlFor="why-join">
                  Why do you want to join this campaign?
                </Label>
                <Textarea
                  id="why-join"
                  placeholder="Share your thoughts on why this campaign is a good fit for you and your audience..."
                  value={formData.whyJoin}
                  onChange={(e) => updateFormData("whyJoin", e.target.value)}
                  className="mt-2 min-h-32"
                />
              </div>

              <div>
                <Label>Sample Content Links (Optional)</Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Share links to your best performing content
                </p>
                {[0, 1, 2].map((index) => (
                  <Input
                    key={index}
                    placeholder={`Sample link ${index + 1}`}
                    value={formData.sampleLinks[index]}
                    onChange={(e) => {
                      const newLinks = [...formData.sampleLinks];
                      newLinks[index] = e.target.value;
                      updateFormData("sampleLinks", newLinks);
                    }}
                    className="mb-2"
                  />
                ))}
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Checkbox
                  id="terms"
                  checked={formData.acceptedTerms}
                  onCheckedChange={(checked) =>
                    updateFormData("acceptedTerms", checked)
                  }
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  I understand and accept the campaign requirements. I commit to
                  creating authentic, high-quality content that aligns with the
                  brand guidelines and will meet all posting deadlines.
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="p-8 border-t flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 1}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {step < totalSteps ? (
          <Button
            onClick={nextStep}
            disabled={
              (step === 1 && selectedPlatforms.length === 0) ||
              (step === 2 &&
                (!formData.ageRange ||
                  !formData.location ||
                  !formData.engagementRate))
            }
            className="gap-2"
          >
            Next Step
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!formData.whyJoin || !formData.acceptedTerms}
            className="gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            Submit Application
          </Button>
        )}
      </div>
    </div>
  );
}
