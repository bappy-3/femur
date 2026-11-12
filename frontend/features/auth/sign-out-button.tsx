"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { api } from "@/services";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await api.auth.logout().catch(() => undefined);
        router.replace("/");
        router.refresh();
      }}
      className={cn("inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink-soft hover:bg-white/60 hover:text-ink", className)}
    >
      <LogOut className="size-4" /> Sign out
    </button>
  );
}
