"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="relative w-14 h-14 rounded-full bg-muted/50 backdrop-blur-sm border border-border shadow-lg" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-background to-muted/50 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle theme"
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-emerald/10 to-emerald/5 opacity-0 group-hover:opacity-100 transition-opacity"
          layoutId="theme-toggle-bg"
        />

        {/* Icon container */}
        <div className="relative w-full h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ rotate: -90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Moon className="w-6 h-6 text-emerald-500" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: 90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Sun className="w-6 h-6 text-amber-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ripple effect on click */}
        <motion.div
          className="absolute inset-0 rounded-full bg-emerald-500/20"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          key={theme}
        />
      </motion.button>
    </div>
  );
}
