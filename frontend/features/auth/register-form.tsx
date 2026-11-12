"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, Spinner } from "@/components/ui/feedback";
import { Checkbox, Field, Input, Select } from "@/components/ui/form";
import { routes } from "@/config/site";
import { errorMessage } from "@/hooks/use-async";
import { api } from "@/services";
import { fieldErrors, registerSchema } from "./schemas";

export function RegisterForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = registerSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    setPending(true);
    setFormError(null);
    try {
      const { fullName, phone, email, gender, password } = parsed.data;
      await api.auth.register({ fullName, phone, email, gender, password });
      router.replace(routes.account.root);
      router.refresh();
    } catch (err) {
      setFormError(errorMessage(err));
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <Field label="Full name" htmlFor="fullName" error={errors.fullName}>
        <Input id="fullName" name="fullName" autoComplete="name" aria-invalid={!!errors.fullName} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mobile number" htmlFor="phone" error={errors.phone}>
          <Input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="e.g. 01712345678" aria-invalid={!!errors.phone} />
        </Field>
        <Field label="Gender" htmlFor="gender" error={errors.gender} hint="Used to match you with a practitioner">
          <Select id="gender" name="gender" defaultValue="" aria-invalid={!!errors.gender}>
            <option value="" disabled>
              Select
            </option>
            <option value="FEMALE">Female</option>
            <option value="MALE">Male</option>
          </Select>
        </Field>
      </div>
      <Field label="Email" htmlFor="email" optional error={errors.email}>
        <Input id="email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Password" htmlFor="password" error={errors.password} hint="At least 8 characters">
          <Input id="password" name="password" type="password" autoComplete="new-password" aria-invalid={!!errors.password} />
        </Field>
        <Field label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword}>
          <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" aria-invalid={!!errors.confirmPassword} />
        </Field>
      </div>
      <div>
        <Checkbox name="terms" label={<>I agree to the clinic&apos;s terms and privacy policy.</>} />
        {errors.terms && <p className="mt-1 text-sm text-rose">{errors.terms}</p>}
      </div>
      {formError && <Alert tone="error">{formError}</Alert>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending && <Spinner />} Create free account
      </Button>
      <p className="text-center text-sm text-ink-soft">
        Already registered?{" "}
        <Link href={routes.login} className="font-semibold text-teal">
          Sign in
        </Link>
      </p>
    </form>
  );
}
