import { getWeekday, toMinutes, toTimeValue } from "./convert-appointment-time";
import type {
  AppointmentSlot,
  DentistOption,
} from "./convert-appointment-types";

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
