"use client";

import { CalendarPlus, Sparkles, UserPlus } from "lucide-react";
import Link from "next/link";
import { PageTitle } from "@/components/layout/portal-shell";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { MembershipStatusBadge } from "@/components/ui/status-badge";
import { env } from "@/config/env";
import { routes } from "@/config/site";
import { useAsync } from "@/hooks/use-async";
import { formatDate } from "@/lib/datetime";
import { api } from "@/services";
import { ACTIVE_STATUSES } from "@/types/appointment";
import { AppointmentCard } from "./appointment-card";

export function AccountOverview({ firstName }: { firstName: string }) {
  const appts = useAsync(() => api.account.listAppointments(), []);
  const membership = useAsync(() => api.account.getMembership(), []);
  const now = new Date().toISOString();
  const upcoming = (appts.data ?? []).filter((a) => a.startsAt > now && ACTIVE_STATUSES.includes(a.status)).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const m = membership.data;
  const hasNira = m?.status === "ACTIVE" && m.entitlements["nira.access"] === true;

  return (
    <div className="space-y-6">
      <PageTitle title={`Hello, ${firstName}`} description="Here's what's coming up." actions={<ButtonLink href={routes.booking}><CalendarPlus className="size-4" /> Book appointment</ButtonLink>} />

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <h2 className="mb-3 font-sans text-sm font-semibold tracking-normal text-ink-soft">Next appointment</h2>
          {appts.loading ? (
            <Skeleton className="h-28 rounded-2xl" />
          ) : upcoming[0] ? (
            <>
              <AppointmentCard appointment={upcoming[0]} />
              {upcoming.length > 1 && (
                <Link href={routes.account.appointments} className="mt-3 inline-block text-sm font-semibold text-teal">
                  + {upcoming.length - 1} more upcoming
                </Link>
              )}
            </>
          ) : (
            <EmptyState title="No upcoming appointments" description="When you book, your appointment will appear here." action={<ButtonLink href={routes.booking} size="sm">Book now</ButtonLink>} />
          )}
        </section>

        <section>
          <h2 className="mb-3 font-sans text-sm font-semibold tracking-normal text-ink-soft">Membership</h2>
          <Card className={hasNira ? "border-teal bg-teal text-white" : undefined}>
            <CardBody>
              {membership.loading || !m ? (
                <Skeleton className="h-24" />
              ) : (
                <div className="space-y-3">
                  <MembershipStatusBadge status={m.status} />
                  <p className={hasNira ? "font-display text-2xl" : "font-display text-2xl text-teal-deep"}>{m.planName ?? "Free account"}</p>
                  <p className={hasNira ? "text-sm text-white/75" : "text-sm text-ink-soft"}>
                    {m.status === "ACTIVE" && m.endsAt && `Active until ${formatDate(m.endsAt)}.`}
                    {m.status === "NONE" && "You can book appointments for free. Membership adds member pricing and Nira."}
                    {m.status === "PENDING_PAYMENT" && "Your membership will activate once the clinic verifies your payment."}
                    {m.status === "EXPIRED" && "Your membership has expired. Renew to restore member benefits."}
                    {m.status === "SUSPENDED" && "Your membership is suspended. Please contact the clinic."}
                  </p>
                  {hasNira ? (
                    <ButtonAnchor href={env.niraUrl} variant="accent" size="sm">
                      <Sparkles className="size-4" /> Open Nira
                    </ButtonAnchor>
                  ) : (
                    <ButtonLink href={routes.account.membership} variant="secondary" size="sm">
                      {m.status === "NONE" ? "Explore membership" : "Manage membership"}
                    </ButtonLink>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </section>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { href: routes.booking, Icon: CalendarPlus, title: "Book an appointment", text: "For yourself or a family member" },
          { href: routes.account.family, Icon: UserPlus, title: "Add a family member", text: "Book faster next time" },
          { href: routes.account.appointments, Icon: CalendarPlus, title: "Manage bookings", text: "Reschedule or cancel" },
        ].map(({ href, Icon, title, text }) => (
          <Link key={title} href={href} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-sage/60">
            <span className="grid size-10 place-items-center rounded-xl bg-mist text-teal">
              <Icon className="size-[1.1rem]" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">{title}</span>
              <span className="text-xs text-ink-soft">{text}</span>
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
