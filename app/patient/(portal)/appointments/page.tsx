import { PatientPageHeader } from "@/components/patient/patient-page-header";
import {
  formatAppointmentDateTime,
  getAppointmentStatusLabel,
} from "@/features/bookings/presentation";
import { getPatientAppointmentsData } from "@/features/patient-portal/queries";
import { requirePatientProfile } from "@/lib/auth/session";

function AppointmentCard({
  appointment,
}: {
  appointment: Awaited<
    ReturnType<typeof getPatientAppointmentsData>
  >["upcoming"][number];
}) {
  return (
    <article className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-slate-900">
            {appointment.serviceName ?? "General consultation"}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {appointment.dentistName}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
          {getAppointmentStatusLabel(appointment.status)}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 rounded-[1.3rem] bg-slate-50 p-4 text-sm text-slate-700 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Date & Time
          </dt>
          <dd className="mt-1 font-semibold text-slate-900">
            {formatAppointmentDateTime(appointment.startAt)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Duration
          </dt>
          <dd className="mt-1 font-semibold text-slate-900">
            {appointment.durationMin} min
          </dd>
        </div>
      </dl>

      {appointment.notes ? (
        <p className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
          {appointment.notes}
        </p>
      ) : null}

      {appointment.cancellationReason ? (
        <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {appointment.cancellationReason}
        </p>
      ) : null}
    </article>
  );
}

export default async function PatientAppointmentsPage() {
  const profile = await requirePatientProfile("/patient/appointments");
  const appointments = await getPatientAppointmentsData(
    profile.patientProfileId,
  );

  return (
    <section className="space-y-8">
      <PatientPageHeader
        eyebrow="Appointments"
        title="My Appointments"
        description="Review your confirmed and previous appointments in one place."
      />

      <div className="grid gap-8 xl:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-2xl font-bold text-slate-900">
              Upcoming
            </h2>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
              {appointments.upcoming.length} visit
              {appointments.upcoming.length === 1 ? "" : "s"}
            </span>
          </div>

          {appointments.upcoming.length === 0 ? (
            <div className="rounded-[1.8rem] border border-dashed border-slate-200 bg-white px-6 py-10 text-sm text-slate-600 shadow-sm">
              Your next confirmed appointment will appear here.
            </div>
          ) : (
            appointments.upcoming.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-2xl font-bold text-slate-900">
              History
            </h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
              {appointments.history.length} record
              {appointments.history.length === 1 ? "" : "s"}
            </span>
          </div>

          {appointments.history.length === 0 ? (
            <div className="rounded-[1.8rem] border border-dashed border-slate-200 bg-white px-6 py-10 text-sm text-slate-600 shadow-sm">
              Past visits will be listed once you have completed appointments.
            </div>
          ) : (
            appointments.history.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
