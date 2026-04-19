import type { Database } from "@/types/database";

export type WaitlistStatus = Database["public"]["Enums"]["waitlist_status"];

export type StaffWaitlistEntry = {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  dentistId: string | null;
  dentistName: string | null;
  serviceId: string | null;
  serviceName: string | null;
  preferredFrom: string | null;
  preferredTo: string | null;
  notes: string | null;
  status: WaitlistStatus;
  createdAt: string;
};
