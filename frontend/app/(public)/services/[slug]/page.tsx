import { ArrowRight, CalendarClock, CheckCircle2, Clock, UsersRound } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/cta-band";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/site";
import { formatMoney } from "@/lib/money";
import { ServiceCard } from "@/features/service-catalog/service-card";
import { ServiceIcon } from "@/features/service-catalog/service-icon";
import { api } from "@/services";

export const revalidate = 300;

export async function generateStaticParams() {
  const services = await api.catalog.listServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await api.catalog.getService(slug);
  return service ? { title: service.name, description: service.summary } : { title: "Service not found" };
}

const genderLine = {
  REQUIRED_SAME_GENDER: "Same-gender practitioner",
  PREFERRED: "Same-gender practitioner where available",
  NONE: "Any available practitioner",
} as const;

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await api.catalog.getService(slug);
  if (!service) notFound();
  const all = await api.catalog.listServices();
  const related = service.relatedSlugs.map((s) => all.find((x) => x.slug === s)).filter((x): x is NonNullable<typeof x> => Boolean(x));

  const lists = [
    { title: "Who may benefit", items: service.benefitsFor },
    { title: "Our treatment approach", items: service.approach },
    { title: "What to expect", items: service.whatToExpect },
  ];

  return (
    <>
      <section className="border-b border-line bg-mist/70">
        <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="animate-fade-up">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-soft">
              <Link href={routes.services} className="hover:text-teal">Services</Link> <span aria-hidden>/</span> <span className="text-ink">{service.name}</span>
            </nav>
            <span className="mb-5 grid size-12 place-items-center rounded-2xl bg-white text-teal shadow-sm">
              <ServiceIcon icon={service.icon} className="size-6" />
            </span>
            <h1 className="text-[2.4rem] leading-[1.05] font-medium text-teal-deep sm:text-[3.2rem]">{service.name}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">{service.description}</p>
            <dl className="mt-7 grid max-w-xl grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl border border-line bg-white px-4 py-3">
                <dt className="flex items-center gap-1.5 text-xs text-ink-soft"><Clock className="size-3.5" /> Session</dt>
                <dd className="mt-1 font-semibold text-ink">{service.rules.durationMinutes} minutes</dd>
              </div>
              <div className="rounded-xl border border-line bg-white px-4 py-3">
                <dt className="flex items-center gap-1.5 text-xs text-ink-soft"><UsersRound className="size-3.5" /> Practitioner</dt>
                <dd className="mt-1 font-semibold text-ink">{genderLine[service.rules.genderPolicy]}</dd>
              </div>
              <div className="col-span-2 rounded-xl border border-line bg-white px-4 py-3 sm:col-span-1">
                <dt className="flex items-center gap-1.5 text-xs text-ink-soft"><CalendarClock className="size-3.5" /> Fee</dt>
                <dd className="mt-1 font-semibold text-ink">{service.startingPrice ? `From ${formatMoney(service.startingPrice)}` : "See pricing"}</dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={routes.bookingFor(service.slug)} size="lg">
                Book {service.name} <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href={routes.pricing} variant="secondary" size="lg">
                View pricing
              </ButtonLink>
            </div>
            {service.availabilityNote && <p className="mt-4 text-sm font-medium text-sand-deep">{service.availabilityNote}</p>}
          </div>
          <div className="relative aspect-[4/3.4] overflow-hidden rounded-[1.75rem] bg-white">
            <Image src={service.image.src} alt={service.image.alt} fill priority sizes="(min-width: 1024px) 520px, 92vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {lists.map((l, i) => (
            <div key={l.title} data-reveal className="rounded-[var(--radius-card)] border border-line bg-white p-6">
              <p className="font-display text-sm text-sand-deep">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 font-sans text-lg font-semibold tracking-normal text-ink">{l.title}</h2>
              <ul className="mt-4 space-y-3 text-[0.95rem]">
                {l.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-ink-soft">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-sage" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="container-page mt-6 text-xs text-ink-soft">
          This information is general. Your physiotherapist will advise on what is appropriate for you after assessment.
        </p>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-white py-16 sm:py-20">
          <div className="container-page">
            <h2 className="mb-8 text-[1.9rem] font-medium text-teal-deep">Related services</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="pt-20">
        <CtaBand title={`Ready to start ${service.name.toLowerCase()}?`} body="Choose a time that suits you — only genuinely available slots are shown." />
      </div>
    </>
  );
}
