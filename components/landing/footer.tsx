import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-1 mb-4">
              <div className="w-11 h-11 flex items-center justify-center bg-emerald-500 rounded-lg text-black font-bold">
                L
              </div>
              <span className="text-white tracking-tight text-base md:text-xl font-semibold">
                Lumina Clippers
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              The premier marketplace for crypto content creators. Connect,
              collaborate, and grow.
            </p>
          </div>
          <div>
            <h4 className="text-white mb-4 tracking-tight uppercase">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  className="text-gray-400 hover:text-emerald-500 transition-colors text-sm uppercase tracking-wider"
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-emerald-500 transition-colors text-sm uppercase tracking-wider"
                  href="/marketplace"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-emerald-500 transition-colors text-sm uppercase tracking-wider"
                  href="/brands"
                >
                  For Brands
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-emerald-500 transition-colors text-sm uppercase tracking-wider"
                  href="/creators"
                >
                  For Creators
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white mb-4 tracking-tight uppercase">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  className="text-gray-400 hover:text-emerald-500 transition-colors text-sm uppercase tracking-wider"
                  href="/about"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 hover:text-emerald-500 transition-colors text-sm uppercase tracking-wider"
                  href="/contact"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-emerald-500 transition-colors text-sm uppercase tracking-wider"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-emerald-500 transition-colors text-sm uppercase tracking-wider"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white mb-4 tracking-tight uppercase">
              Community
            </h4>
            <div className="flex gap-3">
              <Link
                href="#"
                className="w-11 h-11 bg-white/5 border border-white/10 hover:bg-emerald-500 hover:border-emerald-500 flex items-center justify-center transition-all group"
              >
                <Twitter className="w-5 h-5 group-hover:text-black transition-colors" />
              </Link>
              <Link
                href="#"
                className="w-11 h-11 bg-white/5 border border-white/10 hover:bg-emerald-500 hover:border-emerald-500 flex items-center justify-center transition-all group"
              >
                <Instagram className="w-5 h-5 group-hover:text-black transition-colors" />
              </Link>
              <Link
                href="#"
                className="w-11 h-11 bg-white/5 border border-white/10 hover:bg-emerald-500 hover:border-emerald-500 flex items-center justify-center transition-all group"
              >
                <Youtube className="w-5 h-5 group-hover:text-black transition-colors" />
              </Link>
            </div>
            <p className="text-gray-400 mt-4 text-sm leading-relaxed">
              Join our Discord to connect with other creators and brands.
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-gray-500">
          <p className="text-sm uppercase tracking-wider">
            © 2025 Lumina Clippers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
