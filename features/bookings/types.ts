import type { Database } from "@/types/database";

type BookingRequestRow =
  Database["public"]["Tables"]["booking_requests"]["Row"];
type AppointmentRow = Database["public"]["Tables"]["appointments"]["Row"];

export type BookingRequestStatus =
  Database["public"]["Enums"]["booking_request_status"];
export type AppointmentStatus =
  Database["public"]["Enums"]["appointment_status"];

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
