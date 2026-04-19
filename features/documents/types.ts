import type { Database } from "@/types/database";

export type StaffTreatmentDocument = {
  id: string;
  treatmentId: string | null;
  patientId: string;
  documentType: Database["public"]["Enums"]["document_type"];
  fileName: string;
  fileSizeBytes: number | null;
  mimeType: string | null;
  notes: string | null;
  uploadedAt: string;
  isVisibleToPatient: boolean;
  downloadUrl: string | null;
};

export type PatientPortalDocument = {
  id: string;
  treatmentId: string | null;
  fileName: string;
  documentType: Database["public"]["Enums"]["document_type"];
  notes: string | null;
  uploadedAt: string;
  downloadUrl: string | null;
};
