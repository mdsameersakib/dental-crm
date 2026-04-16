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
    <main className="min-h-screen pt-20">
      <section className="relative overflow-hidden bg-[var(--color-surface-container-low)]">
        <div className="absolute inset-0">
          <img
            src={dentist.imageUrl}
            alt={dentist.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(10,24,29,0.88)_0%,rgba(10,24,29,0.72)_45%,rgba(10,24,29,0.3)_100%)]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-24">
          <Link
            href="/dentists"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to dentists
          </Link>

          <div className="mt-8 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-primary-fixed)]">
              {dentist.specialty}
            </p>
            <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-white md:text-5xl xl:text-6xl">
              {dentist.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/82 md:text-lg">
              {dentist.shortBio}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href={`/book?dentist=${dentist.slug}`}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 transition-transform hover:-translate-y-0.5"
            >
              Request Appointment
            </Link>
            <span
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${
                dentist.isAcceptingPatients
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {dentist.isAcceptingPatients ? "Accepting Patients" : "Limited Availability"}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[1.5rem] border border-[var(--color-outline-variant)]/30 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                Quick details
              </p>
              <dl className="mt-4 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[var(--color-on-surface-variant)]">Consultation fee</dt>
                  <dd className="font-bold text-[var(--color-primary)]">
                    {dentist.consultationFee}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[var(--color-on-surface-variant)]">Experience</dt>
                  <dd className="font-bold text-[var(--color-foreground)]">
                    {dentist.yearsOfExperience}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[var(--color-on-surface-variant)]">Primary specialty</dt>
                  <dd className="text-right font-bold text-[var(--color-foreground)]">
                    {dentist.specialty}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--color-outline-variant)]/30 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                Education
              </p>
              <div className="mt-4 space-y-2">
                {dentist.educationItems.map((item) => (
                  <p
                    key={item}
                    className="rounded-xl bg-[var(--color-surface-container-low)] px-3 py-2 text-sm leading-6 text-[var(--color-foreground)]"
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-8">
            <section className="rounded-[1.75rem] border border-[var(--color-outline-variant)]/30 bg-white p-6 shadow-sm md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                Profile
              </p>
              <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
                About this dentist
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-on-surface-variant)] md:text-base">
                {dentist.bio}
              </p>
            </section>

            <section className="rounded-[1.75rem] border border-[var(--color-outline-variant)]/30 bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                    Availability
                  </p>
                  <h3 className="mt-2 font-heading text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
                    Weekly schedule
                  </h3>
                </div>
                <Link
                  href={`/book?dentist=${dentist.slug}`}
                  className="rounded-full border border-[var(--color-primary)]/30 px-4 py-2 text-sm font-bold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:!text-white"
                >
                  Book with this dentist
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {dentist.availability.map((entry) => (
                  <div
                    key={entry.day}
                    className={`rounded-2xl px-4 py-4 ${
                      entry.isAvailable
                        ? "bg-[var(--color-surface)] ring-1 ring-[rgba(189,201,200,0.35)]"
                        : "bg-[var(--color-surface-container-low)] opacity-85"
                    }`}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                      {entry.day}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--color-foreground)]">
                      {entry.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-[var(--color-outline-variant)]/30 bg-white p-6 shadow-sm md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                Specialties
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {dentist.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="rounded-full bg-[var(--color-surface-container-low)] px-3.5 py-1.5 text-sm font-semibold text-[var(--color-foreground)]"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      {relatedDentists.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                More dentists
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
                Continue exploring the team
              </h2>
            </div>
            <Link
              href="/dentists"
              className="text-sm font-bold text-[var(--color-primary)]"
            >
              View all dentists
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedDentists.map((entry) => (
              <article
                key={entry.id}
                className="overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-[rgba(189,201,200,0.2)]"
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={entry.imageUrl}
                    alt={entry.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-3 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                    {entry.specialty}
                  </p>
                  <h3 className="font-heading text-lg font-bold text-[var(--color-foreground)]">
                    {entry.name}
                  </h3>
                  <p className="line-clamp-3 text-sm leading-6 text-[var(--color-on-surface-variant)]">
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
