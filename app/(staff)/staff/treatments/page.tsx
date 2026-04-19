import Link from "next/link";

import { FlashBanner } from "@/components/staff/flash-banner";
import { StaffTreatmentCard } from "@/components/staff/treatments/staff-treatment-card";
import { getTreatmentsForStaff } from "@/features/treatments/admin";
import {
  buildTreatmentDetailHref,
  treatmentStatusOptions,
} from "@/features/treatments/presentation";
import type { TreatmentStatus } from "@/features/treatments/types";

export const dynamic = "force-dynamic";

type StaffTreatmentsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
    q?: string;
    status?: string;
  }>;
};

export default async function StaffTreatmentsPage({
  searchParams,
}: StaffTreatmentsPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const selectedStatus = treatmentStatusOptions.some(
    (entry) => entry.value === params.status,
  )
    ? ((params.status ?? "all") as TreatmentStatus | "all")
    : "all";
  const treatments = await getTreatmentsForStaff({
    query,
    status: selectedStatus,
  });

  return (
    <section className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Clinical workflow
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-slate-900">
            Treatments
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Track treatment progress, patient aftercare, and follow-up planning
            from one clinical record list.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
            {treatments.length} treatment{treatments.length === 1 ? "" : "s"}
          </div>
          <Link
            href="/staff/treatments/new"
            className="rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
          >
            New Treatment
          </Link>
        </div>
      </div>

      <FlashBanner error={params.error} success={params.success} />

      <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px_auto]">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search patient, dentist, service, or treatment"
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:bg-white focus:outline-none"
        />
        <select
          name="status"
          defaultValue={selectedStatus}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
        >
          {treatmentStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Apply Filters
        </button>
      </form>

      {treatments.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white px-8 py-14 text-center shadow-sm">
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            No treatments found
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Completed procedures, in-progress work, and planned follow-ups will
            appear here once treatment records are created.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(320px,380px))]">
          {treatments.map((treatment) => (
            <StaffTreatmentCard
              key={treatment.id}
              treatment={treatment}
              href={buildTreatmentDetailHref(
                treatment.id,
                query,
                selectedStatus,
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
