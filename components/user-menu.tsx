"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Settings,
  CreditCard,
  LogOut,
  User as UserIcon,
  Share,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/app/(login)/actions";
import { useRouter } from "next/navigation";
import { User } from "@/lib/db/schema";
import useSWR, { mutate } from "swr";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function UserMenuSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        disabled
        className="flex flex-row-reverse items-center gap-3 p-3 px-4 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-950/60 cursor-default animate-pulse min-w-[220px]"
      >
        <div className="text-left flex-1 space-y-1">
          <div className="h-4 rounded bg-neutral-200 dark:bg-neutral-900 w-24 mb-1" />
          <div className="h-3 rounded bg-neutral-100 dark:bg-neutral-800 w-16" />
        </div>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-900 overflow-hidden flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          </div>
        </div>
      </button>
    </div>
  );
}

interface MenuItem {
  label: string;
  value?: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
}

interface UserMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  showTopbar?: boolean;
}

export function UserMenu({ className, ...props }: UserMenuProps) {
  const { data: user, error, isLoading } = useSWR<User>("/api/user", fetcher);
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    mutate("/api/user");
    router.push("/");
  }

  // Skeleton loading view
  if (isLoading) {
    return <UserMenuSkeleton className={className} />;
  }

  if (error || !user) {
    return (
      <div className={cn("relative", className)} {...props}>
        <Link
          href="/onboarding"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors font-medium text-sm"
        >
          Get Started
        </Link>
      </div>
    );
  }

  const menuItems: MenuItem[] = [
    {
      label: "Profile",
      href: "/dashboard/settings",
      icon: <UserIcon className="w-4 h-4" />,
    },
    {
      label: "Subscription",
      value: user.role === "admin" ? "ADMIN" : "FREE",
      href: "/pricing",
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="w-4 h-4" />,
    },
    {
      label: "Refer a Friend",
      href: "#",
      icon: <Share className="w-4 h-4" />,
      external: true,
    },
  ];

  return (
    <div className={cn("relative", className)} {...props}>
      <DropdownMenu onOpenChange={setIsOpen}>
        <div className="group relative">
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex flex-row-reverse items-center gap-3 p-2 pl-4 rounded-2xl bg-white/5 dark:bg-neutral-950/50 border border-neutral-200/60 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50/80 dark:hover:bg-neutral-900/80 hover:shadow-sm transition-all duration-200 focus:outline-none backdrop-blur-sm"
            >
              <div className="text-left flex-1 hidden sm:block">
                <div className="text-sm font-medium text-neutral-950 dark:text-neutral-100 tracking-tight leading-tight">
                  {user.name || "User"}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 tracking-tight leading-tight truncate max-w-[120px]">
                  {user.email}
                </div>
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-neutral-200 via-neutral-400 to-neutral-600 dark:from-neutral-800 dark:via-neutral-600 dark:to-neutral-400 p-0.5">
                  <div className="w-full h-full rounded-md overflow-hidden bg-white dark:bg-neutral-950">
                    <Avatar className="h-full w-full rounded-md">
                      <AvatarImage src="" alt={user.name || "User"} className="rounded-md" />
                      <AvatarFallback className="bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300">
                        {user.email.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>

          {/* Bending line indicator on the right */}
          <div
            className={cn(
              "absolute -right-3 top-1/2 -translate-y-1/2 transition-all duration-200 hidden sm:block",
              isOpen ? "opacity-100" : "opacity-60 group-hover:opacity-100"
            )}
          >
            <svg
              width="12"
              height="24"
              viewBox="0 0 12 24"
              fill="none"
              className={cn(
                "transition-all duration-200",
                isOpen
                  ? "text-neutral-500 dark:text-neutral-400 scale-110"
                  : "text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
              )}
              aria-hidden="true"
            >
              <path
                d="M2 4C6 8 6 16 2 20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-64 p-2 dark:bg-neutral-950/75 backdrop-blur-xl border border-neutral-200/60 dark:border-neutral-800 rounded-2xl shadow-xl shadow-neutral-950/5 dark:shadow-neutral-950/20"
          >
            <div className="space-y-1">
              {menuItems.map((item) => (
                <DropdownMenuItem key={item.label} asChild>
                  <Link
                    href={item.href}
                    className="flex items-center p-3 hover:bg-neutral-100/80 dark:hover:bg-neutral-900/60 rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-sm border border-transparent hover:border-neutral-200/50 dark:hover:border-neutral-700/50 outline-none"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300 tracking-tight leading-tight whitespace-nowrap group-hover:text-neutral-950 dark:group-hover:text-neutral-50 transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <div className="shrink-0 ml-auto">
                      {item.value && (
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase rounded-md py-0.5 px-2 tracking-wide",
                            item.value === "ADMIN"
                              ? "text-purple-600 bg-purple-50 dark:text-purple-300 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/20"
                              : "text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/20"
                          )}
                        >
                          {item.value}
                        </span>
                      )}
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>

            <DropdownMenuSeparator className="my-3 bg-gradient-to-r from-transparent via-neutral-200 to-transparent dark:via-neutral-800" />

            <DropdownMenuItem asChild>
              <form action={handleSignOut} className="w-full">
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 p-3 duration-200 bg-red-500/5 dark:bg-red-500/10 rounded-xl hover:bg-red-500/10 dark:hover:bg-red-500/20 cursor-pointer border border-transparent hover:border-red-500/20 hover:shadow-sm transition-all group outline-none"
                >
                  <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                  <span className="text-sm font-medium text-red-500 group-hover:text-red-600">
                    Sign Out
                  </span>
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </div>
      </DropdownMenu>
    </div>
  );
}
