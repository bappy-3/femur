import { STATUS_META } from "@/lib/appointment-status";
import type { AppointmentStatus } from "@/types/appointment";
import type { MembershipStatus } from "@/types/membership";
import { Badge, type Tone } from "./badge";

export function AppointmentStatusBadge({ status, className }: { status: AppointmentStatus; className?: string }) {
  const meta = STATUS_META[status];
  return (
    <Badge tone={meta.tone} className={className}>
      {meta.label}
    </Badge>
  );
}

const MEMBERSHIP: Record<MembershipStatus, { label: string; tone: Tone }> = {
  NONE: { label: "Free account", tone: "slate" },
  PENDING_PAYMENT: { label: "Awaiting payment", tone: "sand" },
  ACTIVE: { label: "Active member", tone: "mint" },
  EXPIRED: { label: "Expired", tone: "rose" },
  SUSPENDED: { label: "Suspended", tone: "rose" },
  CANCELLED: { label: "Cancelled", tone: "slate" },
};

export function MembershipStatusBadge({ status }: { status: MembershipStatus }) {
  const m = MEMBERSHIP[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}
