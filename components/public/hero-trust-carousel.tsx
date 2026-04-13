"use client";

import { useMemo, useState } from "react";

type HeroTrustItem = {
  title: string;
  description: string;
};

type HeroTrustCarouselProps = {
  items: HeroTrustItem[];
};

const trustBadgeIcons = [
  "verified_user",
  "precision_manufacturing",
  "mood",
  "event_available",
] as const;

function chunkItems<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

export function HeroTrustCarousel({ items }: HeroTrustCarouselProps) {
  const groups = useMemo(() => chunkItems(items, 4), [items]);
  const [activeGroup, setActiveGroup] = useState(0);

  if (groups.length === 0) {
    return null;
  }

  const currentItems = groups[activeGroup] ?? groups[0];

  return (
    <section className="bg-[var(--color-surface-container-low)] py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {currentItems.map((item, index) => (
            <div
              key={`${item.title}-${activeGroup}-${index}`}
              className="rounded-xl bg-[var(--color-surface-container-lowest)] p-6 text-center shadow-sm"
            >
              <span className="material-symbols-outlined mb-4 text-4xl text-[var(--color-primary)]">
                {trustBadgeIcons[index % trustBadgeIcons.length]}
              </span>
              <h4 className="font-heading font-bold text-[var(--color-foreground)]">
                {item.title}
              </h4>
              <p className="mt-1 text-xs font-light text-[var(--color-on-surface-variant)]">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {groups.length > 1 ? (
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                setActiveGroup((current) =>
                  current === 0 ? groups.length - 1 : current - 1,
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(0,101,101,0.18)] bg-white text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white"
              aria-label="Previous hero highlights"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="flex items-center gap-2">
              {groups.map((_, index) => (
                <span
                  key={`hero-highlight-page-${index}`}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeGroup
                      ? "w-7 bg-[var(--color-primary)]"
                      : "w-2.5 bg-[var(--color-outline-variant)]/45"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setActiveGroup((current) => (current + 1) % groups.length)
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-white transition hover:brightness-110"
              aria-label="Next hero highlights"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
