type BookingSidebarProps = {
  contactPhone: string;
  contactEmail: string;
};

export function BookingSidebar({
  contactPhone,
  contactEmail,
}: BookingSidebarProps) {
  return (
    <aside className="h-fit rounded-3xl bg-[var(--color-surface-container-lowest)] p-6 shadow-sm ring-1 ring-[rgba(189,201,200,0.25)] lg:sticky lg:top-28">
      <h2 className="font-heading text-2xl font-bold text-[var(--color-foreground)]">
        How it works
      </h2>
      <ol className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-on-surface-variant)]">
        <li>Choose a service and your preferred date/time.</li>
        <li>Share your contact details and optional notes.</li>
        <li>Submit your request for staff confirmation.</li>
      </ol>

      <div className="mt-6 rounded-2xl bg-[var(--color-surface-container-low)] p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]/70">
          Clinic contact
        </p>
        <p className="mt-2 text-sm font-semibold text-[var(--color-foreground)]">
          {contactPhone}
        </p>
        <p className="mt-1 text-sm text-[var(--color-foreground)]">
          {contactEmail}
        </p>
      </div>
    </aside>
  );
}
