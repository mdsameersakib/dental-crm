import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getPublicDentistDetail,
  getPublicDirectoryData,
} from "@/lib/public/content";

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
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <aside className="space-y-8 lg:col-span-4 lg:sticky lg:top-28">
          <div className="relative group">
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl shadow-[rgba(0,101,101,0.08)]">
              <img
                src={dentist.imageUrl}
                alt={dentist.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="absolute right-[-0.5rem] bottom-[-0.5rem] rounded-2xl bg-white p-4 shadow-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                Experience
              </p>
              <p className="font-heading text-xl font-extrabold text-[var(--color-primary)]">
                {dentist.yearsOfExperience}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <Link
              href="/dentists"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] transition-colors hover:text-[var(--color-primary)]"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to dentists
            </Link>

            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-[var(--color-foreground)]">
              {dentist.name}
            </h1>
            <p className="font-medium tracking-wide text-[var(--color-accent)]">
              {dentist.specialty}
            </p>

            <div className="flex flex-wrap gap-2">
              {dentist.specialties.slice(0, 3).map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-full bg-[var(--color-surface-container-low)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)]"
                >
                  {specialty}
                </span>
              ))}
            </div>

            <div className="rounded-[2rem] bg-[var(--color-surface-container-low)] p-6">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
                <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">
                  Consultation fee
                </span>
                <span className="font-heading text-lg font-bold text-[var(--color-primary)]">
                  {dentist.consultationFee}
                </span>
              </div>
              <div className="flex items-center justify-between pt-4">
                <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">
                  Availability
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    dentist.isAcceptingPatients
                      ? "bg-[var(--color-primary-fixed)] text-[var(--color-primary)]"
                      : "bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]"
                  }`}
                >
                  {dentist.isAcceptingPatients ? "Accepting patients" : "Limited intake"}
                </span>
              </div>

              <Link
                href={`/book?dentist=${dentist.slug}`}
                className="hero-gradient mt-6 flex w-full items-center justify-center rounded-xl px-6 py-4 font-heading text-lg font-bold text-white shadow-xl shadow-[rgba(0,101,101,0.18)] transition-all hover:-translate-y-0.5"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </aside>

        <div className="space-y-16 lg:col-span-8">
          <section className="space-y-6">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
              Clinical Philosophy
            </h2>
            <p className="text-lg leading-relaxed font-light text-[var(--color-on-surface-variant)]">
              {dentist.bio}
            </p>
          </section>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <section className="rounded-[2rem] bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-[var(--color-accent)]">
                  school
                </span>
                <h3 className="font-heading text-xl font-bold">Academic Journey</h3>
              </div>

              <div className="space-y-5 border-l-2 border-[var(--color-surface-container-high)] pl-6">
                {dentist.educationItems.map((item, index) => (
                  <div key={item} className="relative">
                    <div
                      className={`absolute top-1.5 left-[-31px] h-3 w-3 rounded-full border-2 border-white ${
                        index === 0
                          ? "bg-[var(--color-accent)]"
                          : "bg-[var(--color-outline-variant,#bdc9c8)]"
                      }`}
                    />
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
                      Credential {index + 1}
                    </p>
                    <p className="font-semibold text-[var(--color-foreground)]">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#8b4823]">
                  workspace_premium
                </span>
                <h3 className="font-heading text-xl font-bold">Specialized Services</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {dentist.specialties.map((specialty) => (
                  <div
                    key={specialty}
                    className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface-container-low)] px-5 py-3"
                  >
                    <span className="material-symbols-outlined text-[var(--color-primary)]">
                      dentistry
                    </span>
                    <span className="text-sm font-medium">{specialty}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-bold tracking-tight text-[var(--color-foreground)]">
                Weekly Availability
              </h3>
              <Link
                href={`/book?dentist=${dentist.slug}`}
                className="text-sm font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]"
              >
                Request a time
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {dentist.availability.map((entry) => (
                <div
                  key={entry.day}
                  className={`rounded-2xl p-5 ${
                    entry.isAvailable
                      ? "bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed-variant)]"
                      : "bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] opacity-70"
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest">
                    {entry.day.slice(0, 3)}
                  </p>
                  <p className="mt-3 text-sm font-semibold">{entry.label}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {relatedDentists.length > 0 ? (
        <section className="mt-24 space-y-10">
          <div className="flex items-end justify-between border-b border-[var(--color-surface-container-high)] pb-8">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
                Meet More Clinicians
              </h2>
              <p className="mt-2 font-light text-[var(--color-on-surface-variant)]">
                Explore more specialists from our clinical atelier.
              </p>
            </div>
            <Link
              href="/dentists"
              className="flex items-center gap-2 text-sm font-bold text-[var(--color-primary)]"
            >
              View all dentists
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {relatedDentists.map((entry) => (
              <article
                key={entry.id}
                className="overflow-hidden rounded-[2rem] bg-[var(--color-surface-container-low)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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
                    <h3 className="font-heading text-xl font-bold text-[var(--color-foreground)]">
                      {entry.name}
                    </h3>
                    <p className="text-sm font-medium text-[var(--color-accent)]">
                      {entry.specialty}
                    </p>
                  </div>
                  <p className="line-clamp-3 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
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
