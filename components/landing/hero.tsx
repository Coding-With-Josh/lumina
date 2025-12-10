import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url(assets/hero.png)", // Crypto/Tech placeholder
            backgroundPosition: "center center",
            backgroundSize: "cover",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/50"></div>
      </div>
      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-4xl">
          <div className="mb-6 space-y-4"></div>
          <h1 className="text-white text-6xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-6 md:mb-8 tracking-tight leading-none">
            AMPLIFY YOUR
            <br />
            <span className="text-emerald">CRYPTO BRAND</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 leading-relaxed max-w-2xl">
            Connect with thousands of content creators. AI-powered matching,
            automated payouts, and viral reach across TikTok, Instagram, and X.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Link className="w-full sm:w-auto" href="/onboarding">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 w-full sm:w-auto bg-emerald-500 hover:bg-emerald-500 text-black px-6 sm:px-8 md:px-10 py-5 md:py-7 text-sm sm:text-base group relative overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
                  START CAMPAIGN
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform"></div>
              </button>
            </Link>
            <Link className="w-full sm:w-auto" href="/creators">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 w-full sm:w-auto text-emerald-500 hover:bg-emerald-500 hover:text-black px-6 sm:px-8 md:px-10 py-5 md:py-7 text-sm sm:text-base backdrop-blur-sm transition-all duration-300">
                <Play className="w-5 h-5 mr-2 md:mr-3" />
                FOR CREATORS
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
