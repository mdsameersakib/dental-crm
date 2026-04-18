import { PatientPageHeader } from "@/components/patient/patient-page-header";
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
  const profile = await getPatientProfileFormData(patient.id);

  return (
    <section className="space-y-8">
      <PatientPageHeader
        eyebrow="Profile"
        title="My Profile"
        description="Keep your contact information updated so the clinic can reach you about upcoming visits."
      />

      <FlashBanner error={params.error} success={params.success} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <form
          action={savePatientProfile}
          className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                htmlFor="first_name"
                className="text-sm font-semibold text-slate-700"
              >
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                defaultValue={profile.firstName}
                required
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="last_name"
                className="text-sm font-semibold text-slate-700"
              >
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                defaultValue={profile.lastName}
                required
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                value={profile.email}
                readOnly
                disabled
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="phone"
                className="text-sm font-semibold text-slate-700"
              >
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={profile.phone}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
              />
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            <label
              htmlFor="address"
              className="text-sm font-semibold text-slate-700"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={4}
              defaultValue={profile.address}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            className="mt-6 rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(0,101,101,0.18)]"
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
