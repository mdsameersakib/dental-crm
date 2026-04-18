import type { PatientPortalProfileFormData } from "@/features/patient-portal/types";

type ContactDetailsCardProps = {
  profile: PatientPortalProfileFormData;
};

export function ContactDetailsCard({ profile }: ContactDetailsCardProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          Contact Details
        </p>
        <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
          Personal information
        </h2>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <label
            htmlFor="first_name"
            className="text-sm font-semibold text-slate-700"
          >
            First Name
          </label>
          <input
            id="first_name"
            name="first_name"
            defaultValue={profile.firstName}
            required
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
          />
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="last_name"
            className="text-sm font-semibold text-slate-700"
          >
            Last Name
          </label>
          <input
            id="last_name"
            name="last_name"
            defaultValue={profile.lastName}
            required
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
          />
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            value={profile.email}
            readOnly
            disabled
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
          />
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="phone"
            className="text-sm font-semibold text-slate-700"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={profile.phone}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
          />
        </div>
      </div>

      <div className="mt-5 grid gap-2">
        <label
          htmlFor="address"
          className="text-sm font-semibold text-slate-700"
        >
          Address
        </label>
        <textarea
          id="address"
          name="address"
          rows={4}
          defaultValue={profile.address}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-teal-500"
        />
      </div>
    </section>
  );
}
