import Link from "next/link";

import { getCurrentProfile } from "@/lib/auth/session";

export default async function RegisterPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-[rgba(189,201,200,0.24)] bg-[var(--color-surface-container-low)] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
          Staff Access
        </p>
        <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-[var(--color-foreground)]">
          Staff accounts are created by an administrator.
        </h2>
        <p className="mt-4 text-sm leading-7 text-[var(--color-on-surface-variant)]">
          Public self-registration has been disabled. New staff members are now
          created inside the CRM by an admin account.
        </p>
      </div>

      {profile && ["admin", "receptionist", "dentist"].includes(profile.role) ? (
        <Link
          href="/staff/settings"
          className="hero-gradient flex w-full items-center justify-center rounded-xl px-6 py-4 font-bold text-white"
        >
          Go to Staff Settings
        </Link>
      ) : (
        <Link
          href="/auth/login"
          className="hero-gradient flex w-full items-center justify-center rounded-xl px-6 py-4 font-bold text-white"
        >
          Return to Staff Login
        </Link>
      )}
    </div>
  );
}
