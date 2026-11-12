import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { routes } from "@/config/site";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default function LoginPage() {
  return (
    <>
      <h1 className="text-[2.2rem] font-medium text-teal-deep">Welcome back</h1>
      <p className="mt-2 mb-8 text-ink-soft">
        Sign in to manage your appointments.{" "}
        <Link href={routes.register} className="font-semibold text-teal">
          Create a free account
        </Link>
      </p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  );
}
