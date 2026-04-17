import type {
  PublicDentist,
  PublicService,
} from "@/features/public-content/queries";

export const publicBookingTimeOptions = [
  { value: "", label: "Select a preferred time" },
  { value: "08:00 - 10:00", label: "08:00 - 10:00" },
  { value: "10:00 - 12:00", label: "10:00 - 12:00" },
  { value: "12:00 - 14:00", label: "12:00 - 14:00" },
  { value: "14:00 - 16:00", label: "14:00 - 16:00" },
  { value: "16:00 - 18:00", label: "16:00 - 18:00" },
] as const;

export function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getInitialBookingSelection(
  services: PublicService[],
  dentists: PublicDentist[],
  params: {
    service?: string;
    dentist?: string;
  },
) {
  const selectedServiceSlug = params.service ?? services[0]?.slug;
  const selectedServiceId =
    services.find((service) => service.slug === selectedServiceSlug)?.id ??
    services[0]?.id ??
    "";
  const selectedDentistId =
    dentists.find((dentist) => dentist.slug === params.dentist)?.id ?? "";

  return {
    selectedServiceId,
    selectedDentistId,
  };
}
