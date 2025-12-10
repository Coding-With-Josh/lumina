import Link from "next/link";
import { Award, Star, TrendingUp } from "lucide-react";

const creators = [
  {
    name: "Alex Rivera",
    role: "DeFi Analyst & Educator",
    rating: "4.9",
    stats: "2.5M Views",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop",
    badge: "Top Clipper",
  },
  {
    name: "Sarah Jenkins",
    role: "Crypto News & Trends",
    rating: "5.0",
    stats: "5M+ Views",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
    badge: "Viral Expert",
  },
  {
    name: "David Kim",
    role: "NFT & Gaming",
    rating: "4.8",
    stats: "1.8M Views",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
    badge: null,
  },
  {
    name: "Emily Chen",
    role: "Web3 Tutorials",
    rating: "4.9",
    stats: "3.2M Views",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
    badge: "Verified",
  },
];

export function Creators() {
  return (
    <section className="py-32 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <span className="px-6 py-3 text-emerald-500 text-sm tracking-[0.3em] uppercase inline-block mb-6">
            Meet The Talent
          </span>
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 md:mb-6 tracking-tight">
            ELITE <span className="text-emerald">CREATORS</span>
          </h2>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Work with verified content creators who understand the crypto
            narrative. From technical analysis to viral memes, find the perfect
            voice for your brand.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {creators.map((creator, index) => (
            <div key={index} className="group relative">
              <div className="relative overflow-hidden bg-[#0a0a0a] border border-white/10 hover:border-emerald-500 transition-all duration-500">
                <div className="relative h-[500px] overflow-hidden">
                  <img
                    alt={creator.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={creator.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>
                  {creator.badge && (
                    <div className="absolute top-4 right-4">
                      <div className="px-4 py-2 bg-emerald-500 text-black text-xs tracking-widest uppercase flex items-center gap-2">
                        <Award className="w-3.5 h-3.5" />
                        {creator.badge}
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white text-2xl mb-2 tracking-tight">
                      {creator.name}
                    </h3>
                    <p className="text-emerald-500 mb-3 uppercase text-sm tracking-wider">
                      {creator.role}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-emerald-500 fill-emerald" />
                        <span className="text-white">{creator.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{creator.stats}</span>
                      </div>
                    </div>
                    <div className="border-t border-white/10 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Link href="/sign-in">
                        <button className="w-full py-3 bg-emerald-500 text-black hover:bg-white transition-colors duration-300 uppercase tracking-wider">
                          Hire Creator
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/creators">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 px-12 py-6 bg-transparent border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all duration-300">
              VIEW ALL CREATORS
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
