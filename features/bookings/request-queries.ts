import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

import { getDentistNameMap, getServiceNameMap } from "./lookups";
import type { StaffBookingRequest, StaffBookingRequestFilters } from "./types";

type BookingRequestRow =
  Database["public"]["Tables"]["booking_requests"]["Row"];

export async function getBookingRequestsForStaff(
  filters: StaffBookingRequestFilters = {},
) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("booking_requests")
    .select(
      "id, patient_name, email, phone, preferred_date, preferred_time, notes, status, created_at, updated_at, service_id, preferred_dentist_id",
    )
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as BookingRequestRow[];
  const serviceIds = Array.from(
    new Set(
      rows.map((row) => row.service_id).filter((value) => Boolean(value)),
    ),
  ) as string[];
  const dentistIds = Array.from(
    new Set(
      rows
        .map((row) => row.preferred_dentist_id)
        .filter((value) => Boolean(value)),
    ),
  ) as string[];

  const [serviceMap, dentistMap] = await Promise.all([
    getServiceNameMap(serviceIds),
    getDentistNameMap(dentistIds),
  ]);

  const mapped = rows.map((row) => ({
    ...row,
    serviceName: row.service_id
      ? (serviceMap.get(row.service_id) ?? null)
      : null,
    preferredDentistName: row.preferred_dentist_id
      ? (dentistMap.get(row.preferred_dentist_id) ?? null)
      : null,
  })) as StaffBookingRequest[];

  const status = filters.status ?? "all";
  const query = (filters.query ?? "").trim().toLowerCase();

  return mapped.filter((request) => {
    if (status !== "all" && request.status !== status) {
      return false;
    }

    if (!query) {
      return true;
    }

    return [
      request.patient_name,
      request.email,
      request.phone ?? "",
      request.serviceName ?? "",
      request.preferredDentistName ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

export async function getBookingRequestForStaff(requestId: string) {
  const results = await getBookingRequestsForStaff();
  return results.find((request) => request.id === requestId) ?? null;
}
