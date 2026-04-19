import Link from "next/link";
import {
  updatePatientArchiveState,
  updatePatientContactProfile,
  updatePatientMedicalProfile,
} from "@/app/(staff)/staff/patients/actions";
import {
  appointmentStatusColorMap,
  bookingRequestStatusColorMap,
  formatAppointmentDateTime,
  formatBookingDate,
  getAppointmentStatusLabel,
} from "@/features/bookings/presentation";
import type { StaffPatientDetail } from "@/features/patients/types";

type StaffPatientDetailPanelProps = {
  patient: StaffPatientDetail;
  closeHref: string;
  editContactHref: string;
  viewContactHref: string;
  editMedicalHref: string;
  viewMedicalHref: string;
  query: string;
  isEditingContact: boolean;
  isEditingMedical: boolean;
};

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

function formatLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function StaffPatientDetailPanel({
  patient,
  closeHref,
  editContactHref,
  viewContactHref,
  editMedicalHref,
  viewMedicalHref,
  query,
  isEditingContact,
  isEditingMedical,
}: StaffPatientDetailPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm md:p-6">
      <Link
        href={closeHref}
        className="absolute inset-0"
        aria-label="Close patient details"
      />
      <aside className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/60 bg-[var(--color-background)] shadow-[0_24px_90px_rgba(15,23,42,0.24)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              Patient record
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-slate-900">
              {patient.name}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {patient.email || "No email provided"}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            {patient.profileId ? (
              <form action={updatePatientArchiveState}>
                <input
                  type="hidden"
                  name="profile_id"
                  value={patient.profileId}
                />
                <input
                  type="hidden"
                  name="patient"
                  value={patient.registryKey}
                />
                <input type="hidden" name="q" value={query} />
                <input
                  type="hidden"
                  name="next_state"
                  value={patient.isArchived ? "restore" : "archive"}
                />
                <button
                  type="submit"
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    patient.isArchived
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {patient.isArchived ? "Restore Patient" : "Archive Patient"}
                </button>
              </form>
            ) : null}
            <Link
              href={closeHref}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Close
            </Link>
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-6">
          <div className="flex flex-wrap gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                patient.hasAccount
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {patient.accountLabel}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
              {patient.appointmentCount} appointments
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
              {patient.treatmentCount} treatments
            </span>
            {patient.isArchived ? (
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-rose-700">
                Archived
              </span>
            ) : null}
          </div>

          <div className="mt-6 grid gap-6 2xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-heading text-2xl font-bold text-slate-900">
                    Contact
                  </h3>
                  {patient.profileId ? (
                    isEditingContact ? (
                      <Link
                        href={viewContactHref}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                      >
                        Cancel
                      </Link>
                    ) : (
                      <Link
                        href={editContactHref}
                        className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Edit Contact
                      </Link>
                    )
                  ) : null}
                </div>

                {patient.profileId ? (
                  isEditingContact ? (
                    <form
                      action={updatePatientContactProfile}
                      className="mt-4 space-y-4"
                    >
                      <input
                        type="hidden"
                        name="profile_id"
                        value={patient.profileId}
                      />
                      <input
                        type="hidden"
                        name="patient_profile_id"
                        value={patient.patientProfileId ?? ""}
                      />
                      <input
                        type="hidden"
                        name="patient"
                        value={patient.registryKey}
                      />
                      <input type="hidden" name="q" value={query} />

                      <div className="grid gap-4 md:grid-cols-2">
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
                            defaultValue={patient.firstName}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
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
                            defaultValue={patient.lastName}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
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
                            name="email"
                            type="email"
                            defaultValue={patient.email}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
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
                            defaultValue={patient.phone}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
                          />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                          <label
                            htmlFor="address"
                            className="text-sm font-semibold text-slate-700"
                          >
                            Address
                          </label>
                          <textarea
                            id="address"
                            name="address"
                            rows={3}
                            defaultValue={patient.address}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500"
                          />
                        </div>
                      </div>

                      <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        Updating email here also updates the linked Supabase
                        Auth account so patient portal sign-in stays in sync.
                      </p>

                      <button
                        type="submit"
                        className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white"
                      >
                        Save Contact Details
                      </button>
                    </form>
                  ) : (
                    <dl className="mt-4 grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                          Name
                        </dt>
                        <dd className="mt-1 text-slate-900">
                          {patient.name || "Not provided"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                          Phone
                        </dt>
                        <dd className="mt-1 text-slate-900">
                          {patient.phone || "Not provided"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                          Email
                        </dt>
                        <dd className="mt-1 break-all text-slate-900">
                          {patient.email || "Not provided"}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                          Address
                        </dt>
                        <dd className="mt-1 text-slate-900">
                          {patient.address || "Not provided"}
                        </dd>
                      </div>
                    </dl>
                  )
                ) : (
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    Contact details for guest-only records are currently
                    read-only. Once the record is linked to a real patient
                    profile, staff can edit the saved contact information here.
                  </p>
                )}
              </section>

              <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-heading text-2xl font-bold text-slate-900">
                    Medical profile
                  </h3>
                  {patient.patientProfileId ? (
                    isEditingMedical ? (
                      <Link
                        href={viewMedicalHref}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                      >
                        Cancel
                      </Link>
                    ) : (
                      <Link
                        href={editMedicalHref}
                        className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Edit Medical Profile
                      </Link>
                    )
                  ) : null}
                </div>

                {patient.patientProfileId ? (
                  isEditingMedical ? (
                    <form
                      action={updatePatientMedicalProfile}
                      className="mt-4 space-y-4"
                    >
                      <input
                        type="hidden"
                        name="patient_profile_id"
                        value={patient.patientProfileId}
                      />
                      <input
                        type="hidden"
                        name="patient"
                        value={patient.registryKey}
                      />
                      <input type="hidden" name="q" value={query} />

                      <div className="grid gap-4 md:[grid-template-columns:repeat(2,minmax(0,1fr))]">
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
                            defaultValue={patient.dateOfBirth}
                            className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
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
                            defaultValue={patient.gender}
                            className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
                          >
                            {genderOptions.map((option) => (
                              <option
                                key={option.value || "empty-gender"}
                                value={option.value}
                              >
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
                            defaultValue={patient.bloodType}
                            className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
                          >
                            {bloodTypeOptions.map((option) => (
                              <option
                                key={option.value || "empty-blood-type"}
                                value={option.value}
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
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
                            defaultValue={patient.emergencyContactName}
                            className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
                          />
                        </div>
                        <div className="grid gap-2 sm:col-span-2">
                          <label
                            htmlFor="emergency_contact_phone"
                            className="text-sm font-semibold text-slate-700"
                          >
                            Emergency Contact Phone
                          </label>
                          <input
                            id="emergency_contact_phone"
                            name="emergency_contact_phone"
                            defaultValue={patient.emergencyContactPhone}
                            className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:[grid-template-columns:repeat(2,minmax(0,1fr))]">
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
                            defaultValue={patient.allergies.join("\n")}
                            placeholder="One allergy per line"
                            className="w-full min-w-0 resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500"
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
                            defaultValue={patient.currentMedications.join("\n")}
                            placeholder="One medication per line"
                            className="w-full min-w-0 resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white"
                      >
                        Save Medical Profile
                      </button>
                    </form>
                  ) : (
                    <dl className="mt-4 grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                          Date of birth
                        </dt>
                        <dd className="mt-1 text-slate-900">
                          {patient.dateOfBirth || "Not provided"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                          Gender
                        </dt>
                        <dd className="mt-1 text-slate-900">
                          {patient.gender
                            ? formatLabel(patient.gender)
                            : "Not provided"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                          Blood type
                        </dt>
                        <dd className="mt-1 text-slate-900">
                          {patient.bloodType || "Not provided"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                          Emergency contact
                        </dt>
                        <dd className="mt-1 text-slate-900">
                          {patient.emergencyContactName || "Not provided"}
                          {patient.emergencyContactPhone
                            ? ` · ${patient.emergencyContactPhone}`
                            : ""}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                          Allergies
                        </dt>
                        <dd className="mt-1 text-slate-900">
                          {patient.allergies.length > 0
                            ? patient.allergies.join(", ")
                            : "Not provided"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                          Medications
                        </dt>
                        <dd className="mt-1 text-slate-900">
                          {patient.currentMedications.length > 0
                            ? patient.currentMedications.join(", ")
                            : "Not provided"}
                        </dd>
                      </div>
                    </dl>
                  )
                ) : (
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    Medical details can be edited once this record is linked to
                    a patient profile. Request-only guest records do not have an
                    editable medical profile yet.
                  </p>
                )}
              </section>

              <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-heading text-2xl font-bold text-slate-900">
                  Appointments
                </h3>
                <div className="mt-4 space-y-3">
                  {patient.appointments.length === 0 ? (
                    <p className="text-sm text-slate-600">
                      No appointment history yet.
                    </p>
                  ) : (
                    patient.appointments.map((appointment) => (
                      <article
                        key={appointment.id}
                        className="rounded-2xl bg-slate-50 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {appointment.serviceName ||
                                "General consultation"}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {appointment.dentistName} ·{" "}
                              {formatAppointmentDateTime(appointment.startAt)}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${appointmentStatusColorMap[appointment.status]}`}
                          >
                            {getAppointmentStatusLabel(appointment.status)}
                          </span>
                        </div>
                        {appointment.notes ? (
                          <p className="mt-3 text-sm text-slate-600">
                            {appointment.notes}
                          </p>
                        ) : null}
                        {patient.patientProfileId ? (
                          <div className="mt-3">
                            <Link
                              href={`/staff/appointments/new?patient=${encodeURIComponent(patient.registryKey)}&notes=${encodeURIComponent("Follow-up from patient appointment history")}`}
                              className="text-sm font-semibold text-teal-700"
                            >
                              Schedule follow-up
                            </Link>
                          </div>
                        ) : null}
                      </article>
                    ))
                  )}
                </div>
              </section>

              <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-heading text-2xl font-bold text-slate-900">
                    Treatments
                  </h3>
                  {patient.patientProfileId ? (
                    <Link
                      href={`/staff/treatments/new?patient_id=${patient.patientProfileId}`}
                      className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                    >
                      New Treatment
                    </Link>
                  ) : null}
                </div>
                <div className="mt-4 space-y-3">
                  {patient.treatments.length === 0 ? (
                    <p className="text-sm text-slate-600">
                      No treatment history yet.
                    </p>
                  ) : (
                    patient.treatments.map((treatment) => (
                      <article
                        key={treatment.id}
                        className="rounded-2xl bg-slate-50 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {treatment.treatmentName}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {treatment.dentistName}
                              {treatment.performedAt
                                ? ` · ${formatAppointmentDateTime(
                                    treatment.performedAt,
                                  )}`
                                : ""}
                            </p>
                          </div>
                          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
                            {formatLabel(treatment.status)}
                          </span>
                        </div>
                        {treatment.aftercareInstructions ? (
                          <p className="mt-3 text-sm text-slate-600">
                            {treatment.aftercareInstructions}
                          </p>
                        ) : null}
                        <div className="mt-3 flex flex-wrap items-center gap-4">
                          <Link
                            href={`/staff/treatments/${treatment.id}`}
                            className="text-sm font-semibold text-teal-700"
                          >
                            Edit treatment
                          </Link>
                          {patient.patientProfileId ? (
                            <Link
                              href={`/staff/appointments/new?patient=${encodeURIComponent(patient.registryKey)}${treatment.followUpDate ? `&date=${treatment.followUpDate}` : ""}&notes=${encodeURIComponent(`Follow-up from treatment: ${treatment.treatmentName}`)}`}
                              className="text-sm font-semibold text-slate-700"
                            >
                              Schedule follow-up
                            </Link>
                          ) : null}
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-heading text-2xl font-bold text-slate-900">
                  Summary
                </h3>
                <dl className="mt-4 grid gap-4 text-sm text-slate-700">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">Last visit</dt>
                    <dd className="text-right font-medium text-slate-900">
                      {patient.lastVisitAt
                        ? formatAppointmentDateTime(patient.lastVisitAt)
                        : "No visit yet"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">Portal access</dt>
                    <dd className="font-medium text-slate-900">
                      {patient.accountLabel}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">Account state</dt>
                    <dd className="font-medium text-slate-900">
                      {patient.isArchived ? "Archived" : "Active"}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-heading text-2xl font-bold text-slate-900">
                  Booking requests
                </h3>
                <div className="mt-4 space-y-3">
                  {patient.bookingRequests.length === 0 ? (
                    <p className="text-sm text-slate-600">
                      No booking requests found.
                    </p>
                  ) : (
                    patient.bookingRequests.map((request) => (
                      <article
                        key={request.id}
                        className="rounded-2xl bg-slate-50 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {request.serviceName || "General consultation"}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {formatBookingDate(request.preferredDate)}
                              {request.preferredTime
                                ? ` · ${request.preferredTime}`
                                : ""}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${bookingRequestStatusColorMap[request.status]}`}
                          >
                            {formatLabel(request.status)}
                          </span>
                        </div>
                        {request.notes ? (
                          <p className="mt-3 text-sm text-slate-600">
                            {request.notes}
                          </p>
                        ) : null}
                      </article>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
