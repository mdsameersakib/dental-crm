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

type DesiredNotification = {
  recordKey: string;
  insert: Database["public"]["Tables"]["notifications"]["Insert"];
};

function buildAppointmentReminder(input: {
  profileId: string;
  nowIso: string;
  appointment: AppointmentReminderRow;
  serviceName: string | null;
  dentistName: string | null;
}): DesiredNotification {
  const recordKey = `appointment:${input.appointment.id}`;

  return {
    recordKey,
    insert: {
      user_id: input.profileId,
      channel: "in_app",
      type: APPOINTMENT_REMINDER_TYPE,
      title: "Upcoming appointment",
      body: `You have ${
        input.serviceName ?? "an appointment"
      } with ${input.dentistName ?? "your dentist"} on ${new Intl.DateTimeFormat(
        "en-US",
        { dateStyle: "medium", timeStyle: "short" },
      ).format(new Date(input.appointment.start_at))}.`,
      status: "sent",
      sent_at: input.nowIso,
      scheduled_for: input.appointment.start_at,
      meta: {
        recordId: input.appointment.id,
        recordKey,
      },
    },
  };
}

function buildFollowUpReminder(input: {
  profileId: string;
  nowIso: string;
  treatment: FollowUpReminderRow;
  serviceName: string | null;
}): DesiredNotification {
  const recordKey = `treatment:${input.treatment.id}`;

  return {
    recordKey,
    insert: {
      user_id: input.profileId,
      channel: "in_app",
      type: FOLLOW_UP_REMINDER_TYPE,
      title: "Follow-up reminder",
      body: `A follow-up is due for ${
        input.treatment.treatment_name ||
        input.serviceName ||
        "your recent treatment"
      } on ${new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
      }).format(
        new Date(`${input.treatment.follow_up_date}T00:00:00`),
      )}. Staff can confirm the final appointment time.`,
      status: "sent",
      sent_at: input.nowIso,
      scheduled_for: `${input.treatment.follow_up_date}T00:00:00.000Z`,
      meta: {
        recordId: input.treatment.id,
        recordKey,
      },
    },
  };
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

  const existingByKey = new Map(
    existingNotifications
      .map((entry) => {
        const recordKey = extractRecordKey(entry.meta);
        return recordKey ? ([recordKey, entry] as const) : null;
      })
      .filter((entry): entry is readonly [string, NotificationRow] =>
        Boolean(entry),
      ),
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

  const desiredNotifications = [
    ...appointments.map((appointment) =>
      buildAppointmentReminder({
        profileId: input.profileId,
        nowIso: now.toISOString(),
        appointment,
        serviceName: serviceMap.get(appointment.service_id ?? "") ?? null,
        dentistName: dentistMap.get(appointment.dentist_id) ?? null,
      }),
    ),
    ...followUps.map((treatment) =>
      buildFollowUpReminder({
        profileId: input.profileId,
        nowIso: now.toISOString(),
        treatment,
        serviceName: serviceMap.get(treatment.service_id ?? "") ?? null,
      }),
    ),
  ];

  const desiredKeys = new Set(
    desiredNotifications.map((notification) => notification.recordKey),
  );

  const inserts = desiredNotifications
    .filter((notification) => !existingByKey.has(notification.recordKey))
    .map((notification) => notification.insert);

  const updates = desiredNotifications
    .map((notification) => {
      const existing = existingByKey.get(notification.recordKey);
      if (!existing) {
        return null;
      }

      if (
        existing.title === notification.insert.title &&
        existing.body === notification.insert.body &&
        existing.scheduled_for === notification.insert.scheduled_for
      ) {
        return null;
      }

      return supabase
        .from("notifications")
        .update({
          title: notification.insert.title,
          body: notification.insert.body,
          scheduled_for: notification.insert.scheduled_for,
          sent_at: notification.insert.sent_at,
          status: existing.read_at ? existing.status : "sent",
        })
        .eq("id", existing.id);
    })
    .filter(Boolean);

  const deleteIds = existingNotifications
    .filter((entry) => {
      const recordKey = extractRecordKey(entry.meta);
      return recordKey ? !desiredKeys.has(recordKey) : false;
    })
    .map((entry) => entry.id);

  await Promise.all(updates);

  if (deleteIds.length > 0) {
    await supabase.from("notifications").delete().in("id", deleteIds);
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
