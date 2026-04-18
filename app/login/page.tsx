import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthLayout } from "@/components/ui/auth-layout";
import { getCurrentProfile } from "@/lib/auth/session";

type LoginChooserPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function LoginChooserPage({
  searchParams,
}: LoginChooserPageProps) {
  const [profile, params] = await Promise.all([
    getCurrentProfile(),
    searchParams,
  ]);

  if (profile?.isActive && profile.role === "patient") {
    redirect("/patient/dashboard");
  }

  if (
    profile?.isActive &&
    ["admin", "receptionist", "dentist"].includes(profile.role)
  ) {
    redirect("/staff/settings");
  }

  const next = params.next ?? "";
  const staffHref = next.startsWith("/staff")
    ? `/auth/login?next=${encodeURIComponent(next)}`
    : "/auth/login";
  const patientHref =
    next.startsWith("/patient") || next === "/patient"
      ? `/patient/login?next=${encodeURIComponent(next)}`
      : "/patient/login";

  return (
    <AuthLayout
      title="Login"
      description="Choose the right login path for your clinic role or patient account."
    >
      <div className="space-y-4">
        <Link
          href={staffHref}
          className="group flex w-full items-center justify-between rounded-[1.6rem] border border-slate-200 bg-white px-5 py-5 transition-all hover:border-[var(--color-primary)]/30 hover:shadow-[0_18px_36px_rgba(0,101,101,0.12)]"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-fixed)] text-[var(--color-primary)]">
              <span className="material-symbols-outlined text-[24px]">
                badge
              </span>
            </span>
            <div className="text-left">
              <p className="text-base font-semibold text-slate-900">
                Staff Login
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Reception, admin, and dentist workspace access.
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)]">
            arrow_forward
          </span>
        </Link>

        <Link
          href={patientHref}
          className="group flex w-full items-center justify-between rounded-[1.6rem] border border-slate-200 bg-white px-5 py-5 transition-all hover:border-[var(--color-primary)]/30 hover:shadow-[0_18px_36px_rgba(0,101,101,0.12)]"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-fixed)] text-[var(--color-primary)]">
              <span className="material-symbols-outlined text-[24px]">
                person
              </span>
            </span>
            <div className="text-left">
              <p className="text-base font-semibold text-slate-900">
                Patient Login
              </p>
              <p className="mt-1 text-sm text-slate-600">
                View appointments, profile details, and follow-up requests.
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)]">
            arrow_forward
          </span>
        </Link>
      </div>
    </AuthLayout>
  );
}
