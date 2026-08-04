"use client";

import Image from "next/image";
import type { HomeTestimonialPublic } from "@anima/shared";
import { useHomeTestimonialsPublic } from "@/hooks/use-home-testimonials";

type Props = {
  title: string;
  subtitle: string;
};

export function HomeTestimonialsSection({ title, subtitle }: Props) {
  const { data, isLoading } = useHomeTestimonialsPublic();

  if (isLoading) return null;
  if (!data?.length) return null;

  return (
    <section
      id="depoimentos"
      className="py-16 sm:py-20 px-4 sm:px-8 border-t border-[var(--home-line)] scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="home-display text-3xl sm:text-4xl text-[var(--home-ink)] mb-3">
          {title}
        </h2>
        <p className="text-sm text-[var(--home-muted)] max-w-2xl mb-12">
          {subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ item }: { item: HomeTestimonialPublic }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-[var(--home-line)] bg-[var(--home-surface)] p-6 shadow-sm">
      <blockquote className="flex-1 text-sm leading-relaxed text-[var(--home-ink)]/90">
        “{item.quote}”
      </blockquote>

      <footer className="mt-6 flex items-center gap-3 border-t border-[var(--home-line)] pt-4">
        {item.photoUrl ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[var(--home-line)] bg-[var(--home-bg)]">
            <Image
              src={item.photoUrl}
              alt={item.authorName}
              fill
              className="object-cover"
              sizes="48px"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--home-accent)]/15 text-sm font-semibold text-[var(--home-accent)]">
            {initials(item.authorName)}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-[var(--home-ink)]">
            {item.authorName}
          </p>
          {item.authorRole ? (
            <p className="text-xs text-[var(--home-muted)]">{item.authorRole}</p>
          ) : null}
        </div>
      </footer>
    </article>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
