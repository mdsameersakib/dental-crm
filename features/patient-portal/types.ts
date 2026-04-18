import type { Database } from "@/types/database";

export type PatientAppointmentStatus =
  Database["public"]["Enums"]["appointment_status"];

export type PatientAppointment = {
  id: string;
  dentistName: string;
  serviceName: string | null;
  startAt: string;
  endAt: string;
  durationMin: number;
  status: PatientAppointmentStatus;
  notes: string | null;
  cancellationReason: string | null;
  source: Database["public"]["Enums"]["appointment_source"];
};

export type PatientTreatmentSummary = {
  id: string;
  treatmentName: string;
  status: Database["public"]["Enums"]["treatment_status"];
  performedAt: string | null;
  aftercareInstructions: string | null;
  followUpDate: string | null;
  serviceName: string | null;
  dentistName: string;
};

export type PatientDashboardData = {
  upcomingAppointment: PatientAppointment | null;
  recentAppointments: PatientAppointment[];
  recentTreatments: PatientTreatmentSummary[];
};

export type PatientPortalProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
};
