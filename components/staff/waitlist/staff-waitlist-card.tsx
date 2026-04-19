import { formatBookingDate } from "@/features/bookings/presentation";
import type { StaffWaitlistEntry } from "@/features/waitlist/types";

type StaffWaitlistCardProps = {
  entry: StaffWaitlistEntry;
  action: (formData: FormData) => void | Promise<void>;
};

const statusColorMap = {
  waiting: "bg-amber-100 text-amber-700",
  notified: "bg-sky-100 text-sky-700",
  booked: "bg-emerald-100 text-emerald-700",
  expired: "bg-slate-200 text-slate-700",
} as const;

export function StaffWaitlistCard({ entry, action }: StaffWaitlistCardProps) {
  return (
    <article className="flex h-full flex-col rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-slate-900">
            {entry.patientName}
          </p>
          <p className="mt-1 truncate text-sm text-slate-600">
            {entry.patientEmail || "No patient email"}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${statusColorMap[entry.status]}`}
        >
          {entry.status}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Service
          </dt>
          <dd className="mt-1 font-medium text-slate-900">
            {entry.serviceName || "Any service"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Dentist
          </dt>
          <dd className="mt-1 font-medium text-slate-900">
            {entry.dentistName || "No preference"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Preferred from
          </dt>
          <dd className="mt-1 font-medium text-slate-900">
            {entry.preferredFrom
              ? formatBookingDate(entry.preferredFrom)
              : "Open"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Preferred to
          </dt>
          <dd className="mt-1 font-medium text-slate-900">
            {entry.preferredTo ? formatBookingDate(entry.preferredTo) : "Open"}
          </dd>
        </div>
      </dl>

      {entry.notes ? (
        <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
          {entry.notes}
        </p>
      ) : null}

      <form action={action} className="mt-auto grid gap-2 pt-4">
        <input type="hidden" name="id" value={entry.id} />
        <select
          name="status"
          defaultValue={entry.status}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
        >
          <option value="waiting">Waiting</option>
          <option value="notified">Notified</option>
          <option value="booked">Booked</option>
          <option value="expired">Expired</option>
        </select>
        <button
          type="submit"
          className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Update waitlist
        </button>
      </form>
    </article>
  );
}
