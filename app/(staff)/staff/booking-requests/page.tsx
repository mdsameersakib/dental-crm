import Link from "next/link";
import { FlashBanner } from "@/components/staff/flash-banner";
import { getBookingRequestsForStaff } from "@/features/bookings/admin";
import {
  bookingRequestStatusColorMap,
  bookingRequestStatusOptions,
  buildRequestDetailHref,
  formatBookingDate,
} from "@/features/bookings/presentation";
import type { Database } from "@/types/database";

export const dynamic = "force-dynamic";

type BookingRequestStatus =
  Database["public"]["Enums"]["booking_request_status"];

type StaffBookingRequestsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
    q?: string;
    status?: string;
  }>;
};

export default async function StaffBookingRequestsPage({
  searchParams,
}: StaffBookingRequestsPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const selectedStatus = bookingRequestStatusOptions.some(
    (entry) => entry.value === params.status,
  )
    ? (params.status as BookingRequestStatus | "all")
    : "all";
  const requests = await getBookingRequestsForStaff({
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
            Booking Requests
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Review public booking requests, contact patients, and convert
            eligible requests into scheduled appointments.
          </p>
        </div>
        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
          {requests.length} request{requests.length === 1 ? "" : "s"}
        </div>
      </div>

      <FlashBanner error={params.error} success={params.success} />

      <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px_auto]">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search patient, email, dentist, service"
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:bg-white focus:outline-none"
        />
        <select
          name="status"
          defaultValue={selectedStatus}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
        >
          {bookingRequestStatusOptions.map((option) => (
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

      {requests.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white px-8 py-14 text-center shadow-sm">
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            No booking requests found
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            New requests from the public website will appear here.
          </p>
        </div>
      ) : (
        <div className="grid justify-center gap-4 [grid-template-columns:repeat(auto-fill,minmax(320px,380px))]">
          {requests.map((request) => (
            <article
              key={request.id}
              className="w-full rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-900">
                    {request.patient_name}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{request.email}</p>
                  <p className="text-sm text-slate-500">
                    {request.phone || "Phone not provided"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${bookingRequestStatusColorMap[request.status]}`}
                >
                  {request.status}
                </span>
              </div>

              <dl className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 sm:grid-cols-2">
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
                    {formatBookingDate(request.preferred_date)}
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

              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                <p className="text-xs text-slate-500">
                  Submitted{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  }).format(new Date(request.created_at))}
                </p>
                <Link
                  href={buildRequestDetailHref(
                    request.id,
                    query,
                    selectedStatus,
                  )}
                  className="rounded-lg bg-[var(--color-primary)] px-3.5 py-2 text-sm font-semibold text-white"
                >
                  Review Request
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
