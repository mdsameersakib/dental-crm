import { redirect } from "next/navigation";

import { AuthStatusBanner } from "@/components/auth/auth-status-banner";
import { AuthLayout } from "@/components/ui/auth-layout";
import { getCurrentProfile } from "@/lib/auth/session";

import { resendPatientOtp, verifyPatientOtp } from "../actions";

type PatientVerifyPageProps = {
  searchParams: Promise<{
    email?: string;
    error?: string;
    next?: string;
    success?: string;
  }>;
};

export default async function PatientVerifyPage({
  searchParams,
}: PatientVerifyPageProps) {
  const profile = await getCurrentProfile();

  if (profile?.isActive && profile.role === "patient") {
    redirect("/patient/dashboard");
  }

  if (
    profile?.isActive &&
    ["admin", "receptionist", "dentist"].includes(profile.role)
  ) {
    redirect("/staff/settings");
  }

  const params = await searchParams;
  const email = String(params.email ?? "")
    .trim()
    .toLowerCase();
  const next =
    params.next?.startsWith("/patient") || params.next === "/patient"
      ? params.next
      : "/patient/dashboard";

  if (!email) {
    redirect("/patient/login?error=Enter+your+email+first.");
  }

  return (
    <AuthLayout
      title="Enter Verification Code"
      description={`We sent a 6-digit code to ${email}. Enter it below to access your patient portal.`}
    >
      <div className="space-y-6">
        <AuthStatusBanner error={params.error} success={params.success} />

        <form action={verifyPatientOtp} className="space-y-6">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="next" value={next} />

          <div className="space-y-2">
            <label
              className="ml-1 block text-sm font-semibold text-[var(--color-on-surface-variant)]"
              htmlFor="token"
            >
              6-digit code
            </label>
            <input
              id="token"
              name="token"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              placeholder="123456"
              className="block w-full rounded-xl border-0 bg-[var(--color-surface-container-low)] px-4 py-4 text-center text-2xl font-bold tracking-[0.45em] text-[var(--color-foreground)] outline-none transition-all placeholder:text-[#9aa5a5] focus:ring-2 focus:ring-[rgba(0,101,101,0.4)]"
            />
          </div>

          <button
            type="submit"
            className="hero-gradient flex w-full items-center justify-center space-x-2 rounded-xl px-6 py-4 font-bold text-white shadow-lg shadow-[rgba(0,101,101,0.1)] transition-all duration-150 hover:shadow-[rgba(0,101,101,0.2)] active:scale-[0.98]"
          >
            <span className="text-sm tracking-wide">Verify And Continue</span>
            <span className="material-symbols-outlined text-lg">
              arrow_forward
            </span>
          </button>
        </form>

        <form action={resendPatientOtp} className="space-y-3">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="next" value={next} />
          <button
            type="submit"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-container-low)] px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-surface-container)]"
          >
            Resend code
          </button>
        </form>

        <p className="text-center text-sm font-medium text-[var(--color-on-surface-variant)]">
          Wrong email?{" "}
          <a
            href={`/patient/login?next=${encodeURIComponent(next)}`}
            className="font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]"
          >
            Go back
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
