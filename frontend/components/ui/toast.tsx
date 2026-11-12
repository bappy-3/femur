"use client";

import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ToastItem {
  id: number;
  tone: "success" | "error";
  message: string;
}

const ToastContext = createContext<{ notify: (message: string, tone?: ToastItem["tone"]) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const notify = useCallback((message: string, tone: ToastItem["tone"] = "success") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, tone, message }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex w-full max-w-sm animate-[fade-up_0.25s_ease-out_both] items-start gap-3 rounded-xl border bg-white px-4 py-3 text-sm shadow-[var(--shadow-lift)]",
              t.tone === "error" ? "border-rose/30" : "border-mint/40",
            )}
          >
            {t.tone === "error" ? <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#3d6e5c]" />}
            <p className="flex-1 text-ink">{t.message}</p>
            <button type="button" aria-label="Dismiss" onClick={() => setItems((p) => p.filter((x) => x.id !== t.id))} className="text-ink-soft hover:text-ink">
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
