"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, Spinner } from "@/components/ui/feedback";
import { Field, Input } from "@/components/ui/form";
import { isMockMode } from "@/config/env";
import { api } from "@/services";

export function ForgotPasswordForm() {
  const [state, setState] = useState<"idle" | "pending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const identifier = String(new FormData(e.currentTarget).get("identifier") ?? "").trim();
    if (identifier.length < 3) return setError("Enter your mobile number or email.");
    setError(null);
    setState("pending");
    await api.auth.requestPasswordReset(identifier).catch(() => undefined);
    setState("done");
  }

  if (state === "done") {
    return (
      <Alert tone={isMockMode ? "warning" : "success"} title={isMockMode ? "Reset not sent (demo mode)" : "Check your phone or email"}>
        {isMockMode
          ? "Password reset requires the backend and an SMS/email provider, which are not connected yet."
          : "If an account exists for that number or email, you'll receive instructions shortly."}
      </Alert>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <Field label="Mobile number or email" htmlFor="identifier" error={error}>
        <Input id="identifier" name="identifier" autoComplete="username" aria-invalid={!!error} />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={state === "pending"}>
        {state === "pending" && <Spinner />} Send reset instructions
      </Button>
    </form>
  );
}
