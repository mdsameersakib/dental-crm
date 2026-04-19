import type { PatientNotificationItem } from "@/features/notifications/types";

type PatientNotificationListProps = {
  notifications: PatientNotificationItem[];
};

function formatNotificationDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function PatientNotificationList({
  notifications,
}: PatientNotificationListProps) {
  if (notifications.length === 0) {
    return (
      <p className="rounded-[1.5rem] bg-slate-50 px-4 py-5 text-sm text-slate-600">
        Upcoming appointment and follow-up reminders will appear here.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 px-4 py-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">
                {notification.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {notification.body}
              </p>
            </div>
            {!notification.readAt ? (
              <span className="rounded-full bg-teal-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-teal-700">
                New
              </span>
            ) : null}
          </div>
          {notification.scheduledFor ? (
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
              {formatNotificationDate(notification.scheduledFor)}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
