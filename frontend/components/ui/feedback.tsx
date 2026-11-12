import { AlertCircle, CheckCircle2, Info, Loader2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 aria-hidden className={cn("size-4 animate-spin", className)} />;
}

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return <div aria-hidden className={cn("animate-pulse rounded-lg bg-ink/[0.06]", className)} {...props} />;
}

export function EmptyState({ icon, title, description, action, className }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white/60 px-6 py-12 text-center", className)}>
      {icon && <div className="mb-3 grid size-11 place-items-center rounded-full bg-mist text-teal">{icon}</div>}
      <p className="font-semibold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

const alertTones = {
  info: { cls: "border-sky/25 bg-sky-soft/60 text-[#2f5673]", Icon: Info },
  success: { cls: "border-mint/40 bg-mint-soft/60 text-[#2f5e4d]", Icon: CheckCircle2 },
  error: { cls: "border-rose/30 bg-rose-soft text-[#8a3f37]", Icon: AlertCircle },
  warning: { cls: "border-sand/40 bg-sand-soft/70 text-[#7d5631]", Icon: AlertCircle },
} as const;

export function Alert({ tone = "info", title, children, className }: { tone?: keyof typeof alertTones; title?: string; children?: ReactNode; className?: string }) {
  const { cls, Icon } = alertTones[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("flex gap-3 rounded-xl border px-4 py-3 text-sm", cls, className)}>
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div className="space-y-0.5">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="leading-relaxed opacity-90">{children}</div>}
      </div>
    </div>
  );
}
