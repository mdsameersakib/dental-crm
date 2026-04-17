type BookingFeedbackBannerProps = {
  error?: string;
  submitted?: string;
  contactPhone: string;
  contactEmail: string;
};

export function BookingFeedbackBanner({
  error,
  submitted,
  contactPhone,
  contactEmail,
}: BookingFeedbackBannerProps) {
  if (error) {
    return (
      <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
        Your booking request was submitted. Our team will contact you shortly at{" "}
        <span className="font-semibold">{contactPhone}</span> or{" "}
        <span className="font-semibold">{contactEmail}</span>.
      </div>
    );
  }

  return null;
}
