import Link from "next/link";
import { StaffDentistCard } from "@/components/staff/dentists/staff-dentist-card";
import { FlashBanner } from "@/components/staff/flash-banner";
import { getDentistsForStaff } from "@/features/dentists/admin";

type StaffDentistsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function StaffDentistsPage({
  searchParams,
}: StaffDentistsPageProps) {
  const [params, dentists] = await Promise.all([
    searchParams,
    getDentistsForStaff(),
  ]);

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Content Management
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-slate-900">
            Dentists
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Manage dentist profiles shown on the public website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
            {dentists.length} profile{dentists.length === 1 ? "" : "s"}
          </div>
          <Link
            href="/staff/dentists/new"
            className="rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white"
          >
            Add Dentist
          </Link>
        </div>
      </div>

      <FlashBanner error={params.error} success={params.success} />

      {dentists.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white px-8 py-14 text-center shadow-sm">
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            No dentist profiles yet
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Start by adding a dentist profile. You can edit all profile and
            schedule details from the dedicated dentist page.
          </p>
          <Link
            href="/staff/dentists/new"
            className="mt-6 inline-flex rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white"
          >
            Add Dentist
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dentists.map((dentist) => (
            <StaffDentistCard key={dentist.id} dentist={dentist} />
          ))}
        </div>
      )}
    </section>
  );
}
