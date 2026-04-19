import type { Database } from "@/types/database";

type AppointmentStatus = Database["public"]["Enums"]["appointment_status"];
type BookingRequestStatus =
  Database["public"]["Enums"]["booking_request_status"];
type TreatmentStatus = Database["public"]["Enums"]["treatment_status"];

export type DashboardMetric = {
  label: string;
  value: number;
  helper: string;
};

export type DashboardScheduleItem = {
  id: string;
  patientName: string;
  dentistName: string;
  serviceName: string | null;
  startAt: string;
  status: AppointmentStatus;
};

export type DashboardRecentTreatmentItem = {
  id: string;
  patientName: string;
  treatmentName: string;
  dentistName: string;
  serviceName: string | null;
  status: TreatmentStatus;
  performedAt: string | null;
  followUpDate: string | null;
};

export type DashboardFollowUpItem = {
  id: string;
  patientName: string;
  treatmentName: string;
  followUpDate: string;
  dentistName: string;
};

export type DashboardActivityItem = {
  id: string;
  kind: "appointment" | "booking_request" | "treatment";
  title: string;
  description: string;
  occurredAt: string;
  status: AppointmentStatus | BookingRequestStatus | TreatmentStatus;
};

export type StaffDashboardData = {
  metrics: DashboardMetric[];
  todaySchedule: DashboardScheduleItem[];
  recentTreatments: DashboardRecentTreatmentItem[];
  upcomingFollowUps: DashboardFollowUpItem[];
  recentActivity: DashboardActivityItem[];
};
