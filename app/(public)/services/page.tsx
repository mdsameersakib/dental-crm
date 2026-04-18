import Link from "next/link";

import { getPublicDirectoryData } from "@/features/public-content/queries";

const servicesHeroImage =
  "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1600&q=80";

export default async function ServicesPage() {
  const { services } = await getPublicDirectoryData();

  return (
    <main className="pt-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            alt="Dental consultation setup"
            className="h-full w-full object-cover"
            src={servicesHeroImage}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,24,29,0.82)_0%,rgba(10,24,29,0.42)_55%,rgba(10,24,29,0.2)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              Services
            </p>
            <h1 className="mt-4 font-heading text-5xl font-extrabold tracking-tight text-white md:text-6xl">
              Review treatments, pricing, and estimated visit time.
            </h1>
            <p className="mt-5 text-base leading-7 text-white/78 md:text-lg">
              All services shown here come from the clinic staff workspace, so
              this page doubles as the public catalogue for your project demo.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                Published catalogue
              </p>
              <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight text-[var(--color-foreground)] md:text-3xl xl:text-4xl">
                Patients can compare services before booking.
              </h2>
            </div>
          </div>

          {services.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.slug}
                  className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[rgba(189,201,200,0.2)]"
                >
                  {service.imageUrl ? (
                    <div className="h-44 overflow-hidden">
                      <img
                        alt={service.name}
                        className="h-full w-full object-cover"
                        src={service.imageUrl}
                      />
                    </div>
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-[var(--color-surface-container-low)]">
                      <span className="material-symbols-outlined text-4xl text-[var(--color-primary)]">
                        {service.iconName}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-fixed)]">
                        <span className="material-symbols-outlined text-[var(--color-primary)]">
                          {service.iconName}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-[var(--color-primary)]">
                        {service.priceLabel}
                      </span>
                    </div>

                    <h3 className="font-heading text-xl font-bold text-[var(--color-foreground)]">
                      {service.name}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--color-on-surface-variant)]">
                      {service.fullDescription}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-[var(--color-outline-variant)]/20 pt-3 text-sm">
                      <span className="text-xs font-medium text-[var(--color-on-surface-variant)] sm:text-sm">
                        {service.durationLabel}
                      </span>
                      <Link
                        href={`/book?service=${service.slug}`}
                        className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-3.5 py-1.5 text-xs font-bold !text-white sm:text-sm"
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
                No services are published yet
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--color-on-surface-variant)]">
                Staff can publish services from the CRM. Once they do, this page
                will automatically show names, prices, durations, and images.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
