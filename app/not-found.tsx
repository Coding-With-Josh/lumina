import Link from "next/link";
import { CircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[100dvh]">
      <div className="max-w-md flex flex-col items-center justify-center space-y-8 p-4 text-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Lumina Clippers"
            width={100}
            height={30}
            className="h-6 w-auto"
          />
        </Link>
        <h1 className="text-4xl font-semibold tracking-tighter">
          Page Not Found
        </h1>
        <p className="text-base text-neutral-500">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link href="/">
          <Button className="py-1">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
