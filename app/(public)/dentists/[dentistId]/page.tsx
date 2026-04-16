import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getPublicDentistDetail,
  getPublicDirectoryData,
} from "@/features/public-content/queries";

export default async function DentistDetailPage({
  params,
}: {
  params: Promise<{ dentistId: string }>;
}) {
  const { dentistId } = await params;
  const [dentist, directory] = await Promise.all([
    getPublicDentistDetail(dentistId),
    getPublicDirectoryData(),
  ]);

  if (!dentist) {
    notFound();
  }

  const relatedDentists = directory.dentists
    .filter((entry) => entry.slug !== dentist.slug)
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-7xl px-6 pt-28 pb-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="space-y-7 lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-[2.5rem] bg-[var(--color-surface-container-low)]">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={dentist.imageUrl}
                alt={dentist.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div>
            <Link
              href="/dentists"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to dentists
            </Link>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-primary)]">
              {dentist.specialty}
            </p>
            <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-[var(--color-foreground)]">
              {dentist.name}
            </h1>
            <p className="mt-4 text-base leading-7 text-[var(--color-on-surface-variant)]">
              {dentist.shortBio}
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[2rem] bg-[var(--color-outline-variant)]/20">
            <div className="flex items-center justify-between bg-white p-5">
              <span className="text-sm text-[var(--color-on-surface-variant)]">
                Consultation fee
              </span>
              <span className="font-bold text-[var(--color-primary)]">
                {dentist.consultationFee}
              </span>
            </div>
            <div className="flex items-center justify-between bg-white p-5">
              <span className="text-sm text-[var(--color-on-surface-variant)]">
                Experience
              </span>
              <span className="font-bold text-[var(--color-foreground)]">
                {dentist.yearsOfExperience}
              </span>
            </div>
            <div className="flex items-center justify-between bg-white p-5">
              <span className="text-sm text-[var(--color-on-surface-variant)]">
                Booking status
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${
                  dentist.isAcceptingPatients
                    ? "bg-[var(--color-primary-fixed)] text-[var(--color-primary)]"
                    : "bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)]"
                }`}
              >
                {dentist.isAcceptingPatients ? "Accepting" : "Limited"}
              </span>
            </div>
          </div>

          <Link
            href={`/book?dentist=${dentist.slug}`}
            className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3.5 text-sm font-bold !text-white"
          >
            Request Appointment
          </Link>
        </aside>

        <div className="space-y-12">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
              About
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
              Profile overview
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--color-on-surface-variant)]">
              {dentist.bio}
            </p>
          </section>

          <div className="grid gap-8 md:grid-cols-2">
            <section className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[rgba(189,201,200,0.2)]">
              <h3 className="font-heading text-2xl font-bold text-[var(--color-foreground)]">
                Education
              </h3>
              <div className="mt-6 space-y-4">
                {dentist.educationItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-[var(--color-surface-container-low)] px-5 py-4"
                  >
                    <p className="text-sm leading-7 text-[var(--color-foreground)]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[rgba(189,201,200,0.2)]">
              <h3 className="font-heading text-2xl font-bold text-[var(--color-foreground)]">
                Specialties
              </h3>
              <div className="mt-6 flex flex-wrap gap-3">
                {dentist.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="rounded-full bg-[var(--color-surface-container-low)] px-4 py-2 text-sm font-semibold text-[var(--color-foreground)]"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <section>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                  Availability
                </p>
                <h3 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
                  Weekly schedule
                </h3>
              </div>
              <Link
                href={`/book?dentist=${dentist.slug}`}
                className="text-sm font-bold text-[var(--color-primary)]"
              >
                Book with this dentist
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {dentist.availability.map((entry) => (
                <div
                  key={entry.day}
                  className={`rounded-2xl p-5 ${
                    entry.isAvailable
                      ? "bg-white ring-1 ring-[rgba(189,201,200,0.2)]"
                      : "bg-[var(--color-surface-container-low)] opacity-80"
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-on-surface-variant)]">
                    {entry.day}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-[var(--color-foreground)]">
                    {entry.label}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {relatedDentists.length > 0 ? (
        <section className="mt-24">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                More dentists
              </p>
              <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
                Continue browsing the clinic team.
              </h2>
            </div>
            <Link
              href="/dentists"
              className="text-sm font-bold text-[var(--color-primary)]"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {relatedDentists.map((entry) => (
              <article
                key={entry.id}
                className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-[rgba(189,201,200,0.2)]"
              >
                <div className="h-72 overflow-hidden">
                  <img
                    src={entry.imageUrl}
                    alt={entry.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-4 p-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                      {entry.specialty}
                    </p>
                    <h3 className="mt-2 font-heading text-xl font-bold text-[var(--color-foreground)]">
                      {entry.name}
                    </h3>
                  </div>
                  <p className="line-clamp-3 text-sm leading-7 text-[var(--color-on-surface-variant)]">
                    {entry.shortBio}
                  </p>
                  <Link
                    href={`/dentists/${entry.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)]"
                  >
                    View profile
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
