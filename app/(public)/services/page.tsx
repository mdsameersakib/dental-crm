import Link from "next/link";

import { getPublicDirectoryData } from "@/features/public-content/queries";

const servicesHeroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA2g0CSdop2wiJgwLhZG4QTwf_Y3-ylsDgT8k61yEhzZrzDk1iC3KqOmbT6TpSO1CE4hZE-N6Qmh6l-P__e8VNO3lQsjwgzwP3amh_OMGzYpiT4-Z3XF1QelAC_vlX4L-wHqBiGS9WjEVWW3eZOR2zxaSKrjl-V8veXB8KRyWfBYtaGKYLlXHM5aP_3VS4UVXn-zsKGSUj-0_jdua92DQkrKOrWF5NKlyDLh7kzVGBGsTgxXe6uLxV8LDyipyKKTfl3IBSXndyvGTo";

export default async function ServicesPage() {
  const { services } = await getPublicDirectoryData();

  return (
    <main className="pt-20">
      <section className="relative flex h-[400px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Modern dental clinic"
            className="h-full w-full object-cover"
            src={servicesHeroImage}
          />
          <div className="absolute inset-0 bg-[rgba(0,101,101,0.4)] backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 px-6 text-center">
          <h1 className="font-heading text-5xl font-extrabold tracking-tight text-white md:text-7xl">
            Our Services
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-light text-white/90 md:text-xl">
            Precision care meets editorial elegance. Explore our comprehensive
            range of specialist-led dental services.
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                Signature Treatments
              </p>
              <h2 className="mt-4 font-heading text-4xl font-bold text-[var(--color-foreground)] md:text-5xl">
                Precision-designed treatment experiences.
              </h2>
            </div>
            <Link
              href="/book"
              className="rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold !text-white transition hover:shadow-lg"
            >
              Book Appointment
            </Link>
          </div>

          {services.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service, index) => {
                const accentClasses = [
                  "bg-[var(--color-primary-fixed)] text-[var(--color-primary)]",
                  "bg-[#d4e3ff] text-[var(--color-accent)]",
                  "bg-[#ffdbcb] text-[#8b4823]",
                ];

                return (
                  <article
                    key={service.slug}
                    className="group overflow-hidden rounded-xl bg-[var(--color-surface-container-low)] shadow-sm transition-all duration-500 hover:-translate-y-1 hover:bg-[var(--color-surface-container-lowest)] hover:shadow-2xl"
                  >
                    {service.imageUrl ? (
                      <div className="h-48 overflow-hidden">
                        <img
                          alt={service.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          src={service.imageUrl}
                        />
                      </div>
                    ) : null}
                    <div className="p-8">
                      <div
                        className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${
                          accentClasses[index % accentClasses.length]
                        }`}
                      >
                        <span className="material-symbols-outlined text-3xl">
                          {service.iconName}
                        </span>
                      </div>
                      <h3 className="mb-3 font-heading text-2xl font-bold text-[var(--color-foreground)]">
                        {service.name}
                      </h3>
                      <p className="mb-6 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                        {service.shortDescription}
                      </p>
                      <div className="mb-6 flex items-center justify-between border-t border-[rgba(189,201,200,0.2)] pt-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                            Duration
                          </span>
                          <span className="text-sm font-semibold">
                            {service.durationLabel}
                          </span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                            Price
                          </span>
                          <span className="text-lg font-bold text-[var(--color-primary)]">
                            {service.priceLabel}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/book?service=${service.slug}`}
                        className="block w-full rounded-xl bg-[var(--color-primary)] py-4 text-center font-bold !text-white transition-all hover:bg-[var(--color-primary-container)]"
                      >
                        Book Treatment
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[var(--color-outline-variant)]/20 bg-[var(--color-surface-container-low)] px-8 py-16 text-center">
              <h3 className="font-heading text-3xl font-bold text-[var(--color-foreground)]">
                Services placeholder
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--color-on-surface-variant)]">
                No published services exist yet. Add real clinic services when
                you are ready to build this section.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
