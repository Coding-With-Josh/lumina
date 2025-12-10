import {
  Zap,
  BarChart3,
  Users,
  DollarSign,
  Globe,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    title: "AI Matching",
    description:
      "Our algorithm connects your brand with creators who perfectly match your target audience and niche.",
    tags: ["Smart Algorithms", "Niche Targeting", "High Conversion"],
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2832&auto=format&fit=crop",
    icon: Zap,
  },
  {
    title: "Real-time Analytics",
    description:
      "Track campaign performance, view counts, and engagement metrics in real-time dashboards.",
    tags: ["Live Data", "ROI Tracking", "Exportable Reports"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    icon: BarChart3,
  },
  {
    title: "Automated Payouts",
    description:
      "Secure, instant payments to creators via smart contracts or fiat rails upon milestone completion.",
    tags: ["Smart Contracts", "Instant Settlement", "Escrow Protection"],
    image:
      "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1974&auto=format&fit=crop",
    icon: DollarSign,
  },
  {
    title: "Multi-Platform",
    description:
      "Launch campaigns across TikTok, Instagram Reels, YouTube Shorts, and X simultaneously.",
    tags: ["TikTok", "Instagram", "YouTube", "X / Twitter"],
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop",
    icon: Globe,
  },
  {
    title: "Vetted Creators",
    description:
      "Every creator on Lumina Clippers is manually verified for authenticity and audience quality.",
    tags: ["KYC Verified", "Quality Check", "No Bots"],
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop",
    icon: ShieldCheck,
  },
  {
    title: "Community Growth",
    description:
      "Drive organic growth and community engagement through authentic storytelling.",
    tags: ["Organic Reach", "Viral Potential", "Community Building"],
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2832&auto=format&fit=crop",
    icon: Users,
  },
];

export function Features() {
  return (
    <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <span className="px-6 py-3 text-emerald-500 text-sm tracking-[0.3em] uppercase inline-block mb-6">
            Platform Features
          </span>
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 md:mb-6 tracking-tight">
            POWER YOUR <span className="text-emerald">GROWTH</span>
          </h2>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Everything you need to scale your crypto brand's presence with
            content creators, all in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden bg-black border border-white/10 hover:border-emerald-500 transition-all duration-500"
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={feature.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    <div className="w-16 h-16 border-2 flex items-center justify-center transition-all duration-500 bg-black/50 border-emerald/50">
                      <Icon className="w-8 h-8 transition-colors text-emerald" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-white text-2xl mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feature.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-emerald/10 border border-emerald/30 text-emerald-500 text-xs tracking-wider uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-500 w-0 group-hover:w-full"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
