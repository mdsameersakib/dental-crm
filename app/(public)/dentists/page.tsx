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
      <header className="mx-auto max-w-7xl px-6 pt-16 pb-12 text-center">
        <h1 className="font-heading text-5xl font-extrabold tracking-tight text-[var(--color-foreground)] md:text-6xl">
          The Hands Behind Your{" "}
          <span className="bg-[linear-gradient(135deg,#006565_0%,#008080_100%)] bg-clip-text text-transparent">
            Radiant Smile
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-on-surface-variant)]">
          Meet our collective of dedicated specialists, combining clinical
          mastery with an atelier approach to oral health and aesthetics.
        </p>
      </header>

      <section className="mx-auto mb-16 max-w-7xl px-6">
        <div className="flex items-center justify-between gap-4 overflow-x-auto rounded-full bg-[var(--color-surface-container-low)] px-4 py-2 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <Link
              href="/dentists"
              className={`rounded-full px-6 py-2 text-sm ${
                selectedSpecialty === "all"
                  ? "bg-[var(--color-surface-container-lowest)] font-semibold text-[var(--color-primary)] shadow-sm"
                  : "text-[var(--color-on-surface-variant)] transition-all hover:bg-[var(--color-surface-container-high)]"
              }`}
            >
              All Specialists
            </Link>
            {specialties.map((specialty) => {
              const specialtySlug = slugify(specialty);
              const isSelected = selectedSpecialty === specialtySlug;

              return (
                <Link
                  key={specialty}
                  href={`/dentists?specialty=${specialtySlug}`}
                  className={`rounded-full px-6 py-2 text-sm transition-all ${
                    isSelected
                      ? "bg-[var(--color-surface-container-lowest)] font-semibold text-[var(--color-primary)] shadow-sm"
                      : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]"
                  }`}
                >
                  {specialty}
                </Link>
              );
            })}
          </div>
          <Link
            href="/book"
            className="rounded-xl bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold !text-white"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        {filteredDentists.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredDentists.map((dentist) => (
              <article
                key={dentist.id}
                className="group overflow-hidden rounded-xl bg-[var(--color-surface-container-low)] transition-all duration-500 hover:-translate-y-1"
              >
                <Link href={`/dentists/${dentist.slug}`} className="block">
                  <div className="relative h-80 overflow-hidden">
                    <img
                      alt={dentist.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={dentist.imageUrl}
                    />
                    <div className="absolute bottom-4 left-4">
                      <span className="rounded-full bg-[rgba(255,255,255,0.9)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] backdrop-blur-md">
                        {dentist.specialty}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="p-6">
                  <Link href={`/dentists/${dentist.slug}`} className="block">
                    <h3 className="mb-1 font-heading text-xl font-bold text-[var(--color-foreground)] transition-colors hover:text-[var(--color-primary)]">
                      {dentist.name}
                    </h3>
                  </Link>
                  <p className="mb-4 text-xs font-medium text-[var(--color-accent)]">
                    {dentist.education}
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-lg text-[#6e7979]">
                        history_edu
                      </span>
                      <div>
                        <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wider text-[#6e7979]">
                          Education
                        </p>
                        <p className="text-sm text-[var(--color-on-surface-variant)]">
                          {dentist.education}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-lg text-[#6e7979]">
                        clinical_notes
                      </span>
                      <div>
                        <p className="mb-0.5 text-[11px] font-bold uppercase tracking-wider text-[#6e7979]">
                          Bio
                        </p>
                        <p className="line-clamp-3 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                          {dentist.shortBio}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 grid gap-3">
                    <Link
                      href={`/dentists/${dentist.slug}`}
                      className="block w-full rounded-xl border border-[var(--color-primary)] py-3 text-center font-bold text-[var(--color-primary)] transition-all duration-300 hover:bg-[var(--color-primary)] hover:text-white"
                    >
                      View Profile
                    </Link>
                    <Link
                      href={`/book?dentist=${dentist.slug}`}
                      className="block w-full rounded-xl bg-[var(--color-primary)] py-3 text-center font-bold !text-white transition-all duration-300 hover:bg-[var(--color-primary-container)]"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl bg-[var(--color-surface-container-low)] p-8 text-center text-[var(--color-on-surface-variant)]">
            Dentists placeholder. Add published dentist profiles when you are
            ready to build this section.
          </div>
        )}
      </section>
    </main>
  );
}
