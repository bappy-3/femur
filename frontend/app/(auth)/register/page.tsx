import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/register-form";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-[2.2rem] font-medium text-teal-deep">Create your free account</h1>
      <p className="mt-2 mb-8 text-ink-soft">Book faster, save family members and keep track of your care. Membership is optional.</p>
      <RegisterForm />
    </>
  );
}
