import Link from "next/link";

import { FlashBanner } from "@/components/staff/flash-banner";
import {
  getAppointmentPrefillForTreatment,
  getServiceDefaultsForTreatment,
  getTreatmentFormOptions,
  toTreatmentFormValue,
} from "@/features/treatments/admin";
import { toDateTimeInputValue } from "@/features/treatments/presentation";

import { TreatmentForm } from "../treatment-form";

export const dynamic = "force-dynamic";

type StaffNewTreatmentPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
    patient_id?: string;
    appointment_id?: string;
    service_id?: string;
  }>;
};

export default async function StaffNewTreatmentPage({
  searchParams,
}: StaffNewTreatmentPageProps) {
  const params = await searchParams;
  const patientId = (params.patient_id ?? "").trim();
  const appointmentId = (params.appointment_id ?? "").trim();
  const explicitServiceId = (params.service_id ?? "").trim();

  const appointment = appointmentId
    ? await getAppointmentPrefillForTreatment(appointmentId)
    : null;
  const resolvedPatientId = appointment?.patient_id ?? patientId;
  const resolvedServiceId = appointment?.service_id ?? explicitServiceId;
  const serviceDefaults = resolvedServiceId
    ? await getServiceDefaultsForTreatment(resolvedServiceId)
    : null;
  const options = await getTreatmentFormOptions({
    patientId: resolvedPatientId || undefined,
    appointmentId: appointmentId || undefined,
  });

  const value = await toTreatmentFormValue({
    patientId: resolvedPatientId || "",
    appointmentId: appointmentId || "",
    dentistId: appointment?.dentist_id ?? "",
    serviceId: resolvedServiceId || "",
    treatmentName: serviceDefaults?.name ?? "",
    aftercareInstructions: serviceDefaults?.recommended_aftercare ?? "",
    performedAt: appointment?.start_at
      ? toDateTimeInputValue(appointment.start_at)
      : "",
  });

  return (
    <section className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Clinical workflow
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-slate-900">
            New Treatment
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Start a treatment record from scratch or prefill it from an existing
            patient visit.
          </p>
        </div>
        <Link
          href="/staff/treatments"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
        >
          Back to treatments
        </Link>
      </div>

      <FlashBanner error={params.error} success={params.success} />

      <TreatmentForm
        mode="create"
        value={value}
        options={options}
        redirectTo="/staff/treatments/new"
      />
    </section>
  );
}
