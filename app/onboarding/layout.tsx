import { ShaderAnimation } from "@/components/blocks/shader-animation";
import Image from "next/image";
import Link from "next/link";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-80">
          <ShaderAnimation />
        </div>
        <div className="relative z-10 p-12 text-white max-w-lg">
          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="Lumina Clippers"
              width={150}
              height={45}
              className="h-10 w-auto"
            />
          </div>
          <h1 className="text-5xl font-bold mb-6 tracking-tight leading-tight">
            Amplify Your <br />
            <span className="text-emerald">Crypto Brand</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Join the premier marketplace for crypto content creators. Connect,
            collaborate, and grow with AI-powered matching.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 flex justify-center">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Lumina Clippers"
                  width={120}
                  height={36}
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
