"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { patientNavigationLinks } from "@/features/patient-portal/navigation";

type PatientShellProps = {
  children: React.ReactNode;
  fullName: string;
  email: string;
  signOutAction: (formData: FormData) => void | Promise<void>;
};

export function PatientShell({
  children,
  fullName,
  email,
  signOutAction,
}: PatientShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)] shadow-[0_14px_28px_rgba(0,101,101,0.22)]">
              <span
                className="material-symbols-outlined text-white"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                medical_services
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-700">
                Patient Portal
              </p>
              <p className="font-heading text-xl font-bold text-slate-900">
                Clinical Atelier
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2">
            {patientNavigationLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    isActive
                      ? "inline-flex items-center gap-2 rounded-full bg-[#cdeeee] px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm"
                      : "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
                  }
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">
                person
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {fullName}
              </p>
              <p className="truncate text-xs text-slate-500">{email}</p>
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
        {children}
      </main>
    </div>
  );
}
