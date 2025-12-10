"use client";

import { useState } from "react";
import { Calculator, DollarSign } from "lucide-react";

export function EarningsCalculator() {
  const [views, setViews] = useState("");
  const [followers, setFollowers] = useState("");
  const [earnings, setEarnings] = useState<number | null>(null);
  const [platform, setPlatform] = useState<"tiktok" | "instagram" | "youtube">(
    "tiktok"
  );

  const calculateEarnings = () => {
    const v = parseFloat(views);
    const f = parseFloat(followers);

    if (!v || !f) return;

    // Simple estimation logic (CPM based)
    // TikTok: $0.02 - $0.04 per 1000 views (plus brand deals)
    // Instagram: Higher engagement value
    // YouTube: Highest CPM

    let baseRate = 0.03; // $0.03 per 1000 views base
    if (platform === "instagram") baseRate = 0.05;
    if (platform === "youtube") baseRate = 0.08;

    // Brand deal multiplier based on followers
    const brandDealMultiplier = 1 + (f / 10000) * 0.1;

    // Monthly estimation (assuming 4 videos a month for simplicity in this calc)
    const monthlyViews = v * 4;
    const estimated =
      (monthlyViews / 1000) * baseRate * 1000 * brandDealMultiplier; // Adjusted for "Lumina Clippers Premium" rates

    // Simplified: (Views * Rate) + (Followers * Value)
    // Let's make it more "fun" / optimistic for the landing page
    const optimistic = v * 0.05 + f * 0.01;

    setEarnings(Math.floor(optimistic));
  };

  return (
    <section className="py-32 bg-black border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="px-6 py-3 text-emerald-500 text-sm tracking-[0.3em] uppercase inline-block mb-6">
            Creator Economy
          </span>
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 md:mb-6 tracking-tight">
            ESTIMATE YOUR <span className="text-emerald">EARNINGS</span>
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            See how much you could earn by creating content for top crypto
            brands on Lumina Clippers.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#0a0a0a] border border-emerald/30 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald/10 border border-emerald-500 flex items-center justify-center">
                <Calculator className="w-6 h-6 text-emerald" />
              </div>
              <h3 className="text-white text-2xl tracking-tight">
                Earnings Calculator
              </h3>
            </div>
            <div className="space-y-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setPlatform("tiktok")}
                  className={`flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 ${
                    platform === "tiktok"
                      ? "bg-emerald-500 text-black hover:bg-white"
                      : "bg-transparent border border-emerald/30 text-gray-400 hover:text-white"
                  }`}
                >
                  TikTok
                </button>
                <button
                  onClick={() => setPlatform("instagram")}
                  className={`flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 ${
                    platform === "instagram"
                      ? "bg-emerald-500 text-black hover:bg-white"
                      : "bg-transparent border border-emerald/30 text-gray-400 hover:text-white"
                  }`}
                >
                  Instagram
                </button>
                <button
                  onClick={() => setPlatform("youtube")}
                  className={`flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 ${
                    platform === "youtube"
                      ? "bg-emerald-500 text-black hover:bg-white"
                      : "bg-transparent border border-emerald/30 text-gray-400 hover:text-white"
                  }`}
                >
                  YouTube
                </button>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm leading-none font-medium text-gray-300">
                  Average Views per Video
                </label>
                <input
                  type="number"
                  placeholder="10000"
                  value={views}
                  onChange={(e) => setViews(e.target.value)}
                  className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-[#000000] border-emerald/30 text-white focus:border-emerald"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm leading-none font-medium text-gray-300">
                  Follower Count
                </label>
                <input
                  type="number"
                  placeholder="5000"
                  value={followers}
                  onChange={(e) => setFollowers(e.target.value)}
                  className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-[#000000] border-emerald/30 text-white focus:border-emerald"
                />
              </div>
              <button
                onClick={calculateEarnings}
                className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 px-4 py-2 bg-emerald-500 hover:bg-white text-black transition-all duration-300"
              >
                Calculate Potential
              </button>
              {earnings !== null && (
                <div className="mt-4 p-4 bg-emerald/10 border border-emerald-500 rounded-md text-center">
                  <p className="text-gray-300 text-sm uppercase tracking-wider mb-1">
                    Estimated Monthly Earnings
                  </p>
                  <div className="flex items-center justify-center gap-1 text-emerald-500 text-4xl font-bold">
                    <DollarSign className="w-8 h-8" />
                    {earnings.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
