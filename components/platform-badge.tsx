import { ReactNode } from "react";

interface PlatformBadgeProps {
  icon: ReactNode;
  name: string;
}

export function PlatformBadge({ icon, name }: PlatformBadgeProps) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
      <div className="relative flex items-center gap-3 px-6 py-4 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-emerald-500/50 transition-all duration-300">
        <div className="text-emerald-500">{icon}</div>
        <span className="text-white font-medium">{name}</span>
      </div>
    </div>
  );
}
