import { ArrowUpRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Bn } from "@/components/ui/bn";
import { routes } from "@/config/site";
import { cn } from "@/lib/cn";
import type { Article, Condition, Treatment } from "@/types/content";

/** Image-overlay tile for a body area / complaint. Text sits on a dark gradient so it stays readable on any photo. */
export function ConditionCard({ condition, className, priority = false }: { condition: Condition; className?: string; priority?: boolean }) {
  return (
    <Link
      href={routes.condition(condition.slug)}
      data-reveal
      className={cn("group relative isolate flex min-h-[17rem] flex-col justify-end overflow-hidden rounded-[1.5rem] bg-teal-deep text-white", className)}
    >
      <Image
        src={condition.image.src}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
        className="-z-10 object-cover transition-transform duration-700 group-hover:scale-[1.05]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-teal-deep via-teal-deep/55 to-transparent" />
      <div className="p-5 sm:p-6">
        <span className="mb-3 inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide backdrop-blur">{condition.group}</span>
        <h3 className="flex items-start justify-between gap-3 font-display text-[1.45rem] leading-tight font-medium">
          {condition.name}
          <ArrowUpRight className="mt-1 size-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </h3>
        <Bn className="mt-1 block text-sm text-mint">{condition.bn}</Bn>
        <p className="mt-2 line-clamp-2 text-sm text-white/80">{condition.summary}</p>
      </div>
    </Link>
  );
}

export function TreatmentCard({ treatment }: { treatment: Treatment }) {
  return (
    <Link
      href={routes.treatment(treatment.slug)}
      data-reveal
      className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-shadow duration-300 hover:shadow-[var(--shadow-soft)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        <Image src={treatment.image.src} alt={treatment.image.alt} fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-teal shadow-sm">{treatment.family}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="flex items-start justify-between gap-3 font-display text-xl font-medium text-teal-deep">
          {treatment.name}
          <ArrowUpRight className="mt-1 size-4 shrink-0 text-sage transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </h3>
        <Bn className="mt-0.5 text-sm text-sage">{treatment.bn}</Bn>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{treatment.summary}</p>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" /> {treatment.sessionLength.split(",")[0]}</span>
          {treatment.availability === "confirm" && <span className="rounded-full bg-sand-soft px-2.5 py-1 font-medium text-sand-deep">Confirmed at booking</span>}
        </div>
      </div>
    </Link>
  );
}

export const formatArticleDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <Link
      href={routes.article(article.slug)}
      data-reveal
      className={cn("group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-shadow duration-300 hover:shadow-[var(--shadow-soft)]", featured && "md:col-span-2 md:flex-row")}
    >
      <div className={cn("relative aspect-[16/10] overflow-hidden bg-mist", featured && "md:aspect-auto md:min-h-[18rem] md:w-1/2")}>
        <Image src={article.image.src} alt={article.image.alt} fill sizes={featured ? "(min-width: 768px) 45vw, 100vw" : "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"} className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      </div>
      <div className={cn("flex flex-1 flex-col p-5 sm:p-6", featured && "md:justify-center md:p-8")}>
        <p className="text-xs font-semibold tracking-wide text-sage uppercase">{article.category}</p>
        <h3 className={cn("mt-2 font-display font-medium text-teal-deep", featured ? "text-[1.7rem] leading-tight" : "text-xl")}>{article.title}</h3>
        <Bn className="mt-1 text-sm text-ink-soft">{article.bnTitle}</Bn>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{article.excerpt}</p>
        <p className="mt-4 text-xs text-ink-soft">{formatArticleDate(article.publishedOn)} · {article.readMinutes} min read</p>
      </div>
    </Link>
  );
}
