import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getActiveAppointmentSlotsForStaff,
  getBookingRequestForStaff,
} from "@/features/bookings/admin";
import { getDentistsForStaff } from "@/features/dentists/admin";
import { getServicesForStaff } from "@/features/services/admin";

import {
  markBookingRequestAsContacted,
  rejectBookingRequest,
} from "../actions";
import { ConvertAppointmentForm } from "./convert-appointment-form";

type BookingRequestDetailPageProps = {
  params: Promise<{ requestId: string }>;
  searchParams: Promise<{
    q?: string;
    status?: string;
    error?: string;
    success?: string;
  }>;
};

function formatDate(date: string | null) {
  if (!date) {
    return "Not selected";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function buildBackHref(query: string, status: string) {
  const params = new URLSearchParams();
  if (query) {
    params.set("q", query);
  }
  if (status) {
    params.set("status", status);
  }
  const queryString = params.toString();
  return queryString
    ? `/staff/booking-requests?${queryString}`
    : "/staff/booking-requests";
}

export default async function BookingRequestDetailPage({
  params,
  searchParams,
}: BookingRequestDetailPageProps) {
  const [{ requestId }, queryParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const [request, services, dentists, activeAppointments] = await Promise.all([
    getBookingRequestForStaff(requestId),
    getServicesForStaff(),
    getDentistsForStaff(),
    getActiveAppointmentSlotsForStaff(),
  ]);

  if (!request) {
    notFound();
  }

  const query = (queryParams.q ?? "").trim();
  const status = (queryParams.status ?? "").trim();
  const detailParams = new URLSearchParams();
  if (query) {
    detailParams.set("q", query);
  }
  if (status) {
    detailParams.set("status", status);
  }
  const detailPath = detailParams.toString()
    ? `/staff/booking-requests/${request.id}?${detailParams.toString()}`
    : `/staff/booking-requests/${request.id}`;
  const backHref = buildBackHref(query, status);
  const isRequestLocked =
    request.status === "converted" || request.status === "rejected";
  const serviceOptions = services.map((service) => ({
    id: service.id,
    name: service.name,
  }));
  const dentistOptions = dentists.map((dentist) => ({
    id: dentist.id,
    name: `${dentist.firstName} ${dentist.lastName}`.trim() || dentist.email,
    email: dentist.email,
    schedules: dentist.schedules,
  }));

  return (
    <section className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Operations
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-slate-900">
            Booking Request Details
          </h1>
        </div>
        <Link
          href={backHref}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
        >
          Back to list
        </Link>
      </div>

      {queryParams.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {queryParams.error}
        </div>
      ) : null}

      {queryParams.success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {queryParams.success}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]">
        <article className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {request.patient_name}
              </p>
              <p className="mt-1 text-sm text-slate-600">{request.email}</p>
              <p className="text-sm text-slate-500">
                {request.phone || "Phone not provided"}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
              {request.status}
            </span>
          </div>

          <dl className="mt-5 grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm md:grid-cols-2">
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                Service
              </dt>
              <dd className="mt-1 font-medium text-slate-900">
                {request.serviceName || "Not selected"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                Preferred Dentist
              </dt>
              <dd className="mt-1 font-medium text-slate-900">
                {request.preferredDentistName || "Any available dentist"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                Preferred Date
              </dt>
              <dd className="mt-1 font-medium text-slate-900">
                {formatDate(request.preferred_date)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                Preferred Time
              </dt>
              <dd className="mt-1 font-medium text-slate-900">
                {request.preferred_time || "Not selected"}
              </dd>
            </div>
          </dl>

          <div className="mt-5 rounded-2xl border border-slate-200 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Patient notes
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {request.notes || "No additional notes from patient."}
            </p>
          </div>
        </article>

        <div className="grid gap-5">
          <article className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Request status
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Update follow-up status while reviewing this request.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <form action={markBookingRequestAsContacted}>
                <input type="hidden" name="request_id" value={request.id} />
                <input type="hidden" name="redirect_to" value={detailPath} />
                <button
                  type="submit"
                  disabled={isRequestLocked}
                  className="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Mark Contacted
                </button>
              </form>

              <form action={rejectBookingRequest}>
                <input type="hidden" name="request_id" value={request.id} />
                <input type="hidden" name="redirect_to" value={detailPath} />
                <button
                  type="submit"
                  disabled={isRequestLocked}
                  className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reject Request
                </button>
              </form>
            </div>
          </article>

          <article className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-slate-900">
              Convert to appointment
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This stores appointment data by patient email and links to a
              patient profile automatically when one exists.
            </p>
            <ConvertAppointmentForm
              requestId={request.id}
              redirectTo={detailPath}
              services={serviceOptions}
              dentists={dentistOptions}
              activeAppointments={activeAppointments}
              defaultServiceId={request.service_id ?? ""}
              defaultDentistId={request.preferred_dentist_id ?? ""}
              defaultDate={request.preferred_date ?? ""}
              defaultTime={request.preferred_time ?? ""}
              locked={isRequestLocked}
            />
          </article>
        </div>
      </div>
    </section>
  );
}
