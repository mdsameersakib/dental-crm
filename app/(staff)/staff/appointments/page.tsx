import { FlashBanner } from "@/components/staff/flash-banner";
import { getAppointmentsForStaff } from "@/features/bookings/admin";
import {
  appointmentStatusColorMap,
  appointmentStatusOptions,
  buildAppointmentsHref,
  formatAppointmentDateTime,
} from "@/features/bookings/presentation";
import type { Database } from "@/types/database";

import { updateAppointmentStatus } from "./actions";

export const dynamic = "force-dynamic";

type AppointmentStatus = Database["public"]["Enums"]["appointment_status"];

type StaffAppointmentsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
    q?: string;
    status?: string;
  }>;
};

export default async function StaffAppointmentsPage({
  searchParams,
}: StaffAppointmentsPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const selectedStatus = appointmentStatusOptions.some(
    (entry) => entry.value === params.status,
  )
    ? (params.status as AppointmentStatus | "all")
    : "all";
  const redirectPath = buildAppointmentsHref(query, selectedStatus);
  const appointments = await getAppointmentsForStaff({
    query,
    status: selectedStatus,
  });

  return (
    <section className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Operations
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-slate-900">
            Appointments
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Manage confirmed clinic appointments and keep visit statuses updated
            from one staff view.
          </p>
        </div>
        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
          {appointments.length} appointment
          {appointments.length === 1 ? "" : "s"}
        </div>
      </div>

      <FlashBanner error={params.error} success={params.success} />

      <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px_auto]">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search patient, dentist, or service"
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:bg-white focus:outline-none"
        />
        <select
          name="status"
          defaultValue={selectedStatus}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
        >
          {appointmentStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Apply Filters
        </button>
      </form>

      {appointments.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white px-8 py-14 text-center shadow-sm">
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            No appointments found
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Converted booking requests and manual appointments will appear here.
          </p>
        </div>
      ) : (
        <div className="grid justify-center gap-4 [grid-template-columns:repeat(auto-fill,minmax(320px,380px))]">
          {appointments.map((appointment) => (
            <article
              key={appointment.id}
              className="w-full rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    {appointment.patientName}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {appointment.patientEmail || "No patient email"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${appointmentStatusColorMap[appointment.status]}`}
                >
                  {appointment.status}
                </span>
              </div>

              <dl className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    Dentist
                  </dt>
                  <dd className="mt-1 font-medium text-slate-900">
                    {appointment.dentistName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    Service
                  </dt>
                  <dd className="mt-1 font-medium text-slate-900">
                    {appointment.serviceName || "General consultation"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    Starts
                  </dt>
                  <dd className="mt-1 font-medium text-slate-900">
                    {formatAppointmentDateTime(appointment.start_at)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    Duration
                  </dt>
                  <dd className="mt-1 font-medium text-slate-900">
                    {appointment.duration_min} min
                  </dd>
                </div>
              </dl>

              <form
                action={updateAppointmentStatus}
                className="mt-4 grid gap-2"
              >
                <input
                  type="hidden"
                  name="appointment_id"
                  value={appointment.id}
                />
                <input type="hidden" name="redirect_to" value={redirectPath} />
                <div className="grid gap-2">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <select
                      name="status"
                      defaultValue={appointment.status}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
                    >
                      {appointmentStatusOptions
                        .filter((option) => option.value !== "all")
                        .map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                    </select>
                    <input
                      type="text"
                      name="cancellation_reason"
                      defaultValue={appointment.cancellation_reason ?? ""}
                      placeholder="Add a note (optional)"
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Update
                  </button>
                </div>
              </form>

              {appointment.notes ? (
                <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  {appointment.notes}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
