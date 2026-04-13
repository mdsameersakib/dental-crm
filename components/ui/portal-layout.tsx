import Link from "next/link";

type PortalLayoutProps = {
  title: string;
  subtitle: string;
  links: { href: string; label: string }[];
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function PortalLayout({
  title,
  subtitle,
  links,
  action,
  children,
}: PortalLayoutProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5f8f8_0%,#edf4f3_100%)]">
      <header className="border-b border-[var(--color-border)] bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
              Dental CRM
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{subtitle}</p>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <nav className="flex flex-wrap gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {action}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
