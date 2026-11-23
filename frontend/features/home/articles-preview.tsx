import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/sections/section";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/site";
import { articles } from "@/content/articles";
import { ArticleCard } from "@/features/content/cards";

export function ArticlesPreview() {
  const latest = [...articles].sort((a, b) => b.publishedOn.localeCompare(a.publishedOn)).slice(0, 3);
  return (
    <Section tone="white">
      <div className="container-page">
        <SectionHeading
          eyebrow="Health blog"
          title="Understand your pain"
          intro="Plain-language guides from our clinical team."
          action={
            <ButtonLink href={routes.blog} variant="secondary">
              All articles <ArrowRight className="size-4" />
            </ButtonLink>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </div>
    </Section>
  );
}
