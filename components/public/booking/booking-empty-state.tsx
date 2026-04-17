export function BookingEmptyState() {
  return (
    <main className="mx-auto max-w-4xl px-6 pt-32 pb-28">
      <div className="rounded-3xl border border-dashed border-[var(--color-outline-variant)]/20 bg-[var(--color-surface-container-lowest)] px-8 py-16 text-center shadow-sm">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-[var(--color-foreground)]">
          Booking opens once services are published
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--color-on-surface-variant)]">
          The booking form depends on the published service catalogue. Add
          services from the staff CRM and this page will become active
          automatically.
        </p>
      </div>
    </main>
  );
}
