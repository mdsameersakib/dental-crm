import {
  getDentistNameMap,
  getServiceNameMap,
} from "@/features/bookings/lookups";
import { formatAppointmentDateTime } from "@/features/bookings/presentation";
import { getPatientInfoMapForStaff } from "@/features/patients/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

import type {
  StaffTreatmentFilters,
  StaffTreatmentFormValue,
  StaffTreatmentSummary,
  TreatmentAppointmentOption,
  TreatmentDentistOption,
  TreatmentFormOptions,
  TreatmentPatientOption,
  TreatmentServiceOption,
} from "./types";

type TreatmentRow = Database["public"]["Tables"]["treatments"]["Row"];
type AppointmentRow = Pick<
  Database["public"]["Tables"]["appointments"]["Row"],
  | "id"
  | "patient_id"
  | "patient_name"
  | "patient_email"
  | "dentist_id"
  | "service_id"
  | "start_at"
  | "status"
>;

function buildPatientName(firstName: string | null, lastName: string | null) {
  return `${firstName ?? ""} ${lastName ?? ""}`.trim() || "Unnamed patient";
}

function buildDentistName(firstName: string | null, lastName: string | null) {
  return `${firstName ?? ""} ${lastName ?? ""}`.trim() || "Unnamed dentist";
}

function normalizeText(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function mapTreatmentRows(
  rows: TreatmentRow[],
  patientMap: Map<string, { name: string; email: string }>,
  dentistMap: Map<string, string>,
  serviceMap: Map<string, string>,
) {
  return rows.map(
    (row) =>
      ({
        id: row.id,
        patientId: row.patient_id,
        patientName: patientMap.get(row.patient_id)?.name ?? "Unknown patient",
        patientEmail: patientMap.get(row.patient_id)?.email ?? "",
        dentistId: row.dentist_id,
        dentistName: dentistMap.get(row.dentist_id) ?? "Clinic dentist",
        serviceId: row.service_id,
        serviceName: row.service_id
          ? (serviceMap.get(row.service_id) ?? null)
          : null,
        appointmentId: row.appointment_id,
        treatmentName: row.treatment_name,
        treatmentCode: row.treatment_code,
        toothNumber: row.tooth_number,
        description: row.description,
        status: row.status,
        statusNotes: row.status_notes,
        cost: row.cost,
        aftercareInstructions: row.aftercare_instructions,
        followUpDate: row.follow_up_date,
        performedAt: row.performed_at,
      }) satisfies StaffTreatmentSummary,
  );
}

export async function getTreatmentsForStaff(
  filters: StaffTreatmentFilters = {},
) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("treatments")
    .select(
      "id, appointment_id, patient_id, dentist_id, service_id, treatment_name, treatment_code, tooth_number, description, status, status_notes, cost, aftercare_instructions, follow_up_date, performed_at, created_at, updated_at",
    )
    .order("performed_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as TreatmentRow[];
  const patientIds = Array.from(new Set(rows.map((row) => row.patient_id)));
  const dentistIds = Array.from(new Set(rows.map((row) => row.dentist_id)));
  const serviceIds = Array.from(
    new Set(
      rows
        .map((row) => row.service_id)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const [patientMap, dentistMap, serviceMap] = await Promise.all([
    getPatientInfoMapForStaff(patientIds),
    getDentistNameMap(dentistIds),
    getServiceNameMap(serviceIds),
  ]);

  const mapped = mapTreatmentRows(rows, patientMap, dentistMap, serviceMap);
  const query = normalizeText(filters.query);
  const status = filters.status ?? "all";

  return mapped.filter((treatment) => {
    if (status !== "all" && treatment.status !== status) {
      return false;
    }

    if (!query) {
      return true;
    }

    return [
      treatment.patientName,
      treatment.patientEmail,
      treatment.dentistName,
      treatment.serviceName ?? "",
      treatment.treatmentName,
      treatment.treatmentCode ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

export async function getTreatmentForStaff(treatmentId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("treatments")
    .select(
      "id, appointment_id, patient_id, dentist_id, service_id, treatment_name, treatment_code, tooth_number, description, status, status_notes, cost, aftercare_instructions, follow_up_date, performed_at, created_at, updated_at",
    )
    .eq("id", treatmentId)
    .maybeSingle();

  if (!data) {
    return null;
  }

  const row = data as TreatmentRow;
  const [patientMap, dentistMap, serviceMap] = await Promise.all([
    getPatientInfoMapForStaff([row.patient_id]),
    getDentistNameMap([row.dentist_id]),
    getServiceNameMap(row.service_id ? [row.service_id] : []),
  ]);

  return mapTreatmentRows([row], patientMap, dentistMap, serviceMap)[0] ?? null;
}

export async function getTreatmentFormOptions(
  input: { patientId?: string; appointmentId?: string } = {},
): Promise<TreatmentFormOptions> {
  const supabase = createAdminClient();
  const [{ data: patientRows }, { data: dentistRows }, { data: serviceRows }] =
    await Promise.all([
      supabase
        .from("patient_profiles")
        .select(
          "id, profiles!patient_profiles_profile_id_fkey(first_name, last_name, email)",
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("dentist_profiles")
        .select(
          "id, profiles!dentist_profiles_profile_id_fkey(first_name, last_name)",
        )
        .order("created_at", { ascending: true }),
      supabase
        .from("services")
        .select("id, name, recommended_aftercare")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

  let appointmentsQuery = supabase
    .from("appointments")
    .select(
      "id, patient_id, patient_name, patient_email, dentist_id, service_id, start_at, status",
    )
    .order("start_at", { ascending: false })
    .limit(20);

  if (input.patientId) {
    appointmentsQuery = appointmentsQuery.eq("patient_id", input.patientId);
  } else if (input.appointmentId) {
    appointmentsQuery = appointmentsQuery.eq("id", input.appointmentId);
  } else {
    appointmentsQuery = appointmentsQuery.in("status", [
      "scheduled",
      "confirmed",
      "completed",
    ]);
  }

  const { data: appointmentRowsData } = await appointmentsQuery;
  const appointmentRows = (appointmentRowsData ?? []) as AppointmentRow[];
  const dentistMap = await getDentistNameMap(
    Array.from(new Set(appointmentRows.map((row) => row.dentist_id))),
  );
  const serviceMap = await getServiceNameMap(
    Array.from(
      new Set(
        appointmentRows
          .map((row) => row.service_id)
          .filter((value): value is string => Boolean(value)),
      ),
    ),
  );

  return {
    patients: (patientRows ?? []).map((row) => {
      const profile = Array.isArray(row.profiles)
        ? row.profiles[0]
        : row.profiles;
      return {
        id: row.id,
        name: buildPatientName(
          profile?.first_name ?? null,
          profile?.last_name ?? null,
        ),
        email: profile?.email ?? "",
      } satisfies TreatmentPatientOption;
    }),
    dentists: (dentistRows ?? []).map((row) => {
      const profile = Array.isArray(row.profiles)
        ? row.profiles[0]
        : row.profiles;
      return {
        id: row.id,
        name: buildDentistName(
          profile?.first_name ?? null,
          profile?.last_name ?? null,
        ),
      } satisfies TreatmentDentistOption;
    }),
    services: (serviceRows ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      recommendedAftercare: row.recommended_aftercare ?? "",
    })) satisfies TreatmentServiceOption[],
    appointments: appointmentRows.map((row) => {
      const serviceName = row.service_id
        ? (serviceMap.get(row.service_id) ?? null)
        : null;
      return {
        id: row.id,
        label: `${serviceName || "Appointment"} · ${formatAppointmentDateTime(
          row.start_at,
        )} · ${dentistMap.get(row.dentist_id) ?? "Clinic dentist"}`,
        patientId: row.patient_id ?? "",
        dentistId: row.dentist_id,
        serviceId: row.service_id,
        startAt: row.start_at,
      } satisfies TreatmentAppointmentOption;
    }),
  };
}

export async function getAppointmentPrefillForTreatment(appointmentId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("appointments")
    .select(
      "id, patient_id, dentist_id, service_id, start_at, status, patient_name, patient_email",
    )
    .eq("id", appointmentId)
    .maybeSingle();

  return (data as AppointmentRow | null) ?? null;
}

export async function getServiceDefaultsForTreatment(serviceId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("services")
    .select("name, recommended_aftercare")
    .eq("id", serviceId)
    .maybeSingle();

  return data;
}

export async function toTreatmentFormValue(input: {
  treatment?: StaffTreatmentSummary | null;
  patientId?: string;
  appointmentId?: string;
  dentistId?: string;
  serviceId?: string;
  treatmentName?: string;
  aftercareInstructions?: string;
  performedAt?: string | null;
}) {
  return {
    id: input.treatment?.id ?? "",
    patientId: input.treatment?.patientId ?? input.patientId ?? "",
    appointmentId: input.treatment?.appointmentId ?? input.appointmentId ?? "",
    serviceId: input.treatment?.serviceId ?? input.serviceId ?? "",
    dentistId: input.treatment?.dentistId ?? input.dentistId ?? "",
    treatmentName: input.treatment?.treatmentName ?? input.treatmentName ?? "",
    treatmentCode: input.treatment?.treatmentCode ?? "",
    toothNumber:
      input.treatment?.toothNumber === null ||
      input.treatment?.toothNumber === undefined
        ? ""
        : String(input.treatment.toothNumber),
    description: input.treatment?.description ?? "",
    status: input.treatment?.status ?? "planned",
    statusNotes: input.treatment?.statusNotes ?? "",
    cost:
      input.treatment?.cost === null || input.treatment?.cost === undefined
        ? ""
        : String(input.treatment.cost),
    aftercareInstructions:
      input.treatment?.aftercareInstructions ??
      input.aftercareInstructions ??
      "",
    followUpDate: input.treatment?.followUpDate ?? "",
    performedAt: input.performedAt ?? input.treatment?.performedAt ?? "",
  } satisfies StaffTreatmentFormValue;
}
