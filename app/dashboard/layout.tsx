"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Header } from "@/components/dashboard/header";
import { SidebarProvider } from "@/components/dashboard/sidebar-context";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider
      initialOpen={!(pathname && pathname.includes("/dashboard/discover"))}
    >
      <div className="flex min-h-screen bg-muted/20">
        <ThemeToggle />
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
