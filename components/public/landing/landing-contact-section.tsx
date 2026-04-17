import Link from "next/link";

import { buildMapsHref } from "@/features/public-content/presentation";

type LandingContactSectionProps = {
  clinicAddress: string;
  contactPhone: string;
  contactEmail: string;
  imageSrc: string;
};

export function LandingContactSection({
  clinicAddress,
  contactPhone,
  contactEmail,
  imageSrc,
}: LandingContactSectionProps) {
  return (
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
              Call, email, or find us on the map. If you are ready, you can send
              a booking request in one step.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[2rem] bg-[var(--color-outline-variant)]/20">
            <div className="bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-on-surface-variant)]">
                Address
              </p>
              <p className="mt-3 text-base leading-6 text-[var(--color-foreground)]">
                {clinicAddress}
              </p>
            </div>
            <div className="bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-on-surface-variant)]">
                Phone
              </p>
              <a
                href={`tel:${contactPhone}`}
                className="mt-3 inline-flex text-base font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]"
              >
                {contactPhone}
              </a>
            </div>
            <div className="bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-on-surface-variant)]">
                Email
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="mt-3 inline-flex text-base font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]"
              >
                {contactEmail}
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
              href={buildMapsHref(clinicAddress)}
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
            src={imageSrc}
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
  );
}
