import Link from "next/link";

import type { StaffPatientSummary } from "@/features/patients/types";

type StaffPatientCardProps = {
  patient: StaffPatientSummary;
  href: string;
};

export function StaffPatientCard({ patient, href }: StaffPatientCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)]/30 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-slate-900">
            {patient.name}
          </p>
          <p className="mt-1 truncate text-sm text-slate-600">
            {patient.email}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
            patient.hasAccount
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {patient.accountLabel}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-700">
        <p>{patient.phone || "No phone provided"}</p>
        <p className="text-slate-500">
          {patient.appointmentCount} appointment
          {patient.appointmentCount === 1 ? "" : "s"} · {patient.treatmentCount}{" "}
          treatment{patient.treatmentCount === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-500">
          {patient.lastVisitAt ? "Record active" : "No visits yet"}
        </span>
        <span className="font-semibold text-[var(--color-primary)]">
          View details
        </span>
      </div>
    </Link>
  );
}
