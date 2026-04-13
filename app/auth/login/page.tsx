import { redirect } from "next/navigation";
import Link from "next/link";

import { AuthFragmentBridge } from "@/components/auth/auth-fragment-bridge";
import { getCurrentProfile } from "@/lib/auth/session";

import { signInStaff } from "../actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
    registered?: string;
    signed_out?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const profile = await getCurrentProfile();

  if (
    profile &&
    profile.isActive &&
    ["admin", "receptionist", "dentist"].includes(profile.role)
  ) {
    redirect("/staff/settings");
  }

  const params = await searchParams;
  const next =
    params.next && params.next.startsWith("/staff") ? params.next : "/staff/settings";

  return (
    <div className="space-y-6">
      <AuthFragmentBridge defaultNext="/auth/staff-onboarding" />

      {params.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {params.error}
        </div>
      ) : null}

      {params.signed_out ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          You have been signed out.
        </div>
      ) : null}

      {params.registered ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Staff account created. You can sign in now.
        </div>
      ) : null}

      <form action={signInStaff} className="space-y-6">
        <input type="hidden" name="next" value={next} />

        <div className="space-y-2">
          <label
            className="ml-1 block text-sm font-semibold text-[var(--color-on-surface-variant)]"
            htmlFor="email"
          >
            Professional Email
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#6e7979]">
              <span className="material-symbols-outlined text-xl">mail</span>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="staff@clinicalatelier.com"
              className="block w-full rounded-xl border-0 bg-[var(--color-surface-container-low)] py-3.5 pr-4 pl-11 text-[var(--color-foreground)] outline-none transition-all placeholder:text-[#6e7979] focus:ring-2 focus:ring-[rgba(0,101,101,0.4)]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="ml-1 flex items-center justify-between">
            <label
              className="block text-sm font-semibold text-[var(--color-on-surface-variant)]"
              htmlFor="password"
            >
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-semibold text-[var(--color-accent)] transition-colors hover:text-[var(--color-primary)]"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#6e7979]">
              <span className="material-symbols-outlined text-xl">lock</span>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="block w-full rounded-xl border-0 bg-[var(--color-surface-container-low)] py-3.5 pr-4 pl-11 text-[var(--color-foreground)] outline-none transition-all placeholder:text-[#6e7979] focus:ring-2 focus:ring-[rgba(0,101,101,0.4)]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="hero-gradient flex w-full items-center justify-center space-x-2 rounded-xl px-6 py-4 font-bold text-white shadow-lg shadow-[rgba(0,101,101,0.1)] transition-all duration-150 hover:shadow-[rgba(0,101,101,0.2)] active:scale-[0.98]"
        >
          <span className="text-sm tracking-wide">Log In</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </form>

      <p className="text-center text-sm font-medium text-[var(--color-on-surface-variant)]">
        Need a staff account? Ask your administrator to create it inside the CRM.
      </p>
    </div>
  );
}
