"use client";

import { ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, Spinner } from "@/components/ui/feedback";
import { Field, Input } from "@/components/ui/form";
import { isMockMode } from "@/config/env";
import { routes } from "@/config/site";
import { errorMessage } from "@/hooks/use-async";
import { api } from "@/services";
import { STAFF_ROLES } from "@/types/user";
import { fieldErrors, loginSchema } from "./schemas";

function safeNext(next: string | null, fallback: string) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function signIn(identifier: string, password: string) {
    setPending(true);
    setFormError(null);
    try {
      const user = await api.auth.login({ identifier, password });
      const staff = user.roles.some((r) => STAFF_ROLES.includes(r));
      router.replace(safeNext(params.get("next"), staff ? routes.admin.root : routes.account.root));
      router.refresh();
    } catch (e) {
      setFormError(errorMessage(e));
      setPending(false);
    }
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = loginSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    void signIn(parsed.data.identifier, parsed.data.password);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="Mobile number or email" htmlFor="identifier" error={errors.identifier}>
          <Input id="identifier" name="identifier" autoComplete="username" placeholder="e.g. 01712345678" aria-invalid={!!errors.identifier} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password}>
          <Input id="password" name="password" type="password" autoComplete="current-password" aria-invalid={!!errors.password} />
        </Field>
        <div className="flex justify-end text-sm">
          <Link href={routes.forgotPassword} className="font-medium text-teal hover:text-teal-deep">
            Forgot password?
          </Link>
        </div>
        {formError && <Alert tone="error">{formError}</Alert>}
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending && <Spinner />} Sign in
        </Button>
      </form>

      {isMockMode && process.env.NEXT_PUBLIC_SHOW_DEMO_LOGIN === "true" && (
        <div className="rounded-xl border border-dashed border-sand-deep/40 bg-sand-soft/40 p-4">
          <p className="text-xs font-semibold tracking-wide text-sand-deep uppercase">Demo mode — no backend connected</p>
          <p className="mt-1 text-xs text-ink-soft">Preview the portals with a demo session. Real authentication is handled by the backend.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Button variant="secondary" size="sm" disabled={pending} onClick={() => signIn("demo.patient", "demo-password")}>
              <UserRound className="size-4" /> Demo patient
            </Button>
            <Button variant="secondary" size="sm" disabled={pending} onClick={() => signIn("demo.admin", "demo-password")}>
              <ShieldCheck className="size-4" /> Demo admin
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
