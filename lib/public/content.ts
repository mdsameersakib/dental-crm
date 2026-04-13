import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/types/database";

type LandingSettingsRow =
  Database["public"]["Tables"]["landing_settings"]["Row"];
type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type DentistRow = Database["public"]["Tables"]["dentist_profiles"]["Row"];
type DentistScheduleRow =
  Database["public"]["Tables"]["dentist_schedules"]["Row"];

type DentistProfileWithName = Pick<
  DentistRow,
  | "id"
  | "slug"
  | "short_bio"
  | "bio"
  | "specializations"
  | "education"
  | "profile_photo_path"
> & { profile_name: string };

export type PublicService = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  imageUrl: string | null;
  durationLabel: string;
  priceLabel: string;
};

export type PublicDentist = {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  education: string;
  shortBio: string;
  imageUrl: string;
};

export type PublicDentistDetail = PublicDentist & {
  bio: string;
  yearsOfExperience: string;
  consultationFee: string;
  isAcceptingPatients: boolean;
  educationItems: string[];
  specialties: string[];
  availability: {
    day: string;
    label: string;
    isAvailable: boolean;
  }[];
};

export type WhyChooseItem = {
  title: string;
  description: string;
};

const landingPlaceholderContent = {
  heroTitle: "Landing content placeholder",
  heroSubtitle:
    "Replace this placeholder copy with the clinic's real landing page story and primary call to action.",
  primaryCtaLabel: "Book Appointment",
  primaryCtaHref: "/book",
  secondaryCtaLabel: "Meet Our Dentists",
  secondaryCtaHref: "/dentists",
  whyChooseUs: [
    {
      title: "Why choose us placeholder",
      description: "Add the first clinic value proposition here.",
    },
    {
      title: "Care experience placeholder",
      description: "Add the second landing highlight here.",
    },
    {
      title: "Trust signal placeholder",
      description: "Add the third proof point here.",
    },
  ] satisfies WhyChooseItem[],
  stats: [
    { label: "Placeholder Metric", value: "TBD" },
    { label: "Placeholder Metric", value: "TBD" },
    { label: "Placeholder Metric", value: "TBD" },
  ],
};

const DEFAULT_CONTACT_PHONE = "Add clinic phone";
const DEFAULT_CONTACT_EMAIL = "Add clinic email";
const DEFAULT_CLINIC_ADDRESS = "Add clinic address";

function toWhyChooseItems(value: Json): WhyChooseItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        return null;
      }

      const title = typeof entry.title === "string" ? entry.title.trim() : "";
      const description =
        typeof entry.description === "string" ? entry.description.trim() : "";

      if (!title || !description) {
        return null;
      }

      return { title, description };
    })
    .filter((entry): entry is WhyChooseItem => entry !== null);
}

function fallbackText(value: string | null | undefined, fallback: string) {
  return value?.trim() ? value : fallback;
}

function formatMoney(amount: number | null) {
  if (amount === null) {
    return "By consultation";
  }

  const formatted = new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);

  return `৳${formatted}`;
}

function formatDuration(durationMin: number | null) {
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

function formatTime(value: string) {
  const [hoursRaw, minutes] = value.split(":");
  const hours = Number(hoursRaw);

  if (Number.isNaN(hours)) {
    return value;
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const twelveHour = hours % 12 || 12;

  return `${twelveHour}:${minutes} ${suffix}`;
}

async function readLandingSettings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("landing_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data as LandingSettingsRow | null;
}

async function readPublishedServices(limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from("services")
    .select(
      "id, slug, name, short_description, full_description, icon_name, image_path, base_price, duration_min",
    )
    .eq("is_active", true)
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("display_order", { ascending: true });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data } = await query;

  return (data ?? []) as Pick<
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
  >[];
}

async function readPublishedDentists(limit?: number) {
  const admin = createAdminClient();
  let query = admin
    .from("dentist_profiles")
    .select(
      "id, slug, short_bio, bio, specializations, education, profile_photo_path, profiles!dentist_profiles_profile_id_fkey(first_name,last_name)",
    )
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("display_order", { ascending: true });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data } = await query;

  return (data?.map((entry) => {
    const profile = Array.isArray(entry.profiles)
      ? entry.profiles[0]
      : entry.profiles;
    const firstName = profile?.first_name?.trim() ?? "";
    const lastName = profile?.last_name?.trim() ?? "";

    return {
      id: entry.id,
      slug: entry.slug,
      short_bio: entry.short_bio,
      bio: entry.bio,
      specializations: entry.specializations,
      education: entry.education,
      profile_photo_path: entry.profile_photo_path,
      profile_name: `${firstName} ${lastName}`.trim() || "Dental Specialist",
    };
  }) ?? []) as DentistProfileWithName[];
}

function mapPublicServices(
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

function mapPublicDentists(
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

function buildDefaultAvailability() {
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

const scheduleDayLabels: Record<
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

export async function getLandingPageData() {
  const [settings, services, dentists] = await Promise.all([
    readLandingSettings(),
    readPublishedServices(6),
    readPublishedDentists(6),
  ]);

  const whyChooseUs = toWhyChooseItems(settings?.why_choose_us ?? []);

  return {
    landing: {
      id: settings?.id ?? null,
      heroTitle: fallbackText(
        settings?.hero_title,
        landingPlaceholderContent.heroTitle,
      ),
      heroSubtitle: fallbackText(
        settings?.hero_subtitle,
        landingPlaceholderContent.heroSubtitle,
      ),
      primaryCtaLabel: fallbackText(
        settings?.primary_cta_label,
        landingPlaceholderContent.primaryCtaLabel,
      ),
      primaryCtaHref: fallbackText(
        settings?.primary_cta_href,
        landingPlaceholderContent.primaryCtaHref,
      ),
      secondaryCtaLabel: fallbackText(
        settings?.secondary_cta_label,
        landingPlaceholderContent.secondaryCtaLabel,
      ),
      secondaryCtaHref: fallbackText(
        settings?.secondary_cta_href,
        landingPlaceholderContent.secondaryCtaHref,
      ),
      whyChooseUs:
        whyChooseUs.length > 0
          ? whyChooseUs
          : landingPlaceholderContent.whyChooseUs,
      contactPhone: settings?.contact_phone?.trim() || DEFAULT_CONTACT_PHONE,
      contactEmail: settings?.contact_email?.trim() || DEFAULT_CONTACT_EMAIL,
      clinicAddress: settings?.clinic_address?.trim() || DEFAULT_CLINIC_ADDRESS,
      stats: landingPlaceholderContent.stats,
    },
    services: mapPublicServices(services),
    dentists: mapPublicDentists(dentists),
  };
}

export async function getPublicDirectoryData() {
  const [services, dentists] = await Promise.all([
    readPublishedServices(),
    readPublishedDentists(),
  ]);

  return {
    services: mapPublicServices(services),
    dentists: mapPublicDentists(dentists),
  };
}

export async function getBookingPageData() {
  const [{ services, dentists }, landing] = await Promise.all([
    getPublicDirectoryData(),
    readLandingSettings(),
  ]);

  return {
    services,
    dentists,
    contactPhone: landing?.contact_phone?.trim() || DEFAULT_CONTACT_PHONE,
    contactEmail: landing?.contact_email?.trim() || DEFAULT_CONTACT_EMAIL,
  };
}

export async function getPublicDentistDetail(dentistId: string) {
  const admin = createAdminClient();
  const { data: dentist } = await admin
    .from("dentist_profiles")
    .select(
      "id, slug, short_bio, bio, specializations, education, profile_photo_path, years_of_experience, consultation_fee, is_accepting_patients, profiles!dentist_profiles_profile_id_fkey(first_name,last_name)",
    )
    .or(`slug.eq.${dentistId},id.eq.${dentistId}`)
    .eq("is_published", true)
    .maybeSingle();

  if (!dentist) {
    return null;
  }

  const firstName =
    (Array.isArray(dentist.profiles) ? dentist.profiles[0] : dentist.profiles)
      ?.first_name ?? "";
  const lastName =
    (Array.isArray(dentist.profiles) ? dentist.profiles[0] : dentist.profiles)
      ?.last_name ?? "";

  const { data: schedules } = await admin
    .from("dentist_schedules")
    .select("day_of_week, start_time, end_time, is_available")
    .eq("dentist_id", dentist.id)
    .order("day_of_week", { ascending: true });

  const availabilityMap = new Map<
    string,
    Pick<DentistScheduleRow, "start_time" | "end_time" | "is_available">
  >();

  for (const schedule of schedules ?? []) {
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

  const educationItems =
    Array.isArray(dentist.education) && dentist.education.length > 0
      ? dentist.education.filter(
          (entry): entry is string => typeof entry === "string",
        )
      : ["Advanced Clinical Training"];

  return {
    id: dentist.id,
    slug: dentist.slug ?? dentist.id,
    name: `${firstName} ${lastName}`.trim() || "Dental Specialist",
    specialty: dentist.specializations[0] ?? "Dental Specialist",
    education: educationItems[0] ?? "Advanced Clinical Training",
    shortBio:
      dentist.short_bio ??
      dentist.bio ??
      "Experienced clinician focused on patient comfort and modern dentistry.",
    imageUrl:
      dentist.profile_photo_path ||
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
    bio:
      dentist.bio ??
      dentist.short_bio ??
      "Experienced clinician focused on patient comfort and modern dentistry.",
    yearsOfExperience:
      dentist.years_of_experience === null
        ? "By consultation"
        : `${dentist.years_of_experience} years`,
    consultationFee: formatMoney(dentist.consultation_fee),
    isAcceptingPatients: dentist.is_accepting_patients,
    educationItems,
    specialties:
      dentist.specializations.length > 0
        ? dentist.specializations
        : ["Comprehensive Dental Care"],
    availability: availability.some((entry) => entry.isAvailable)
      ? availability
      : buildDefaultAvailability(),
  } satisfies PublicDentistDetail;
}

export async function getLandingSettingsForStaff() {
  const settings = await readLandingSettings();
  const whyChooseUs = toWhyChooseItems(settings?.why_choose_us ?? []);

  return {
    id: settings?.id ?? null,
    heroTitle: settings?.hero_title ?? landingPlaceholderContent.heroTitle,
    heroSubtitle:
      settings?.hero_subtitle ?? landingPlaceholderContent.heroSubtitle,
    primaryCtaLabel:
      settings?.primary_cta_label ?? landingPlaceholderContent.primaryCtaLabel,
    primaryCtaHref:
      settings?.primary_cta_href ?? landingPlaceholderContent.primaryCtaHref,
    secondaryCtaLabel:
      settings?.secondary_cta_label ??
      landingPlaceholderContent.secondaryCtaLabel,
    secondaryCtaHref:
      settings?.secondary_cta_href ??
      landingPlaceholderContent.secondaryCtaHref,
    contactPhone: settings?.contact_phone ?? "",
    contactEmail: settings?.contact_email ?? "",
    clinicAddress: settings?.clinic_address ?? "",
    whyChooseUs:
      whyChooseUs.length > 0
        ? whyChooseUs
        : landingPlaceholderContent.whyChooseUs,
  };
}
