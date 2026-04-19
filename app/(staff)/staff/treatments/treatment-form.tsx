import Link from "next/link";
import type {
  StaffTreatmentFormValue,
  StaffTreatmentSummary,
  TreatmentFormOptions,
} from "@/features/treatments/types";
import { deleteTreatment, saveTreatment } from "./actions";

type TreatmentFormProps = {
  mode: "create" | "edit";
  value: StaffTreatmentFormValue;
  options: TreatmentFormOptions;
  treatment?: StaffTreatmentSummary | null;
  redirectTo: string;
};

export function TreatmentForm({
  mode,
  value,
  options,
  treatment,
  redirectTo,
}: TreatmentFormProps) {
  const isEdit = mode === "edit";

  return (
    <section className="space-y-6">
      <form
        action={saveTreatment}
        className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
      >
        <input type="hidden" name="id" value={value.id} />
        <input type="hidden" name="redirect_to" value={redirectTo} />

        <div className="flex flex-wrap items-start justify-between gap-4 px-4 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              {isEdit ? "Edit treatment" : "New treatment"}
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold text-slate-900">
              {isEdit ? treatment?.treatmentName : "Create treatment"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Record clinical work, patient-specific aftercare, and follow-up
              timing from one treatment record.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/staff/treatments"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Back
            </Link>
            <button
              type="submit"
              className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
            >
              Save treatment
            </button>
          </div>
        </div>

        <section className="grid gap-6 border-t border-slate-200 bg-[var(--color-surface-container-low)] px-4 py-5 sm:px-6 sm:py-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <article className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-heading text-2xl font-bold text-slate-900">
                Patient and visit
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="grid gap-2 md:col-span-2">
                  <label
                    htmlFor="patient_id"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Patient
                  </label>
                  <select
                    id="patient_id"
                    name="patient_id"
                    defaultValue={value.patientId}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-500"
                  >
                    <option value="">Select patient</option>
                    {options.patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} · {patient.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <label
                    htmlFor="appointment_id"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Linked appointment
                  </label>
                  <select
                    id="appointment_id"
                    name="appointment_id"
                    defaultValue={value.appointmentId}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-500"
                  >
                    <option value="">No linked appointment</option>
                    {options.appointments.map((appointment) => (
                      <option key={appointment.id} value={appointment.id}>
                        {appointment.label}
                      </option>
                    ))}
                  </select>
                </div>
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
                    defaultValue={value.serviceId}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-500"
                  >
                    <option value="">Custom / not linked</option>
                    {options.services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="dentist_id"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Dentist
                  </label>
                  <select
                    id="dentist_id"
                    name="dentist_id"
                    defaultValue={value.dentistId}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-500"
                  >
                    <option value="">Select dentist</option>
                    {options.dentists.map((dentist) => (
                      <option key={dentist.id} value={dentist.id}>
                        {dentist.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </article>

            <article className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-heading text-2xl font-bold text-slate-900">
                Clinical details
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="grid gap-2 md:col-span-2">
                  <label
                    htmlFor="treatment_name"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Treatment name
                  </label>
                  <input
                    id="treatment_name"
                    name="treatment_name"
                    defaultValue={value.treatmentName}
                    placeholder="Root canal therapy"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-500"
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="treatment_code"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Treatment code
                  </label>
                  <input
                    id="treatment_code"
                    name="treatment_code"
                    defaultValue={value.treatmentCode}
                    placeholder="Optional internal code"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-500"
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="tooth_number"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Tooth number
                  </label>
                  <input
                    id="tooth_number"
                    name="tooth_number"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={value.toothNumber}
                    placeholder="Optional"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-500"
                  />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <label
                    htmlFor="description"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    defaultValue={value.description}
                    placeholder="Clinical notes, treatment summary, or case details"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-500"
                  />
                </div>
              </div>
            </article>
          </div>

          <div className="space-y-6">
            <article className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-heading text-2xl font-bold text-slate-900">
                Tracking
              </h2>
              <div className="mt-4 grid gap-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="status"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={value.status}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-500"
                  >
                    <option value="planned">Planned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="status_notes"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Status notes
                  </label>
                  <textarea
                    id="status_notes"
                    name="status_notes"
                    rows={3}
                    defaultValue={value.statusNotes}
                    placeholder="Optional status context for staff"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-500"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label
                      htmlFor="cost"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Cost
                    </label>
                    <input
                      id="cost"
                      name="cost"
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={value.cost}
                      placeholder="Optional"
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="follow_up_date"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Follow-up date
                    </label>
                    <input
                      id="follow_up_date"
                      name="follow_up_date"
                      type="date"
                      defaultValue={value.followUpDate}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="performed_at"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Performed at
                  </label>
                  <input
                    id="performed_at"
                    name="performed_at"
                    type="datetime-local"
                    defaultValue={value.performedAt}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </article>

            <article className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-heading text-2xl font-bold text-slate-900">
                Aftercare
              </h2>
              <div className="mt-4 grid gap-2">
                <label
                  htmlFor="aftercare_instructions"
                  className="text-sm font-semibold text-slate-700"
                >
                  Patient-specific instructions
                </label>
                <textarea
                  id="aftercare_instructions"
                  name="aftercare_instructions"
                  rows={7}
                  defaultValue={value.aftercareInstructions}
                  placeholder="If the selected service has recommended aftercare, this field can be prefilled on save when left blank."
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-500"
                />
              </div>
            </article>
          </div>
        </section>
      </form>

      {isEdit && treatment ? (
        <form action={deleteTreatment} className="flex justify-end">
          <input type="hidden" name="id" value={treatment.id} />
          <input type="hidden" name="redirect_to" value="/staff/treatments" />
          <button
            type="submit"
            className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Delete treatment
          </button>
        </form>
      ) : null}
    </section>
  );
}
