"use client";

import { Bell, UserPlus, Share2, SidebarIcon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-context";

export function Header() {
  const { toggle } = useSidebar();

  return (
    <header className="h-16 border-b border-border bg-white/30 dark:bg-black/30 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 transition-all hover:bg-muted"
          onClick={toggle}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex h-9 w-9 transition-all hover:bg-muted"
          onClick={toggle}
          aria-label="Toggle sidebar"
        >
          <SidebarIcon className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl border-border bg-background hover:bg-muted transition-colors"
        >
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl border-border bg-background hover:bg-muted transition-colors"
        >
          <Share2 className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl border-border bg-background hover:bg-muted transition-colors relative"
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500" />
        </Button>
      </div>
    </header>
  );
}
