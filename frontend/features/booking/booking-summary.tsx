import { CalendarDays, Phone, Stethoscope, UserRound } from "lucide-react";
import { formatDayShort, formatTime, toDhakaDate } from "@/lib/datetime";
import { formatMoney } from "@/lib/money";
import type { Service } from "@/types/catalog";
import type { BookingState } from "./booking-state";

export function BookingSummary({ state, service, clinicPhone }: { state: BookingState; service: Service | undefined; clinicPhone: string }) {
  const rows = [
    { Icon: Stethoscope, label: "Service", value: service?.name },
    { Icon: UserRound, label: "Patient", value: state.patient?.fullName ?? (state.gender ? (state.gender === "FEMALE" ? "Female patient" : "Male patient") : undefined) },
    {
      Icon: CalendarDays,
      label: "When",
      value: state.slot ? `${formatDayShort(toDhakaDate(state.slot.startsAt))}, ${formatTime(state.slot.startsAt)}` : state.date ? formatDayShort(state.date) : undefined,
    },
  ];
  return (
    <aside className="sticky top-24 hidden rounded-2xl border border-line bg-white p-5 lg:block">
      <p className="text-xs font-semibold tracking-[0.16em] text-sage uppercase">Your appointment</p>
      <ul className="mt-4 space-y-4">
        {rows.map(({ Icon, label, value }) => (
          <li key={label} className="flex gap-3">
            <Icon className="mt-0.5 size-4 shrink-0 text-sage" />
            <div className="min-w-0">
              <p className="text-xs text-ink-soft">{label}</p>
              <p className={value ? "truncate font-semibold text-ink" : "text-ink/30"}>{value ?? "—"}</p>
            </div>
          </li>
        ))}
      </ul>
      {service?.startingPrice && (
        <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
          <span className="text-sm text-ink-soft">Fee</span>
          <span className="font-display text-xl font-medium text-teal">{formatMoney(service.startingPrice)}</span>
        </div>
      )}
      <div className="mt-5 rounded-xl bg-mist p-3.5 text-sm">
        <p className="font-semibold text-ink">Need help booking?</p>
        <a href={`tel:${clinicPhone.replace(/[^+\d]/g, "")}`} className="mt-1 inline-flex items-center gap-1.5 text-teal">
          <Phone className="size-3.5" /> {clinicPhone}
        </a>
      </div>
    </aside>
  );
}
