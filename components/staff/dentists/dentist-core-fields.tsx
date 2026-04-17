import type {
  AvailableDentistStaff,
  StaffDentistProfile,
} from "@/features/dentists/admin";

type DentistCoreFieldsProps = {
  isEdit: boolean;
  dentist?: StaffDentistProfile;
  availableDentists: AvailableDentistStaff[];
};

export function DentistCoreFields({
  isEdit,
  dentist,
  availableDentists,
}: DentistCoreFieldsProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
        Contact & account
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>First name</span>
          <input
            name="first_name"
            defaultValue={dentist?.firstName ?? ""}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>Last name</span>
          <input
            name="last_name"
            defaultValue={dentist?.lastName ?? ""}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
          />
        </label>

        {!isEdit ? (
          <div className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
            <label htmlFor="profile_id">Dentist account</label>
            {availableDentists.length > 0 ? (
              <select
                id="profile_id"
                name="profile_id"
                defaultValue=""
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
                required
              >
                <option value="" disabled>
                  Select a dentist account
                </option>
                {availableDentists.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {`${profile.first_name} ${profile.last_name}`.trim() ||
                      profile.email}
                  </option>
                ))}
              </select>
            ) : (
              <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                No unassigned dentist staff accounts are available.
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
            <span>Account email</span>
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {dentist?.email}
            </p>
          </div>
        )}

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>License number</span>
          <input
            name="license_number"
            defaultValue={dentist?.license_number ?? ""}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>Slug</span>
          <input
            name="slug"
            defaultValue={dentist?.slug ?? ""}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>Consultation fee</span>
          <input
            name="consultation_fee"
            type="number"
            min="0"
            step="0.01"
            defaultValue={dentist?.consultation_fee ?? ""}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>Years of experience</span>
          <input
            name="years_of_experience"
            type="number"
            min="0"
            defaultValue={dentist?.years_of_experience ?? ""}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
          />
        </label>
      </div>
    </div>
  );
}
