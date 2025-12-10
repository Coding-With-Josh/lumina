import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300">
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 mb-4">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-neutral-400 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
