import Link from "next/link";

import { HeroTrustCarousel } from "@/components/public/hero-trust-carousel";
import { LandingInteractive } from "@/components/public/landing-interactive";
import { getLandingPageData } from "@/features/public-content/queries";

const heroImage =
  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80";
const contactImage =
  "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1400&q=80";

function buildMapsHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export default async function PublicLandingPage() {
  const { landing, services, dentists } = await getLandingPageData();
  const featuredServices = services.slice(0, 3);
  const featuredDentists = dentists.slice(0, 3);

  return (
    <main className="pt-20" id="top">
      <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden">
        <div className="absolute inset-0">
          <img
            alt="Bright modern dental clinic"
            className="h-full w-full object-cover"
            src={heroImage}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,24,29,0.84)_0%,rgba(10,24,29,0.62)_42%,rgba(10,24,29,0.18)_100%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl items-center px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
              Staff-managed dental clinic website
            </p>
            <h1 className="mt-6 max-w-2xl font-heading text-5xl font-extrabold leading-[1.02] tracking-tight text-white md:text-7xl">
              {landing.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/78 md:text-lg">
              {landing.heroSubtitle}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href={landing.primaryCtaHref}
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-bold text-slate-900 transition-transform hover:-translate-y-0.5"
              >
                {landing.primaryCtaLabel}
              </Link>
              <Link
                href={landing.secondaryCtaHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/55 bg-white/14 px-7 py-3.5 text-sm font-bold !text-white shadow-[0_18px_40px_rgba(10,24,29,0.18)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/22"
              >
                {landing.secondaryCtaLabel}
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="mt-12 grid max-w-2xl gap-4 border-t border-white/12 pt-8 sm:grid-cols-3">
              <div>
                <p className="text-3xl font-heading font-extrabold text-white">
                  {services.length}+
                </p>
                <p className="mt-1 text-sm text-white/68">Published services</p>
              </div>
              <div>
                <p className="text-3xl font-heading font-extrabold text-white">
                  {dentists.length}+
                </p>
                <p className="mt-1 text-sm text-white/68">Clinic dentists</p>
              </div>
              <div>
                <p className="text-3xl font-heading font-extrabold text-white">
                  1
                </p>
                <p className="mt-1 text-sm text-white/68">Patients served</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HeroTrustCarousel items={landing.whyChooseUs} />

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
              className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)]"
            >
              View all services
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </Link>
          </div>

          {featuredServices.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredServices.map((service) => (
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

      <section className="bg-[var(--color-surface-container-low)] py-24" id="dentists">
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
              className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)]"
            >
              Browse all dentists
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </Link>
          </div>

          {featuredDentists.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {featuredDentists.map((dentist) => (
                <article
                  key={dentist.id}
                  className="overflow-hidden rounded-[2rem] bg-white shadow-sm"
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
                  <div className="space-y-4 p-7">
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
                    <div className="flex items-center justify-between border-t border-[var(--color-outline-variant)]/20 pt-4">
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
                Staff can publish dentist profiles and schedules from the CRM,
                and they will appear here automatically.
              </p>
            </div>
          )}
        </div>
      </section>

      <LandingInteractive />

      <section className="bg-[var(--color-surface)] py-24" id="contact">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="space-y-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                Contact
              </p>
              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-[var(--color-foreground)] md:text-4xl xl:text-5xl">
                Everything you need to reach our clinic.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--color-on-surface-variant)]">
                Call, email, or find us on the map. If you are ready, you can
                send a booking request in one step.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-[2rem] bg-[var(--color-outline-variant)]/20">
              <div className="bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-on-surface-variant)]">
                  Address
                </p>
                <p className="mt-3 text-base leading-6 text-[var(--color-foreground)]">
                  {landing.clinicAddress}
                </p>
              </div>
              <div className="bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-on-surface-variant)]">
                  Phone
                </p>
                <a
                  href={`tel:${landing.contactPhone}`}
                  className="mt-3 inline-flex text-base font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]"
                >
                  {landing.contactPhone}
                </a>
              </div>
              <div className="bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-on-surface-variant)]">
                  Email
                </p>
                <a
                  href={`mailto:${landing.contactEmail}`}
                  className="mt-3 inline-flex text-base font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]"
                >
                  {landing.contactEmail}
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-7 py-3.5 text-sm font-bold !text-white"
              >
                Book an appointment
              </Link>
              <a
                href={buildMapsHref(landing.clinicAddress)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-outline-variant)]/40 px-7 py-3.5 text-sm font-bold text-[var(--color-foreground)]"
              >
                Open in Maps
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem]">
            <img
              alt="Dental chair and treatment room"
              className="h-full min-h-[460px] w-full object-cover"
              src={contactImage}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,24,29,0.06)_0%,rgba(10,24,29,0.68)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
              <div className="max-w-md rounded-[2rem] bg-white/92 p-6 backdrop-blur-md">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                  Booking flow
                </p>
                <h3 className="mt-3 font-heading text-2xl font-bold text-[var(--color-foreground)]">
                  Send a request. We confirm the final appointment.
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-on-surface-variant)]">
                  Choose a service, pick your preferred time, and our team will
                  follow up to finalize your visit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
