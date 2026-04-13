export const publicExperience = [
  {
    slug: "landing",
    title: "Landing",
    description: "Editorial homepage for services, dentists, trust signals, and booking entry points.",
  },
  {
    slug: "services",
    title: "Services",
    description: "Service listing and treatment explanation pages.",
  },
  {
    slug: "dentists",
    title: "Dentists",
    description: "Clinician listing and individual dentist profile pages.",
  },
  {
    slug: "booking",
    title: "Booking",
    description: "Public appointment request flow that feeds the internal scheduling pipeline.",
  },
] as const;

export const patientExperience = [
  "Appointments",
  "Treatment history",
] as const;

export const staffExperience = [
  "Dashboard",
  "Booking requests",
  "Appointments",
  "Services",
  "Dentists",
  "Landing content",
  "Settings",
] as const;
