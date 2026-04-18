import type { Database } from "@/types/database";

type AppointmentStatus = Database["public"]["Enums"]["appointment_status"];
type BookingRequestStatus =
  Database["public"]["Enums"]["booking_request_status"];
type TreatmentStatus = Database["public"]["Enums"]["treatment_status"];

export type StaffPatientSummary = {
  registryKey: string;
  patientProfileId: string | null;
  profileId: string | null;
  name: string;
  email: string;
  phone: string;
  hasAccount: boolean;
  accountLabel: string;
  appointmentCount: number;
  treatmentCount: number;
  lastVisitAt: string | null;
};

export type StaffPatientAppointmentHistoryItem = {
  id: string;
  dentistName: string;
  serviceName: string | null;
  startAt: string;
  durationMin: number;
  status: AppointmentStatus;
  source: Database["public"]["Enums"]["appointment_source"];
  notes: string | null;
};

export type StaffPatientTreatmentHistoryItem = {
  id: string;
  treatmentName: string;
  dentistName: string;
  serviceName: string | null;
  performedAt: string | null;
  status: TreatmentStatus;
  aftercareInstructions: string | null;
  followUpDate: string | null;
};

export type StaffPatientBookingRequestHistoryItem = {
  id: string;
  createdAt: string;
  serviceName: string | null;
  preferredDentistName: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  status: BookingRequestStatus;
  notes: string | null;
};

export type StaffPatientDetail = StaffPatientSummary & {
  address: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  allergies: string[];
  currentMedications: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  appointments: StaffPatientAppointmentHistoryItem[];
  treatments: StaffPatientTreatmentHistoryItem[];
  bookingRequests: StaffPatientBookingRequestHistoryItem[];
};
