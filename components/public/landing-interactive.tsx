"use client";

import { useState } from "react";

const faqs = [
  "How does booking work on this site?",
  "Can I choose a specific dentist?",
  "When is the appointment confirmed?",
] as const;

export function LandingInteractive() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section
      className="bg-[var(--color-surface-container-low)] pt-8 pb-24 md:pt-10"
      id="faq"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
            FAQ
          </p>
          <h2 className="mt-4 font-heading text-4xl font-bold tracking-tight text-[var(--color-foreground)]">
            What patients should know before sending a request.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--color-on-surface-variant)]">
            The public website is intentionally simple: review services, choose
            a dentist if you want, and send a booking request that staff
            confirms afterwards.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[2rem] bg-[var(--color-outline-variant)]/20">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            const answer =
              index === 0
                ? "You select a service, choose a preferred date and time, and submit your details. The request goes to the clinic staff for review."
                : index === 1
                  ? "Yes. If a dentist profile is published, patients can select that dentist from the booking page or start from the dentist profile directly."
                  : "A submitted request is not the final appointment yet. Staff reviews availability and contacts the patient to confirm the final schedule.";

            return (
              <div key={faq} className="bg-white p-6 md:p-7">
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq((current) => (current === index ? null : index))
                  }
                  className="flex w-full items-center justify-between gap-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-xl font-bold text-[var(--color-foreground)]">
                    {faq}
                  </span>
                  <span className="material-symbols-outlined text-[var(--color-primary)]">
                    {isOpen ? "remove" : "add"}
                  </span>
                </button>

                {isOpen ? (
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-on-surface-variant)]">
                    {answer}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
