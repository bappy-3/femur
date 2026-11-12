import type { AppointmentStatus } from "@/types/appointment";

/**
 * Display metadata + allowed transitions for appointment statuses.
 * The backend enforces transitions; the UI uses this to only offer valid actions.
 */
export const STATUS_META: Record<AppointmentStatus, { label: string; tone: "teal" | "sand" | "mint" | "slate" | "rose" | "sky" }> = {
  PENDING: { label: "Pending", tone: "sand" },
  CONFIRMED: { label: "Confirmed", tone: "teal" },
  IN_PROGRESS: { label: "In progress", tone: "sky" },
  COMPLETED: { label: "Completed", tone: "mint" },
  CANCELLED: { label: "Cancelled", tone: "slate" },
  REJECTED: { label: "Rejected", tone: "slate" },
  NO_SHOW: { label: "No-show", tone: "rose" },
};

export const TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  PENDING: ["CONFIRMED", "REJECTED", "CANCELLED"],
  CONFIRMED: ["IN_PROGRESS", "COMPLETED", "NO_SHOW", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
  REJECTED: [],
  NO_SHOW: [],
};

export const TRANSITION_LABEL: Partial<Record<AppointmentStatus, string>> = {
  CONFIRMED: "Confirm",
  REJECTED: "Reject",
  CANCELLED: "Cancel",
  IN_PROGRESS: "Check in",
  COMPLETED: "Mark completed",
  NO_SHOW: "Mark no-show",
};

/** Transitions that require a reason (recorded in status history). */
export const REQUIRES_REASON: AppointmentStatus[] = ["REJECTED", "CANCELLED"];

export function canTransition(from: AppointmentStatus, to: AppointmentStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export function isReschedulable(status: AppointmentStatus): boolean {
  return status === "PENDING" || status === "CONFIRMED";
}
