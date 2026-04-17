import Link from "next/link";

import { getBookingPageData } from "@/features/public-content/queries";

import { submitBookingRequest } from "./actions";
import { ServiceSelect } from "./service-select";
import { SimpleSelect } from "./simple-select";

type BookPageProps = {
  searchParams: Promise<{
    service?: string;
    dentist?: string;
    submitted?: string;
    error?: string;
  }>;
};

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function BookPage({ searchParams }: BookPageProps) {
  const params = await searchParams;
  const { services, dentists, contactEmail, contactPhone } =
    await getBookingPageData();
  const today = getTodayDateString();

  if (services.length === 0) {
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

  const selectedServiceSlug = params.service ?? services[0]?.slug;
  const selectedServiceId =
    services.find((service) => service.slug === selectedServiceSlug)?.id ??
    services[0]?.id ??
    "";
  const selectedDentistSlug = params.dentist ?? "";

  return (
    <main className="mx-auto max-w-7xl px-6 pt-28 pb-24">
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
          Booking Request
        </p>
        <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-[var(--color-foreground)] md:text-5xl">
          Request an appointment in under a minute.
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--color-on-surface-variant)]">
          Pick a service, share your preferred date and time, and submit your
          contact details. Our team confirms the final slot.
        </p>
      </section>

      {params.error ? (
        <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {params.error}
        </div>
      ) : null}

      {params.submitted ? (
        <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          Your booking request was submitted. Our team will contact you shortly
          at <span className="font-semibold">{contactPhone}</span> or{" "}
          <span className="font-semibold">{contactEmail}</span>.
        </div>
      ) : null}

      <form
        action={submitBookingRequest}
        className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="space-y-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[rgba(189,201,200,0.25)] md:p-8">
          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[var(--color-on-surface-variant)]">
              1. Choose a service{" "}
              <span className="text-[var(--color-primary)]">*</span>
            </span>
            <ServiceSelect
              name="service_id"
              defaultValue={selectedServiceId}
              options={services.map((service) => ({
                id: service.id,
                name: service.name,
                priceLabel: service.priceLabel,
                durationLabel: service.durationLabel,
              }))}
            />
          </label>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="font-semibold text-[var(--color-on-surface-variant)]">
                2. Preferred date{" "}
                <span className="text-[var(--color-primary)]">*</span>
              </span>
              <input
                name="preferred_date"
                type="date"
                required
                min={today}
                className="rounded-xl border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-container-low)] px-4 py-3 outline-none focus:ring-2 focus:ring-[rgba(0,101,101,0.35)]"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-semibold text-[var(--color-on-surface-variant)]">
                3. Preferred time{" "}
                <span className="text-[var(--color-primary)]">*</span>
              </span>
              <SimpleSelect
                name="preferred_time"
                defaultValue=""
                required
                options={[
                  { value: "", label: "Select a preferred time" },
                  { value: "08:00 - 10:00", label: "08:00 - 10:00" },
                  { value: "10:00 - 12:00", label: "10:00 - 12:00" },
                  { value: "12:00 - 14:00", label: "12:00 - 14:00" },
                  { value: "14:00 - 16:00", label: "14:00 - 16:00" },
                  { value: "16:00 - 18:00", label: "16:00 - 18:00" },
                ]}
              />
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="font-semibold text-[var(--color-on-surface-variant)]">
                4. Full name{" "}
                <span className="text-[var(--color-primary)]">*</span>
              </span>
              <input
                name="patient_name"
                type="text"
                required
                placeholder="Full patient name"
                className="rounded-xl border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-container-low)] px-4 py-3 outline-none focus:ring-2 focus:ring-[rgba(0,101,101,0.35)]"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-semibold text-[var(--color-on-surface-variant)]">
                5. Phone number{" "}
                <span className="text-[var(--color-primary)]">*</span>
              </span>
              <input
                name="phone"
                type="tel"
                required
                placeholder="+1 555 123 4567"
                className="rounded-xl border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-container-low)] px-4 py-3 outline-none focus:ring-2 focus:ring-[rgba(0,101,101,0.35)]"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[var(--color-on-surface-variant)]">
              6. Email address{" "}
              <span className="text-[var(--color-primary)]">*</span>
            </span>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="rounded-xl border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-container-low)] px-4 py-3 outline-none focus:ring-2 focus:ring-[rgba(0,101,101,0.35)]"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[var(--color-on-surface-variant)]">
              Preferred dentist (optional)
            </span>
            <SimpleSelect
              name="preferred_dentist_id"
              defaultValue={
                dentists.find((dentist) => dentist.slug === selectedDentistSlug)
                  ?.id ?? ""
              }
              options={[
                { value: "", label: "No preference" },
                ...dentists.map((dentist) => ({
                  value: dentist.id,
                  label: dentist.name,
                  subLabel: dentist.specialty,
                })),
              ]}
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold text-[var(--color-on-surface-variant)]">
              Notes (optional)
            </span>
            <textarea
              name="notes"
              rows={4}
              placeholder="Share symptoms, urgency, or anything the clinic should know."
              className="rounded-xl border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-container-low)] px-4 py-3 outline-none focus:ring-2 focus:ring-[rgba(0,101,101,0.35)]"
            />
          </label>

          <button
            type="submit"
            className="hero-gradient inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-md transition-transform hover:-translate-y-0.5"
          >
            Submit Booking Request
            <span className="material-symbols-outlined text-lg">
              arrow_forward
            </span>
          </button>
        </div>

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
      </form>
    </main>
  );
}
