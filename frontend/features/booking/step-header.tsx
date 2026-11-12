import type { ReactNode } from "react";

/** Step title. The step number lives in <BookingProgress />, so it isn't repeated here. */
export function StepHeader({ title, description }: { step?: number; title: string; description?: ReactNode }) {
  return (
    <header className="mb-7">
      <h1 className="text-[1.9rem] leading-tight font-medium text-teal-deep sm:text-[2.2rem]">{title}</h1>
      {description && <p className="mt-2 text-ink-soft">{description}</p>}
    </header>
  );
}
