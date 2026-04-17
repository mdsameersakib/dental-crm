import { saveDentistSchedule } from "@/app/(staff)/staff/dentists/actions";
import {
  dentistScheduleDays,
  type StaffDentistProfile,
} from "@/features/dentists/admin";

type DentistScheduleFormProps = {
  dentist: StaffDentistProfile;
};

export function DentistScheduleForm({ dentist }: DentistScheduleFormProps) {
  return (
    <form
      action={saveDentistSchedule}
      className="grid w-full gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
    >
      <input type="hidden" name="dentist_id" value={dentist.id} />
      <input
        type="hidden"
        name="redirect_to"
        value={`/staff/dentists/${dentist.id}`}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Weekly availability
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
            Schedule
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Toggle day availability, then set start and end times.
          </p>
        </div>
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Save schedule
        </button>
      </div>

      <div className="grid gap-2.5">
        {dentistScheduleDays.map((day) => {
          const schedule = dentist.schedules.find(
            (entry) => entry.day === day.value,
          );

          return (
            <div
              key={day.value}
              className="grid items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 md:grid-cols-[190px_170px_1fr]"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">
                  calendar_month
                </span>
                <p className="text-sm font-semibold text-slate-900">
                  {day.label}
                </p>
              </div>

              <label className="inline-flex w-full items-center justify-end md:justify-end">
                <input
                  type="checkbox"
                  name={`is_available_${day.value}`}
                  defaultChecked={schedule?.isAvailable ?? false}
                  className="peer sr-only"
                />
                <span className="relative h-7 w-14 rounded-full bg-slate-300 transition-colors after:absolute after:top-[2px] after:left-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-7" />
              </label>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <input
                  type="time"
                  name={`start_time_${day.value}`}
                  defaultValue={schedule?.startTime ?? ""}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none"
                />
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  to
                </span>
                <input
                  type="time"
                  name={`end_time_${day.value}`}
                  defaultValue={schedule?.endTime ?? ""}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none"
                />
              </div>
            </div>
          );
        })}
      </div>
    </form>
  );
}
