import { createManualAppointment } from "@/app/(staff)/staff/appointments/actions";
import type { ManualAppointmentDraft } from "@/features/bookings/manual-appointment";
import type { AppointmentStatus } from "@/features/bookings/types";
import type { StaffDentistProfile } from "@/features/dentists/admin";
import type {
  StaffPatientDetail,
  StaffPatientSummary,
} from "@/features/patients/types";
import type { StaffService } from "@/features/services/admin";

type ManualAppointmentFormProps = {
  draft: ManualAppointmentDraft;
  patientResults: StaffPatientSummary[];
  selectedPatient: StaffPatientDetail | null;
  services: StaffService[];
  dentists: StaffDentistProfile[];
};

const statusOptions: Array<{
  value: AppointmentStatus;
  label: string;
}> = [
  { value: "scheduled", label: "Scheduled" },
  { value: "confirmed", label: "Confirmed" },
];

const dayLabelMap: Record<string, string> = {
  mon: "M",
  tue: "T",
  wed: "W",
  thu: "T",
  fri: "F",
  sat: "S",
  sun: "S",
};

function buildDentistAvailabilitySummary(dentist: StaffDentistProfile) {
  const availableDays = dentist.schedules.filter((entry) => entry.isAvailable);
  if (availableDays.length === 0) {
    return "No published availability";
  }

  return availableDays
    .map(
      (entry) =>
        `${dayLabelMap[entry.day] ?? "?"} ${entry.startTime.slice(0, 5)}-${entry.endTime.slice(0, 5)}`,
    )
    .join(" · ");
}

export function ManualAppointmentForm({
  draft,
  patientResults,
  selectedPatient,
  services,
  dentists,
}: ManualAppointmentFormProps) {
  const hasPatientSearch = draft.patientQuery.trim().length > 0;
  const visiblePatients =
    selectedPatient &&
    !patientResults.some(
      (patient) => patient.registryKey === selectedPatient.registryKey,
    )
      ? [
          {
            registryKey: selectedPatient.registryKey,
            patientProfileId: selectedPatient.patientProfileId,
            profileId: selectedPatient.profileId,
            name: selectedPatient.name,
            email: selectedPatient.email,
            phone: selectedPatient.phone,
            hasAccount: selectedPatient.hasAccount,
            accountLabel: selectedPatient.accountLabel,
            appointmentCount: selectedPatient.appointmentCount,
            treatmentCount: selectedPatient.treatmentCount,
            lastVisitAt: selectedPatient.lastVisitAt,
          },
          ...patientResults,
        ]
      : patientResults;
  const selectedDentist = dentists.find(
    (entry) => entry.id === draft.dentistId,
  );

  return (
    <form
      action={createManualAppointment}
      className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]"
    >
      <input type="hidden" name="patient_query" value={draft.patientQuery} />

      <section className="space-y-5 rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              Patient
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
              Choose or enter patient details
            </h2>
          </div>
        </div>

        {selectedPatient ? (
          <div className="rounded-[1.4rem] border border-emerald-200 bg-emerald-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Selected patient
            </p>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-lg font-semibold text-slate-900">
                  {selectedPatient.name}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedPatient.email || "No email provided"}
                </p>
                <p className="text-sm text-slate-500">
                  {selectedPatient.phone || "No phone provided"}
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
                {selectedPatient.accountLabel}
              </span>
            </div>
          </div>
        ) : null}

        <div className="space-y-3">
          {hasPatientSearch ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Matching patients
                </h3>
                <span className="text-xs uppercase tracking-[0.12em] text-slate-500">
                  {patientResults.length} shown
                </span>
              </div>

              {visiblePatients.length === 0 ? (
                <div className="rounded-[1.3rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
                  No matching patients found. You can continue below with guest
                  details.
                </div>
              ) : patientResults.length === 1 && selectedPatient ? (
                <div className="rounded-[1.3rem] border border-emerald-200 bg-emerald-50/70 px-4 py-4 text-sm text-emerald-800">
                  One matching patient was found and selected automatically.
                </div>
              ) : (
                <div className="grid gap-3">
                  <label
                    className={`cursor-pointer rounded-[1.35rem] border px-4 py-4 transition ${
                      !draft.selectedPatient
                        ? "border-[var(--color-primary)]/45 bg-cyan-50/70 shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="selected_patient"
                      value=""
                      defaultChecked={!draft.selectedPatient}
                      className="sr-only"
                    />
                    <p className="text-sm font-semibold text-slate-900">
                      Use guest details instead
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Leave the appointment unlinked for now and store it by
                      patient name and email.
                    </p>
                  </label>

                  {visiblePatients.map((patient) => {
                    const isSelected =
                      draft.selectedPatient === patient.registryKey;

                    return (
                      <label
                        key={patient.registryKey}
                        className={`cursor-pointer rounded-[1.35rem] border px-4 py-4 transition ${
                          isSelected
                            ? "border-[var(--color-primary)]/45 bg-cyan-50/70 shadow-sm"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="selected_patient"
                          value={patient.registryKey}
                          defaultChecked={isSelected}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {patient.name}
                            </p>
                            <p className="mt-1 truncate text-sm text-slate-600">
                              {patient.email || "No email provided"}
                            </p>
                            <p className="text-sm text-slate-500">
                              {patient.phone || "No phone provided"}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                              patient.hasAccount
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {patient.accountLabel}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="grid gap-3">
              <input
                type="hidden"
                name="selected_patient"
                value={draft.selectedPatient}
              />
              <div className="rounded-[1.3rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
                Search for a patient above if you want to link this appointment
                to an existing record. Otherwise continue with guest details
                below.
              </div>
            </div>
          )}
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Guest fallback
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            If you do not select an existing patient, the appointment will be
            stored using these guest details and can still be linked later by
            email.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="grid gap-2 md:col-span-2">
              <label
                htmlFor="patient_name"
                className="text-sm font-semibold text-slate-700"
              >
                Patient Name
              </label>
              <input
                id="patient_name"
                name="patient_name"
                defaultValue={draft.patientName}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="patient_email"
                className="text-sm font-semibold text-slate-700"
              >
                Patient Email
              </label>
              <input
                id="patient_email"
                name="patient_email"
                type="email"
                defaultValue={draft.patientEmail}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="patient_phone"
                className="text-sm font-semibold text-slate-700"
              >
                Patient Phone
              </label>
              <input
                id="patient_phone"
                name="patient_phone"
                defaultValue={draft.patientPhone}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="patient_gender"
                className="text-sm font-semibold text-slate-700"
              >
                Gender
              </label>
              <select
                id="patient_gender"
                name="patient_gender"
                defaultValue={draft.patientGender}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="patient_age"
                className="text-sm font-semibold text-slate-700"
              >
                Age
              </label>
              <input
                id="patient_age"
                name="patient_age"
                type="number"
                min={0}
                max={120}
                defaultValue={draft.patientAge}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Appointment
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
            Confirm scheduling details
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <label
              htmlFor="service_id"
              className="text-sm font-semibold text-slate-700"
            >
              Service
            </label>
            <select
              id="service_id"
              name="service_id"
              defaultValue={draft.serviceId}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
            >
              <option value="">Select service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="appointment_status"
              className="text-sm font-semibold text-slate-700"
            >
              Status
            </label>
            <select
              id="appointment_status"
              name="appointment_status"
              defaultValue={draft.appointmentStatus}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2 md:col-span-2">
            <label
              htmlFor="dentist_id"
              className="text-sm font-semibold text-slate-700"
            >
              Dentist
            </label>
            <select
              id="dentist_id"
              name="dentist_id"
              defaultValue={draft.dentistId}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
            >
              <option value="">Select dentist</option>
              {dentists.map((dentist) => (
                <option key={dentist.id} value={dentist.id}>
                  {`${dentist.firstName} ${dentist.lastName}`.trim() ||
                    dentist.email}
                </option>
              ))}
            </select>
            {draft.dentistId ? (
              <p className="text-sm text-slate-500">
                {selectedDentist
                  ? buildDentistAvailabilitySummary(selectedDentist)
                  : "Choose a valid dentist to review availability."}
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                Choose a dentist to review their available working days.
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="appointment_date"
              className="text-sm font-semibold text-slate-700"
            >
              Date
            </label>
            <input
              id="appointment_date"
              name="appointment_date"
              type="date"
              defaultValue={draft.appointmentDate}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="appointment_time"
              className="text-sm font-semibold text-slate-700"
            >
              Time
            </label>
            <input
              id="appointment_time"
              name="appointment_time"
              type="time"
              step={1800}
              defaultValue={draft.appointmentTime}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
            />
          </div>

          <div className="grid gap-2 md:col-span-2">
            <label
              htmlFor="duration_min"
              className="text-sm font-semibold text-slate-700"
            >
              Duration (minutes)
            </label>
            <input
              id="duration_min"
              name="duration_min"
              type="number"
              min={15}
              step={15}
              defaultValue={draft.durationMin}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
            />
          </div>

          <div className="grid gap-2 md:col-span-2">
            <label
              htmlFor="notes"
              className="text-sm font-semibold text-slate-700"
            >
              Internal Note
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={5}
              defaultValue={draft.notes}
              placeholder="Optional note for staff about this appointment"
              className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500"
            />
          </div>
        </div>

        <div className="rounded-[1.4rem] bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
          The appointment is checked against the selected dentist’s published
          schedule and existing confirmed/scheduled visits before it is created.
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
        >
          Create Appointment
        </button>
      </section>
    </form>
  );
}
