"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/** Dismissible announcement. Remembers dismissal per announcement id in this browser. */
export function AnnouncementBar({ id, message, href }: { id: string; message: string; href: string | null }) {
  const key = `femur_announcement_${id}`;
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(key) === "1") setHidden(true);
    } catch {
      /* storage unavailable */
    }
  }, [key]);

  if (hidden) return null;
  return (
    <div className="relative bg-teal-deep text-center text-[0.8rem] text-white/90">
      <div className="container-page px-10 py-2">
        {href ? (
          <Link href={href} className="underline-offset-4 hover:underline">
            {message} <span aria-hidden>→</span>
          </Link>
        ) : (
          message
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          setHidden(true);
          try {
            localStorage.setItem(key, "1");
          } catch {
            /* ignore */
          }
        }}
        className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white sm:right-4"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
