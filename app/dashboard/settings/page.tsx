"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  User as UserIcon,
  Lock,
  Palette,
  Trash2,
  Upload,
  X,
  Camera,
  MapPin,
  Globe,
  LinkIcon,
  Phone,
  Shield,
  Copy,
  CheckCircle2,
  QrCode as QrCodeIcon,
} from "lucide-react";
import {
  updateProfile,
  updatePassword,
  deleteAccount,
  signOut,
} from "@/app/(login)/actions";
import {
  generateTwoFactorSecret,
  enableTwoFactor,
  disableTwoFactor,
} from "@/app/(login)/2fa-actions";
import { User } from "@/lib/db/schema";
import useSWR from "swr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Email } from "@carbon/icons-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ActionState = {
  error?: string;
  success?: string;
};

export default function SettingsPage() {
  const { data: user, mutate } = useSWR<User>("/api/user", fetcher);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [profileState, profileAction, isProfilePending] = useActionState<
    ActionState,
    FormData
  >(updateProfile, {});

  const [passwordState, passwordAction, isPasswordPending] = useActionState<
    ActionState,
    FormData
  >(updatePassword, {});

  const [deleteState, deleteAction, isDeletePending] = useActionState<
    ActionState,
    FormData
  >(deleteAccount, {});

  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 2FA State
  const [show2FADialog, setShow2FADialog] = React.useState(false);
  const [showBackupCodesDialog, setShowBackupCodesDialog] =
    React.useState(false);
  const [showDisable2FADialog, setShowDisable2FADialog] = React.useState(false);
  const [twoFactorSetup, setTwoFactorSetup] = React.useState<{
    secret: string;
    qrCode: string;
    backupCodes: string[];
  } | null>(null);
  const [verificationCode, setVerificationCode] = React.useState("");
  const [is2FALoading, setIs2FALoading] = React.useState(false);
  const [twoFactorError, setTwoFactorError] = React.useState("");
  const [disablePassword, setDisablePassword] = React.useState("");
  const [copiedCodes, setCopiedCodes] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [viewAs, setViewAs] = React.useState<"creator" | "brand">("creator");

  const publicUrl = React.useMemo(() => {
    const base =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "https://lumina-clippers.app");
    const slug = user?.username || user?.email?.split("@")[0] || "profile";
    return `${base}/p/${slug}`;
  }, [user]);

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1500);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEnable2FA = async () => {
    setIs2FALoading(true);
    setTwoFactorError("");
    try {
      const setup = await generateTwoFactorSecret();
      setTwoFactorSetup(setup);
      setShow2FADialog(true);
    } catch (error) {
      setTwoFactorError("Failed to generate 2FA secret");
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!twoFactorSetup || !verificationCode) return;

    setIs2FALoading(true);
    setTwoFactorError("");

    try {
      const result = await enableTwoFactor({
        secret: twoFactorSetup.secret,
        code: verificationCode,
        backupCodes: twoFactorSetup.backupCodes,
      });

      if (result.error) {
        setTwoFactorError(result.error);
      } else if (result.success) {
        setShow2FADialog(false);
        setShowBackupCodesDialog(true);
        setVerificationCode("");
        mutate();
      }
    } catch (error) {
      setTwoFactorError("Verification failed");
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!disablePassword) return;

    setIs2FALoading(true);
    setTwoFactorError("");

    try {
      const result = await disableTwoFactor({ password: disablePassword });

      if (result.error) {
        setTwoFactorError(result.error);
      } else if (result.success) {
        setShowDisable2FADialog(false);
        setDisablePassword("");
        mutate();
      }
    } catch (error) {
      setTwoFactorError("Failed to disable 2FA");
    } finally {
      setIs2FALoading(false);
    }
  };

  const copyBackupCodes = () => {
    if (twoFactorSetup) {
      navigator.clipboard.writeText(twoFactorSetup.backupCodes.join("\n"));
      setCopiedCodes(true);
      setTimeout(() => setCopiedCodes(false), 2000);
    }
  };

  if (!user) {
    return (
      <section className="flex-1 p-4 lg:p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 p-4 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile" className="gap-2">
            <UserIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your public profile information and personal details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={profileAction} className="space-y-8">
                {/* Avatar Section */}
                <div className="flex items-start gap-6">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-4 border-muted">
                      <AvatarImage
                        src={avatarPreview || user.profilePicture || ""}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback className="text-2xl bg-emerald-500/10 text-emerald-500">
                        {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={clearAvatar}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <div
                      className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      onClick={handleAvatarClick}
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-semibold">Profile Picture</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload a new profile picture or use your current one
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAvatarClick}
                      >
                        <Upload className=" h-4 w-4" />
                        Upload New
                      </Button>
                      {avatarPreview && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={clearAvatar}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      name="profilePicture"
                    />
                    <input
                      type="hidden"
                      name="profilePicture"
                      value={avatarPreview || user.profilePicture || ""}
                    />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      defaultValue={user.name || ""}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="johndoe"
                      defaultValue={user.username || ""}
                      required
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        defaultValue={user.email}
                        required
                        className="pl-10"
                      />
                      <Email className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <div className="relative">
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        defaultValue={user.phoneNumber || ""}
                        className="pl-10"
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself..."
                    defaultValue={user.bio || ""}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Brief description for your profile. Max 500 characters.
                  </p>
                </div>

                {/* Location */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <div className="relative">
                      <Input
                        id="country"
                        name="country"
                        placeholder="United States"
                        defaultValue={user.country || ""}
                        className="pl-10"
                      />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      name="timezone"
                      defaultValue={user.timezone || "UTC"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                        <SelectItem value="America/New_York">
                          Eastern (GMT-5)
                        </SelectItem>
                        <SelectItem value="America/Chicago">
                          Central (GMT-6)
                        </SelectItem>
                        <SelectItem value="America/Denver">
                          Mountain (GMT-7)
                        </SelectItem>
                        <SelectItem value="America/Los_Angeles">
                          Pacific (GMT-8)
                        </SelectItem>
                        <SelectItem value="Europe/London">
                          London (GMT+0)
                        </SelectItem>
                        <SelectItem value="Europe/Paris">
                          Paris (GMT+1)
                        </SelectItem>
                        <SelectItem value="Asia/Tokyo">
                          Tokyo (GMT+9)
                        </SelectItem>
                        <SelectItem value="Asia/Dubai">
                          Dubai (GMT+4)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Messages */}
                {profileState.error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {profileState.error}
                  </div>
                )}
                {profileState.success && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-sm">
                    {profileState.success}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={isProfilePending}
                    className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
                  >
                    {isProfilePending ? (
                      <>
                        <Loader2 className=" h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Public profile preview</CardTitle>
              <CardDescription>
                See how your profile appears to others. Copy the shareable link
                or open the public view.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      window.open(publicUrl, "_blank");
                    }}
                  >
                    <Globe className="h-4 w-4" />
                    Open public view
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={copyPublicLink}
                  >
                    {copiedLink ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copiedLink ? "Copied" : "Copy link"}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">View as</span>
                  <div className="flex gap-2">
                    <Button
                      variant={viewAs === "creator" ? "default" : "outline"}
                      size="sm"
                      className="h-8 px-3 rounded-full"
                      onClick={() => setViewAs("creator")}
                    >
                      Creator
                    </Button>
                    <Button
                      variant={viewAs === "brand" ? "default" : "outline"}
                      size="sm"
                      className="h-8 px-3 rounded-full"
                      onClick={() => setViewAs("brand")}
                    >
                      Brand
                    </Button>
                  </div>
                </div>
              </div>

              {/* Preview card */}
              <div className="rounded-2xl border border-border/60 bg-card/60 p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border border-border/50">
                      <AvatarImage
                        src={user?.profilePicture || ""}
                        alt={user?.name || "Profile"}
                      />
                      <AvatarFallback>
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {user?.name || "Your Name"}{" "}
                        <Badge className="ml-2 align-middle bg-emerald-500/10 text-emerald-500">
                          Verified
                        </Badge>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @{user?.username || "handle"} ·{" "}
                        {viewAs === "creator" ? "Creator" : "Brand"}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Follow
                  </Button>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {user?.bio ||
                    "Add a short bio to let others know who you are and what you do."}
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="p-3 rounded-lg border border-border/50 bg-card/50">
                    <p className="text-xs text-muted-foreground">Followers</p>
                    <p className="text-lg font-semibold">1.2M</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border/50 bg-card/50">
                    <p className="text-xs text-muted-foreground">Engagement</p>
                    <p className="text-lg font-semibold">4.6%</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border/50 bg-card/50">
                    <p className="text-xs text-muted-foreground">
                      Top platform
                    </p>
                    <p className="text-lg font-semibold">TikTok</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="rounded-full">
                    Tech & Productivity
                  </Badge>
                  <Badge variant="outline" className="rounded-full">
                    USA
                  </Badge>
                  <Badge variant="outline" className="rounded-full">
                    Accepting campaigns
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={passwordAction} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                  />
                </div>

                {passwordState.error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {passwordState.error}
                  </div>
                )}
                {passwordState.success && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-sm">
                    {passwordState.success}
                  </div>
                )}

                <Button type="submit" disabled={isPasswordPending}>
                  {isPasswordPending ? (
                    <>
                      <Loader2 className=" h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account with TOTP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {user.twoFactorEnabled ? "2FA Enabled" : "2FA Disabled"}
                    </p>
                    {user.twoFactorEnabled && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {user.twoFactorEnabled
                      ? "Your account is protected with two-factor authentication"
                      : "Secure your account with an authenticator app"}
                  </p>
                </div>
                {user.twoFactorEnabled ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowDisable2FADialog(true)}
                  >
                    Disable
                  </Button>
                ) : (
                  <Button
                    onClick={handleEnable2FA}
                    disabled={is2FALoading}
                    className="bg-emerald-500 hover:bg-emerald-600 text-black"
                  >
                    {is2FALoading ? (
                      <>
                        <Loader2 className=" h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Enable 2FA"
                    )}
                  </Button>
                )}
              </div>

              {user.twoFactorEnabled && (
                <div className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium">Backup Codes</p>
                      <p className="text-xs text-muted-foreground">
                        {user.twoFactorBackupCodes
                          ? `${
                              (user.twoFactorBackupCodes as string[]).length
                            } backup codes remaining`
                          : "No backup codes available"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>
                Sign out of your account and end your current session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Sign Out</p>
                  <p className="text-sm text-muted-foreground">
                    End your current session and return to the login page
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await signOut();
                    router.push("/sign-in");
                  }}
                >
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={deleteAction} className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delete-password">Confirm with Password</Label>
                  <Input
                    id="delete-password"
                    name="password"
                    type="password"
                    placeholder="Enter your password to confirm"
                    required
                  />
                </div>

                {deleteState.error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {deleteState.error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isDeletePending}
                >
                  {isDeletePending ? (
                    <>
                      <Loader2 className=" h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className=" h-4 w-4" />
                      Delete Account
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how Lumina Clippers looks for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Color Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "light", label: "Light", preview: "bg-white" },
                    { value: "dark", label: "Dark", preview: "bg-zinc-950" },
                    {
                      value: "system",
                      label: "System",
                      preview: "bg-gradient-to-br from-white to-zinc-950",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setTheme(option.value)}
                      className={cn(
                        "relative overflow-hidden rounded-2xl border-2 p-4 hover:border-emerald-500/50 transition-all",
                        theme === option.value
                          ? "border-emerald-500 ring-2 ring-emerald-500/20"
                          : "border-border"
                      )}
                    >
                      <div
                        className={cn(
                          "aspect-video rounded-lg mb-3",
                          option.preview
                        )}
                      />
                      <p className="text-sm font-medium text-center">
                        {option.label}
                      </p>
                      {theme === option.value && (
                        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 2FA Setup Dialog */}
      <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCodeIcon className="h-5 w-5" />
              Enable Two-Factor Authentication
            </DialogTitle>
            <DialogDescription>
              Scan the QR code with your authenticator app
            </DialogDescription>
          </DialogHeader>

          {twoFactorSetup && (
            <div className="space-y-4">
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <Image
                  src={twoFactorSetup.qrCode}
                  alt="2FA QR Code"
                  width={200}
                  height={200}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Or enter this code manually:
                </Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-2 py-2 pl-3 bg-muted rounded-xl text-xs font-mono break-all">
                    {twoFactorSetup.secret}
                  </code>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      navigator.clipboard.writeText(twoFactorSetup.secret)
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
              </div>

              {twoFactorError && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {twoFactorError}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShow2FADialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleVerify2FA}
              disabled={is2FALoading || verificationCode.length !== 6}
              className="bg-emerald-500 hover:bg-emerald-600 text-black"
            >
              {is2FALoading ? (
                <>
                  <Loader2 className=" h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Enable"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Backup Codes Dialog */}
      <Dialog
        open={showBackupCodesDialog}
        onOpenChange={setShowBackupCodesDialog}
      >
        <DialogContent className="w-fit">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
              2FA Enabled Successfully!
            </DialogTitle>
            <DialogDescription>
              Save these backup codes in a safe place
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {twoFactorSetup?.backupCodes.map((code, index) => (
                  <div key={index} className="text-center">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-500 text-sm">
              <p className="font-medium">Important!</p>
              <p className="text-xs mt-1">
                Each backup code can only be used once. Store them securely -
                you won't be able to see them again.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={copyBackupCodes}
              className="flex-1"
            >
              {copiedCodes ? (
                <>
                  <CheckCircle2 className=" h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className=" h-4 w-4" />
                  Copy Codes
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                setShowBackupCodesDialog(false);
                setTwoFactorSetup(null);
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-black"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable 2FA Dialog */}
      <Dialog
        open={showDisable2FADialog}
        onOpenChange={setShowDisable2FADialog}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Disable Two-Factor Authentication
            </DialogTitle>
            <DialogDescription>
              Enter your password to disable 2FA
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              Warning: Disabling 2FA will make your account less secure.
            </div>

            <div className="space-y-2">
              <Label htmlFor="disable-password">Password</Label>
              <Input
                id="disable-password"
                type="password"
                placeholder="Enter your password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
              />
            </div>

            {twoFactorError && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {twoFactorError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDisable2FADialog(false);
                setDisablePassword("");
                setTwoFactorError("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisable2FA}
              disabled={is2FALoading || !disablePassword}
            >
              {is2FALoading ? (
                <>
                  <Loader2 className=" h-4 w-4 animate-spin" />
                  Disabling...
                </>
              ) : (
                "Disable 2FA"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
