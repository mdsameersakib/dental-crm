import Link from "next/link";
import { ManualAppointmentForm } from "@/components/staff/appointments/manual-appointment-form";
import { FlashBanner } from "@/components/staff/flash-banner";
import type { ManualAppointmentDraft } from "@/features/bookings/manual-appointment";
import { getDentistsForStaff } from "@/features/dentists/admin";
import {
  getPatientDetailForStaff,
  getPatientsForStaff,
} from "@/features/patients/admin";
import { getServicesForStaff } from "@/features/services/admin";

export const dynamic = "force-dynamic";

type StaffNewAppointmentPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
    q?: string;
    patient?: string;
    service_id?: string;
    dentist_id?: string;
    date?: string;
    time?: string;
    duration?: string;
    status?: string;
    patient_name?: string;
    patient_email?: string;
    patient_phone?: string;
    patient_gender?: string;
    patient_age?: string;
    notes?: string;
  }>;
};

function buildDraft(
  params: Awaited<StaffNewAppointmentPageProps["searchParams"]>,
  defaultDuration: number,
): ManualAppointmentDraft {
  return {
    patientQuery: (params.q ?? "").trim(),
    selectedPatient: (params.patient ?? "").trim(),
    serviceId: (params.service_id ?? "").trim(),
    dentistId: (params.dentist_id ?? "").trim(),
    appointmentDate: (params.date ?? "").trim(),
    appointmentTime: (params.time ?? "").trim(),
    durationMin: (params.duration ?? String(defaultDuration)).trim(),
    appointmentStatus: (params.status ?? "scheduled").trim(),
    patientName: (params.patient_name ?? "").trim(),
    patientEmail: (params.patient_email ?? "").trim(),
    patientPhone: (params.patient_phone ?? "").trim(),
    patientGender: (params.patient_gender ?? "").trim(),
    patientAge: (params.patient_age ?? "").trim(),
    notes: (params.notes ?? "").trim(),
  };
}

export default async function StaffNewAppointmentPage({
  searchParams,
}: StaffNewAppointmentPageProps) {
  const params = await searchParams;
  const patientQuery = (params.q ?? "").trim();
  const selectedPatientKeyFromParams = (params.patient ?? "").trim();

  const [services, dentists, patientResults, selectedPatient] =
    await Promise.all([
      getServicesForStaff(),
      getDentistsForStaff(),
      getPatientsForStaff(patientQuery),
      selectedPatientKeyFromParams
        ? getPatientDetailForStaff(selectedPatientKeyFromParams)
        : Promise.resolve(null),
    ]);

  const autoSelectedPatientKey =
    !selectedPatientKeyFromParams && patientQuery && patientResults.length === 1
      ? (patientResults[0]?.registryKey ?? "")
      : selectedPatientKeyFromParams;
  const resolvedSelectedPatient =
    selectedPatient ??
    (autoSelectedPatientKey &&
    autoSelectedPatientKey !== selectedPatientKeyFromParams
      ? await getPatientDetailForStaff(autoSelectedPatientKey)
      : null);

  const selectedService = services.find(
    (service) => service.id === (params.service_id ?? "").trim(),
  );
  const draft = buildDraft(params, selectedService?.duration_min ?? 30);
  if (autoSelectedPatientKey) {
    draft.selectedPatient = autoSelectedPatientKey;
  }

  return (
    <section className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Operations
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-slate-900">
            New Appointment
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Create a manual appointment by selecting an existing patient or
            using guest details, then confirm the service, dentist, and
            appointment slot.
          </p>
        </div>
        <Link
          href="/staff/appointments"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
        >
          Back to appointments
        </Link>
      </div>

      <FlashBanner error={params.error} success={params.success} />

      <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_auto]">
        <input
          type="search"
          name="q"
          defaultValue={patientQuery}
          placeholder="Search existing patient name, email, or phone"
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:bg-white focus:outline-none"
        />
        <input type="hidden" name="patient" value={draft.selectedPatient} />
        <input type="hidden" name="service_id" value={draft.serviceId} />
        <input type="hidden" name="dentist_id" value={draft.dentistId} />
        <input type="hidden" name="date" value={draft.appointmentDate} />
        <input type="hidden" name="time" value={draft.appointmentTime} />
        <input type="hidden" name="duration" value={draft.durationMin} />
        <input type="hidden" name="status" value={draft.appointmentStatus} />
        <input type="hidden" name="patient_name" value={draft.patientName} />
        <input type="hidden" name="patient_email" value={draft.patientEmail} />
        <input type="hidden" name="patient_phone" value={draft.patientPhone} />
        <input
          type="hidden"
          name="patient_gender"
          value={draft.patientGender}
        />
        <input type="hidden" name="patient_age" value={draft.patientAge} />
        <input type="hidden" name="notes" value={draft.notes} />
        <button
          type="submit"
          className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Search Patients
        </button>
      </form>

      <ManualAppointmentForm
        draft={draft}
        patientResults={patientResults.slice(0, 8)}
        selectedPatient={resolvedSelectedPatient}
        services={services}
        dentists={dentists}
      />
    </section>
  );
}
