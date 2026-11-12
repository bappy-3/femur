import type { AppointmentStatus } from "@/types/appointment";

/** Visual language for appointment blocks — distinct by colour AND pattern/weight (not colour alone). */
export const BLOCK_STYLE: Record<AppointmentStatus, string> = {
  CONFIRMED: "bg-teal text-white border-teal-deep",
  PENDING: "bg-sand-soft text-[#6e4a26] border-sand-deep border-dashed",
  IN_PROGRESS: "bg-sky text-white border-[#3f6a89] ring-2 ring-sky/30",
  COMPLETED: "bg-mint-soft text-[#2f5e4d] border-mint",
  CANCELLED: "bg-white text-ink-soft/70 border-line line-through opacity-75",
  REJECTED: "bg-white text-ink-soft/70 border-line line-through opacity-75",
  NO_SHOW: "bg-rose-soft text-[#8a3f37] border-rose",
};

export const LEGEND: { label: string; className: string }[] = [
  { label: "Available", className: "bg-white border-line" },
  { label: "Confirmed", className: "bg-teal border-teal-deep" },
  { label: "Pending", className: "bg-sand-soft border-sand-deep border-dashed" },
  { label: "In progress", className: "bg-sky border-[#3f6a89]" },
  { label: "Completed", className: "bg-mint-soft border-mint" },
  { label: "No-show", className: "bg-rose-soft border-rose" },
  { label: "Cancelled", className: "bg-white border-line opacity-60" },
  { label: "Blocked", className: "bg-blocked border-line" },
  { label: "Off duty", className: "bg-offduty bg-cream border-line" },
];
