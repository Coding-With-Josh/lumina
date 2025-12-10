import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Alex Thompson",
    role: "Marketing Director @ DeFi Protocol",
    content:
      "Lumina Clippers streamlined our entire influencer marketing workflow. We found amazing creators who actually understood our product.",
    initials: "AT",
  },
  {
    name: "Sarah Jenkins",
    role: "Crypto Content Creator",
    content:
      "Finally, a platform that pays creators fairly and instantly. I've doubled my monthly income since joining Lumina Clippers.",
    initials: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Founder @ NFT Project",
    content:
      "The ROI we got from our Lumina Clippers campaign was insane. We sold out our mint in record time thanks to the buzz generated.",
    initials: "MC",
  },
  {
    name: "Jessica Lee",
    role: "Growth Lead @ Exchange",
    content:
      "The analytics dashboard is a game changer. Being able to track real-time performance across multiple platforms is invaluable.",
    initials: "JL",
  },
  {
    name: "David Wilson",
    role: "DeFi Educator",
    content:
      "Lumina Clippers connects me with high-quality brands that align with my values. It's the best marketplace for serious crypto creators.",
    initials: "DW",
  },
  {
    name: "Emily Rodriguez",
    role: "CMO @ L1 Blockchain",
    content:
      "We scaled our ambassador program from 10 to 100 creators in a month using Lumina Clippers. The automated payouts saved us hours of work.",
    initials: "ER",
  },
];

export function Reviews() {
  return (
    <section className="py-32 bg-[#0a0a0a] border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <span className="px-6 py-3 text-emerald-500 text-sm tracking-[0.3em] uppercase inline-block mb-6">
            Testimonials
          </span>
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 md:mb-6 tracking-tight">
            TRUSTED BY <span className="text-emerald">LEADERS</span>
          </h2>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Hear from the brands and creators shaping the future of the crypto
            economy.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="flex flex-col gap-6 rounded-xl border bg-black border-white/10 hover:border-emerald-500 transition-all duration-500 h-full group p-8"
            >
              <div className="mb-6">
                <Quote className="w-10 h-10 text-emerald-500 opacity-30 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-emerald-500 text-emerald"
                  />
                ))}
              </div>
              <p className="text-gray-300 mb-8 leading-relaxed flex-grow">
                "{review.content}"
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 text-black border-2 border-emerald-500 font-bold">
                  {review.initials}
                </div>
                <div>
                  <h4 className="text-white tracking-tight">{review.name}</h4>
                  <p className="text-emerald-500 text-sm uppercase tracking-wider">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
