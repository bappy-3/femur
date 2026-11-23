import { CalendarCheck2, ClipboardList, House, MessageCircle, Phone, UserRoundCheck } from "lucide-react";
import type { Metadata } from "next";
import { waNumber } from "@/components/layout/quick-contact";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { Bn } from "@/components/ui/bn";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/site";
import { ContactForm } from "@/features/home/contact-form";
import { api } from "@/services";
import { stock } from "@/services/mock/fixtures/images";

export const metadata: Metadata = {
  title: "Home physiotherapy",
  description: "Physiotherapy at home in Dhaka for people who cannot easily travel: after surgery, stroke, in older age or during pregnancy.",
};

const who = ["After surgery or a fracture", "After a stroke or with reduced mobility", "Older adults who find travel difficult", "Late pregnancy and early postnatal care"];
const steps = [
  { icon: MessageCircle, title: "Tell us what you need", body: "Call, WhatsApp or send the form below. Share the condition, location and preferred time." },
  { icon: UserRoundCheck, title: "We match a physiotherapist", body: "Same-gender care is offered wherever you prefer it." },
  { icon: ClipboardList, title: "Assessment at your home", body: "We assess, set goals and agree a plan and visit schedule with you and your family." },
  { icon: CalendarCheck2, title: "Regular visits and reviews", body: "Exercises are progressed over time and shared with your doctor if you wish." },
];

export default async function HomePhysioPage() {
  const settings = await api.cms.getSettings();
  const { contact } = settings;
  return (
    <>
      <PageHero
        eyebrow="Home physiotherapy"
        title={<>Expert care, at your home <Bn className="mt-3 block text-[0.55em] font-medium text-sage">আপনার বাড়িতেই ফিজিওথেরাপি</Bn></>}
        intro="When travelling to a clinic is hard, our physiotherapists can come to you. Coverage areas, visit fees and availability are confirmed when you contact us."
        image={stock.rehabClinic.src}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonAnchor href={`https://wa.me/${waNumber(contact.whatsapp)}`} target="_blank" rel="noopener noreferrer" size="lg"><MessageCircle className="size-4" /> WhatsApp us</ButtonAnchor>
          <ButtonAnchor href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} variant="secondary" size="lg"><Phone className="size-4" /> {contact.phone}</ButtonAnchor>
        </div>
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div data-reveal>
            <span className="grid size-12 place-items-center rounded-2xl bg-mint-soft text-teal"><House className="size-6" /></span>
            <h2 className="mt-5 text-[1.9rem] font-medium text-teal-deep">Who it is for</h2>
            <ul className="mt-5 space-y-3">
              {who.map((w) => (
                <li key={w} className="flex gap-3 text-ink-soft"><span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-sage" /> {w}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-ink-soft">
              Home visits suit many situations, but some treatments need clinic equipment. We will tell you honestly what can and cannot be done at home.
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {steps.map((s, i) => (
              <li key={s.title} data-reveal className="rounded-[var(--radius-card)] border border-line bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-mist text-teal"><s.icon className="size-5" /></span>
                  <span className="font-display text-sm text-sand-deep">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-4 font-sans text-base font-semibold tracking-normal text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line bg-white py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-[1.9rem] font-medium text-teal-deep">Request a home visit</h2>
            <p className="mt-3 text-ink-soft">Write your name, number, area and what you need help with. The clinic will call you back to confirm.</p>
            <p className="mt-6 text-sm text-ink-soft">Prefer the clinic? <ButtonLink href={routes.booking} variant="ghost" size="sm">Book online instead</ButtonLink></p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-line bg-cream p-5 sm:p-7"><ContactForm /></div>
        </div>
      </section>

      <div className="pt-20"><CtaBand title="Care that comes to you" body="Or visit the clinic. Either way, you start with a proper assessment." /></div>
    </>
  );
}
