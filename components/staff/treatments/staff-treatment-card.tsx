import Link from "next/link";
import {
  formatAppointmentDateTime,
  formatBookingDate,
} from "@/features/bookings/presentation";
import {
  getTreatmentStatusLabel,
  treatmentStatusColorMap,
} from "@/features/treatments/presentation";
import type { StaffTreatmentSummary } from "@/features/treatments/types";

type StaffTreatmentCardProps = {
  treatment: StaffTreatmentSummary;
  href: string;
  followUpHref?: string;
};

export function StaffTreatmentCard({
  treatment,
  href,
  followUpHref,
}: StaffTreatmentCardProps) {
  return (
    <article className="flex h-full flex-col rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-lg font-semibold text-slate-900">
            {treatment.treatmentName}
          </p>
          <p className="mt-1 truncate text-sm text-slate-600">
            {treatment.patientName}
          </p>
          <p className="truncate text-sm text-slate-500">
            {treatment.patientEmail || "No patient email"}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${treatmentStatusColorMap[treatment.status]}`}
        >
          {getTreatmentStatusLabel(treatment.status)}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Dentist
          </dt>
          <dd className="mt-1 font-medium text-slate-900">
            {treatment.dentistName}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Service
          </dt>
          <dd className="mt-1 font-medium text-slate-900">
            {treatment.serviceName || "Custom treatment"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Performed
          </dt>
          <dd className="mt-1 font-medium text-slate-900">
            {treatment.performedAt
              ? formatAppointmentDateTime(treatment.performedAt)
              : "Not completed yet"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Follow-up
          </dt>
          <dd className="mt-1 font-medium text-slate-900">
            {treatment.followUpDate
              ? formatBookingDate(treatment.followUpDate)
              : "Not set"}
          </dd>
        </div>
      </dl>

      {treatment.aftercareInstructions ? (
        <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
          {treatment.aftercareInstructions}
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-4 pt-4">
        <Link
          href={href}
          className="inline-flex rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Edit treatment
        </Link>
        {followUpHref ? (
          <Link
            href={followUpHref}
            className="text-sm font-semibold text-slate-700"
          >
            Schedule follow-up
          </Link>
        ) : null}
      </div>
    </article>
  );
}
