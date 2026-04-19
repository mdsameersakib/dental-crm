"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { updateWaitlistStatus } from "@/features/waitlist/admin";
import type { WaitlistStatus } from "@/features/waitlist/types";
import { requireStaffProfile } from "@/lib/auth/session";

const allowedStatuses: WaitlistStatus[] = [
  "waiting",
  "notified",
  "booked",
  "expired",
];

function redirectWaitlistStatus(
  type: "error" | "success",
  message: string,
): never {
  const params = new URLSearchParams({
    [type]: message,
  });

  redirect(`/staff/waitlist?${params.toString()}`);
}

export async function saveWaitlistStatus(formData: FormData) {
  await requireStaffProfile();

  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as WaitlistStatus;

  if (!id || !allowedStatuses.includes(status)) {
    redirectWaitlistStatus("error", "Choose a valid waitlist status.");
  }

  const { error } = await updateWaitlistStatus({
    id,
    status,
  });

  if (error) {
    redirectWaitlistStatus("error", error.message);
  }

  revalidatePath("/staff/waitlist");
  redirectWaitlistStatus("success", "Waitlist entry updated.");
}
