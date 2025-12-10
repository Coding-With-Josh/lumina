import { Suspense } from "react";
import { Login } from "../login";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SignInPage() {
  return (
    <>
      <ThemeToggle />
      <Suspense>
        <Login />
      </Suspense>
    </>
  );
}
