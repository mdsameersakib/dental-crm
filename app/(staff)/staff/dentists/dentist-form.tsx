import Link from "next/link";

import type {
  AvailableDentistStaff,
  StaffDentistProfile,
} from "@/features/dentists/admin";
import { dentistScheduleDays } from "@/features/dentists/admin";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";

import {
  removeDentistProfilePhoto,
  saveDentistProfile,
  saveDentistSchedule,
} from "./actions";

type DentistFormProps = {
  mode: "create" | "edit";
  dentist?: StaffDentistProfile;
  availableDentists?: AvailableDentistStaff[];
};

function toEducationText(education: unknown) {
  if (!Array.isArray(education)) {
    return "";
  }

  return education
    .filter((entry): entry is string => typeof entry === "string")
    .join("\n");
}

export function DentistForm({
  mode,
  dentist,
  availableDentists = [],
}: DentistFormProps) {
  const isEdit = mode === "edit";
  const displayName = dentist
    ? `${dentist.firstName} ${dentist.lastName}`.trim() || dentist.email
    : "Add a dentist";

  return (
    <section className="space-y-6">
      <form
        action={saveDentistProfile}
        className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
      >
        <input type="hidden" name="id" value={dentist?.id ?? ""} />
        <input
          type="hidden"
          name="profile_id"
          value={isEdit ? dentist?.profile_id : ""}
        />
        <input
          type="hidden"
          name="redirect_to"
          value={
            isEdit && dentist
              ? `/staff/dentists/${dentist.id}`
              : "/staff/dentists/new"
          }
        />

        <div className="flex flex-wrap items-start justify-between gap-4 px-6 pt-6 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              {isEdit ? "Edit dentist" : "New dentist"}
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold text-slate-900">
              {displayName}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              {isEdit
                ? "Update public profile details, contact data, and publishing status."
                : "Create a dentist profile for an existing staff dentist account."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/staff/dentists"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Back
            </Link>
            <button
              type="submit"
              className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
              disabled={!isEdit && availableDentists.length === 0}
            >
              Save profile
            </button>
          </div>
        </div>

        <section className="grid gap-6 border-t border-slate-200 bg-[var(--color-surface-container-low)] px-6 py-6 lg:grid-cols-[0.88fr_1.12fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              Image
            </p>
            <div className="mt-3 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#d9efee_0%,#edf4f8_100%)]">
              {dentist?.profile_photo_path ? (
                <img
                  src={dentist.profile_photo_path}
                  alt={`${displayName} current profile`}
                  className="h-56 w-full object-cover"
                />
              ) : (
                <div className="flex h-56 items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-teal-700">
                    medical_services
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-3">
              <input
                name="profile_photo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-primary-fixed)] file:px-3 file:py-1.5 file:font-semibold file:text-[var(--color-primary)]"
              />
              {dentist?.profile_photo_path ? (
                <div>
                  <input type="hidden" name="dentist_id" value={dentist.id} />
                  <ConfirmSubmitButton
                    className="inline-flex items-center rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                    confirmMessage="Remove this profile image? This action cannot be undone."
                    label="Remove current image"
                    formAction={removeDentistProfilePhoto}
                  />
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Upload a square portrait for best card presentation.
                </p>
              )}
            </div>
          </div>

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
                <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                  <span>Dentist account</span>
                  {availableDentists.length > 0 ? (
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
                </label>
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
        </section>

        <section className="grid gap-5 border-t border-slate-200 px-6 py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              Profile details
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
              Professional information
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              <span>Specializations</span>
              <input
                name="specializations"
                defaultValue={dentist?.specializations.join(", ") ?? ""}
                placeholder="Cosmetic Dentistry, Orthodontics"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              <span>Display order</span>
              <input
                name="display_order"
                type="number"
                defaultValue={dentist?.display_order ?? 0}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
              <span>Education (one item per line)</span>
              <textarea
                name="education"
                defaultValue={toEducationText(dentist?.education)}
                rows={4}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              <span>Short bio</span>
              <textarea
                name="short_bio"
                defaultValue={dentist?.short_bio ?? ""}
                rows={4}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              <span>Full bio</span>
              <textarea
                name="bio"
                defaultValue={dentist?.bio ?? ""}
                rows={4}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
            <label className="flex items-center gap-2 rounded-lg px-2 py-1">
              <input
                type="checkbox"
                name="is_accepting_patients"
                defaultChecked={dentist?.is_accepting_patients ?? true}
              />
              Accepting patients
            </label>
            <label className="flex items-center gap-2 rounded-lg px-2 py-1">
              <input
                type="checkbox"
                name="is_published"
                defaultChecked={dentist?.is_published ?? false}
              />
              Published
            </label>
            <label className="flex items-center gap-2 rounded-lg px-2 py-1">
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={dentist?.is_featured ?? false}
              />
              Featured
            </label>
          </div>
        </section>
      </form>

      {isEdit && dentist ? (
        <form
          action={saveDentistSchedule}
          className="grid w-full gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <input type="hidden" name="dentist_id" value={dentist.id} />
          <input
            type="hidden"
            name="redirect_to"
            value={`/staff/dentists/${dentist.id}`}
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                Weekly availability
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
                Schedule
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Toggle day availability, then set start and end times.
              </p>
            </div>
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Save schedule
            </button>
          </div>

          <div className="grid gap-2.5">
            {dentistScheduleDays.map((day) => {
              const schedule = dentist.schedules.find(
                (entry) => entry.day === day.value,
              );

              return (
                <div
                  key={day.value}
                  className="grid items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 md:grid-cols-[190px_170px_1fr]"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">
                      calendar_month
                    </span>
                    <p className="text-sm font-semibold text-slate-900">{day.label}</p>
                  </div>

                  <label className="inline-flex w-full items-center justify-end md:justify-end">
                    <input
                      type="checkbox"
                      name={`is_available_${day.value}`}
                      defaultChecked={schedule?.isAvailable ?? false}
                      className="peer sr-only"
                    />
                    <span className="relative h-7 w-14 rounded-full bg-slate-300 transition-colors after:absolute after:top-[2px] after:left-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-7" />
                  </label>

                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <input
                      type="time"
                      name={`start_time_${day.value}`}
                      defaultValue={schedule?.startTime ?? ""}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none"
                    />
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      to
                    </span>
                    <input
                      type="time"
                      name={`end_time_${day.value}`}
                      defaultValue={schedule?.endTime ?? ""}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </form>
      ) : (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Weekly availability
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
            Schedule
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Save the dentist profile first, then you can configure weekly
            availability on the edit page.
          </p>
        </section>
      )}
    </section>
  );
}
