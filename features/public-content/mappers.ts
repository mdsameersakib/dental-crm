import type { Database } from "@/types/database";

import { scheduleDayLabels } from "./constants";
import type {
  PublicDentist,
  PublicDentistDetail,
  PublicService,
} from "./types";

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type DentistRow = Database["public"]["Tables"]["dentist_profiles"]["Row"];
type DentistScheduleRow =
  Database["public"]["Tables"]["dentist_schedules"]["Row"];

export type DentistProfileWithName = Pick<
  DentistRow,
  | "id"
  | "slug"
  | "short_bio"
  | "bio"
  | "specializations"
  | "education"
  | "profile_photo_path"
> & { profile_name: string };

export function formatMoney(amount: number | null) {
  if (amount === null) {
    return "By consultation";
  }

  const formatted = new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);

  return `৳${formatted}`;
}

export function formatDuration(durationMin: number | null) {
  if (!durationMin) {
    return "Custom timing";
  }

  if (durationMin < 60) {
    return `${durationMin} mins`;
  }

  const hours = Math.floor(durationMin / 60);
  const minutes = durationMin % 60;

  return minutes
    ? `${hours}h ${minutes}m`
    : `${hours} hour${hours === 1 ? "" : "s"}`;
}

export function formatTime(value: string) {
  const [hoursRaw, minutes] = value.split(":");
  const hours = Number(hoursRaw);

  if (Number.isNaN(hours)) {
    return value;
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const twelveHour = hours % 12 || 12;

  return `${twelveHour}:${minutes} ${suffix}`;
}

export function mapPublicServices(
  services: Pick<
    ServiceRow,
    | "id"
    | "slug"
    | "name"
    | "short_description"
    | "full_description"
    | "icon_name"
    | "image_path"
    | "base_price"
    | "duration_min"
  >[],
): PublicService[] {
  return services.map((service) => ({
    id: service.id,
    slug: service.slug,
    name: service.name,
    shortDescription:
      service.short_description ?? "Tailored treatment planning and care.",
    fullDescription:
      service.full_description ??
      service.short_description ??
      "Tailored treatment planning and care.",
    iconName: service.icon_name ?? "stethoscope",
    imageUrl: service.image_path ?? null,
    durationLabel: formatDuration(service.duration_min),
    priceLabel: formatMoney(service.base_price),
  }));
}

export function mapPublicDentists(
  dentists: DentistProfileWithName[],
): PublicDentist[] {
  return dentists.map((dentist) => ({
    id: dentist.id,
    slug: dentist.slug ?? dentist.id,
    name: dentist.profile_name,
    specialty: dentist.specializations[0] ?? "Dental Specialist",
    education:
      Array.isArray(dentist.education) &&
      typeof dentist.education[0] === "string"
        ? dentist.education[0]
        : "Advanced Clinical Training",
    shortBio:
      dentist.short_bio ??
      dentist.bio ??
      "Experienced clinician focused on patient comfort and modern dentistry.",
    imageUrl:
      dentist.profile_photo_path ||
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
  }));
}

export function buildDefaultAvailability(): PublicDentistDetail["availability"] {
  return [
    { day: "monday", label: "Mon · 09:00 AM - 05:00 PM", isAvailable: true },
    { day: "tuesday", label: "Tue · 09:00 AM - 05:00 PM", isAvailable: true },
    { day: "wednesday", label: "Wed · 09:00 AM - 05:00 PM", isAvailable: true },
    { day: "thursday", label: "Thu · 09:00 AM - 05:00 PM", isAvailable: true },
    { day: "friday", label: "Fri · 09:00 AM - 05:00 PM", isAvailable: true },
    { day: "saturday", label: "Sat · Closed", isAvailable: false },
    { day: "sunday", label: "Sun · Closed", isAvailable: false },
  ];
}

export function mapDentistAvailability(
  schedules: Pick<
    DentistScheduleRow,
    "day_of_week" | "start_time" | "end_time" | "is_available"
  >[],
) {
  const availabilityMap = new Map<
    string,
    Pick<DentistScheduleRow, "start_time" | "end_time" | "is_available">
  >();

  for (const schedule of schedules) {
    if (!availabilityMap.has(schedule.day_of_week)) {
      availabilityMap.set(schedule.day_of_week, schedule);
    }
  }

  const availability = (
    ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const
  ).map((day) => {
    const schedule = availabilityMap.get(day);
    const dayMeta = scheduleDayLabels[day];

    if (!schedule || !schedule.is_available) {
      return {
        day: dayMeta.key,
        label: `${dayMeta.shortLabel} · Closed`,
        isAvailable: false,
      };
    }

    return {
      day: dayMeta.key,
      label: `${dayMeta.shortLabel} · ${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}`,
      isAvailable: true,
    };
  });

  return availability.some((entry) => entry.isAvailable)
    ? availability
    : buildDefaultAvailability();
}
