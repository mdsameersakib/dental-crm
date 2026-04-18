"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type PublicSiteShellProps = {
  children: React.ReactNode;
};

const navLinks = [
  { href: "/#top", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#dentists", label: "Dentists" },
  { href: "/#contact", label: "Contact" },
];

export function PublicSiteShell({ children }: PublicSiteShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <header className="fixed top-0 z-50 w-full border-b border-white/70 bg-white/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-primary-fixed)] text-[var(--color-primary)]">
              <span className="material-symbols-outlined text-xl">
                dentistry
              </span>
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                Dental CRM
              </p>
              <p className="text-sm font-semibold text-[var(--color-foreground)]">
                Public Clinic Website
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => {
              const isActive =
                (link.href === "/#top" && pathname === "/") ||
                (link.href !== "/" &&
                  !link.href.includes("#") &&
                  pathname === link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    isActive
                      ? "text-sm font-semibold text-[var(--color-primary)]"
                      : "text-sm text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-primary)]"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full border border-[var(--color-outline-variant)]/30 px-4 py-2.5 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)] md:inline-flex"
            >
              Login
            </Link>

            <Link
              href="/book"
              className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold !text-white"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-[var(--color-outline-variant)]/20 bg-[var(--color-surface-container-low)] pt-16 pb-8">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
              Dental CRM
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
              A simple clinic website connected to a staff-managed CRM.
            </h2>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-foreground)]">
              Explore
            </h3>
            <div className="mt-5 grid gap-3 text-sm text-[var(--color-on-surface-variant)]">
              <Link href="/">Home</Link>
              <Link href="/services">Services</Link>
              <Link href="/dentists">Dentists</Link>
              <Link href="/book">Book</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-foreground)]">
              Access
            </h3>
            <div className="mt-5 grid gap-3 text-sm text-[var(--color-on-surface-variant)]">
              <Link href="/#contact">Contact</Link>
              <Link href="/login">Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
