import { redirect } from "next/navigation";

import { AuthStatusBanner } from "@/components/auth/auth-status-banner";
import { requireStaffProfileForOnboarding } from "@/lib/auth/session";

import { completeStaffOnboarding } from "./actions";

type StaffOnboardingPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function StaffOnboardingPage({
  searchParams,
}: StaffOnboardingPageProps) {
  const profile = await requireStaffProfileForOnboarding();
  const params = await searchParams;

  if (!profile.needsStaffOnboarding) {
    redirect("/staff/settings");
  }

  return (
    <div className="space-y-6">
      <AuthStatusBanner error={params.error} />

      <div className="rounded-2xl border border-[rgba(189,201,200,0.24)] bg-[var(--color-surface-container-low)] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
          Staff Onboarding
        </p>
        <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-[var(--color-foreground)]">
          Complete your staff profile before entering the CRM.
        </h2>
        <p className="mt-4 text-sm leading-7 text-[var(--color-on-surface-variant)]">
          This invited account is linked to{" "}
          <span className="font-semibold">{profile.email}</span>. Add the core
          staff details your clinic needs, then you will be sent into the staff
          workspace.
        </p>
      </div>

      <form action={completeStaffOnboarding} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="first_name"
              className="block px-1 text-sm font-semibold text-[var(--color-on-surface-variant)]"
            >
              First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              required
              defaultValue={profile.firstName}
              className="w-full rounded-xl border-0 bg-[var(--color-surface-container-low)] px-5 py-4 outline-none transition-all placeholder:text-[#6e7979] focus:ring-2 focus:ring-[rgba(0,101,101,0.4)]"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="last_name"
              className="block px-1 text-sm font-semibold text-[var(--color-on-surface-variant)]"
            >
              Last Name
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              required
              defaultValue={profile.lastName}
              className="w-full rounded-xl border-0 bg-[var(--color-surface-container-low)] px-5 py-4 outline-none transition-all placeholder:text-[#6e7979] focus:ring-2 focus:ring-[rgba(0,101,101,0.4)]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="block px-1 text-sm font-semibold text-[var(--color-on-surface-variant)]"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            defaultValue={profile.phone ?? ""}
            className="w-full rounded-xl border-0 bg-[var(--color-surface-container-low)] px-5 py-4 outline-none transition-all placeholder:text-[#6e7979] focus:ring-2 focus:ring-[rgba(0,101,101,0.4)]"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="address"
            className="block px-1 text-sm font-semibold text-[var(--color-on-surface-variant)]"
          >
            Address
          </label>
          <textarea
            id="address"
            name="address"
            required
            rows={4}
            defaultValue={profile.address ?? ""}
            className="w-full rounded-xl border-0 bg-[var(--color-surface-container-low)] px-5 py-4 outline-none transition-all placeholder:text-[#6e7979] focus:ring-2 focus:ring-[rgba(0,101,101,0.4)]"
          />
        </div>

        <button
          type="submit"
          className="hero-gradient flex w-full items-center justify-center space-x-2 rounded-xl px-6 py-4 font-bold text-white shadow-lg shadow-[rgba(0,101,101,0.1)] transition-all duration-150 hover:shadow-[rgba(0,101,101,0.2)] active:scale-[0.98]"
        >
          <span className="text-sm tracking-wide">Complete Onboarding</span>
          <span className="material-symbols-outlined text-lg">
            arrow_forward
          </span>
        </button>
      </form>
    </div>
  );
}
