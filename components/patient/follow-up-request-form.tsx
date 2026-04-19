import type {
  PublicDentist,
  PublicService,
} from "@/features/public-content/types";

type FollowUpRequestFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  services: PublicService[];
  dentists: PublicDentist[];
  defaultPhone: string;
};

export function FollowUpRequestForm({
  action,
  services,
  dentists,
  defaultPhone,
}: FollowUpRequestFormProps) {
  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="phone" className="text-sm font-semibold text-slate-700">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          defaultValue={defaultPhone}
          placeholder="01XXXXXXXXX"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500"
        />
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="service_id"
          className="text-sm font-semibold text-slate-700"
        >
          Service
        </label>
        <select
          id="service_id"
          name="service_id"
          required
          defaultValue=""
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
        >
          <option value="" disabled>
            Select a service
          </option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="preferred_dentist_id"
          className="text-sm font-semibold text-slate-700"
        >
          Preferred Dentist
        </label>
        <select
          id="preferred_dentist_id"
          name="preferred_dentist_id"
          defaultValue=""
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
        >
          <option value="">No preference</option>
          {dentists.map((dentist) => (
            <option key={dentist.id} value={dentist.id}>
              {dentist.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label
            htmlFor="preferred_date"
            className="text-sm font-semibold text-slate-700"
          >
            Preferred Date
          </label>
          <input
            id="preferred_date"
            name="preferred_date"
            type="date"
            required
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
          />
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="preferred_time"
            className="text-sm font-semibold text-slate-700"
          >
            Preferred Time
          </label>
          <input
            id="preferred_time"
            name="preferred_time"
            type="time"
            required
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="notes" className="text-sm font-semibold text-slate-700">
          Note
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Tell the clinic whether this is a follow-up visit or any preference staff should know."
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500"
        />
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
        <input
          type="checkbox"
          name="join_waitlist"
          value="yes"
          className="mt-1 h-4 w-4 rounded border-slate-300 text-[var(--color-primary)]"
        />
        <span className="leading-6">
          Add me to the waitlist if the requested slot is unavailable.
        </span>
      </label>

      <button
        type="submit"
        className="rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(0,101,101,0.18)]"
      >
        Send Request
      </button>
    </form>
  );
}
