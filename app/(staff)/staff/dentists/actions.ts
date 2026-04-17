"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  validateDentistProfileForm,
  validateDentistScheduleForm,
} from "@/features/dentists/validation";
import { requireStaffProfile } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSupabaseEnv } from "@/lib/supabase/env";

const DENTIST_IMAGE_BUCKET = "doctor-images";

function extractBucketPathFromPublicUrl(url: string) {
  const marker = `/storage/v1/object/public/${DENTIST_IMAGE_BUCKET}/`;
  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  const pathWithQuery = url.slice(index + marker.length);
  const [path] = pathWithQuery.split("?");

  return decodeURIComponent(path);
}

function fileExtensionFrom(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();

  if (fromName && /^[a-z0-9]+$/.test(fromName)) {
    return fromName;
  }

  const fromType = file.type.split("/")[1]?.toLowerCase();

  if (fromType && /^[a-z0-9.+-]+$/.test(fromType)) {
    return fromType.replace("jpeg", "jpg");
  }

  return "jpg";
}

function sanitizeRedirectPath(path: string) {
  if (path.startsWith("/staff/dentists")) {
    return path;
  }

  return "/staff/dentists";
}

function redirectWithStatus(
  message: string,
  type: "error" | "success",
  path = "/staff/dentists",
): never {
  const params = new URLSearchParams({
    [type]: message,
  });

  redirect(`${sanitizeRedirectPath(path)}?${params.toString()}`);
}

export async function saveDentistProfile(formData: FormData) {
  await requireStaffProfile();
  const redirectTo = sanitizeRedirectPath(
    String(formData.get("redirect_to") ?? "/staff/dentists").trim(),
  );
  const validation = validateDentistProfileForm(formData);
  const firstNameInput = String(formData.get("first_name") ?? "").trim();
  const lastNameInput = String(formData.get("last_name") ?? "").trim();

  if (!validation.success) {
    redirectWithStatus(validation.error, "error", redirectTo);
  }

  const supabase = createAdminClient();
  const env = getSupabaseEnv();
  const { data: currentProfile, error: currentProfileError } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", validation.data.profileId)
    .maybeSingle();

  if (currentProfileError) {
    redirectWithStatus(currentProfileError.message, "error", redirectTo);
  }

  const nextFirstName = firstNameInput || currentProfile?.first_name || "";
  const nextLastName = lastNameInput || currentProfile?.last_name || "";

  if (
    nextFirstName !== (currentProfile?.first_name || "") ||
    nextLastName !== (currentProfile?.last_name || "")
  ) {
    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        first_name: nextFirstName,
        last_name: nextLastName,
      })
      .eq("id", validation.data.profileId);

    if (profileUpdateError) {
      redirectWithStatus(profileUpdateError.message, "error", redirectTo);
    }
  }

  const existingProfilePhotoPath = validation.data.id
    ? ((
        await supabase
          .from("dentist_profiles")
          .select("profile_photo_path")
          .eq("id", validation.data.id)
          .maybeSingle()
      ).data?.profile_photo_path ?? null)
    : null;
  const removeProfilePhoto = formData.get("remove_profile_photo") === "on";
  const profilePhotoFile = formData.get("profile_photo");

  let profilePhotoPath = existingProfilePhotoPath;

  if (removeProfilePhoto && existingProfilePhotoPath) {
    const existingBucketPath = extractBucketPathFromPublicUrl(
      existingProfilePhotoPath,
    );
    if (existingBucketPath) {
      await supabase.storage
        .from(DENTIST_IMAGE_BUCKET)
        .remove([existingBucketPath]);
    }
    profilePhotoPath = null;
  }

  if (profilePhotoFile instanceof File && profilePhotoFile.size > 0) {
    const fileExtension = fileExtensionFrom(profilePhotoFile);
    const folder = validation.data.profileId || "unassigned";
    const storagePath = `dentists/${folder}/${Date.now()}-${randomUUID()}.${fileExtension}`;
    const bytes = Buffer.from(await profilePhotoFile.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from(DENTIST_IMAGE_BUCKET)
      .upload(storagePath, bytes, {
        contentType: profilePhotoFile.type || undefined,
        upsert: false,
      });

    if (uploadError) {
      redirectWithStatus(uploadError.message, "error", redirectTo);
    }

    if (existingProfilePhotoPath) {
      const existingBucketPath = extractBucketPathFromPublicUrl(
        existingProfilePhotoPath,
      );
      if (existingBucketPath) {
        await supabase.storage
          .from(DENTIST_IMAGE_BUCKET)
          .remove([existingBucketPath]);
      }
    }

    profilePhotoPath = `${env.url}/storage/v1/object/public/${DENTIST_IMAGE_BUCKET}/${storagePath}`;
  }

  const payload = {
    profile_id: validation.data.profileId,
    slug: validation.data.slug,
    license_number: validation.data.licenseNumber,
    specializations: validation.data.specializations,
    education: validation.data.education,
    years_of_experience: validation.data.yearsOfExperience,
    bio: validation.data.bio,
    short_bio: validation.data.shortBio,
    profile_photo_path: profilePhotoPath,
    consultation_fee: validation.data.consultationFee,
    is_accepting_patients: validation.data.isAcceptingPatients,
    is_published: validation.data.isPublished,
    is_featured: validation.data.isFeatured,
    display_order: validation.data.displayOrder,
  };

  if (validation.data.id) {
    const result = await supabase
      .from("dentist_profiles")
      .update(payload)
      .eq("id", validation.data.id);

    if (result.error) {
      redirectWithStatus(result.error.message, "error", redirectTo);
    }

    revalidatePath("/", "layout");
    redirectWithStatus("Dentist profile saved.", "success", redirectTo);
  }

  const { data, error } = await supabase
    .from("dentist_profiles")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    redirectWithStatus(error.message, "error", redirectTo);
  }

  revalidatePath("/", "layout");
  redirectWithStatus(
    "Dentist profile created.",
    "success",
    data?.id ? `/staff/dentists/${data.id}` : "/staff/dentists",
  );
}

export async function saveDentistSchedule(formData: FormData) {
  await requireStaffProfile();
  const redirectTo = sanitizeRedirectPath(
    String(formData.get("redirect_to") ?? "/staff/dentists").trim(),
  );
  const validation = validateDentistScheduleForm(formData);

  if (!validation.success) {
    redirectWithStatus(validation.error, "error", redirectTo);
  }

  const supabase = createAdminClient();
  const { error: deleteError } = await supabase
    .from("dentist_schedules")
    .delete()
    .eq("dentist_id", validation.data.dentistId);

  if (deleteError) {
    redirectWithStatus(deleteError.message, "error", redirectTo);
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
      redirectWithStatus(error.message, "error", redirectTo);
    }
  }

  revalidatePath("/", "layout");
  redirectWithStatus("Dentist schedule updated.", "success", redirectTo);
}
