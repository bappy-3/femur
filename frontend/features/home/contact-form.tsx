"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Alert, Spinner } from "@/components/ui/feedback";
import { Field, Input, Textarea } from "@/components/ui/form";
import { isMockMode } from "@/config/env";
import { phoneSchema } from "@/features/auth/schemas";
import { request } from "@/services/http/client";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  phone: phoneSchema,
  message: z.string().trim().min(10, "Please write a short message (at least 10 characters).").max(1000),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "unavailable">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const parsed = schema.safeParse(Object.fromEntries(new FormData(form)));
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [i.path[0], i.message])) as Errors);
      return;
    }
    setErrors({});
    // Contact messages need the backend (POST /contact-messages). We never pretend a message was sent.
    if (isMockMode) {
      setStatus("unavailable");
      return;
    }
    setStatus("sending");
    try {
      await request("/contact-messages", { method: "POST", body: parsed.data });
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") return <Alert tone="success" title="Message sent">Thank you — the clinic will get back to you soon.</Alert>;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" htmlFor="c-name" error={errors.name}>
          <Input id="c-name" name="name" autoComplete="name" aria-invalid={!!errors.name} />
        </Field>
        <Field label="Mobile number" htmlFor="c-phone" error={errors.phone}>
          <Input id="c-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" aria-invalid={!!errors.phone} />
        </Field>
      </div>
      <Field label="Message" htmlFor="c-message" error={errors.message}>
        <Textarea id="c-message" name="message" rows={5} aria-invalid={!!errors.message} />
      </Field>
      {status === "unavailable" && (
        <Alert tone="warning" title="Messaging not connected yet">
          The contact form will send messages once the backend is connected. Please call or WhatsApp the clinic for now.
        </Alert>
      )}
      {status === "error" && <Alert tone="error">We couldn&apos;t send your message. Please try again or call the clinic.</Alert>}
      <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto">
        {status === "sending" && <Spinner />} Send message
      </Button>
    </form>
  );
}
