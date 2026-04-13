import { formatWhyChooseUsInput } from "@/features/public-content/admin";
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
          Update the homepage story, primary calls to action, clinic contact details, and homepage trust highlights from one place.
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

      <form action={saveLandingContent} className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <input type="hidden" name="id" value={landing.id ?? ""} />

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
            <span>Hero title</span>
            <input
              name="hero_title"
              defaultValue={landing.heroTitle}
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
            <span>Hero subtitle</span>
            <textarea
              name="hero_subtitle"
              defaultValue={landing.heroSubtitle}
              rows={3}
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Primary CTA label</span>
            <input
              name="primary_cta_label"
              defaultValue={landing.primaryCtaLabel}
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Primary CTA href</span>
            <input
              name="primary_cta_href"
              defaultValue={landing.primaryCtaHref}
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Secondary CTA label</span>
            <input
              name="secondary_cta_label"
              defaultValue={landing.secondaryCtaLabel}
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Secondary CTA href</span>
            <input
              name="secondary_cta_href"
              defaultValue={landing.secondaryCtaHref}
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
            />
          </label>
        </div>

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

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>Why choose us</span>
          <textarea
            name="why_choose_us"
            defaultValue={formatWhyChooseUsInput(landing.whyChooseUs)}
            rows={6}
            className="rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm outline-none"
          />
          <span className="text-xs text-slate-500">
            One item per line in the format: `Title | Description`
          </span>
        </label>

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
