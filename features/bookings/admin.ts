import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

type BookingRequestRow =
  Database["public"]["Tables"]["booking_requests"]["Row"];
type AppointmentRow = Database["public"]["Tables"]["appointments"]["Row"];
type BookingRequestStatus =
  Database["public"]["Enums"]["booking_request_status"];
type AppointmentStatus = Database["public"]["Enums"]["appointment_status"];

export type StaffBookingRequest = Pick<
  BookingRequestRow,
  | "id"
  | "patient_name"
  | "email"
  | "phone"
  | "preferred_date"
  | "preferred_time"
  | "notes"
  | "status"
  | "created_at"
  | "updated_at"
  | "service_id"
  | "preferred_dentist_id"
> & {
  serviceName: string | null;
  preferredDentistName: string | null;
};

export type StaffAppointment = Pick<
  AppointmentRow,
  | "id"
  | "patient_email"
  | "patient_id"
  | "patient_name"
  | "dentist_id"
  | "service_id"
  | "start_at"
  | "end_at"
  | "duration_min"
  | "status"
  | "source"
  | "notes"
  | "cancellation_reason"
  | "created_at"
> & {
  patientName: string;
  patientEmail: string;
  dentistName: string;
  serviceName: string | null;
};

export type StaffActiveAppointmentSlot = {
  dentistId: string;
  startAt: string;
  endAt: string;
};

export type StaffBookingRequestFilters = {
  status?: BookingRequestStatus | "all";
  query?: string;
};

export type StaffAppointmentFilters = {
  status?: AppointmentStatus | "all";
  query?: string;
};

function buildName(firstName: string | null, lastName: string | null) {
  return `${firstName ?? ""} ${lastName ?? ""}`.trim();
}

async function getServiceNameMap(serviceIds: string[]) {
  if (serviceIds.length === 0) {
    return new Map<string, string>();
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("services")
    .select("id, name")
    .in("id", serviceIds);

  return new Map((data ?? []).map((service) => [service.id, service.name]));
}

async function getDentistNameMap(dentistIds: string[]) {
  if (dentistIds.length === 0) {
    return new Map<string, string>();
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("dentist_profiles")
    .select(
      "id, profiles!dentist_profiles_profile_id_fkey(first_name, last_name)",
    )
    .in("id", dentistIds);

  return new Map(
    (data ?? []).map((dentist) => {
      const profile = Array.isArray(dentist.profiles)
        ? dentist.profiles[0]
        : dentist.profiles;
      const name = buildName(
        profile?.first_name ?? null,
        profile?.last_name ?? null,
      );
      return [dentist.id, name || "Unnamed dentist"];
    }),
  );
}

async function getPatientInfoMap(patientIds: string[]) {
  if (patientIds.length === 0) {
    return new Map<string, { name: string; email: string }>();
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("patient_profiles")
    .select(
      "id, profiles!patient_profiles_profile_id_fkey(first_name, last_name, email)",
    )
    .in("id", patientIds);

  return new Map(
    (data ?? []).map((patient) => {
      const profile = Array.isArray(patient.profiles)
        ? patient.profiles[0]
        : patient.profiles;
      const name = buildName(
        profile?.first_name ?? null,
        profile?.last_name ?? null,
      );
      return [
        patient.id,
        {
          name: name || "Unnamed patient",
          email: profile?.email ?? "",
        },
      ];
    }),
  );
}

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
    getPatientInfoMap(patientIds),
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
