"use client";

import { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { completeSignUpAndOnboarding } from "@/app/(login)/actions";
import {
  Loader2,
  Briefcase,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

type ActionState = {
  error?: string;
};

type FormData = {
  email: string;
  password: string;
  companyName?: string;
  billingEmail?: string;
  niche?: string;
  bio?: string;
  currency: string;
  name: string;
  username: string;
  country?: string;
  timezone?: string;
};

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"brand" | "creator" | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    currency: "USD",
    name: "",
    username: "",
  });

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    completeSignUpAndOnboarding,
    {}
  );

  const handleRoleSelect = (selectedRole: "brand" | "creator") => {
    setRole(selectedRole);
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setProfilePicture(null);
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const steps = [
    { number: 1, title: "Role" },
    { number: 2, title: "Credentials" },
    { number: 3, title: "Details" },
    { number: 4, title: "Profile" },
  ];

  return (
    <div className="w-full">
      <ThemeToggle />
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-10 px-2">
        {steps.map((s, idx) => (
          <div key={s.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative z-10">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2",
                  step >= s.number
                    ? "bg-emerald-500 border-emerald-500 text-black"
                    : "bg-background border-muted text-muted-foreground"
                )}
              >
                {step > s.number ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  s.number
                )}
              </div>
              <span
                className={cn(
                  "text-xs mt-2 font-medium transition-colors duration-300 whitespace-nowrap",
                  step >= s.number ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {s.title}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-[2px] mx-2 transition-colors duration-300",
                  step > s.number ? "bg-emerald-500" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          {step === 1 && "How will you use Lumina Clippers?"}
          {step === 2 && "Create Your Account"}
          {step === 3 &&
            (role === "brand" ? "Brand Details" : "Creator Profile")}
          {step === 4 && "Complete Your Profile"}
        </h2>
        <p className="text-muted-foreground">
          {step === 1 && "Select your primary role to get started."}
          {step === 2 && "Enter your email and choose a secure password."}
          {step === 3 && "Tell us a bit more about your goals."}
          {step === 4 && "Just a few more details to finish setup."}
        </p>
      </div>

      <form action={formAction}>
        {/* Hidden inputs to preserve all form data */}
        <input type="hidden" name="accountType" value={role || ""} />
        <input type="hidden" name="email" value={formData.email} />
        <input type="hidden" name="password" value={formData.password} />
        <input type="hidden" name="currency" value={formData.currency} />
        {formData.companyName && (
          <input
            type="hidden"
            name="companyName"
            value={formData.companyName}
          />
        )}
        {formData.billingEmail && (
          <input
            type="hidden"
            name="billingEmail"
            value={formData.billingEmail}
          />
        )}
        {formData.niche && (
          <input type="hidden" name="niche" value={formData.niche} />
        )}
        {formData.bio && (
          <input type="hidden" name="bio" value={formData.bio} />
        )}
        {profilePicture && (
          <input type="hidden" name="profilePicture" value={profilePicture} />
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4"
            >
              <div
                className={cn(
                  "cursor-pointer border-2 rounded-2xl p-6 flex items-center gap-6 transition-all duration-200 hover:border-emerald/50 hover:bg-muted/30",
                  role === "brand"
                    ? "border-emerald-500 bg-emerald/5 ring-1 ring-emerald/20"
                    : "border-border"
                )}
                onClick={() => handleRoleSelect("brand")}
              >
                <div
                  className={cn(
                    "p-4 rounded-xl transition-colors",
                    role === "brand"
                      ? "bg-emerald-500 text-black"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Briefcase className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">I'm a Brand</h3>
                  <p className="text-sm text-muted-foreground">
                    I want to launch campaigns and hire creators.
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  "cursor-pointer border-2 rounded-2xl p-6 flex items-center gap-6 transition-all duration-200 hover:border-emerald/50 hover:bg-muted/30",
                  role === "creator"
                    ? "border-emerald-500 bg-emerald/5 ring-1 ring-emerald/20"
                    : "border-border"
                )}
                onClick={() => handleRoleSelect("creator")}
              >
                <div
                  className={cn(
                    "p-4 rounded-xl transition-colors",
                    role === "creator"
                      ? "bg-emerald-500 text-black"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <User className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">I'm a Creator</h3>
                  <p className="text-sm text-muted-foreground">
                    I want to find campaigns and monetize my content.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Email & Password */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Role-Specific Details */}
          {step === 3 && role === "brand" && (
            <motion.div
              key="step3-brand"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Acme Inc."
                  required
                  value={formData.companyName || ""}
                  onChange={(e) =>
                    updateFormData("companyName", e.target.value)
                  }
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingEmail">Billing Email</Label>
                <Input
                  id="billingEmail"
                  type="email"
                  placeholder="billing@acme.com"
                  value={formData.billingEmail || ""}
                  onChange={(e) =>
                    updateFormData("billingEmail", e.target.value)
                  }
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Preferred Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => updateFormData("currency", value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {step === 3 && role === "creator" && (
            <motion.div
              key="step3-creator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="niche">Primary Niche</Label>
                <Select
                  value={formData.niche || ""}
                  onValueChange={(value) => updateFormData("niche", value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your niche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Tech & Gaming</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="beauty">Beauty & Fashion</SelectItem>
                    <SelectItem value="fitness">Health & Fitness</SelectItem>
                    <SelectItem value="business">Business & Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  placeholder="Tell brands about yourself"
                  value={formData.bio || ""}
                  onChange={(e) => updateFormData("bio", e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Preferred Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => updateFormData("currency", value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {/* Step 4: Profile Details */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="johndoe"
                  required
                  value={formData.username}
                  onChange={(e) => updateFormData("username", e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="United States"
                    value={formData.country || ""}
                    onChange={(e) => updateFormData("country", e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    name="timezone"
                    placeholder="UTC-5"
                    value={formData.timezone || ""}
                    onChange={(e) => updateFormData("timezone", e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              {/* Profile Picture Upload */}
              <div className="space-y-2">
                <Label>Profile Picture (Optional)</Label>
                {!profilePicture ? (
                  <div className="border-2 border-dashed border-muted rounded-xl p-6 text-center hover:border-emerald/50 transition-colors">
                    <input
                      type="file"
                      id="profile-pic"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <label
                      htmlFor="profile-pic"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <div className="p-3 rounded-full bg-muted">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Click to upload image
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG or GIF (max. 5MB)
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative w-full aspect-square max-w-[200px] mx-auto">
                    <Image
                      src={profilePicture}
                      alt="Profile preview"
                      fill
                      className="rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {state.error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
                  {state.error}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 flex justify-between items-center">
          {step > 1 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          ) : (
            <div /> // Spacer
          )}

          {step < 4 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={
                (step === 1 && !role) ||
                (step === 2 &&
                  (!formData.email ||
                    !formData.password ||
                    formData.password.length < 8))
              }
              className="font-semibold text-black"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="font-semibold text-black"
              disabled={isPending || !formData.name || !formData.username}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
