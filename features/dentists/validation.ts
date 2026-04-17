import type { DentistScheduleDay } from "./admin";

export type DentistProfileInput = {
  id: string | null;
  profileId: string;
  slug: string | null;
  licenseNumber: string;
  specializations: string[];
  education: string[];
  yearsOfExperience: number | null;
  bio: string | null;
  shortBio: string | null;
  profilePhotoPath: string | null;
  consultationFee: number | null;
  displayOrder: number;
  isAcceptingPatients: boolean;
  isPublished: boolean;
  isFeatured: boolean;
};

export type DentistScheduleInput = {
  dentistId: string;
  schedules: Array<{
    day: DentistScheduleDay;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>;
};

function getTrimmedField(formData: FormData, field: string) {
  return String(formData.get(field) ?? "").trim();
}

function parseOptionalNumber(value: string, label: string) {
  if (!value) {
    return { success: true as const, value: null };
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return {
      success: false as const,
      error: `${label} must be a valid number.`,
    };
  }

  return { success: true as const, value: parsed };
}

export function validateDentistProfileForm(formData: FormData) {
  const id = getTrimmedField(formData, "id");
  const profileId = getTrimmedField(formData, "profile_id");
  const slug = getTrimmedField(formData, "slug")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const licenseNumber = getTrimmedField(formData, "license_number");
  const specializations = getTrimmedField(formData, "specializations")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const education = getTrimmedField(formData, "education")
    .split("\n")
    .map((value) => value.trim())
    .filter(Boolean);
  const yearsRaw = getTrimmedField(formData, "years_of_experience");
  const feeRaw = getTrimmedField(formData, "consultation_fee");
  const displayOrderRaw = getTrimmedField(formData, "display_order");

  if (!profileId || !licenseNumber) {
    return {
      success: false as const,
      error: "A dentist account and license number are required.",
    };
  }

  const years = parseOptionalNumber(yearsRaw, "Years of experience");
  if (!years.success) {
    return { success: false as const, error: years.error };
  }

  const fee = parseOptionalNumber(feeRaw, "Consultation fee");
  if (!fee.success) {
    return { success: false as const, error: fee.error };
  }

  const displayOrder = displayOrderRaw ? Number(displayOrderRaw) : 0;
  if (Number.isNaN(displayOrder)) {
    return {
      success: false as const,
      error: "Display order must be a valid number.",
    };
  }

  return {
    success: true as const,
    data: {
      id: id || null,
      profileId,
      slug: slug || null,
      licenseNumber,
      specializations,
      education,
      yearsOfExperience: years.value,
      bio: getTrimmedField(formData, "bio") || null,
      shortBio: getTrimmedField(formData, "short_bio") || null,
      profilePhotoPath: getTrimmedField(formData, "profile_photo_path") || null,
      consultationFee: fee.value,
      displayOrder,
      isAcceptingPatients: formData.get("is_accepting_patients") === "on",
      isPublished: formData.get("is_published") === "on",
      isFeatured: formData.get("is_featured") === "on",
    } satisfies DentistProfileInput,
  };
}

export function validateDentistScheduleForm(formData: FormData) {
  const dentistId = getTrimmedField(formData, "dentist_id");
  if (!dentistId) {
    return {
      success: false as const,
      error: "Dentist profile is required for schedule updates.",
    };
  }

  const schedules = (
    ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const
  ).map((day) => ({
    day,
    startTime: getTrimmedField(formData, `start_time_${day}`),
    endTime: getTrimmedField(formData, `end_time_${day}`),
    isAvailable: formData.get(`is_available_${day}`) === "on",
  }));

  for (const schedule of schedules) {
    if (schedule.isAvailable && (!schedule.startTime || !schedule.endTime)) {
      return {
        success: false as const,
        error: "Available schedule rows need both a start and end time.",
      };
    }
  }

  return {
    success: true as const,
    data: {
      dentistId,
      schedules,
    } satisfies DentistScheduleInput,
  };
}
