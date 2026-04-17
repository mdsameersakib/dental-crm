export type DentistSchedule = {
  day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

export type DentistOption = {
  id: string;
  name: string;
  email: string;
  schedules: DentistSchedule[];
};

export type ServiceOption = {
  id: string;
  name: string;
};

export type AppointmentSlot = {
  dentistId: string;
  startAt: string;
  endAt: string;
};

export type FlowMode = "dentist" | "datetime";

const weekdayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

export function toMinutes(timeValue: string) {
  const [hour, minute] = timeValue
    .slice(0, 5)
    .split(":")
    .map((value) => Number.parseInt(value, 10));
  return hour * 60 + minute;
}

export function toTimeValue(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function toTimeLabel(minutes: number) {
  const hour24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(baseDate: Date, days: number) {
  const cloned = new Date(baseDate);
  cloned.setDate(cloned.getDate() + days);
  return cloned;
}

export function normalizeTime(value: string) {
  const trimmed = value.trim();
  if (/^\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed.slice(0, 5);
  }
  return "";
}

export function getWeekday(dateValue: string) {
  return weekdayMap[new Date(`${dateValue}T00:00:00`).getDay()];
}

export function hasAppointmentConflict(
  activeAppointments: AppointmentSlot[],
  dentistId: string,
  dateValue: string,
  timeValue: string,
  durationMin: number,
) {
  const selectedStart = new Date(`${dateValue}T${timeValue}:00`);
  const selectedEnd = new Date(selectedStart.getTime() + durationMin * 60_000);

  return activeAppointments.some((entry) => {
    if (entry.dentistId !== dentistId) {
      return false;
    }
    const bookedStart = new Date(entry.startAt);
    const bookedEnd = new Date(entry.endAt);
    return selectedStart < bookedEnd && selectedEnd > bookedStart;
  });
}

export function canDentistTakeSlot(
  dentist: DentistOption,
  activeAppointments: AppointmentSlot[],
  dateValue: string,
  timeValue: string,
  durationMin: number,
) {
  const weekday = getWeekday(dateValue);
  const startMinute = toMinutes(timeValue);
  const endMinute = startMinute + durationMin;

  const coveredBySchedule = dentist.schedules.some((entry) => {
    if (!entry.isAvailable || entry.day !== weekday) {
      return false;
    }
    const scheduleStart = toMinutes(entry.startTime);
    const scheduleEnd = toMinutes(entry.endTime);
    return startMinute >= scheduleStart && endMinute <= scheduleEnd;
  });

  if (!coveredBySchedule) {
    return false;
  }

  return !hasAppointmentConflict(
    activeAppointments,
    dentist.id,
    dateValue,
    timeValue,
    durationMin,
  );
}

export function buildTimeSlotsForDentist(
  dentist: DentistOption,
  activeAppointments: AppointmentSlot[],
  dateValue: string,
  durationMin: number,
) {
  const weekday = getWeekday(dateValue);
  const slotSet = new Set<string>();

  for (const schedule of dentist.schedules) {
    if (!schedule.isAvailable || schedule.day !== weekday) {
      continue;
    }

    const scheduleStart = toMinutes(schedule.startTime);
    const scheduleEnd = toMinutes(schedule.endTime);
    for (
      let cursor = scheduleStart;
      cursor + durationMin <= scheduleEnd;
      cursor += 30
    ) {
      const slot = toTimeValue(cursor);
      if (
        canDentistTakeSlot(
          dentist,
          activeAppointments,
          dateValue,
          slot,
          durationMin,
        )
      ) {
        slotSet.add(slot);
      }
    }
  }

  return Array.from(slotSet).sort((a, b) => toMinutes(a) - toMinutes(b));
}

export function buildTimeSlotsAcrossDentists(
  dentists: DentistOption[],
  activeAppointments: AppointmentSlot[],
  dateValue: string,
  durationMin: number,
) {
  const slotSet = new Set<string>();
  for (const dentist of dentists) {
    const slots = buildTimeSlotsForDentist(
      dentist,
      activeAppointments,
      dateValue,
      durationMin,
    );
    for (const slot of slots) {
      slotSet.add(slot);
    }
  }
  return Array.from(slotSet).sort((a, b) => toMinutes(a) - toMinutes(b));
}
