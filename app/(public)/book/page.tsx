import { BookingEmptyState } from "@/components/public/booking/booking-empty-state";
import { BookingFeedbackBanner } from "@/components/public/booking/booking-feedback-banner";
import { BookingFormFields } from "@/components/public/booking/booking-form-fields";
import { BookingSidebar } from "@/components/public/booking/booking-sidebar";
import {
  getInitialBookingSelection,
  getTodayDateString,
} from "@/features/bookings/public-form";

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
    return <BookingEmptyState />;
  }

  const today = getTodayDateString();
  const { selectedDentistId, selectedServiceId } = getInitialBookingSelection(
    services,
    dentists,
    params,
  );

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

      <BookingFeedbackBanner
        contactEmail={contactEmail}
        contactPhone={contactPhone}
        error={params.error}
        submitted={params.submitted}
      />

      <form
        action={submitBookingRequest}
        className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <BookingFormFields
          dentists={dentists}
          selectedDentistId={selectedDentistId}
          selectedServiceId={selectedServiceId}
          services={services}
          today={today}
        />
        <BookingSidebar
          contactEmail={contactEmail}
          contactPhone={contactPhone}
        />
      </form>
    </main>
  );
}
