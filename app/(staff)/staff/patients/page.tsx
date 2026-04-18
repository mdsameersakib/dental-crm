import { FlashBanner } from "@/components/staff/flash-banner";
import { StaffPatientCard } from "@/components/staff/patients/staff-patient-card";
import { StaffPatientDetailPanel } from "@/components/staff/patients/staff-patient-detail-panel";
import {
  getPatientDetailForStaff,
  getPatientsForStaff,
} from "@/features/patients/admin";

export const dynamic = "force-dynamic";

type StaffPatientsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
    q?: string;
    patient?: string;
    edit?: string;
  }>;
};

function buildPatientsHref(query: string, patient?: string, edit?: string) {
  const params = new URLSearchParams();
  if (query) {
    params.set("q", query);
  }
  if (patient) {
    params.set("patient", patient);
  }
  if (edit) {
    params.set("edit", edit);
  }

  const queryString = params.toString();
  return queryString ? `/staff/patients?${queryString}` : "/staff/patients";
}

export default async function StaffPatientsPage({
  searchParams,
}: StaffPatientsPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const isEditingContact = params.edit === "contact";
  const isEditingMedical = params.edit === "medical";
  const [patients, selectedPatient] = await Promise.all([
    getPatientsForStaff(query),
    params.patient
      ? getPatientDetailForStaff(params.patient)
      : Promise.resolve(null),
  ]);

  return (
    <section className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Operations
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-slate-900">
            Patients
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Review patient contact details, medical profile information, and
            visit history from one staff registry.
          </p>
        </div>
        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
          {patients.length} patient{patients.length === 1 ? "" : "s"}
        </div>
      </div>

      <FlashBanner error={params.error} success={params.success} />

      <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_auto]">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search patient name, email, or phone"
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:bg-white focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Search
        </button>
      </form>

      {patients.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white px-8 py-14 text-center shadow-sm">
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            No patients found
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Patients will appear here when they submit a booking request, get an
            appointment, or create a patient account.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {patients.map((patient) => (
            <StaffPatientCard
              key={patient.registryKey}
              patient={patient}
              href={buildPatientsHref(query, patient.registryKey)}
            />
          ))}
        </div>
      )}

      {selectedPatient ? (
        <StaffPatientDetailPanel
          patient={selectedPatient}
          closeHref={buildPatientsHref(query)}
          editContactHref={buildPatientsHref(
            query,
            selectedPatient.registryKey,
            "contact",
          )}
          viewContactHref={buildPatientsHref(
            query,
            selectedPatient.registryKey,
          )}
          editMedicalHref={buildPatientsHref(
            query,
            selectedPatient.registryKey,
            "medical",
          )}
          viewMedicalHref={buildPatientsHref(
            query,
            selectedPatient.registryKey,
          )}
          query={query}
          isEditingContact={isEditingContact}
          isEditingMedical={isEditingMedical}
        />
      ) : null}
    </section>
  );
}
