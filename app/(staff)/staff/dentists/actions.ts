"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { validateDentistProfileForm, validateDentistScheduleForm } from "@/features/dentists/validation";
import { requireStaffProfile } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

function redirectWithStatus(message: string, type: "error" | "success"): never {
  const params = new URLSearchParams({
    [type]: message,
  });

  redirect(`/staff/dentists?${params.toString()}`);
}

export async function saveDentistProfile(formData: FormData) {
  await requireStaffProfile();
  const validation = validateDentistProfileForm(formData);

  if (!validation.success) {
    redirectWithStatus(validation.error, "error");
  }

  const supabase = createAdminClient();
  const payload = {
    profile_id: validation.data.profileId,
    slug: validation.data.slug,
    license_number: validation.data.licenseNumber,
    specializations: validation.data.specializations,
    education: validation.data.education,
    years_of_experience: validation.data.yearsOfExperience,
    bio: validation.data.bio,
    short_bio: validation.data.shortBio,
    profile_photo_path: validation.data.profilePhotoPath,
    consultation_fee: validation.data.consultationFee,
    is_accepting_patients: validation.data.isAcceptingPatients,
    is_published: validation.data.isPublished,
    is_featured: validation.data.isFeatured,
    display_order: validation.data.displayOrder,
  };

  const result = validation.data.id
    ? await supabase
        .from("dentist_profiles")
        .update(payload)
        .eq("id", validation.data.id)
    : await supabase.from("dentist_profiles").insert(payload);

  if (result.error) {
    redirectWithStatus(result.error.message, "error");
  }

  revalidatePath("/", "layout");
  redirectWithStatus("Dentist profile saved.", "success");
}

export async function saveDentistSchedule(formData: FormData) {
  await requireStaffProfile();
  const validation = validateDentistScheduleForm(formData);

  if (!validation.success) {
    redirectWithStatus(validation.error, "error");
  }

  const supabase = createAdminClient();
  const { error: deleteError } = await supabase
    .from("dentist_schedules")
    .delete()
    .eq("dentist_id", validation.data.dentistId);

  if (deleteError) {
    redirectWithStatus(deleteError.message, "error");
  }

  const rows = validation.data.schedules
    .filter((schedule) => schedule.startTime && schedule.endTime)
    .map((schedule) => ({
      dentist_id: validation.data.dentistId,
      day_of_week: schedule.day,
      start_time: schedule.startTime,
      end_time: schedule.endTime,
      is_available: schedule.isAvailable,
    }));

  if (rows.length > 0) {
    const { error } = await supabase.from("dentist_schedules").insert(rows);
    if (error) {
      redirectWithStatus(error.message, "error");
    }
  }

  revalidatePath("/", "layout");
  redirectWithStatus("Dentist schedule updated.", "success");
}
