import type { Metadata } from "next";
import Link from "next/link";
import { routes } from "@/config/site";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";

export const metadata: Metadata = { title: "Reset password", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-[2.2rem] font-medium text-teal-deep">Reset your password</h1>
      <p className="mt-2 mb-8 text-ink-soft">We&apos;ll send reset instructions to your registered mobile number or email.</p>
      <ForgotPasswordForm />
      <Link href={routes.login} className="mt-6 inline-block text-sm font-semibold text-teal">
        ← Back to sign in
      </Link>
    </>
  );
}
