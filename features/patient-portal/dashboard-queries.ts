import {
  getDentistNameMap,
  getServiceNameMap,
} from "@/features/bookings/lookups";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

import { getPatientAppointmentsData } from "./appointment-queries";
import type { PatientDashboardData, PatientTreatmentSummary } from "./types";

type TreatmentRow = Pick<
  Database["public"]["Tables"]["treatments"]["Row"],
  | "id"
  | "treatment_name"
  | "status"
  | "performed_at"
  | "aftercare_instructions"
  | "follow_up_date"
  | "service_id"
  | "dentist_id"
>;

async function getRecentTreatments(
  patientProfileId: string,
): Promise<PatientTreatmentSummary[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("treatments")
    .select(
      "id, treatment_name, status, performed_at, aftercare_instructions, follow_up_date, service_id, dentist_id",
    )
    .eq("patient_id", patientProfileId)
    .order("performed_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(3);

  const rows = (data ?? []) as TreatmentRow[];
  const dentistIds = Array.from(new Set(rows.map((row) => row.dentist_id)));
  const serviceIds = Array.from(
    new Set(
      rows
        .map((row) => row.service_id)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const [dentistMap, serviceMap] = await Promise.all([
    getDentistNameMap(dentistIds),
    getServiceNameMap(serviceIds),
  ]);

  return rows.map((row) => ({
    id: row.id,
    treatmentName: row.treatment_name,
    status: row.status,
    performedAt: row.performed_at,
    aftercareInstructions: row.aftercare_instructions,
    followUpDate: row.follow_up_date,
    serviceName: row.service_id
      ? (serviceMap.get(row.service_id) ?? null)
      : null,
    dentistName: dentistMap.get(row.dentist_id) ?? "Clinic dentist",
  }));
}

export async function getPatientDashboardData(
  patientProfileId: string,
): Promise<PatientDashboardData> {
  const [{ upcoming, history }, recentTreatments] = await Promise.all([
    getPatientAppointmentsData(patientProfileId),
    getRecentTreatments(patientProfileId),
  ]);

  return {
    upcomingAppointment: upcoming[0] ?? null,
    recentAppointments: history.slice(0, 3),
    recentTreatments,
  };
}
