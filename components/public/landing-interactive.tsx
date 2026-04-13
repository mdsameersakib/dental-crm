"use client";

import { useState } from "react";

type LandingInteractiveProps = {
  faqs: readonly string[];
  lang?: "en" | "bn";
};

export function LandingInteractive({
  faqs,
  lang = "en",
}: LandingInteractiveProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const copy =
    lang === "bn"
      ? {
          faqHeading: "ক্লিনিক্যাল জিজ্ঞাসা",
          faqText: "প্রথম ভিজিটের আগে যা জানা দরকার।",
          faqAnswer:
            "ভিজিটের সময় আমরা সবকিছু পরিষ্কারভাবে বুঝিয়ে দেব এবং আপনার কেস, স্বাচ্ছন্দ্য ও চিকিৎসার লক্ষ্য অনুযায়ী পরামর্শ দেব।",
        }
      : {
          faqHeading: "Clinical Inquiries",
          faqText: "Everything you need to know about your first visit.",
          faqAnswer:
            "We'll walk you through this clearly during your visit and tailor recommendations to your case, comfort, and treatment goals.",
        };

  return (
    <section className="bg-[var(--color-surface-container-low)] py-24" id="faq">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-heading text-4xl font-bold text-[var(--color-foreground)]">
            {copy.faqHeading}
          </h2>
          <p className="font-light text-[var(--color-on-surface-variant)]">
            {copy.faqText}
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                key={faq}
                className="rounded-2xl border border-transparent bg-[var(--color-surface-container-lowest)] p-6 shadow-sm transition-all hover:border-[rgba(0,101,101,0.1)]"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq((current) => (current === index ? null : index))
                  }
                  className="flex w-full items-center justify-between text-left font-heading text-lg font-bold text-[var(--color-foreground)]"
                  aria-expanded={isOpen}
                >
                  <span>{faq}</span>
                  <span className="material-symbols-outlined text-[var(--color-primary)]">
                    {isOpen ? "remove" : "add"}
                  </span>
                </button>
                {isOpen ? (
                  <p className="mt-4 pr-10 text-sm leading-7 text-[var(--color-on-surface-variant)]">
                    {copy.faqAnswer}
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
