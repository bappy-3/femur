"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PageTitle } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Alert, Skeleton, Spinner } from "@/components/ui/feedback";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { errorMessage, useAsync } from "@/hooks/use-async";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/datetime";
import { api } from "@/services";
import type { Faq, HomeContent, SeoEntry, SiteSettings, Testimonial } from "@/types/cms";

const TABS = ["Contact & hours", "Homepage", "Announcement", "FAQs", "Testimonials", "SEO"] as const;
type Tab = (typeof TABS)[number];

export function CmsAdmin() {
  const [tab, setTab] = useState<Tab>("Contact & hours");
  return (
    <div className="space-y-5">
      <PageTitle title="Website CMS" description="Edit public website content without touching code. Published changes refresh the site cache." />
      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn("-mb-px border-b-2 px-3.5 py-2 text-sm font-medium whitespace-nowrap", tab === t ? "border-teal text-teal" : "border-transparent text-ink-soft hover:text-ink")}>
            {t}
          </button>
        ))}
      </div>
      {tab === "Contact & hours" && <SettingsEditor mode="contact" />}
      {tab === "Announcement" && <SettingsEditor mode="announcement" />}
      {tab === "Homepage" && <HomeEditor />}
      {tab === "FAQs" && <FaqEditor />}
      {tab === "Testimonials" && <TestimonialEditor />}
      {tab === "SEO" && <SeoEditor />}
      <p className="text-xs text-ink-soft">
        Other pages (About, Our Story, Why Femur) and image uploads use the same section model and will be editable once the backend media + page APIs are connected.
      </p>
    </div>
  );
}

function useSaver() {
  const { notify } = useToast();
  const [pending, setPending] = useState(false);
  async function save<T>(fn: () => Promise<T>, message = "Saved and published.") {
    setPending(true);
    try {
      const r = await fn();
      notify(message);
      return r;
    } catch (e) {
      notify(errorMessage(e), "error");
    } finally {
      setPending(false);
    }
  }
  return { pending, save };
}

function SettingsEditor({ mode }: { mode: "contact" | "announcement" }) {
  const res = useAsync(() => api.cms.getSettings(), []);
  const [s, setS] = useState<SiteSettings | null>(null);
  const { pending, save } = useSaver();
  useEffect(() => {
    if (res.data) setS(res.data);
  }, [res.data]);
  if (!s) return <Skeleton className="h-64 rounded-2xl" />;
  const contact = (k: keyof SiteSettings["contact"], v: string | string[]) => setS({ ...s, contact: { ...s.contact, [k]: v } });

  return (
    <Card>
      <CardBody className="space-y-4">
        {mode === "contact" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Address (one line per row)" htmlFor="cs-a" className="sm:col-span-2">
                <Textarea id="cs-a" rows={3} value={s.contact.addressLines.join("\n")} onChange={(e) => contact("addressLines", e.target.value.split("\n"))} />
              </Field>
              <Field label="Phone" htmlFor="cs-p">
                <Input id="cs-p" value={s.contact.phone} onChange={(e) => contact("phone", e.target.value)} />
              </Field>
              <Field label="WhatsApp" htmlFor="cs-w">
                <Input id="cs-w" value={s.contact.whatsapp} onChange={(e) => contact("whatsapp", e.target.value)} />
              </Field>
              <Field label="Email" htmlFor="cs-e">
                <Input id="cs-e" value={s.contact.email} onChange={(e) => contact("email", e.target.value)} />
              </Field>
              <Field label="Google Maps search" htmlFor="cs-m" hint="Exact address or place name">
                <Input id="cs-m" value={s.contact.mapQuery} onChange={(e) => contact("mapQuery", e.target.value)} />
              </Field>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-ink">Opening hours</p>
              {s.openingHours.map((row, i) => (
                <div key={i} className="mb-2 grid grid-cols-[1fr_1fr_auto] gap-2">
                  <Input aria-label="Days" value={row.label} onChange={(e) => setS({ ...s, openingHours: s.openingHours.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)) })} />
                  <Input aria-label="Hours" value={row.hours} onChange={(e) => setS({ ...s, openingHours: s.openingHours.map((r, j) => (j === i ? { ...r, hours: e.target.value } : r)) })} />
                  <button aria-label="Remove row" onClick={() => setS({ ...s, openingHours: s.openingHours.filter((_, j) => j !== i) })} className="px-2 text-ink-soft hover:text-rose">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              <Button size="sm" variant="ghost" onClick={() => setS({ ...s, openingHours: [...s.openingHours, { label: "", hours: "" }] })}>
                <Plus className="size-4" /> Add row
              </Button>
            </div>
            {s.placeholders.length > 0 && (
              <Checkbox label="Mark contact details as confirmed (removes placeholder badges)" onChange={(e) => setS({ ...s, placeholders: e.target.checked ? [] : ["contact.addressLines", "contact.phone", "contact.whatsapp", "contact.email", "openingHours"] })} />
            )}
          </>
        ) : (
          <>
            <Field label="Announcement text" htmlFor="an-m">
              <Input id="an-m" value={s.announcement?.message ?? ""} onChange={(e) => setS({ ...s, announcement: { id: s.announcement?.id ?? "ann_1", href: s.announcement?.href ?? null, isPublished: s.announcement?.isPublished ?? false, message: e.target.value } })} />
            </Field>
            <Field label="Link" htmlFor="an-l" optional>
              <Input id="an-l" value={s.announcement?.href ?? ""} onChange={(e) => s.announcement && setS({ ...s, announcement: { ...s.announcement, href: e.target.value || null } })} />
            </Field>
            <Checkbox label="Published" checked={!!s.announcement?.isPublished} onChange={(e) => s.announcement && setS({ ...s, announcement: { ...s.announcement, isPublished: e.target.checked } })} />
          </>
        )}
        <Button onClick={() => save(() => api.admin.saveSettings(s))} disabled={pending}>
          {pending && <Spinner />} Save & publish
        </Button>
      </CardBody>
    </Card>
  );
}

function HomeEditor() {
  const res = useAsync(() => api.cms.getHome(), []);
  const [h, setH] = useState<HomeContent | null>(null);
  const { pending, save } = useSaver();
  useEffect(() => {
    if (res.data) setH(res.data);
  }, [res.data]);
  if (!h) return <Skeleton className="h-64 rounded-2xl" />;
  const hero = (k: keyof HomeContent["hero"], v: string) => setH({ ...h, hero: { ...h.hero, [k]: v } });
  return (
    <Card>
      <CardBody className="grid gap-4 sm:grid-cols-2">
        <Field label="Eyebrow" htmlFor="hm-e" className="sm:col-span-2">
          <Input id="hm-e" value={h.hero.eyebrow} onChange={(e) => hero("eyebrow", e.target.value)} />
        </Field>
        <Field label="Headline" htmlFor="hm-h" hint='Sentences ending in "." get the accent style on their second word.' className="sm:col-span-2">
          <Input id="hm-h" value={h.hero.headline} onChange={(e) => hero("headline", e.target.value)} />
        </Field>
        <Field label="Supporting text" htmlFor="hm-s" className="sm:col-span-2">
          <Textarea id="hm-s" rows={2} value={h.hero.subheadline} onChange={(e) => hero("subheadline", e.target.value)} />
        </Field>
        <Field label="Primary button" htmlFor="hm-p">
          <Input id="hm-p" value={h.hero.primaryCta} onChange={(e) => hero("primaryCta", e.target.value)} />
        </Field>
        <Field label="Secondary button" htmlFor="hm-2">
          <Input id="hm-2" value={h.hero.secondaryCta} onChange={(e) => hero("secondaryCta", e.target.value)} />
        </Field>
        <Field label="Final call-to-action title" htmlFor="hm-ft">
          <Input id="hm-ft" value={h.finalCta.title} onChange={(e) => setH({ ...h, finalCta: { ...h.finalCta, title: e.target.value } })} />
        </Field>
        <Field label="Final call-to-action text" htmlFor="hm-fb">
          <Input id="hm-fb" value={h.finalCta.body} onChange={(e) => setH({ ...h, finalCta: { ...h.finalCta, body: e.target.value } })} />
        </Field>
        <Alert tone="info" className="sm:col-span-2">Hero images are selected from the media library once the upload service is connected.</Alert>
        <Button className="sm:justify-self-start" onClick={() => save(() => api.admin.saveHome(h))} disabled={pending}>
          {pending && <Spinner />} Save & publish
        </Button>
      </CardBody>
    </Card>
  );
}

function FaqEditor() {
  const list = useAsync(() => api.admin.listFaqs(), []);
  const { pending, save } = useSaver();
  const [draft, setDraft] = useState<Faq | null>(null);
  return (
    <div className="space-y-3">
      <Button size="sm" onClick={() => setDraft({ id: `faq_${Date.now()}`, category: "General", question: "", answer: "", isPublished: false, sortOrder: 99 })}>
        <Plus className="size-4" /> Add FAQ
      </Button>
      {draft && (
        <Card>
          <CardBody className="grid gap-3 sm:grid-cols-[1fr_12rem]">
            <Field label="Question" htmlFor="fq-q">
              <Input id="fq-q" value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} />
            </Field>
            <Field label="Category" htmlFor="fq-c">
              <Select id="fq-c" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as Faq["category"] })}>
                {["Booking", "Treatment", "Membership", "Payments", "General"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Answer" htmlFor="fq-a" className="sm:col-span-2">
              <Textarea id="fq-a" rows={3} value={draft.answer} onChange={(e) => setDraft({ ...draft, answer: e.target.value })} />
            </Field>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
              <Checkbox label="Published" checked={draft.isPublished} onChange={(e) => setDraft({ ...draft, isPublished: e.target.checked })} />
              <Button
                size="sm"
                disabled={pending || !draft.question || !draft.answer}
                onClick={async () => {
                  const saved = await save(() => api.admin.saveFaq(draft));
                  if (saved) {
                    list.setData((prev) => {
                      const l = prev ?? [];
                      return l.some((x) => x.id === saved.id) ? l.map((x) => (x.id === saved.id ? saved : x)) : [...l, saved];
                    });
                    setDraft(null);
                  }
                }}
              >
                Save FAQ
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setDraft(null)}>
                Cancel
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
      <div className="divide-y divide-line rounded-2xl border border-line bg-white">
        {(list.data ?? []).map((f) => (
          <div key={f.id} className="flex items-start gap-3 px-5 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{f.question}</p>
              <p className="line-clamp-1 text-sm text-ink-soft">{f.answer}</p>
            </div>
            <Badge tone="outline">{f.category}</Badge>
            <Badge tone={f.isPublished ? "mint" : "slate"}>{f.isPublished ? "Published" : "Draft"}</Badge>
            <Button size="sm" variant="ghost" onClick={() => setDraft(f)}>
              Edit
            </Button>
            <button
              aria-label="Delete FAQ"
              className="p-2 text-ink-soft hover:text-rose"
              onClick={async () => {
                if (!confirm("Delete this FAQ?")) return;
                await save(() => api.admin.deleteFaq(f.id), "FAQ deleted.");
                list.setData((prev) => (prev ?? []).filter((x) => x.id !== f.id));
              }}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialEditor() {
  const list = useAsync(() => api.admin.listTestimonials(), []);
  const { save } = useSaver();
  async function update(t: Testimonial) {
    const saved = await save(() => api.admin.saveTestimonial(t));
    if (saved) list.setData((prev) => (prev ?? []).map((x) => (x.id === saved.id ? saved : x)));
  }
  return (
    <div className="space-y-3">
      <Alert tone="warning">Publish only real testimonials with the patient&apos;s recorded consent. Sample entries should be replaced or unpublished before launch.</Alert>
      {(list.data ?? []).map((t) => (
        <Card key={t.id}>
          <CardBody className="space-y-2">
            <Textarea aria-label="Quote" rows={2} defaultValue={t.quote} onBlur={(e) => e.target.value !== t.quote && update({ ...t, quote: e.target.value, isSample: false })} />
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-ink-soft">
                {t.authorDisplay} · {t.context}
              </span>
              {t.isSample && <Badge tone="sand">Sample</Badge>}
              <Checkbox className="ml-auto" label="Published" checked={t.isPublished} onChange={(e) => update({ ...t, isPublished: e.target.checked })} />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

function SeoEditor() {
  const list = useAsync(() => api.admin.listSeo(), []);
  const { save } = useSaver();
  return (
    <div className="space-y-3">
      {(list.data ?? []).map((e) => (
        <SeoRow key={e.pageKey} entry={e} onSave={async (next) => {
          const saved = await save(() => api.admin.saveSeo(next));
          if (saved) list.setData((prev) => (prev ?? []).map((x) => (x.pageKey === saved.pageKey ? saved : x)));
        }} />
      ))}
    </div>
  );
}

function SeoRow({ entry, onSave }: { entry: SeoEntry; onSave: (e: SeoEntry) => void }) {
  const [e, setE] = useState(entry);
  return (
    <Card>
      <CardBody className="grid gap-3 sm:grid-cols-2">
        <p className="text-sm font-semibold text-ink sm:col-span-2">
          /{entry.pageKey === "home" ? "" : entry.pageKey} <span className="font-normal text-ink-soft">· updated {formatDate(entry.updatedAt)}</span>
        </p>
        <Field label={`Title (${e.title.length}/60)`} htmlFor={`seo-t-${e.pageKey}`}>
          <Input id={`seo-t-${e.pageKey}`} value={e.title} onChange={(ev) => setE({ ...e, title: ev.target.value })} />
        </Field>
        <Field label={`Description (${e.description.length}/160)`} htmlFor={`seo-d-${e.pageKey}`}>
          <Input id={`seo-d-${e.pageKey}`} value={e.description} onChange={(ev) => setE({ ...e, description: ev.target.value })} />
        </Field>
        <Button size="sm" variant="secondary" className="sm:justify-self-start" onClick={() => onSave(e)}>
          Save
        </Button>
      </CardBody>
    </Card>
  );
}
