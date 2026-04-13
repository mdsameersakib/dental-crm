import Link from "next/link";

import { getBookingPageData } from "@/features/public-content/queries";

import { submitBookingRequest } from "./actions";

type BookPageProps = {
  searchParams: Promise<{
    service?: string;
    dentist?: string;
    submitted?: string;
    error?: string;
  }>;
};

export default async function BookPage({ searchParams }: BookPageProps) {
  const params = await searchParams;
  const { services, dentists, contactEmail, contactPhone } =
    await getBookingPageData();

  if (services.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-6 pt-32 pb-28">
        <div className="rounded-[2rem] border border-dashed border-[var(--color-outline-variant)]/20 bg-[var(--color-surface-container-lowest)] px-8 py-16 text-center shadow-sm">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-[var(--color-foreground)]">
            Booking placeholder
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--color-on-surface-variant)]">
            Add real public services before enabling the booking flow. This
            route is intentionally paused until clinic data is ready.
          </p>
        </div>
      </main>
    );
  }

  const selectedServiceSlug = params.service ?? services[0]?.slug;
  const selectedDentistSlug = params.dentist ?? "";
  const bookingSteps = [
    ["1", "Service", true],
    ["2", "DateTime", false],
    ["3", "Details", false],
    ["4", "Review", false],
  ] as const;

  return (
    <main className="mx-auto max-w-7xl px-6 pt-32 pb-28">
      <section className="mb-16">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          {bookingSteps.map(([step, label, active], index) => (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                    active
                      ? "bg-[var(--color-primary)] text-white shadow-md"
                      : "bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]"
                  }`}
                >
                  {step}
                </div>
                <span
                  className={`text-xs ${
                    active
                      ? "font-semibold text-[var(--color-primary)]"
                      : "font-medium text-[var(--color-on-surface-variant)] opacity-60"
                  }`}
                >
                  {label}
                </span>
              </div>

              {index < 3 ? (
                <div className="mx-4 h-px flex-1 bg-[var(--color-border)] opacity-30" />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <div className="mb-12 text-center">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-[var(--color-foreground)] md:text-5xl">
          Select Your Treatment
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg font-light text-[var(--color-on-surface-variant)]">
          Choose the clinical service you require. All our treatments are
          performed by specialists in a premium atelier environment.
        </p>
      </div>

      {params.error ? (
        <div className="mx-auto mb-8 max-w-3xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {params.error}
        </div>
      ) : null}

      {params.submitted ? (
        <div className="mx-auto mb-8 max-w-3xl rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          Your booking request was submitted. Our team will contact you shortly
          at <span className="font-semibold">{contactPhone}</span> or{" "}
          <span className="font-semibold">{contactEmail}</span>.
        </div>
      ) : null}

      <form action={submitBookingRequest} className="space-y-14">
        <section>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const isSelected = service.slug === selectedServiceSlug;

              return (
                <label
                  key={service.id}
                  className={`group relative flex cursor-pointer flex-col rounded-xl border p-8 transition-all duration-300 ${
                    isSelected
                      ? "border-[var(--color-primary)] bg-[var(--color-surface-container-lowest)] ring-2 ring-[var(--color-primary)]"
                      : "border-transparent bg-[var(--color-surface-container-low)] hover:border-[rgba(0,101,101,0.12)] hover:shadow-2xl"
                  }`}
                >
                  <input
                    type="radio"
                    name="service_id"
                    value={service.id}
                    defaultChecked={isSelected}
                    className="sr-only"
                  />

                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--color-primary-fixed)] transition-transform duration-300 group-hover:scale-110">
                    <span className="material-symbols-outlined text-3xl text-[var(--color-primary)]">
                      {service.iconName}
                    </span>
                  </div>

                  <h2 className="mb-3 font-heading text-2xl font-bold text-[var(--color-foreground)]">
                    {service.name}
                  </h2>
                  <p className="mb-6 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                    {service.fullDescription}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-bold text-[var(--color-primary)]">
                      {service.priceLabel}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)] opacity-60">
                      {service.durationLabel}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-[2rem] bg-[var(--color-surface-container-lowest)] p-8 shadow-[0_20px_40px_rgba(25,28,30,0.06)] ring-1 ring-[rgba(189,201,200,0.2)] md:p-10">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                Appointment Details
              </p>
              <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-[var(--color-foreground)]">
                Choose your preferred date and tell us how to reach you.
              </h2>
            </div>

            <div className="grid gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="grid gap-2 text-sm">
                  <span className="font-semibold text-[var(--color-on-surface-variant)]">
                    Preferred Date
                  </span>
                  <input
                    name="preferred_date"
                    type="date"
                    required
                    className="rounded-xl border-0 bg-[var(--color-surface-container-low)] px-5 py-4 outline-none focus:ring-2 focus:ring-[rgba(0,101,101,0.35)]"
                  />
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="font-semibold text-[var(--color-on-surface-variant)]">
                    Preferred Time
                  </span>
                  <select
                    name="preferred_time"
                    required
                    defaultValue=""
                    className="rounded-xl border-0 bg-[var(--color-surface-container-low)] px-5 py-4 outline-none focus:ring-2 focus:ring-[rgba(0,101,101,0.35)]"
                  >
                    <option value="" disabled>
                      Select a preferred time
                    </option>
                    <option value="08:00 - 10:00">08:00 - 10:00</option>
                    <option value="10:00 - 12:00">10:00 - 12:00</option>
                    <option value="12:00 - 14:00">12:00 - 14:00</option>
                    <option value="14:00 - 16:00">14:00 - 16:00</option>
                    <option value="16:00 - 18:00">16:00 - 18:00</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="grid gap-2 text-sm">
                  <span className="font-semibold text-[var(--color-on-surface-variant)]">
                    Full Name
                  </span>
                  <input
                    name="patient_name"
                    type="text"
                    required
                    placeholder="Md. Sameer Sakib"
                    className="rounded-xl border-0 bg-[var(--color-surface-container-low)] px-5 py-4 outline-none focus:ring-2 focus:ring-[rgba(0,101,101,0.35)]"
                  />
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="font-semibold text-[var(--color-on-surface-variant)]">
                    Phone Number
                  </span>
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="+8801XXXXXXXXX"
                    className="rounded-xl border-0 bg-[var(--color-surface-container-low)] px-5 py-4 outline-none focus:ring-2 focus:ring-[rgba(0,101,101,0.35)]"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm">
                <span className="font-semibold text-[var(--color-on-surface-variant)]">
                  Email Address
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="rounded-xl border-0 bg-[var(--color-surface-container-low)] px-5 py-4 outline-none focus:ring-2 focus:ring-[rgba(0,101,101,0.35)]"
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span className="font-semibold text-[var(--color-on-surface-variant)]">
                  Preferred Dentist
                </span>
                <select
                  name="preferred_dentist_id"
                  defaultValue={
                    dentists.find(
                      (dentist) => dentist.slug === selectedDentistSlug,
                    )?.id ?? ""
                  }
                  className="rounded-xl border-0 bg-[var(--color-surface-container-low)] px-5 py-4 outline-none focus:ring-2 focus:ring-[rgba(0,101,101,0.35)]"
                >
                  <option value="">No preference</option>
                  {dentists.map((dentist) => (
                    <option key={dentist.id} value={dentist.id}>
                      {dentist.name} · {dentist.specialty}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm">
                <span className="font-semibold text-[var(--color-on-surface-variant)]">
                  Notes
                </span>
                <textarea
                  name="notes"
                  rows={5}
                  placeholder="Tell us about symptoms, urgency, or preferred contact method."
                  className="rounded-xl border-0 bg-[var(--color-surface-container-low)] px-5 py-4 outline-none focus:ring-2 focus:ring-[rgba(0,101,101,0.35)]"
                />
              </label>
            </div>
          </div>

          <aside className="h-fit rounded-[2rem] bg-[var(--color-surface-container-lowest)] p-8 shadow-[0_20px_40px_rgba(25,28,30,0.06)] ring-1 ring-[rgba(189,201,200,0.2)] lg:sticky lg:top-28">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
              Booking Review
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-[var(--color-foreground)]">
              Submit your request
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--color-on-surface-variant)]">
              Your request goes directly to our front desk as a public booking
              inquiry. A staff member will confirm availability before anything
              is finalized.
            </p>

            <div className="mt-8 space-y-4 rounded-2xl bg-[var(--color-surface-container-low)] p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)] opacity-70">
                  Contact
                </span>
                <span className="text-sm font-semibold text-[var(--color-foreground)]">
                  {contactPhone}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)] opacity-70">
                  Email
                </span>
                <span className="text-right text-sm font-semibold text-[var(--color-foreground)]">
                  {contactEmail}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="hero-gradient mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-white shadow-lg shadow-[rgba(0,101,101,0.16)] transition-all duration-150 hover:shadow-[rgba(0,101,101,0.24)] active:scale-[0.98]"
            >
              Submit Booking Request
              <span className="material-symbols-outlined text-lg">
                arrow_forward
              </span>
            </button>

            <Link
              href="/services"
              className="mt-4 block text-center text-sm font-semibold text-[var(--color-accent)] transition-colors hover:text-[var(--color-primary)]"
            >
              Need to compare treatments first?
            </Link>
          </aside>
        </section>
      </form>
    </main>
  );
}
