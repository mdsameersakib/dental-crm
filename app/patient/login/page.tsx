import { redirect } from "next/navigation";

import { AuthStatusBanner } from "@/components/auth/auth-status-banner";
import { AuthLayout } from "@/components/ui/auth-layout";
import { getCurrentProfile } from "@/lib/auth/session";

import { requestPatientOtp } from "../actions";

type PatientLoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
    success?: string;
  }>;
};

export default async function PatientLoginPage({
  searchParams,
}: PatientLoginPageProps) {
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
  const next =
    params.next?.startsWith("/patient") || params.next === "/patient"
      ? params.next
      : "/patient/dashboard";

  return (
    <AuthLayout
      title="Patient Access"
      description="Use the same email you used for your appointment or treatment. We will send a 6-digit verification code to your inbox."
    >
      <div className="space-y-6">
        <AuthStatusBanner error={params.error} success={params.success} />

        <form action={requestPatientOtp} className="space-y-6">
          <input type="hidden" name="next" value={next} />

          <div className="space-y-2">
            <label
              className="ml-1 block text-sm font-semibold text-[var(--color-on-surface-variant)]"
              htmlFor="email"
            >
              Email Address
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
                placeholder="you@example.com"
                className="block w-full rounded-xl border-0 bg-[var(--color-surface-container-low)] py-3.5 pr-4 pl-11 text-[var(--color-foreground)] outline-none transition-all placeholder:text-[#6e7979] focus:ring-2 focus:ring-[rgba(0,101,101,0.4)]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="hero-gradient flex w-full items-center justify-center space-x-2 rounded-xl px-6 py-4 font-bold text-white shadow-lg shadow-[rgba(0,101,101,0.1)] transition-all duration-150 hover:shadow-[rgba(0,101,101,0.2)] active:scale-[0.98]"
          >
            <span className="text-sm tracking-wide">
              Send Verification Code
            </span>
            <span className="material-symbols-outlined text-lg">
              arrow_forward
            </span>
          </button>
        </form>

        <p className="text-center text-sm font-medium text-[var(--color-on-surface-variant)]">
          This portal is for patients only. Staff members should use the staff
          login.
        </p>
      </div>
    </AuthLayout>
  );
}
