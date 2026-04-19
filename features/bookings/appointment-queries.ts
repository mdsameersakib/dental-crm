import { getPatientInfoMapForStaff } from "@/features/patients/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

import { getDentistNameMap, getServiceNameMap } from "./lookups";
import type {
  StaffActiveAppointmentSlot,
  StaffAppointment,
  StaffAppointmentFilters,
} from "./types";

type AppointmentRow = Database["public"]["Tables"]["appointments"]["Row"];

export async function getAppointmentsForStaff(
  filters: StaffAppointmentFilters = {},
) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("appointments")
    .select(
      "id, patient_id, patient_email, patient_name, dentist_id, service_id, start_at, end_at, duration_min, status, source, notes, cancellation_reason, created_at",
    )
    .order("start_at", { ascending: true });

  const rows = (data ?? []) as AppointmentRow[];
  const patientIds = Array.from(
    new Set(
      rows
        .map((row) => row.patient_id)
        .filter((value): value is string => Boolean(value)),
    ),
  );
  const dentistIds = Array.from(new Set(rows.map((row) => row.dentist_id)));
  const serviceIds = Array.from(
    new Set(
      rows.map((row) => row.service_id).filter((value) => Boolean(value)),
    ),
  ) as string[];

  const [patientMap, dentistMap, serviceMap] = await Promise.all([
    getPatientInfoMapForStaff(patientIds),
    getDentistNameMap(dentistIds),
    getServiceNameMap(serviceIds),
  ]);

  const mapped = rows.map((row) => {
    const patient = row.patient_id ? patientMap.get(row.patient_id) : null;
    return {
      ...row,
      patientName: patient?.name ?? row.patient_name ?? "Unknown patient",
      patientEmail: patient?.email ?? row.patient_email ?? "",
      dentistName: dentistMap.get(row.dentist_id) ?? "Unknown dentist",
      serviceName: row.service_id
        ? (serviceMap.get(row.service_id) ?? null)
        : null,
    } satisfies StaffAppointment;
  });

  const status = filters.status ?? "all";
  const query = (filters.query ?? "").trim().toLowerCase();

  return mapped.filter((appointment) => {
    if (status !== "all" && appointment.status !== status) {
      return false;
    }

    if (!query) {
      return true;
    }

    return [
      appointment.patientName,
      appointment.patientEmail,
      appointment.dentistName,
      appointment.serviceName ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

export async function getActiveAppointmentSlotsForStaff() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("appointments")
    .select("dentist_id, start_at, end_at")
    .in("status", ["scheduled", "confirmed"]);

  return (data ?? []).map((entry) => ({
    dentistId: entry.dentist_id,
    startAt: entry.start_at,
    endAt: entry.end_at,
  })) as StaffActiveAppointmentSlot[];
}
