import { PatientPageHeader } from "@/components/patient/patient-page-header";
import { ContactDetailsCard } from "@/components/patient/profile/contact-details-card";
import { HealthDetailsCard } from "@/components/patient/profile/health-details-card";
import { FlashBanner } from "@/components/staff/flash-banner";
import { getPatientProfileFormData } from "@/features/patient-portal/queries";
import { requirePatientProfile } from "@/lib/auth/session";

import { savePatientProfile } from "./actions";

type PatientProfilePageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function PatientProfilePage({
  searchParams,
}: PatientProfilePageProps) {
  const patient = await requirePatientProfile("/patient/profile");
  const params = await searchParams;
  const profile = await getPatientProfileFormData(
    patient.id,
    patient.patientProfileId,
  );

  return (
    <section className="space-y-8">
      <PatientPageHeader
        eyebrow="Profile"
        title="My Profile"
        description="Keep your contact information updated so the clinic can reach you about upcoming visits."
      />

      <FlashBanner error={params.error} success={params.success} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <form action={savePatientProfile} className="space-y-6">
          <ContactDetailsCard profile={profile} />
          <HealthDetailsCard profile={profile} />
          <button
            type="submit"
            className="rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(0,101,101,0.18)]"
          >
            Save Changes
          </button>
        </form>

        <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Account Note
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
            Email-linked access
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Your patient portal is linked to the email used in clinic booking
            and appointment records. If the clinic needs to change that email,
            staff should update it centrally first.
          </p>
        </aside>
      </div>
    </section>
  );
}
