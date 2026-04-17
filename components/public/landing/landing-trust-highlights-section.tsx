type TrustHighlight = {
  icon: string;
  title: string;
  description: string;
};

type LandingTrustHighlightsSectionProps = {
  items: readonly TrustHighlight[];
};

export function LandingTrustHighlightsSection({
  items,
}: LandingTrustHighlightsSectionProps) {
  return (
    <section className="bg-[var(--color-surface-container-low)] py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {items.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl bg-[var(--color-surface-container-lowest)] p-5 text-center shadow-sm ring-1 ring-[rgba(189,201,200,0.2)]"
            >
              <span className="material-symbols-outlined mb-3 text-3xl text-[var(--color-primary)]">
                {item.icon}
              </span>
              <h3 className="font-heading text-sm font-bold text-[var(--color-foreground)] md:text-base">
                {item.title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-[var(--color-on-surface-variant)]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
