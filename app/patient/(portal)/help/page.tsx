import { PatientHelpAssistant } from "@/components/patient/help/patient-help-assistant";
import { PatientPageHeader } from "@/components/patient/patient-page-header";
import { requirePatientProfile } from "@/lib/auth/session";

import { askPatientHelpAssistant } from "./actions";

export default async function PatientHelpPage() {
  await requirePatientProfile("/patient/help");

  return (
    <section className="space-y-8">
      <PatientPageHeader
        eyebrow="Patient Support"
        title="Clinic Assistant"
        description="Ask about services, dentist suggestions, clinic contact details, follow-up guidance, and aftercare from your own recent records."
      />

      <PatientHelpAssistant action={askPatientHelpAssistant} />
    </section>
  );
}
