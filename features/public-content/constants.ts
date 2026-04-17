import type { Database } from "@/types/database";

export const DEFAULT_CONTACT_PHONE = "Clinic phone will be added by staff";
export const DEFAULT_CONTACT_EMAIL = "clinic@example.com";
export const DEFAULT_CLINIC_ADDRESS = "Clinic address will be added by staff";

export const scheduleDayLabels: Record<
  Database["public"]["Enums"]["day_of_week"],
  { key: string; shortLabel: string }
> = {
  mon: { key: "monday", shortLabel: "Mon" },
  tue: { key: "tuesday", shortLabel: "Tue" },
  wed: { key: "wednesday", shortLabel: "Wed" },
  thu: { key: "thursday", shortLabel: "Thu" },
  fri: { key: "friday", shortLabel: "Fri" },
  sat: { key: "saturday", shortLabel: "Sat" },
  sun: { key: "sunday", shortLabel: "Sun" },
};
