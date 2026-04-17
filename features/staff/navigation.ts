export type StaffNavigationLink = {
  href: string;
  label: string;
  icon: string;
};

export type StaffNavigationSection = {
  title: string;
  links: StaffNavigationLink[];
};

export const staffNavigationSections: StaffNavigationSection[] = [
  {
    title: "Operations",
    links: [
      // Dashboard was planned early, but it's intentionally hidden for the MVP scope.
      {
        href: "/staff/booking-requests",
        label: "Booking Requests",
        icon: "event_note",
      },
      {
        href: "/staff/appointments",
        label: "Appointments",
        icon: "calendar_today",
      },
    ],
  },
  {
    title: "Content",
    links: [
      {
        href: "/staff/services",
        label: "Services",
        icon: "medical_services",
      },
      {
        href: "/staff/dentists",
        label: "Dentists",
        icon: "medical_information",
      },
      {
        href: "/staff/landing-content",
        label: "Landing Content",
        icon: "web",
      },
    ],
  },
  {
    title: "Workspace",
    links: [{ href: "/staff/settings", label: "Settings", icon: "settings" }],
  },
] as const;
