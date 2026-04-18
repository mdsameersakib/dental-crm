import Link from "next/link";

import type { StaffDentistProfile } from "@/features/dentists/admin";

const weekdayOrder = [
  { key: "sun", label: "S" },
  { key: "mon", label: "M" },
  { key: "tue", label: "T" },
  { key: "wed", label: "W" },
  { key: "thu", label: "T" },
  { key: "fri", label: "F" },
  { key: "sat", label: "S" },
] as const;

type StaffDentistCardProps = {
  dentist: StaffDentistProfile;
};

export function StaffDentistCard({ dentist }: StaffDentistCardProps) {
  const displayName =
    `${dentist.firstName} ${dentist.lastName}`.trim() || dentist.email;
  const availableDaySet = new Set(
    dentist.schedules
      .filter((entry) => entry.isAvailable)
      .map((entry) => entry.day),
  );
  const availableDays = availableDaySet.size;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(10,24,29,0.12)]">
      <div className="relative h-48 overflow-hidden bg-[linear-gradient(135deg,#d9efee_0%,#edf4f8_100%)]">
        {dentist.profile_photo_path ? (
          <img
            src={dentist.profile_photo_path}
            alt={displayName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-teal-700">
              medical_services
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(10,24,29,0)_0%,rgba(10,24,29,0.75)_100%)] p-4">
          <p className="line-clamp-1 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
            {dentist.specializations.join(", ") || "Dental Specialist"}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
        <p className="truncate text-sm font-semibold text-slate-900">
          {displayName}
        </p>
        {dentist.is_published ? (
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
            Published
          </span>
        ) : (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700">
            Draft
          </span>
        )}
      </div>

      <div className="grid flex-1 gap-3 p-4">
        <p className="line-clamp-2 text-sm text-slate-600">
          {dentist.short_bio || "No short bio added yet."}
        </p>

        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl bg-slate-50 px-3 py-2.5 text-[12px]">
          <div>
            <dt className="font-bold uppercase tracking-[0.12em] text-slate-500">
              License
            </dt>
            <dd className="mt-1 truncate font-semibold text-slate-900">
              {dentist.license_number}
            </dd>
          </div>
          <div>
            <dt className="font-bold uppercase tracking-[0.12em] text-slate-500">
              Fee
            </dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {dentist.consultation_fee === null
                ? "By consult"
                : `৳${dentist.consultation_fee}`}
            </dd>
          </div>
          <div>
            <dt className="font-bold uppercase tracking-[0.12em] text-slate-500">
              Available
            </dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {availableDays} day{availableDays === 1 ? "" : "s"}
            </dd>
          </div>
          <div>
            <dt className="font-bold uppercase tracking-[0.12em] text-slate-500">
              Order
            </dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {dentist.display_order}
            </dd>
          </div>
        </dl>

        <div className="rounded-xl border border-slate-200/80 bg-white px-3 py-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
            Weekly availability
          </p>
          <div className="mt-2 flex items-center justify-between">
            {weekdayOrder.map((day) => {
              const isAvailable = availableDaySet.has(day.key);

              return (
                <span
                  key={day.key}
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
                    isAvailable
                      ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300/80"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {day.label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-3">
          <p className="text-xs text-slate-500">{dentist.email}</p>
          <Link
            href={`/staff/dentists/${dentist.id}`}
            className="rounded-lg bg-[var(--color-primary)] px-3 py-2 text-xs font-semibold text-white"
          >
            Edit
          </Link>
        </div>
      </div>
    </article>
  );
}
