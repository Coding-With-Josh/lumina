"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-md font-semibold text-neutral-100 hover:text-emerald-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="#how-it-works"
              className="text-md font-semibold text-neutral-100 hover:text-emerald-400 transition-colors"
            >
              Contact us
            </Link>
            <Link
              href="/pricing"
              className="text-md font-semibold text-neutral-100 hover:text-emerald-400 transition-colors"
            >
              Testimonial
            </Link>
            <Link
              href="/pricing"
              className="text-md font-semibold text-neutral-100 hover:text-emerald-400 transition-colors"
            >
              Case Study
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Suspense
              fallback={
                <div className="h-9 w-9 rounded-full bg-neutral-800 animate-pulse" />
              }
            >
              <UserMenu />
            </Suspense>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-300 hover:text-white p-2"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <Link
              href="#features"
              className="block px-3 py-2 text-base font-medium text-neutral-300 hover:text-white hover:bg-white/5 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="block px-3 py-2 text-base font-medium text-neutral-300 hover:text-white hover:bg-white/5 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              How it Works
            </Link>
            <Link
              href="/pricing"
              className="block px-3 py-2 text-base font-medium text-neutral-300 hover:text-white hover:bg-white/5 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <div className="pt-4 border-t border-white/10">
              <Suspense
                fallback={
                  <div className="h-9 w-full bg-neutral-800 animate-pulse rounded-md" />
                }
              >
                <div className="flex flex-col gap-3">
                  <UserMenu />
                </div>
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
