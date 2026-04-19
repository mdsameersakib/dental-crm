import Link from "next/link";
import { FollowUpRequestForm } from "@/components/patient/follow-up-request-form";
import { PatientNotificationList } from "@/components/patient/notifications/patient-notification-list";
import { PatientPageHeader } from "@/components/patient/patient-page-header";
import { FlashBanner } from "@/components/staff/flash-banner";
import {
  formatAppointmentDateTime,
  getAppointmentStatusLabel,
} from "@/features/bookings/presentation";
import { getPatientVisibleDocuments } from "@/features/documents/admin";
import {
  ensurePatientNotifications,
  getPatientNotifications,
} from "@/features/notifications/patient";
import { getPatientDashboardPageData } from "@/features/patient-portal/queries";
import { requirePatientProfile } from "@/lib/auth/session";

import { submitPatientFollowUpRequest } from "./actions";

type PatientDashboardPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

function formatTreatmentDate(value: string | null) {
  if (!value) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export default async function PatientDashboardPage({
  searchParams,
}: PatientDashboardPageProps) {
  const profile = await requirePatientProfile("/patient/dashboard");
  const params = await searchParams;
  await ensurePatientNotifications({
    profileId: profile.id,
    patientProfileId: profile.patientProfileId,
  });
  const [data, notifications, visibleDocuments] = await Promise.all([
    getPatientDashboardPageData(profile.patientProfileId),
    getPatientNotifications(),
    getPatientVisibleDocuments(profile.patientProfileId),
  ]);
  const fullName =
    `${profile.firstName} ${profile.lastName}`.trim() || "Patient";

  return (
    <section className="space-y-8">
      <PatientPageHeader
        eyebrow="Patient Portal"
        title={`Welcome back, ${fullName}`}
        description="Review your next visit, check recent treatment updates, and send a follow-up request if you need another appointment."
      />

      <FlashBanner error={params.error} success={params.success} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,420px)]">
        <div className="grid gap-4">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                  Next Visit
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
                  {data.upcomingAppointment
                    ? (data.upcomingAppointment.serviceName ??
                      "General consultation")
                    : "No upcoming appointment"}
                </h2>
              </div>
              {data.upcomingAppointment ? (
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
                  {getAppointmentStatusLabel(data.upcomingAppointment.status)}
                </span>
              ) : null}
            </div>

            {data.upcomingAppointment ? (
              <dl className="mt-5 grid gap-3 rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-700 md:grid-cols-3">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    Dentist
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {data.upcomingAppointment.dentistName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    Date & Time
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {formatAppointmentDateTime(
                      data.upcomingAppointment.startAt,
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    Duration
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {data.upcomingAppointment.durationMin} min
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Once staff confirms your next appointment, it will appear here.
              </p>
            )}
          </article>

          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                    Recent Appointments
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
                    Visit history
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {data.recentAppointments.length === 0 ? (
                  <p className="rounded-[1.5rem] bg-slate-50 px-4 py-5 text-sm text-slate-600">
                    Your completed and past appointments will appear here.
                  </p>
                ) : (
                  data.recentAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="rounded-[1.5rem] bg-slate-50 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {appointment.serviceName ?? "General consultation"}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {appointment.dentistName}
                          </p>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          {getAppointmentStatusLabel(appointment.status)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">
                        {formatAppointmentDateTime(appointment.startAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                Recent Treatments
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
                Care updates
              </h2>

              <div className="mt-5 space-y-3">
                {data.recentTreatments.length === 0 ? (
                  <p className="rounded-[1.5rem] bg-slate-50 px-4 py-5 text-sm text-slate-600">
                    Treatment notes and aftercare guidance will appear once a
                    visit is completed.
                  </p>
                ) : (
                  data.recentTreatments.map((treatment) => (
                    <div
                      key={treatment.id}
                      className="rounded-[1.5rem] bg-slate-50 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {treatment.treatmentName}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {treatment.serviceName ?? treatment.dentistName}
                          </p>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          {treatment.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">
                        {formatTreatmentDate(treatment.performedAt)}
                      </p>
                      {treatment.aftercareInstructions ? (
                        <p className="mt-3 rounded-xl bg-white px-3 py-2 text-sm text-slate-600">
                          {treatment.aftercareInstructions}
                        </p>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </article>
          </div>
        </div>

        <div className="grid gap-4">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                  Reminders
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
                  Patient inbox
                </h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
                {notifications.length} item
                {notifications.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="mt-5">
              <PatientNotificationList notifications={notifications} />
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                  Patient Assistant
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
                  Need help choosing care?
                </h2>
              </div>
              <Link
                href="/patient/help"
                className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
              >
                Open Help
              </Link>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Ask which dentist may fit your concern, review clinic contact
              details, or get aftercare guidance from your recent record.
            </p>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              Treatment documents
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
              Files shared with you
            </h2>

            <div className="mt-5 space-y-3">
              {visibleDocuments.length === 0 ? (
                <p className="rounded-[1.5rem] bg-slate-50 px-4 py-5 text-sm text-slate-600">
                  Files like scans, reports, or photos will appear here when
                  staff shares them with your portal account.
                </p>
              ) : (
                visibleDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {document.fileName}
                        </p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          {document.documentType.replaceAll("_", " ")}
                        </p>
                      </div>
                      {document.downloadUrl ? (
                        <a
                          href={document.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                        >
                          Open
                        </a>
                      ) : null}
                    </div>
                    {document.notes ? (
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {document.notes}
                      </p>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              Request Follow-up
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
              Need another visit?
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Send a request and clinic staff will confirm the appointment with
              you after checking availability.
            </p>

            <div className="mt-5">
              <FollowUpRequestForm
                action={submitPatientFollowUpRequest}
                services={data.services}
                dentists={data.dentists}
                defaultPhone={profile.phone ?? ""}
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
