type RoutePlaceholderProps = {
  title: string;
  description: string;
  area: "Public" | "Patient" | "Staff" | "Auth" | "API";
  path: string;
  notes?: string[];
};

export function RoutePlaceholder({
  title,
  description,
  area,
  path,
  notes = [],
}: RoutePlaceholderProps) {
  return (
    <section className="rounded-[28px] border border-[var(--color-outline-variant)]/15 bg-[var(--color-surface-container-lowest)] p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            {area} Route
          </p>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">
            {title}
          </h1>
        </div>
        <code className="rounded-full bg-[var(--color-surface-container-low)] px-4 py-2 text-xs text-[var(--color-on-surface-variant)]">
          {path}
        </code>
      </div>
      <p className="max-w-2xl text-sm leading-7 text-[var(--color-on-surface-variant)]">
        {description}
      </p>
      {notes.length > 0 ? (
        <ul className="mt-6 grid gap-3 text-sm text-[var(--color-foreground)] md:grid-cols-2">
          {notes.map((note) => (
            <li
              key={note}
              className="rounded-2xl bg-[var(--color-surface-container-low)] px-4 py-3"
            >
              {note}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
