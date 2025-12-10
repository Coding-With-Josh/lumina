"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleIcon, Loader2 } from "lucide-react";
import { signIn } from "./actions"; // Only import signIn
import { ActionState } from "@/lib/auth/middleware";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import Image from "next/image";
import { Spotlight } from "@/components/blocks/spotlight";

export function Login() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const priceId = searchParams.get("priceId");
  const inviteId = searchParams.get("inviteId");
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    signIn,
    { error: "" }
  );

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-950/20">
      <Spotlight />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Lumina Clippers"
                width={100}
                height={30}
                className="h-6 w-auto"
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-neutral-900 dark:text-white">
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-neutral-700 dark:text-neutral-300">
              Login with your Email or Google account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction}>
              <input type="hidden" name="redirect" value={redirect || ""} />
              <input type="hidden" name="priceId" value={priceId || ""} />
              <input type="hidden" name="inviteId" value={inviteId || ""} />
              <FieldGroup>
                <Field className="flex flex-col gap-2 h-fit">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full flex justify-center py-2 px-4 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-sm text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <p>Login with Google</p>
                  </Button>
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-white rounded-md dark:*:data-[slot=field-separator-content]:bg-neutral-900 text-neutral-500 dark:text-neutral-400">
                  Or continue with
                </FieldSeparator>
                <Field>
                  <FieldLabel
                    htmlFor="email"
                    className="text-neutral-700 dark:text-neutral-300"
                  >
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    defaultValue={state.email}
                    required
                    maxLength={50}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 placeholder-neutral-500 dark:placeholder-neutral-400 text-neutral-900 dark:text-white bg-white dark:bg-neutral-800 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                    placeholder="m@example.com"
                  />
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel
                      htmlFor="password"
                      className="text-neutral-700 dark:text-neutral-300"
                    >
                      Password
                    </FieldLabel>
                    <Link
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline text-emerald-600 dark:text-emerald-400"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    defaultValue={state.password}
                    required
                    minLength={8}
                    maxLength={100}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 placeholder-neutral-500 dark:placeholder-neutral-400 text-neutral-900 dark:text-white bg-white dark:bg-neutral-800 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  />
                </Field>

                {state?.error && (
                  <div className="text-red-500 text-sm">{state.error}</div>
                )}

                <Field>
                  <Button
                    type="submit"
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    disabled={pending}
                  >
                    {pending ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Loading...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                  <FieldDescription className="text-center text-neutral-500 dark:text-neutral-400">
                    Don&apos;t have an account?{" "}
                    <Link
                      href={`/onboarding${
                        redirect ? `?redirect=${redirect}` : ""
                      }${priceId ? `&priceId=${priceId}` : ""}`}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Get Started
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
      <span className="px-6 mt-5 max-lg text-center text-neutral-500 dark:text-neutral-400">
        By clicking continue, you agree to our{" "}
        <Link
          href="#"
          className="text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="#"
          className="text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </span>
    </div>
  );
}
