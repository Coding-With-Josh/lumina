import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { getUser, getTeamForUser } from "@/lib/db/queries";
import { SWRConfig } from "swr";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Lumina Clippers - Crypto Clippers Marketplace",
  description:
    "Connect brands with content creators across Instagram, TikTok, X, and Threads. AI-powered campaigns, automated payouts, and real-time analytics.",
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-neutral-950 text-black dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-neutral-50 dark:bg-neutral-950">
        <Toaster />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SWRConfig
            value={{
              fallback: {
                // We do NOT await here
                // Only components that read this data will suspend
                "/api/user": getUser(),
                "/api/team": getTeamForUser(),
              },
            }}
          >
            {children}
          </SWRConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
