"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { staffNavigationSections } from "@/features/staff/navigation";

type StaffShellProps = {
  profile: {
    firstName: string;
    lastName: string;
    role: "admin" | "receptionist" | "dentist" | "patient";
    email: string;
  };
  children: React.ReactNode;
};

function StaffSidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="border-b border-[var(--color-outline-variant)]/20 px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] shadow-lg shadow-[rgba(0,101,101,0.25)]">
            <span
              className="material-symbols-outlined text-white"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              medical_services
            </span>
          </div>
          <div>
            <h1 className="font-heading text-xl font-extrabold tracking-tight text-[var(--color-foreground)]">
              Dental CRM
            </h1>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-on-surface-variant)]">
              Staff Portal
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-6 px-3 py-6">
        {staffNavigationSections.map((section) => (
          <div key={section.title}>
            <p className="px-4 pb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)]">
              {section.title}
            </p>
            {section.links.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onNavigate}
                  className={
                    isActive
                      ? "mb-1 flex items-center gap-3 rounded-2xl bg-[#cdeeee] px-4 py-3.5 text-[var(--color-foreground)] shadow-[0_10px_24px_rgba(15,35,35,0.08)] transition-[background-color,color,box-shadow] duration-200 ease-out"
                      : "mb-1 flex items-center gap-3 rounded-2xl bg-transparent px-4 py-3.5 text-[var(--color-on-surface-variant)] transition-[background-color,color,box-shadow] duration-200 ease-out hover:bg-white/90 hover:text-[var(--color-foreground)] hover:shadow-[0_8px_18px_rgba(15,35,35,0.05)]"
                  }
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive
                        ? "text-[var(--color-primary)]"
                        : "text-[var(--color-on-surface-variant)]"
                    }`}
                  >
                    {link.icon}
                  </span>
                  <span
                    className={`text-sm ${
                      isActive
                        ? "font-semibold tracking-[0.01em]"
                        : "font-medium"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </>
  );
}

function getDisplayName(profile: StaffShellProps["profile"]) {
  return `${profile.firstName} ${profile.lastName}`.trim() || profile.email;
}

function getRoleLabel(role: StaffShellProps["profile"]["role"]) {
  switch (role) {
    case "admin":
      return "Administrator";
    case "dentist":
      return "Dentist";
    default:
      return "Reception";
  }
}

export function StaffShell({ profile, children }: StaffShellProps) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const lastPathnameRef = useRef(pathname);

  useEffect(() => {
    if (lastPathnameRef.current !== pathname) {
      setIsMobileNavOpen(false);
      lastPathnameRef.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    if (!isMobileNavOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileNavOpen]);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-foreground)]">
      <div
        aria-hidden={!isMobileNavOpen}
        className={`fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileNavOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMobileNavOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 pr-4 transition-opacity duration-300 lg:hidden ${
          isMobileNavOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <aside
          id="staff-sidebar"
          className={`flex h-screen w-64 flex-col overflow-hidden border-r border-[var(--color-outline-variant)]/20 bg-[linear-gradient(180deg,#f8fbfb_0%,#eef4f4_100%)] shadow-[18px_0_40px_rgba(15,35,35,0.06)] transition-all duration-300 ease-out ${
            isMobileNavOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-6 opacity-0"
          }`}
        >
          <StaffSidebarContent
            pathname={pathname}
            onNavigate={() => setIsMobileNavOpen(false)}
          />
        </aside>
      </div>

      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col overflow-hidden border-r border-[var(--color-outline-variant)]/20 bg-[linear-gradient(180deg,#f8fbfb_0%,#eef4f4_100%)] shadow-[18px_0_40px_rgba(15,35,35,0.06)] lg:flex">
        <StaffSidebarContent pathname={pathname} />
      </aside>

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/60 bg-white/80 px-5 shadow-sm backdrop-blur-md lg:ml-64 lg:px-8">
        <div className="flex flex-1 items-center gap-4">
          <button
            type="button"
            aria-expanded={isMobileNavOpen}
            aria-controls="staff-sidebar"
            aria-label={
              isMobileNavOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-teal-50 hover:text-teal-700 lg:hidden"
            onClick={() => setIsMobileNavOpen((current) => !current)}
          >
            <span className="material-symbols-outlined">
              {isMobileNavOpen ? "close" : "menu"}
            </span>
          </button>
          <div className="hidden max-w-md flex-1 items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 md:flex">
            <span className="material-symbols-outlined mr-2 text-slate-400">
              search
            </span>
            <input
              placeholder="Search bookings, appointments, services..."
              className="w-full border-none bg-transparent p-0 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="lg:hidden">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Staff Portal
            </p>
            <p className="font-heading text-lg font-bold tracking-tight text-slate-900">
              Dental CRM
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">
            MVP Workspace
          </span>
          <div className="hidden h-8 w-px bg-slate-200 sm:block" />
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {getDisplayName(profile)}
            </p>
            <p className="text-xs text-slate-500">
              {getRoleLabel(profile.role)}
            </p>
          </div>
        </div>
      </header>

      <main className="px-5 py-8 lg:ml-64 lg:px-8 lg:py-10">{children}</main>
    </div>
  );
}
