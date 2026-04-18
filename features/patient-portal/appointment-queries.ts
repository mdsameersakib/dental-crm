import {
  getDentistNameMap,
  getServiceNameMap,
} from "@/features/bookings/lookups";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

import type { PatientAppointment } from "./types";

type AppointmentRow = Pick<
  Database["public"]["Tables"]["appointments"]["Row"],
  | "id"
  | "dentist_id"
  | "service_id"
  | "start_at"
  | "end_at"
  | "duration_min"
  | "status"
  | "notes"
  | "cancellation_reason"
  | "source"
>;

function isPastAppointment(entry: AppointmentRow) {
  return new Date(entry.end_at).getTime() < Date.now();
}

async function mapPatientAppointments(rows: AppointmentRow[]) {
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
    dentistName: dentistMap.get(row.dentist_id) ?? "Clinic dentist",
    serviceName: row.service_id
      ? (serviceMap.get(row.service_id) ?? null)
      : null,
    startAt: row.start_at,
    endAt: row.end_at,
    durationMin: row.duration_min,
    status: row.status,
    notes: row.notes,
    cancellationReason: row.cancellation_reason,
    source: row.source,
  })) satisfies PatientAppointment[];
}

export async function getPatientAppointmentsData(patientProfileId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("appointments")
    .select(
      "id, dentist_id, service_id, start_at, end_at, duration_min, status, notes, cancellation_reason, source",
    )
    .eq("patient_id", patientProfileId)
    .order("start_at", { ascending: true });

  const rows = (data ?? []) as AppointmentRow[];
  const upcomingRows = rows.filter((entry) => !isPastAppointment(entry));
  const pastRows = rows.filter((entry) => isPastAppointment(entry)).reverse();
  const [upcoming, history] = await Promise.all([
    mapPatientAppointments(upcomingRows),
    mapPatientAppointments(pastRows),
  ]);

  return {
    upcoming,
    history,
  };
}
