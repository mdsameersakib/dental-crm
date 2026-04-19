import {
  getDentistNameMap,
  getServiceNameMap,
} from "@/features/bookings/lookups";
import { getPatientInfoMapForStaff } from "@/features/patients/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

import type { StaffWaitlistEntry, WaitlistStatus } from "./types";

type WaitlistRow = Database["public"]["Tables"]["waitlist"]["Row"];

function readPreferredRangeValue(
  value: Database["public"]["Tables"]["waitlist"]["Row"]["preferred_date_range"],
  key: "from" | "to",
) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const rawValue = (value as Record<string, unknown>)[key];
  return typeof rawValue === "string" ? rawValue : null;
}

export async function getWaitlistEntriesForStaff() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as WaitlistRow[];
  const patientIds = Array.from(new Set(rows.map((row) => row.patient_id)));
  const dentistIds = Array.from(
    new Set(
      rows
        .map((row) => row.dentist_id)
        .filter((value): value is string => Boolean(value)),
    ),
  );
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

  return rows.map(
    (row) =>
      ({
        id: row.id,
        patientId: row.patient_id,
        patientName: patientMap.get(row.patient_id)?.name ?? "Unknown patient",
        patientEmail: patientMap.get(row.patient_id)?.email ?? "",
        dentistId: row.dentist_id,
        dentistName: row.dentist_id
          ? (dentistMap.get(row.dentist_id) ?? null)
          : null,
        serviceId: row.service_id,
        serviceName: row.service_id
          ? (serviceMap.get(row.service_id) ?? null)
          : null,
        preferredFrom: readPreferredRangeValue(
          row.preferred_date_range,
          "from",
        ),
        preferredTo: readPreferredRangeValue(row.preferred_date_range, "to"),
        notes: row.notes,
        status: row.status,
        createdAt: row.created_at,
      }) satisfies StaffWaitlistEntry,
  );
}

export async function createWaitlistEntry(input: {
  patientId: string;
  dentistId: string | null;
  serviceId: string | null;
  preferredFrom: string | null;
  preferredTo: string | null;
  notes: string | null;
}) {
  const supabase = createAdminClient();
  return supabase.from("waitlist").insert({
    patient_id: input.patientId,
    dentist_id: input.dentistId,
    service_id: input.serviceId,
    preferred_date_range:
      input.preferredFrom || input.preferredTo
        ? {
            from: input.preferredFrom,
            to: input.preferredTo,
          }
        : null,
    notes: input.notes,
    status: "waiting",
  });
}

export async function updateWaitlistStatus(input: {
  id: string;
  status: WaitlistStatus;
}) {
  const supabase = createAdminClient();
  return supabase
    .from("waitlist")
    .update({
      status: input.status,
    })
    .eq("id", input.id);
}
