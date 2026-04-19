import {
  getDentistNameMap,
  getServiceNameMap,
} from "@/features/bookings/lookups";
import {
  getPatientInfoMapForStaff,
  getPatientsForStaff,
} from "@/features/patients/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

import type {
  DashboardActivityItem,
  DashboardFollowUpItem,
  DashboardRecentTreatmentItem,
  DashboardScheduleItem,
  StaffDashboardData,
} from "./types";

type AppointmentRow = Pick<
  Database["public"]["Tables"]["appointments"]["Row"],
  | "id"
  | "patient_id"
  | "patient_name"
  | "dentist_id"
  | "service_id"
  | "start_at"
  | "status"
  | "created_at"
>;

type BookingRequestRow = Pick<
  Database["public"]["Tables"]["booking_requests"]["Row"],
  | "id"
  | "patient_name"
  | "service_id"
  | "preferred_dentist_id"
  | "status"
  | "created_at"
>;

type TreatmentRow = Pick<
  Database["public"]["Tables"]["treatments"]["Row"],
  | "id"
  | "patient_id"
  | "dentist_id"
  | "service_id"
  | "treatment_name"
  | "status"
  | "performed_at"
  | "follow_up_date"
  | "created_at"
>;

function getDayBounds() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return {
    nowIso: now.toISOString(),
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}

function buildActivityDescription(
  kind: DashboardActivityItem["kind"],
  item: {
    dentistName?: string | null;
    serviceName?: string | null;
    status: string;
  },
) {
  const subject = [item.serviceName, item.dentistName]
    .filter(Boolean)
    .join(" · ");
  if (kind === "appointment") {
    return subject || `Appointment ${item.status}`;
  }
  if (kind === "booking_request") {
    return subject || `Booking request ${item.status}`;
  }
  return subject || `Treatment ${item.status}`;
}

export async function getStaffDashboardData(): Promise<StaffDashboardData> {
  const supabase = createAdminClient();
  const { nowIso, startIso, endIso } = getDayBounds();

  const [
    patients,
    { count: totalTreatments },
    { count: pendingRequests },
    { count: upcomingAppointmentsCount },
    { data: todayAppointments },
    { data: recentAppointments },
    { data: recentBookingRequests },
    { data: recentTreatments },
    { data: upcomingFollowUpRows },
  ] = await Promise.all([
    getPatientsForStaff(),
    supabase.from("treatments").select("id", { count: "exact", head: true }),
    supabase
      .from("booking_requests")
      .select("id", { count: "exact", head: true })
      .in("status", ["new", "contacted"]),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .in("status", ["scheduled", "confirmed"])
      .gte("start_at", nowIso),
    supabase
      .from("appointments")
      .select(
        "id, patient_id, patient_name, dentist_id, service_id, start_at, status, created_at",
      )
      .gte("start_at", startIso)
      .lte("start_at", endIso)
      .order("start_at", { ascending: true })
      .limit(8),
    supabase
      .from("appointments")
      .select(
        "id, patient_id, patient_name, dentist_id, service_id, start_at, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("booking_requests")
      .select(
        "id, patient_name, service_id, preferred_dentist_id, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("treatments")
      .select(
        "id, patient_id, dentist_id, service_id, treatment_name, status, performed_at, follow_up_date, created_at",
      )
      .order("performed_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("treatments")
      .select(
        "id, patient_id, dentist_id, service_id, treatment_name, status, performed_at, follow_up_date, created_at",
      )
      .gte("follow_up_date", startIso.slice(0, 10))
      .order("follow_up_date", { ascending: true })
      .limit(6),
  ]);

  const appointmentRows = (todayAppointments ?? []) as AppointmentRow[];
  const recentAppointmentRows = (recentAppointments ?? []) as AppointmentRow[];
  const bookingRequestRows = (recentBookingRequests ??
    []) as BookingRequestRow[];
  const recentTreatmentRows = (recentTreatments ?? []) as TreatmentRow[];
  const followUpRows = (upcomingFollowUpRows ?? []) as TreatmentRow[];

  const appointmentPatientIds = [
    ...appointmentRows.map((row) => row.patient_id),
    ...recentAppointmentRows.map((row) => row.patient_id),
    ...recentTreatmentRows.map((row) => row.patient_id),
    ...followUpRows.map((row) => row.patient_id),
  ].filter((value): value is string => Boolean(value));

  const serviceIds = [
    ...appointmentRows.map((row) => row.service_id),
    ...recentAppointmentRows.map((row) => row.service_id),
    ...recentTreatmentRows.map((row) => row.service_id),
    ...followUpRows.map((row) => row.service_id),
    ...bookingRequestRows.map((row) => row.service_id),
  ].filter((value): value is string => Boolean(value));

  const dentistIds = [
    ...appointmentRows.map((row) => row.dentist_id),
    ...recentAppointmentRows.map((row) => row.dentist_id),
    ...recentTreatmentRows.map((row) => row.dentist_id),
    ...followUpRows.map((row) => row.dentist_id),
    ...bookingRequestRows
      .map((row) => row.preferred_dentist_id)
      .filter((value): value is string => Boolean(value)),
  ];

  const [patientMap, serviceMap, dentistMap] = await Promise.all([
    getPatientInfoMapForStaff(Array.from(new Set(appointmentPatientIds))),
    getServiceNameMap(Array.from(new Set(serviceIds))),
    getDentistNameMap(Array.from(new Set(dentistIds))),
  ]);

  const todaySchedule: DashboardScheduleItem[] = appointmentRows.map((row) => ({
    id: row.id,
    patientName:
      (row.patient_id ? patientMap.get(row.patient_id)?.name : null) ??
      row.patient_name ??
      "Unknown patient",
    dentistName: dentistMap.get(row.dentist_id) ?? "Clinic dentist",
    serviceName: row.service_id
      ? (serviceMap.get(row.service_id) ?? null)
      : null,
    startAt: row.start_at,
    status: row.status,
  }));

  const recentTreatmentItems: DashboardRecentTreatmentItem[] =
    recentTreatmentRows.map((row) => ({
      id: row.id,
      patientName: patientMap.get(row.patient_id)?.name ?? "Unknown patient",
      treatmentName: row.treatment_name,
      dentistName: dentistMap.get(row.dentist_id) ?? "Clinic dentist",
      serviceName: row.service_id
        ? (serviceMap.get(row.service_id) ?? null)
        : null,
      status: row.status,
      performedAt: row.performed_at,
      followUpDate: row.follow_up_date,
    }));

  const upcomingFollowUps: DashboardFollowUpItem[] = followUpRows.map(
    (row) => ({
      id: row.id,
      patientName: patientMap.get(row.patient_id)?.name ?? "Unknown patient",
      treatmentName: row.treatment_name,
      followUpDate: row.follow_up_date ?? "",
      dentistName: dentistMap.get(row.dentist_id) ?? "Clinic dentist",
    }),
  );

  const recentActivity: DashboardActivityItem[] = [
    ...recentAppointmentRows.map((row) => ({
      id: `appointment:${row.id}`,
      kind: "appointment" as const,
      title: `${(row.patient_id ? patientMap.get(row.patient_id)?.name : null) ?? row.patient_name ?? "Unknown patient"} appointment`,
      description: buildActivityDescription("appointment", {
        dentistName: dentistMap.get(row.dentist_id) ?? null,
        serviceName: row.service_id
          ? (serviceMap.get(row.service_id) ?? null)
          : null,
        status: row.status,
      }),
      occurredAt: row.created_at,
      status: row.status,
    })),
    ...bookingRequestRows.map((row) => ({
      id: `booking_request:${row.id}`,
      kind: "booking_request" as const,
      title: `${row.patient_name} booking request`,
      description: buildActivityDescription("booking_request", {
        dentistName: row.preferred_dentist_id
          ? (dentistMap.get(row.preferred_dentist_id) ?? null)
          : null,
        serviceName: row.service_id
          ? (serviceMap.get(row.service_id) ?? null)
          : null,
        status: row.status,
      }),
      occurredAt: row.created_at,
      status: row.status,
    })),
    ...recentTreatmentRows.map((row) => ({
      id: `treatment:${row.id}`,
      kind: "treatment" as const,
      title: `${patientMap.get(row.patient_id)?.name ?? "Unknown patient"} treatment`,
      description: buildActivityDescription("treatment", {
        dentistName: dentistMap.get(row.dentist_id) ?? null,
        serviceName: row.service_id
          ? (serviceMap.get(row.service_id) ?? null)
          : null,
        status: row.status,
      }),
      occurredAt: row.performed_at ?? row.created_at,
      status: row.status,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    )
    .slice(0, 8);

  return {
    metrics: [
      {
        label: "Patients",
        value: patients.length,
        helper: "Known patient records in the registry",
      },
      {
        label: "Upcoming appointments",
        value: upcomingAppointmentsCount ?? 0,
        helper: "Scheduled or confirmed from now onward",
      },
      {
        label: "Pending requests",
        value: pendingRequests ?? 0,
        helper: "Booking requests still awaiting closure",
      },
      {
        label: "Treatments",
        value: totalTreatments ?? 0,
        helper: "Clinical records tracked in the system",
      },
    ],
    todaySchedule,
    recentTreatments: recentTreatmentItems,
    upcomingFollowUps,
    recentActivity,
  };
}
