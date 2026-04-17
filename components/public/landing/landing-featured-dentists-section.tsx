import Link from "next/link";

import type { PublicDentist } from "@/features/public-content/queries";

type LandingFeaturedDentistsSectionProps = {
  dentists: PublicDentist[];
};

export function LandingFeaturedDentistsSection({
  dentists,
}: LandingFeaturedDentistsSectionProps) {
  return (
    <section
      className="bg-[var(--color-surface-container-low)] pt-24 pb-8 md:pb-10"
      id="dentists"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
              Dentists
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-[var(--color-foreground)] md:text-4xl xl:text-5xl">
              Meet our experienced dental specialists.
            </h2>
          </div>
          <Link
            href="/dentists"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/25 bg-white px-5 py-2.5 text-base font-bold text-[var(--color-primary)] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:!text-white"
          >
            Browse all dentists
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
          </Link>
        </div>

        {dentists.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {dentists.map((dentist) => (
              <article
                key={dentist.id}
                className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-sm"
              >
                <Link href={`/dentists/${dentist.slug}`} className="block">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      alt={dentist.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      src={dentist.imageUrl}
                    />
                  </div>
                </Link>
                <div className="flex flex-1 flex-col gap-4 p-7">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                      {dentist.specialty}
                    </p>
                    <h3 className="mt-2 font-heading text-2xl font-bold text-[var(--color-foreground)]">
                      {dentist.name}
                    </h3>
                  </div>
                  <p className="line-clamp-3 text-sm leading-7 text-[var(--color-on-surface-variant)]">
                    {dentist.shortBio}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-[var(--color-outline-variant)]/20 pt-4">
                    <Link
                      href={`/dentists/${dentist.slug}`}
                      className="text-sm font-bold text-[var(--color-primary)]"
                    >
                      View profile
                    </Link>
                    <Link
                      href={`/book?dentist=${dentist.slug}`}
                      className="text-sm font-bold text-[var(--color-accent)]"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-[var(--color-outline-variant)]/30 bg-white px-8 py-16 text-center">
            <h3 className="font-heading text-3xl font-bold text-[var(--color-foreground)]">
              Dentist profiles are coming soon
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--color-on-surface-variant)]">
              Staff can publish dentist profiles and schedules from the CRM, and
              they will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
