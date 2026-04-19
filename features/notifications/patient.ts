import {
  getDentistNameMap,
  getServiceNameMap,
} from "@/features/bookings/lookups";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

import type { PatientNotificationItem } from "./types";

type AppointmentReminderRow = Pick<
  Database["public"]["Tables"]["appointments"]["Row"],
  "id" | "patient_id" | "dentist_id" | "service_id" | "start_at" | "status"
>;

type FollowUpReminderRow = Pick<
  Database["public"]["Tables"]["treatments"]["Row"],
  "id" | "patient_id" | "treatment_name" | "service_id" | "follow_up_date"
>;

type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

const APPOINTMENT_REMINDER_TYPE = "appointment_reminder";
const FOLLOW_UP_REMINDER_TYPE = "treatment_follow_up";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function extractRecordKey(
  meta: Database["public"]["Tables"]["notifications"]["Row"]["meta"],
) {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) {
    return null;
  }

  return typeof meta.recordKey === "string" ? meta.recordKey : null;
}

export async function ensurePatientNotifications(input: {
  profileId: string;
  patientProfileId: string;
}) {
  const supabase = createAdminClient();
  const now = new Date();
  const appointmentWindowEnd = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const followUpWindowStart = startOfDay(now);
  const followUpWindowEnd = new Date(
    followUpWindowStart.getTime() + 7 * 24 * 60 * 60 * 1000,
  );

  const [
    { data: appointmentData },
    { data: followUpData },
    { data: existingNotificationData },
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, patient_id, dentist_id, service_id, start_at, status")
      .eq("patient_id", input.patientProfileId)
      .in("status", ["scheduled", "confirmed"])
      .gte("start_at", now.toISOString())
      .lte("start_at", appointmentWindowEnd.toISOString())
      .order("start_at", { ascending: true }),
    supabase
      .from("treatments")
      .select("id, patient_id, treatment_name, service_id, follow_up_date")
      .eq("patient_id", input.patientProfileId)
      .not("follow_up_date", "is", null)
      .gte("follow_up_date", followUpWindowStart.toISOString().slice(0, 10))
      .lte("follow_up_date", followUpWindowEnd.toISOString().slice(0, 10))
      .order("follow_up_date", { ascending: true }),
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", input.profileId)
      .in("type", [APPOINTMENT_REMINDER_TYPE, FOLLOW_UP_REMINDER_TYPE]),
  ]);

  const appointments = (appointmentData ?? []) as AppointmentReminderRow[];
  const followUps = (followUpData ?? []) as FollowUpReminderRow[];
  const existingNotifications = (existingNotificationData ??
    []) as NotificationRow[];

  const seenKeys = new Set(
    existingNotifications
      .map((entry) => extractRecordKey(entry.meta))
      .filter((entry): entry is string => Boolean(entry)),
  );

  const dentistIds = Array.from(
    new Set(appointments.map((row) => row.dentist_id)),
  );
  const serviceIds = Array.from(
    new Set(
      [...appointments, ...followUps]
        .map((row) => row.service_id)
        .filter((value): value is string => Boolean(value)),
    ),
  );
  const [dentistMap, serviceMap] = await Promise.all([
    getDentistNameMap(dentistIds),
    getServiceNameMap(serviceIds),
  ]);

  const inserts: Database["public"]["Tables"]["notifications"]["Insert"][] = [];

  for (const appointment of appointments) {
    const key = `appointment:${appointment.id}`;
    if (seenKeys.has(key)) {
      continue;
    }

    inserts.push({
      user_id: input.profileId,
      channel: "in_app",
      type: APPOINTMENT_REMINDER_TYPE,
      title: "Upcoming appointment",
      body: `You have ${
        serviceMap.get(appointment.service_id ?? "") ?? "an appointment"
      } with ${dentistMap.get(appointment.dentist_id) ?? "your dentist"} on ${new Intl.DateTimeFormat(
        "en-US",
        { dateStyle: "medium", timeStyle: "short" },
      ).format(new Date(appointment.start_at))}.`,
      status: "sent",
      sent_at: now.toISOString(),
      scheduled_for: appointment.start_at,
      meta: {
        recordId: appointment.id,
        recordKey: key,
      },
    });
  }

  for (const treatment of followUps) {
    const key = `treatment:${treatment.id}`;
    if (seenKeys.has(key)) {
      continue;
    }

    inserts.push({
      user_id: input.profileId,
      channel: "in_app",
      type: FOLLOW_UP_REMINDER_TYPE,
      title: "Follow-up reminder",
      body: `A follow-up is due for ${
        treatment.treatment_name ||
        serviceMap.get(treatment.service_id ?? "") ||
        "your recent treatment"
      } on ${new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
      }).format(
        new Date(`${treatment.follow_up_date}T00:00:00`),
      )}. Staff can confirm the final appointment time.`,
      status: "sent",
      sent_at: now.toISOString(),
      scheduled_for: `${treatment.follow_up_date}T00:00:00.000Z`,
      meta: {
        recordId: treatment.id,
        recordKey: key,
      },
    });
  }

  if (inserts.length > 0) {
    await supabase.from("notifications").insert(inserts);
  }
}

export async function getPatientNotifications() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select("id, title, body, type, status, created_at, scheduled_for, read_at")
    .order("scheduled_for", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(8);

  const rows = (
    (data ?? []) as Pick<
      NotificationRow,
      | "id"
      | "title"
      | "body"
      | "type"
      | "status"
      | "created_at"
      | "scheduled_for"
      | "read_at"
    >[]
  ).map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    type: row.type,
    status: row.status,
    createdAt: row.created_at,
    scheduledFor: row.scheduled_for,
    readAt: row.read_at,
  })) satisfies PatientNotificationItem[];

  const unreadIds = rows
    .filter((row) => row.status !== "read" && !row.readAt)
    .map((row) => row.id);
  if (unreadIds.length > 0) {
    await markPatientNotificationsRead(unreadIds);
  }

  return rows;
}

export async function markPatientNotificationsRead(notificationIds: string[]) {
  if (notificationIds.length === 0) {
    return;
  }

  const supabase = createAdminClient();
  await supabase
    .from("notifications")
    .update({
      status: "read",
      read_at: new Date().toISOString(),
    })
    .in("id", notificationIds);
}
