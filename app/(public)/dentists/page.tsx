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
    <main className="min-h-screen pt-24">
      <header className="mx-auto max-w-7xl px-6 pt-16 pb-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
            Dentists
          </p>
          <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-[var(--color-foreground)] md:text-4xl xl:text-5xl">
            Our experienced dental team.
          </h1>
          <p className="mt-5 text-base leading-7 text-[var(--color-on-surface-variant)] md:text-lg">
            Browse dentist profiles, specialties, and appointment options.
          </p>
        </div>
      </header>

      <section className="mx-auto mb-12 max-w-7xl px-6">
        <div className="rounded-[2rem] bg-[var(--color-surface-container-low)] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dentists"
              className={`rounded-full px-4 py-2 text-sm ${
                selectedSpecialty === "all"
                  ? "bg-white font-semibold text-[var(--color-primary)]"
                  : "text-[var(--color-on-surface-variant)]"
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
                  className={`rounded-full px-4 py-2 text-sm ${
                    isSelected
                      ? "bg-white font-semibold text-[var(--color-primary)]"
                      : "text-[var(--color-on-surface-variant)]"
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
        {filteredDentists.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredDentists.map((dentist) => (
              <article
                key={dentist.id}
                className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-[rgba(189,201,200,0.2)]"
              >
                <Link href={`/dentists/${dentist.slug}`} className="block">
                  <div className="relative h-80 overflow-hidden">
                    <img
                      alt={dentist.name}
                      className="h-full w-full object-cover"
                      src={dentist.imageUrl}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(10,24,29,0)_0%,rgba(10,24,29,0.75)_100%)] p-6">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/72">
                        {dentist.specialty}
                      </p>
                      <h2 className="mt-2 font-heading text-2xl font-bold text-white">
                        {dentist.name}
                      </h2>
                    </div>
                  </div>
                </Link>

                <div className="space-y-5 p-7">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                      Education
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-foreground)]">
                      {dentist.education}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
                      Profile summary
                    </p>
                    <p className="mt-2 line-clamp-3 text-sm leading-7 text-[var(--color-on-surface-variant)]">
                      {dentist.shortBio}
                    </p>
                  </div>

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
            <h2 className="font-heading text-3xl font-bold text-[var(--color-foreground)]">
              No dentist profiles are published yet
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--color-on-surface-variant)]">
              Staff can publish dentist profiles and schedules from the CRM.
              They will automatically appear in this directory.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
