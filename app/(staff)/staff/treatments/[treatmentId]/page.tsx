import { notFound } from "next/navigation";

import { FlashBanner } from "@/components/staff/flash-banner";
import { TreatmentDocumentsCard } from "@/components/staff/treatments/treatment-documents-card";
import { getTreatmentDocumentsForStaff } from "@/features/documents/admin";
import {
  getTreatmentFormOptions,
  getTreatmentForStaff,
  toTreatmentFormValue,
} from "@/features/treatments/admin";
import {
  buildTreatmentsHref,
  toDateTimeInputValue,
  treatmentStatusOptions,
} from "@/features/treatments/presentation";

import { TreatmentForm } from "../treatment-form";

export const dynamic = "force-dynamic";

type StaffTreatmentDetailPageProps = {
  params: Promise<{ treatmentId: string }>;
  searchParams: Promise<{
    error?: string;
    success?: string;
    q?: string;
    status?: string;
  }>;
};

export default async function StaffTreatmentDetailPage({
  params,
  searchParams,
}: StaffTreatmentDetailPageProps) {
  const [{ treatmentId }, queryParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const [treatment, documents] = await Promise.all([
    getTreatmentForStaff(treatmentId),
    getTreatmentDocumentsForStaff(treatmentId),
  ]);

  if (!treatment) {
    notFound();
  }

  const query = (queryParams.q ?? "").trim();
  const status = treatmentStatusOptions.some(
    (entry) => entry.value === queryParams.status,
  )
    ? ((queryParams.status ?? "all").trim() as
        | "all"
        | "planned"
        | "in_progress"
        | "completed")
    : "all";
  const options = await getTreatmentFormOptions({
    patientId: treatment.patientId,
    appointmentId: treatment.appointmentId ?? undefined,
  });
  const value = await toTreatmentFormValue({
    treatment,
    performedAt: toDateTimeInputValue(treatment.performedAt),
  });

  return (
    <section className="space-y-7">
      <FlashBanner error={queryParams.error} success={queryParams.success} />
      <TreatmentForm
        mode="edit"
        value={value}
        options={options}
        treatment={treatment}
        followUpHref={`/staff/appointments/new?patient_profile_id=${treatment.patientId}&dentist_id=${treatment.dentistId}${treatment.serviceId ? `&service_id=${treatment.serviceId}` : ""}${treatment.followUpDate ? `&date=${treatment.followUpDate}` : ""}&notes=${encodeURIComponent(`Follow-up from treatment: ${treatment.treatmentName}`)}`}
        redirectTo={buildTreatmentsHref(query, status)}
      />
      <TreatmentDocumentsCard treatment={treatment} documents={documents} />
    </section>
  );
}
