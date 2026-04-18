"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { staffNavigationSections } from "@/features/staff/navigation";

type StaffShellProps = {
  children: React.ReactNode;
  signOutAction: (formData: FormData) => void | Promise<void>;
};

function StaffSidebarContent({
  pathname,
  signOutAction,
  onNavigate,
}: {
  pathname: string;
  signOutAction: (formData: FormData) => void | Promise<void>;
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

      <div className="border-t border-[var(--color-outline-variant)]/20 p-3">
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-white hover:text-slate-900"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
            Log Out
          </button>
        </form>
      </div>
    </>
  );
}

export function StaffShell({ children, signOutAction }: StaffShellProps) {
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
            signOutAction={signOutAction}
            onNavigate={() => setIsMobileNavOpen(false)}
          />
        </aside>
      </div>

      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col overflow-hidden border-r border-[var(--color-outline-variant)]/20 bg-[linear-gradient(180deg,#f8fbfb_0%,#eef4f4_100%)] shadow-[18px_0_40px_rgba(15,35,35,0.06)] lg:flex">
        <StaffSidebarContent
          pathname={pathname}
          signOutAction={signOutAction}
        />
      </aside>

      <main className="px-5 py-8 lg:ml-64 lg:px-8 lg:py-10">
        <div className="mb-5 lg:hidden">
          <button
            type="button"
            aria-expanded={isMobileNavOpen}
            aria-controls="staff-sidebar"
            aria-label={
              isMobileNavOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            onClick={() => setIsMobileNavOpen((current) => !current)}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isMobileNavOpen ? "close" : "menu"}
            </span>
            Menu
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
