"use client";

import { ServiceSelect } from "@/app/(public)/book/service-select";
import { SimpleSelect } from "@/app/(public)/book/simple-select";
import { publicBookingTimeOptions } from "@/features/bookings/public-form";
import type {
  PublicDentist,
  PublicService,
} from "@/features/public-content/queries";

type BookingFormFieldsProps = {
  services: PublicService[];
  dentists: PublicDentist[];
  selectedServiceId: string;
  selectedDentistId: string;
  today: string;
};

const fieldClassName =
  "rounded-xl border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-container-low)] px-4 py-3 outline-none focus:ring-2 focus:ring-[rgba(0,101,101,0.35)]";

export function BookingFormFields({
  services,
  dentists,
  selectedServiceId,
  selectedDentistId,
  today,
}: BookingFormFieldsProps) {
  return (
    <div className="space-y-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[rgba(189,201,200,0.25)] md:p-8">
      <div className="grid gap-2 text-sm">
        <label
          htmlFor="service_id_button"
          className="font-semibold text-[var(--color-on-surface-variant)]"
        >
          1. Choose a service{" "}
          <span className="text-[var(--color-primary)]">*</span>
        </label>
        <ServiceSelect
          id="service_id_button"
          name="service_id"
          defaultValue={selectedServiceId}
          options={services.map((service) => ({
            id: service.id,
            name: service.name,
            priceLabel: service.priceLabel,
            durationLabel: service.durationLabel,
          }))}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="font-semibold text-[var(--color-on-surface-variant)]">
            2. Preferred date{" "}
            <span className="text-[var(--color-primary)]">*</span>
          </span>
          <input
            id="preferred_date"
            name="preferred_date"
            type="date"
            required
            min={today}
            className={fieldClassName}
          />
        </label>

        <div className="grid gap-2 text-sm">
          <label
            htmlFor="preferred_time_button"
            className="font-semibold text-[var(--color-on-surface-variant)]"
          >
            3. Preferred time{" "}
            <span className="text-[var(--color-primary)]">*</span>
          </label>
          <SimpleSelect
            id="preferred_time_button"
            name="preferred_time"
            defaultValue=""
            required
            options={[...publicBookingTimeOptions]}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="font-semibold text-[var(--color-on-surface-variant)]">
            4. Full name <span className="text-[var(--color-primary)]">*</span>
          </span>
          <input
            id="patient_name"
            name="patient_name"
            type="text"
            required
            placeholder="Full patient name"
            className={fieldClassName}
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-semibold text-[var(--color-on-surface-variant)]">
            5. Phone number{" "}
            <span className="text-[var(--color-primary)]">*</span>
          </span>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+1 555 123 4567"
            className={fieldClassName}
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm">
        <span className="font-semibold text-[var(--color-on-surface-variant)]">
          6. Email address{" "}
          <span className="text-[var(--color-primary)]">*</span>
        </span>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className={fieldClassName}
        />
      </label>

      <div className="grid gap-2 text-sm">
        <label
          htmlFor="preferred_dentist_id_button"
          className="font-semibold text-[var(--color-on-surface-variant)]"
        >
          Preferred dentist (optional)
        </label>
        <SimpleSelect
          id="preferred_dentist_id_button"
          name="preferred_dentist_id"
          defaultValue={selectedDentistId}
          options={[
            { value: "", label: "No preference" },
            ...dentists.map((dentist) => ({
              value: dentist.id,
              label: dentist.name,
              subLabel: dentist.specialty,
            })),
          ]}
        />
      </div>

      <label className="grid gap-2 text-sm">
        <span className="font-semibold text-[var(--color-on-surface-variant)]">
          Notes (optional)
        </span>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Share symptoms, urgency, or anything the clinic should know."
          className={fieldClassName}
        />
      </label>

      <button
        type="submit"
        className="hero-gradient inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-md transition-transform hover:-translate-y-0.5"
      >
        Submit Booking Request
        <span className="material-symbols-outlined text-lg">arrow_forward</span>
      </button>
    </div>
  );
}
