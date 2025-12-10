"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "./sidebar-context";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Users,
  MessageSquare,
  Mail,
  Workflow,
  BarChart2,
  Layers,
  Flag,
  Zap,
  BarChart3,
  Puzzle,
  FolderKanban,
  Calendar,
  HelpCircle,
  MessageCircle,
  Settings,
  LogOut,
  User2,
  ChevronRight,
  X,
  Search,
  DollarSign,
  FileText,
  Briefcase,
} from "lucide-react";
import { signOut } from "@/app/(login)/actions";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { User } from "@/lib/db/schema";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function AppSidebar() {
  const pathname = usePathname();
  const { isOpen, toggle, setIsOpen } = useSidebar();
  const router = useRouter();
  const [showUpgradeCard, setShowUpgradeCard] = React.useState(true);
  const [isFadingOut, setIsFadingOut] = React.useState(false);

  // Fetch user data
  const { data: user } = useSWR<User>("/api/user", fetcher);

  const handleLinkClick = () => {
    // Close sidebar on mobile when link is clicked
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const handleCloseCard = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setShowUpgradeCard(false);
    }, 300);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === path || pathname.startsWith(path + "/");
  };

  const brandNavLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/discover", icon: Search, label: "Discover" },
    { href: "/dashboard/campaigns", icon: ShoppingBag, label: "Campaigns" },
    { href: "/dashboard/creators", icon: Users, label: "Find Creators" },
    {
      href: "/dashboard/messages",
      icon: MessageSquare,
      label: "Messages",
      badge: "3",
    },
    { href: "/dashboard/analytics", icon: BarChart2, label: "Analytics" },
    { href: "/dashboard/finance", icon: DollarSign, label: "Finance" },
  ];

  const creatorNavLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/discover", icon: Search, label: "Discover" },
    { href: "/dashboard/campaigns", icon: Search, label: "Find Campaigns" },
    {
      href: "/dashboard/applications",
      icon: FileText,
      label: "My Applications",
    },
    {
      href: "/dashboard/messages",
      icon: MessageSquare,
      label: "Messages",
      badge: "12",
    },
    { href: "/dashboard/earnings", icon: DollarSign, label: "Earnings" },
    { href: "/dashboard/portfolio", icon: Briefcase, label: "Portfolio" },
  ];

  // Default to brand links if no user or brand
  const navLinks =
    user?.accountType === "creator" ? creatorNavLinks : brandNavLinks;

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-500 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 z-500 left-0 h-screen",
          "bg-card border-r border-border",
          "flex flex-col overflow-y-auto transition-all duration-300 ease-in-out",
          isOpen
            ? "w-[22rem] translate-x-0 pointer-events-auto"
            : "w-0 -translate-x-full pointer-events-none border-transparent"
        )}
      >
        {/* Header / Logo */}
        <div className="p-4 border-b border-border/40">
          <div className="flex items-center justify-center gap-3 mb-7 mt-3">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Lumina Clippers"
                  width={100}
                  height={30}
                  className="h-6 w-auto"
                />
              </Link>
            </div>
            <div>
              <Badge className="text-xs py-1 px-3 text-white bg-emerald-500/20 border border-emerald-500">
                {user?.accountType === "creator" ? "Creator" : "Brand"}
              </Badge>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              autoComplete="off"
              placeholder="Search"
              className="w-full pl-9 bg-muted/50 border-none h-9 text-sm"
            />
            <div className="absolute right-2 top-2 flex gap-1">
              <span className="text-[10px] border border-border rounded px-1 text-muted-foreground">
                ⌘
              </span>
              <span className="text-[10px] border border-border rounded px-1 text-muted-foreground">
                K
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 py-4 px-3 space-y-6">
          {/* Main Menu */}
          <div>
            <h3 className="px-2 text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              Main Menu
            </h3>
            <nav className="gap-1 flex flex-col">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-9 px-2 font-semibold transition-all",
                        active
                          ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15 dark:bg-emerald-500/20 dark:text-emerald-500"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {link.label}
                      {link.badge && (
                        <Badge
                          variant="secondary"
                          className="ml-auto h-5 rounded-md px-1.5 min-w-5 flex items-center justify-center text-[10px] bg-muted text-muted-foreground group-hover:bg-background"
                        >
                          {link.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer / Help & Settings */}
        <div className="border-t border-border/40">
          <div className="p-3 space-y-1">
            <Link href="/help" onClick={handleLinkClick}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-9 px-2 font-semibold transition-all",
                  isActive("/help")
                    ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Help Center
              </Button>
            </Link>
            <Link href="/feedback" onClick={handleLinkClick}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-9 px-2 font-semibold transition-all",
                  isActive("/feedback")
                    ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Feedback
              </Button>
            </Link>
            <Link href="/dashboard/settings" onClick={handleLinkClick}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-9 px-2 font-semibold transition-all",
                  isActive("/dashboard/settings")
                    ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15 dark:bg-emerald-500/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>

          {/* User Menu */}
          <div className="p-3 pt-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-2 hover:bg-muted/50 transition-all rounded-xl"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="relative">
                      <Avatar className="h-10 w-10 ring-2 ring-emerald-500/20">
                        <AvatarImage src={user?.profilePicture || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold">
                          {user?.name?.charAt(0) ||
                            user?.email?.charAt(0) ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        View profile
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72" sideOffset={8}>
                {/* Header with user info */}
                <div className="px-3 py-3 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-t-lg border-b">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-emerald-500/30">
                      <AvatarImage src={user?.profilePicture || ""} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold text-lg">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mb-1.5">
                        {user?.email || ""}
                      </p>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 text-xs">
                        {user?.accountType === "brand" ? "Brand" : "Creator"}{" "}
                        Account
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="py-1.5">
                  {/* Profile Section */}
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/settings"
                      className="cursor-pointer flex items-center gap-3 px-3 py-2.5"
                      onClick={handleLinkClick}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                        <User2 className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">My Profile</p>
                        <p className="text-xs text-muted-foreground">
                          View and edit profile
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/settings"
                      className="cursor-pointer flex items-center gap-3 px-3 py-2.5"
                      onClick={handleLinkClick}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                        <Settings className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Settings</p>
                        <p className="text-xs text-muted-foreground">
                          Preferences & security
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator />

                <div className="py-1.5">
                  {/* Quick Actions */}
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/help"
                      className="cursor-pointer flex items-center gap-3 px-3 py-2.5"
                      onClick={handleLinkClick}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                        <HelpCircle className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Help & Support</p>
                        <p className="text-xs text-muted-foreground">
                          Get help and tutorials
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer flex items-center gap-3 px-3 py-2.5">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Keyboard Shortcuts</p>
                      <p className="text-xs text-muted-foreground">
                        View shortcuts
                      </p>
                    </div>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator />

                {/* Sign Out */}
                <div className="py-1.5">
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center gap-3 px-3 py-2.5 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-500/10"
                    onClick={handleSignOut}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Sign Out</p>
                      <p className="text-xs opacity-80">End your session</p>
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Upgrade Card */}
        {showUpgradeCard && (
          <div
            className={`p-4 pt-0 mt-2 transition-all duration-300 ease-in-out ${
              isFadingOut
                ? "opacity-0 max-h-0 overflow-hidden"
                : "opacity-100 max-h-[200px]"
            }`}
          >
            <div className="flex flex-col items-center border border-emerald-500/40 justify-center rounded-lg bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 p-4 text-center relative">
              <button
                onClick={handleCloseCard}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close upgrade card"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                <Zap className="h-5 w-5 fill-current" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-foreground">
                Unlock all features
              </h4>
              <p className="mb-4 text-xs text-muted-foreground">
                Upgrade to Pro for unlimited access.
              </p>
              <Button size="sm" className="w-full">
                Upgrade Now
              </Button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
