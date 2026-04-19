import type { Database } from "@/types/database";

export type TreatmentStatus = Database["public"]["Enums"]["treatment_status"];

export type StaffTreatmentSummary = {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  dentistId: string;
  dentistName: string;
  serviceId: string | null;
  serviceName: string | null;
  appointmentId: string | null;
  treatmentName: string;
  treatmentCode: string | null;
  toothNumber: number | null;
  description: string | null;
  status: TreatmentStatus;
  statusNotes: string | null;
  cost: number | null;
  aftercareInstructions: string | null;
  followUpDate: string | null;
  performedAt: string | null;
};

export type StaffTreatmentFilters = {
  query?: string;
  status?: TreatmentStatus | "all";
};

export type TreatmentPatientOption = {
  id: string;
  name: string;
  email: string;
};

export type TreatmentDentistOption = {
  id: string;
  name: string;
};

export type TreatmentServiceOption = {
  id: string;
  name: string;
  recommendedAftercare: string;
};

export type TreatmentAppointmentOption = {
  id: string;
  label: string;
  patientId: string;
  dentistId: string;
  serviceId: string | null;
  startAt: string;
};

export type TreatmentFormOptions = {
  patients: TreatmentPatientOption[];
  dentists: TreatmentDentistOption[];
  services: TreatmentServiceOption[];
  appointments: TreatmentAppointmentOption[];
};

export type StaffTreatmentFormValue = {
  id: string;
  patientId: string;
  appointmentId: string;
  serviceId: string;
  dentistId: string;
  treatmentName: string;
  treatmentCode: string;
  toothNumber: string;
  description: string;
  status: TreatmentStatus;
  statusNotes: string;
  cost: string;
  aftercareInstructions: string;
  followUpDate: string;
  performedAt: string;
};
