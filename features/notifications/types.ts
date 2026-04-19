import type { Database } from "@/types/database";

export type PatientNotificationItem = {
  id: string;
  title: string;
  body: string;
  type: string;
  status: Database["public"]["Enums"]["notification_status"];
  createdAt: string;
  scheduledFor: string | null;
  readAt: string | null;
};
