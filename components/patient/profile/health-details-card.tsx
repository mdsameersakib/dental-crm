import type { PatientPortalProfileFormData } from "@/features/patient-portal/types";

const genderOptions = [
  { value: "", label: "Select gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

const bloodTypeOptions = [
  { value: "", label: "Select blood type" },
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
] as const;

type HealthDetailsCardProps = {
  profile: PatientPortalProfileFormData;
};

export function HealthDetailsCard({ profile }: HealthDetailsCardProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          Health Details
        </p>
        <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
          Medical information
        </h2>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <label
            htmlFor="date_of_birth"
            className="text-sm font-semibold text-slate-700"
          >
            Date of Birth
          </label>
          <input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            defaultValue={profile.dateOfBirth}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
          />
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="gender"
            className="text-sm font-semibold text-slate-700"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            defaultValue={profile.gender}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
          >
            {genderOptions.map((option) => (
              <option key={option.value || "empty"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="blood_type"
            className="text-sm font-semibold text-slate-700"
          >
            Blood Type
          </label>
          <select
            id="blood_type"
            name="blood_type"
            defaultValue={profile.bloodType}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
          >
            {bloodTypeOptions.map((option) => (
              <option key={option.value || "empty"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <div className="grid gap-2">
          <label
            htmlFor="allergies"
            className="text-sm font-semibold text-slate-700"
          >
            Allergies
          </label>
          <textarea
            id="allergies"
            name="allergies"
            rows={5}
            defaultValue={profile.allergiesText}
            placeholder="One allergy per line"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500"
          />
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="current_medications"
            className="text-sm font-semibold text-slate-700"
          >
            Current Medications
          </label>
          <textarea
            id="current_medications"
            name="current_medications"
            rows={5}
            defaultValue={profile.currentMedicationsText}
            placeholder="One medication per line"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <label
            htmlFor="emergency_contact_name"
            className="text-sm font-semibold text-slate-700"
          >
            Emergency Contact Name
          </label>
          <input
            id="emergency_contact_name"
            name="emergency_contact_name"
            defaultValue={profile.emergencyContactName}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
          />
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="emergency_contact_phone"
            className="text-sm font-semibold text-slate-700"
          >
            Emergency Contact Phone
          </label>
          <input
            id="emergency_contact_phone"
            name="emergency_contact_phone"
            type="tel"
            defaultValue={profile.emergencyContactPhone}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
          />
        </div>
      </div>
    </section>
  );
}
