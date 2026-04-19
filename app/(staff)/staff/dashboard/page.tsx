import Link from "next/link";

import { DashboardMetricCard } from "@/components/staff/dashboard/dashboard-metric-card";
import {
  appointmentStatusColorMap,
  bookingRequestStatusColorMap,
  formatAppointmentDateTime,
  formatBookingDate,
} from "@/features/bookings/presentation";
import { getStaffDashboardData } from "@/features/dashboard/admin";
import {
  getTreatmentStatusLabel,
  treatmentStatusColorMap,
} from "@/features/treatments/presentation";

export const dynamic = "force-dynamic";

export default async function StaffDashboardPage() {
  const dashboard = await getStaffDashboardData();

  return (
    <section className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Workspace overview
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-slate-900">
            Dashboard
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Track today’s appointments, pending patient flow, and recent clinic
            activity from one operational overview.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/staff/appointments/new"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            New appointment
          </Link>
          <Link
            href="/staff/treatments/new"
            className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            New treatment
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboard.metrics.map((metric) => (
          <DashboardMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-2xl font-bold text-slate-900">
                Today&apos;s schedule
              </h2>
              <Link
                href="/staff/appointments"
                className="text-sm font-semibold text-teal-700"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {dashboard.todaySchedule.length === 0 ? (
                <p className="text-sm text-slate-600">
                  No appointments scheduled for today.
                </p>
              ) : (
                dashboard.todaySchedule.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl bg-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {item.patientName}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.serviceName || "General consultation"} ·{" "}
                          {item.dentistName}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {formatAppointmentDateTime(item.startAt)}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${appointmentStatusColorMap[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-2xl font-bold text-slate-900">
                Recent treatments
              </h2>
              <Link
                href="/staff/treatments"
                className="text-sm font-semibold text-teal-700"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {dashboard.recentTreatments.length === 0 ? (
                <p className="text-sm text-slate-600">
                  No treatment records yet.
                </p>
              ) : (
                dashboard.recentTreatments.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl bg-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {item.treatmentName}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.patientName} · {item.dentistName}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.performedAt
                            ? formatAppointmentDateTime(item.performedAt)
                            : "Not completed yet"}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${treatmentStatusColorMap[item.status]}`}
                      >
                        {getTreatmentStatusLabel(item.status)}
                      </span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-heading text-2xl font-bold text-slate-900">
              Upcoming follow-ups
            </h2>
            <div className="mt-4 space-y-3">
              {dashboard.upcomingFollowUps.length === 0 ? (
                <p className="text-sm text-slate-600">
                  No follow-up dates scheduled.
                </p>
              ) : (
                dashboard.upcomingFollowUps.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl bg-slate-50 p-4"
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {item.treatmentName}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {item.patientName} · {item.dentistName}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatBookingDate(item.followUpDate)}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-heading text-2xl font-bold text-slate-900">
              Recent activity
            </h2>
            <div className="mt-4 space-y-3">
              {dashboard.recentActivity.length === 0 ? (
                <p className="text-sm text-slate-600">
                  No recent activity yet.
                </p>
              ) : (
                dashboard.recentActivity.map((item) => {
                  const colorClass =
                    item.kind === "appointment"
                      ? appointmentStatusColorMap[
                          item.status as keyof typeof appointmentStatusColorMap
                        ]
                      : item.kind === "booking_request"
                        ? bookingRequestStatusColorMap[
                            item.status as keyof typeof bookingRequestStatusColorMap
                          ]
                        : treatmentStatusColorMap[
                            item.status as keyof typeof treatmentStatusColorMap
                          ];

                  return (
                    <article
                      key={item.id}
                      className="rounded-2xl bg-slate-50 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {item.description}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {formatAppointmentDateTime(item.occurredAt)}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${colorClass}`}
                        >
                          {String(item.status).replaceAll("_", " ")}
                        </span>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
