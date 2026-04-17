import { saveBookingDefaults } from "@/app/(staff)/staff/settings/actions";
import type { ClinicSettings } from "@/features/settings/admin";

type BookingDefaultsCardProps = {
  clinicSettings: ClinicSettings;
};

export function BookingDefaultsCard({
  clinicSettings,
}: BookingDefaultsCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-xl font-bold text-slate-900">
        Booking Defaults
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Control default appointment duration and workspace timezone.
      </p>

      <form
        action={saveBookingDefaults}
        className="mt-4 grid gap-3 md:grid-cols-3"
      >
        <input type="hidden" name="id" value={clinicSettings.id ?? ""} />
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Default duration (minutes)
          <input
            name="duration_min"
            type="number"
            min={5}
            step={5}
            defaultValue={clinicSettings.booking_default_duration_min}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          Timezone
          <input
            name="timezone"
            defaultValue={clinicSettings.booking_timezone}
            placeholder="e.g. Asia/Dhaka"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </label>
        <div className="md:col-span-3">
          <button
            type="submit"
            className="w-full rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white sm:w-auto"
          >
            Save Booking Defaults
          </button>
        </div>
      </form>
    </article>
  );
}
