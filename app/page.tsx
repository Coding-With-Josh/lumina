import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Creators } from "@/components/landing/creators";
import { Features } from "@/components/landing/features";
import { EarningsCalculator } from "@/components/landing/earnings-calculator";
import { CampaignResults } from "@/components/landing/campaign-results";
import { Reviews } from "@/components/landing/reviews";
import { Footer } from "@/components/landing/footer";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans">
      <ThemeToggle />
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Creators />
        <Features />
        <EarningsCalculator />
        <CampaignResults />
        <Reviews />
      </main>
      <Footer />
    </div>
  );
}
