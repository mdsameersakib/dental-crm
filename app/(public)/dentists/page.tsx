import Link from "next/link";

import { getPublicDirectoryData } from "@/features/public-content/queries";

type DentistsPageProps = {
  searchParams: Promise<{
    specialty?: string;
  }>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function DentistsPage({
  searchParams,
}: DentistsPageProps) {
  const { dentists } = await getPublicDirectoryData();
  const params = await searchParams;
  const selectedSpecialty = params.specialty ?? "all";
  const specialties = Array.from(
    new Set(dentists.map((dentist) => dentist.specialty)),
  );

  const filteredDentists =
    selectedSpecialty === "all"
      ? dentists
      : dentists.filter(
          (dentist) => slugify(dentist.specialty) === selectedSpecialty,
        );

  return (
    <main className="min-h-screen pt-20">
      <section className="relative overflow-hidden bg-[var(--color-surface-container-low)]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1800&q=80"
            alt="Dental clinic interior"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(96deg,rgba(10,24,29,0.84)_0%,rgba(10,24,29,0.66)_40%,rgba(10,24,29,0.32)_100%)]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              Dentist Directory
            </p>
            <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-white md:text-5xl xl:text-6xl">
              Meet our experienced dental team.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/82 md:text-lg">
              Browse profiles, compare specialties, and request an appointment
              with the right clinician.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-[1.5rem] border border-[var(--color-outline-variant)]/30 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
            <span className="material-symbols-outlined text-base">filter_alt</span>
            Specialty
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dentists"
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                selectedSpecialty === "all"
                  ? "border-transparent bg-[var(--color-accent)] font-semibold !text-white shadow-[0_6px_16px_rgba(0,96,172,0.28)]"
                  : "border-[var(--color-outline-variant)]/40 bg-white font-medium text-[var(--color-foreground)] hover:bg-[var(--color-surface-container-low)]"
              }`}
            >
              All dentists
            </Link>
            {specialties.map((specialty) => {
              const specialtySlug = slugify(specialty);
              const isSelected = selectedSpecialty === specialtySlug;

              return (
                <Link
                  key={specialty}
                  href={`/dentists?specialty=${specialtySlug}`}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    isSelected
                      ? "border-transparent bg-[var(--color-accent)] font-semibold !text-white shadow-[0_6px_16px_rgba(0,96,172,0.28)]"
                      : "border-[var(--color-outline-variant)]/40 bg-white font-medium text-[var(--color-foreground)] hover:bg-[var(--color-surface-container-low)]"
                  }`}
                >
                  {specialty}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDentists.map((dentist) => (
            <article
              key={dentist.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_45px_rgba(10,24,29,0.08)] ring-1 ring-[rgba(189,201,200,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(10,24,29,0.14)]"
            >
              <Link
                href={`/dentists/${dentist.slug}`}
                className="absolute inset-0 z-10"
                aria-label={`View profile of ${dentist.name}`}
              />
              <div className="relative h-80 overflow-hidden">
                <img
                  alt={dentist.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  src={dentist.imageUrl}
                />
                <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(10,24,29,0)_0%,rgba(10,24,29,0.86)_100%)] p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/75">
                    {dentist.specialty}
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-white">
                    {dentist.name}
                  </h2>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                    Education
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-foreground)]">
                    {dentist.education}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                    Summary
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--color-on-surface-variant)]">
                    {dentist.shortBio}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-[var(--color-outline-variant)]/20 pt-4">
                  <span className="text-sm font-semibold text-[var(--color-on-surface-variant)]">
                    {dentist.specialty}
                  </span>
                  <Link
                    href={`/book?dentist=${dentist.slug}`}
                    className="relative z-20 inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-bold !text-white sm:text-sm"
                  >
                    Request
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
