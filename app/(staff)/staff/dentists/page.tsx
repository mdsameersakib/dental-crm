import { dentistScheduleDays, getAvailableDentistStaff, getDentistsForStaff } from "@/features/dentists/admin";

import { saveDentistProfile, saveDentistSchedule } from "./actions";

type StaffDentistsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

function toEducationText(education: unknown) {
  if (!Array.isArray(education)) {
    return "";
  }

  return education
    .filter((entry): entry is string => typeof entry === "string")
    .join("\n");
}

export default async function StaffDentistsPage({
  searchParams,
}: StaffDentistsPageProps) {
  const [params, dentists, availableDentists] = await Promise.all([
    searchParams,
    getDentistsForStaff(),
    getAvailableDentistStaff(),
  ]);

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Content Management
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-slate-900">
            Dentists
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Manage dentist bios, public publishing state, consultation details, and weekly availability. New dentist profiles can only be created for existing staff dentist accounts.
          </p>
        </div>
        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
          {dentists.length} profile{dentists.length === 1 ? "" : "s"}
        </div>
      </div>

      {params.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {params.error}
        </div>
      ) : null}

      {params.success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {params.success}
        </div>
      ) : null}

      <form action={saveDentistProfile} className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <input type="hidden" name="id" value="" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              New dentist profile
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
              Create a dentist profile
            </h2>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
            disabled={availableDentists.length === 0}
          >
            Create
          </button>
        </div>

        {availableDentists.length === 0 ? (
          <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            No unassigned dentist staff accounts are available. Create the staff account first, then return here to add the public dentist profile.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              <span>Dentist account</span>
              <select
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
                    {`${profile.first_name} ${profile.last_name}`.trim() || profile.email}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              <span>License number</span>
              <input
                name="license_number"
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              <span>Slug</span>
              <input
                name="slug"
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              <span>Specializations</span>
              <input
                name="specializations"
                placeholder="Cosmetic Dentistry, Implants"
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
              />
            </label>
          </div>
        )}
      </form>

      <div className="grid gap-8">
        {dentists.map((dentist) => {
          const displayName = `${dentist.firstName} ${dentist.lastName}`.trim() || dentist.email;

          return (
            <article key={dentist.id} className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm xl:grid-cols-[1.15fr_0.85fr]">
              <form action={saveDentistProfile} className="grid gap-4">
                <input type="hidden" name="id" value={dentist.id} />
                <input type="hidden" name="profile_id" value={dentist.profile_id} />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                      Dentist profile
                    </p>
                    <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
                      {displayName}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">{dentist.email}</p>
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Save profile
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    <span>License number</span>
                    <input
                      name="license_number"
                      defaultValue={dentist.license_number}
                      className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
                      required
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    <span>Slug</span>
                    <input
                      name="slug"
                      defaultValue={dentist.slug ?? ""}
                      className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    <span>Specializations</span>
                    <input
                      name="specializations"
                      defaultValue={dentist.specializations.join(", ")}
                      className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    <span>Education</span>
                    <textarea
                      name="education"
                      defaultValue={toEducationText(dentist.education)}
                      rows={3}
                      className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    <span>Years of experience</span>
                    <input
                      name="years_of_experience"
                      type="number"
                      min="0"
                      defaultValue={dentist.years_of_experience ?? ""}
                      className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    <span>Consultation fee</span>
                    <input
                      name="consultation_fee"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={dentist.consultation_fee ?? ""}
                      className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    <span>Display order</span>
                    <input
                      name="display_order"
                      type="number"
                      defaultValue={dentist.display_order}
                      className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
                    />
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Photo path or URL</span>
                  <input
                    name="profile_photo_path"
                    defaultValue={dentist.profile_photo_path ?? ""}
                    className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Short bio</span>
                  <textarea
                    name="short_bio"
                    defaultValue={dentist.short_bio ?? ""}
                    rows={3}
                    className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  <span>Full bio</span>
                  <textarea
                    name="bio"
                    defaultValue={dentist.bio ?? ""}
                    rows={5}
                    className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
                  />
                </label>

                <div className="flex flex-wrap gap-4 text-sm text-slate-700">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_accepting_patients"
                      defaultChecked={dentist.is_accepting_patients}
                    />
                    Accepting patients
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_published"
                      defaultChecked={dentist.is_published}
                    />
                    Published
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_featured"
                      defaultChecked={dentist.is_featured}
                    />
                    Featured
                  </label>
                </div>
              </form>

              <form action={saveDentistSchedule} className="grid gap-4 rounded-[1.5rem] bg-slate-50 p-5">
                <input type="hidden" name="dentist_id" value={dentist.id} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                    Weekly availability
                  </p>
                  <h3 className="mt-2 font-heading text-xl font-bold text-slate-900">
                    Schedule
                  </h3>
                </div>

                {dentistScheduleDays.map((day) => {
                  const schedule = dentist.schedules.find((entry) => entry.day === day.value);

                  return (
                    <div key={day.value} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-900">{day.label}</p>
                        <label className="flex items-center gap-2 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            name={`is_available_${day.value}`}
                            defaultChecked={schedule?.isAvailable ?? false}
                          />
                          Available
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="grid gap-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                          <span>Start</span>
                          <input
                            type="time"
                            name={`start_time_${day.value}`}
                            defaultValue={schedule?.startTime ?? ""}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                          />
                        </label>
                        <label className="grid gap-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                          <span>End</span>
                          <input
                            type="time"
                            name={`end_time_${day.value}`}
                            defaultValue={schedule?.endTime ?? ""}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                >
                  Save schedule
                </button>
              </form>
            </article>
          );
        })}
      </div>
    </section>
  );
}
