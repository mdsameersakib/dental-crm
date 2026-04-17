import { getLandingSettingsForStaff } from "@/features/public-content/queries";

import { saveLandingContent } from "./actions";

type StaffLandingContentPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function StaffLandingContentPage({
  searchParams,
}: StaffLandingContentPageProps) {
  const [params, landing] = await Promise.all([
    searchParams,
    getLandingSettingsForStaff(),
  ]);

  return (
    <section className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          Content Management
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold text-slate-900">
          Landing Content
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Update the public contact details shown across the landing and booking
          pages.
        </p>
      </div>

      {params.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {params.error}
        </div>
      ) : null}

      {params.success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {params.success}
        </div>
      ) : null}

      <form
        action={saveLandingContent}
        className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
      >
        <input type="hidden" name="id" value={landing.id ?? ""} />

        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Contact phone</span>
            <input
              name="contact_phone"
              defaultValue={landing.contactPhone}
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Contact email</span>
            <input
              name="contact_email"
              defaultValue={landing.contactEmail}
              type="email"
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Clinic address</span>
            <input
              name="clinic_address"
              defaultValue={landing.clinicAddress}
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
            />
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
          >
            Save landing content
          </button>
        </div>
      </form>
    </section>
  );
}
