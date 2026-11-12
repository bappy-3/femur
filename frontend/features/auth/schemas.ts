import { z } from "zod";

/** Normalise a Bangladeshi mobile number to E.164 (+8801XXXXXXXXX). Returns null if invalid. */
export function normalizeBdPhone(raw: string): string | null {
  const digits = raw.replace(/[\s-()]/g, "").replace(/^\+/, "");
  const local = digits.startsWith("880") ? digits.slice(3) : digits.startsWith("0") ? digits.slice(1) : digits;
  return /^1[3-9]\d{8}$/.test(local) ? `+880${local}` : null;
}

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Please enter a mobile number.")
  .refine((v) => normalizeBdPhone(v) !== null, "Enter a valid Bangladeshi mobile number, e.g. 01712345678.")
  .transform((v) => normalizeBdPhone(v)!);

const optionalEmail = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .pipe(z.email("Please enter a valid email address.").nullable());

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, "Enter your mobile number or email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name."),
    phone: phoneSchema,
    email: optionalEmail,
    gender: z.enum(["MALE", "FEMALE"], { error: "Please select your gender." }),
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string(),
    terms: z.literal("on", { error: "Please accept the terms to continue." }),
  })
  .refine((v) => v.password === v.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match." });

export const patientDetailsSchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter the patient's full name."),
    gender: z.enum(["MALE", "FEMALE"]),
    ageYears: z.coerce.number({ error: "Enter age in years." }).int("Enter age in whole years.").min(0, "Age can't be negative.").max(120, "Please check the age."),
    phone: phoneSchema,
    email: optionalEmail,
    relationship: z.enum(["SELF", "CHILD", "PARENT", "SPOUSE", "SIBLING", "OTHER"]),
    reasonForVisit: z
      .string()
      .trim()
      .max(500, "Please keep this under 500 characters.")
      .transform((v) => (v === "" ? null : v)),
  });

export type PatientDetails = z.infer<typeof patientDetailsSchema>;

/** Map zod issues to a { field: message } record for form display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}
