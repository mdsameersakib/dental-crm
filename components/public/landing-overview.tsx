import Link from "next/link";

import { publicExperience } from "@/config/features.config";

export function LandingOverview() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,#0f766e_0%,#115e59_100%)] p-8 text-white shadow-[0_20px_60px_rgba(15,94,89,0.35)]">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-teal-100">
          Public Experience
        </p>
        <h1 className="max-w-2xl text-5xl font-semibold leading-tight tracking-tight">
          The repository is scaffolded around the three product surfaces of the
          app.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-teal-50/90">
          Start with shared design tokens and stable routing, then layer in
          Supabase-backed patient records, appointments, documents, and staff
          workflows.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/book"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-teal-50"
          >
            Public Booking Route
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Auth Scaffold
          </Link>
        </div>
      </div>
      <div className="rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[0_20px_60px_rgba(15,35,35,0.08)]">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
          Public Modules
        </p>
        <div className="grid gap-3">
          {publicExperience.map((feature) => (
            <div
              key={feature.slug}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-4"
            >
              <p className="text-sm font-semibold">{feature.title}</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
