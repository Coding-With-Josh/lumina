"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-[100] scale-x-0 transition-transform duration-300"
        style={{ transform: `scaleX(${isScrolled ? 1 : 0})` }}
      ></div>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/95 backdrop-blur-md border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-4 py-4 md:py-5">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Lumina Clippers"
                  width={100}
                  height={30}
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link
                className="transition-colors text-sm tracking-widest uppercase text-emerald"
                href="/"
              >
                Home
              </Link>
              <Link
                className="transition-colors text-sm tracking-widest uppercase text-gray-400 hover:text-white"
                href="/marketplace"
              >
                Marketplace
              </Link>
              <Link
                className="transition-colors text-sm tracking-widest uppercase text-gray-400 hover:text-white"
                href="/brands"
              >
                Brands
              </Link>
              <Link
                className="transition-colors text-sm tracking-widest uppercase text-gray-400 hover:text-white"
                href="/creators"
              >
                Creators
              </Link>
              <Link
                className="transition-colors text-sm tracking-widest uppercase text-gray-400 hover:text-white"
                href="/about"
              >
                About
              </Link>
            </div>
            <div className="hidden md:block">
              <Link href="/sign-in">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 px-4 py-2 bg-emerald-500 hover:bg-white text-black tracking-widest uppercase transition-all duration-300">
                  Launch App
                </button>
              </Link>
            </div>
            <button
              className="md:hidden text-white relative z-10 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="w-8 h-8 flex flex-col justify-center items-center">
                {isMobileMenuOpen ? (
                  <X className="w-8 h-8" />
                ) : (
                  <Menu className="w-8 h-8" />
                )}
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-black border-b border-white/10 p-4 flex flex-col gap-4">
              <Link
                className="transition-colors text-sm tracking-widest uppercase text-emerald"
                href="/"
              >
                Home
              </Link>
              <Link
                className="transition-colors text-sm tracking-widest uppercase text-gray-400 hover:text-white"
                href="/marketplace"
              >
                Marketplace
              </Link>
              <Link
                className="transition-colors text-sm tracking-widest uppercase text-gray-400 hover:text-white"
                href="/brands"
              >
                Brands
              </Link>
              <Link
                className="transition-colors text-sm tracking-widest uppercase text-gray-400 hover:text-white"
                href="/creators"
              >
                Creators
              </Link>
              <Link
                className="transition-colors text-sm tracking-widest uppercase text-gray-400 hover:text-white"
                href="/about"
              >
                About
              </Link>
              <Link href="/sign-in" className="w-full">
                <button className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 bg-emerald-500 hover:bg-white text-black tracking-widest uppercase transition-all duration-300">
                  Launch App
                </button>
              </Link>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
