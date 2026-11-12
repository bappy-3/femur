"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  variant?: "dialog" | "drawer";
  className?: string;
}

/**
 * Accessible modal surface used by Dialog and Drawer:
 * ESC to close, scroll lock, initial focus, focus restoration, labelled by title.
 */
export function Overlay({ open, onClose, title, description, children, footer, variant = "dialog", className }: OverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const focusable = panelRef.current?.querySelector<HTMLElement>("input, select, textarea, button:not([data-close])");
    (focusable ?? panelRef.current)?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCloseRef.current();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) return null;
  const isDrawer = variant === "drawer";

  return (
    <div className="fixed inset-0 z-50 flex" role="presentation">
      <div className="absolute inset-0 bg-ink/35 backdrop-blur-[2px] animate-[fade-up_0.2s_ease-out_both]" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "relative flex max-h-full flex-col bg-white shadow-[var(--shadow-lift)] outline-none",
          isDrawer
            ? "ml-auto h-full w-full max-w-md animate-[drawer-in_0.28s_cubic-bezier(0.2,0.7,0.2,1)_both] sm:max-w-lg"
            : "m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg animate-[fade-up_0.25s_ease-out_both] rounded-2xl",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 id={titleId} className="font-sans text-lg font-semibold tracking-normal text-ink">
              {title}
            </h2>
            {description && <p className="mt-0.5 text-sm text-ink-soft">{description}</p>}
          </div>
          <button data-close type="button" onClick={onClose} aria-label="Close" className="-mr-1 grid size-9 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-mist">
            <X className="size-4.5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line bg-cream/60 px-5 py-3.5">{footer}</div>}
      </div>
      <style>{`@keyframes drawer-in { from { transform: translateX(24px); opacity: 0 } to { transform: none; opacity: 1 } }`}</style>
    </div>
  );
}
