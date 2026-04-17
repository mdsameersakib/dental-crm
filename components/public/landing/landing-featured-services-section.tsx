import Link from "next/link";

import type { PublicService } from "@/features/public-content/queries";

type LandingFeaturedServicesSectionProps = {
  services: PublicService[];
};

export function LandingFeaturedServicesSection({
  services,
}: LandingFeaturedServicesSectionProps) {
  return (
    <section className="bg-[var(--color-surface)] py-24" id="services">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
              Services
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight whitespace-nowrap text-[var(--color-foreground)] md:text-4xl xl:text-5xl">
              Explore our dental services.
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/25 bg-white px-5 py-2.5 text-base font-bold text-[var(--color-primary)] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:!text-white"
          >
            View all services
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
          </Link>
        </div>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.id}
                className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[rgba(189,201,200,0.2)]"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-fixed)]">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">
                      {service.iconName}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[var(--color-primary)]">
                    {service.priceLabel}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-[var(--color-foreground)]">
                  {service.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--color-on-surface-variant)]">
                  {service.shortDescription}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-[var(--color-outline-variant)]/20 pt-3 text-sm">
                  <span className="text-xs text-[var(--color-on-surface-variant)] sm:text-sm">
                    {service.durationLabel}
                  </span>
                  <Link
                    href={`/book?service=${service.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-xs font-bold !text-white sm:px-3.5 sm:py-2 sm:text-sm"
                  >
                    Book
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-[var(--color-outline-variant)]/30 bg-white px-8 py-16 text-center">
            <h3 className="font-heading text-3xl font-bold text-[var(--color-foreground)]">
              Services are being updated
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--color-on-surface-variant)]">
              Published treatments will appear here as soon as the clinic team
              finishes updating the service catalogue.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
