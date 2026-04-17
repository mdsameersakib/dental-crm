import Link from "next/link";

import { AuthStatusBanner } from "@/components/auth/auth-status-banner";

import { requestPasswordReset } from "../actions";

type ForgotPasswordPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <AuthStatusBanner error={params.error} success={params.success} />

      <form action={requestPasswordReset} className="space-y-6">
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

        <button
          type="submit"
          className="hero-gradient flex w-full items-center justify-center space-x-2 rounded-xl px-6 py-4 font-bold text-white shadow-lg shadow-[rgba(0,101,101,0.1)] transition-all duration-150 hover:shadow-[rgba(0,101,101,0.2)] active:scale-[0.98]"
        >
          <span className="text-sm tracking-wide">Send Reset Link</span>
          <span className="material-symbols-outlined text-lg">mail</span>
        </button>
      </form>

      <p className="text-center text-sm font-medium text-[var(--color-on-surface-variant)]">
        Remembered your password?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-[var(--color-accent)] transition-colors hover:text-[var(--color-primary)]"
        >
          Back to login
        </Link>
      </p>
    </div>
  );
}
