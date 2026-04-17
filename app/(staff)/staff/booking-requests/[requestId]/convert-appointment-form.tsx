"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { convertBookingRequestToAppointment } from "../actions";

type DentistSchedule = {
  day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

type DentistOption = {
  id: string;
  name: string;
  email: string;
  schedules: DentistSchedule[];
};

type ServiceOption = {
  id: string;
  name: string;
};

type AppointmentSlot = {
  dentistId: string;
  startAt: string;
  endAt: string;
};

type ConvertAppointmentFormProps = {
  requestId: string;
  redirectTo: string;
  services: ServiceOption[];
  dentists: DentistOption[];
  activeAppointments: AppointmentSlot[];
  defaultServiceId: string;
  defaultDentistId: string;
  defaultDate: string;
  defaultTime: string;
  locked: boolean;
};

type FlowMode = "dentist" | "datetime";

const weekdayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function toMinutes(timeValue: string) {
  const [hour, minute] = timeValue
    .slice(0, 5)
    .split(":")
    .map((value) => Number.parseInt(value, 10));
  return hour * 60 + minute;
}

function toTimeValue(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function toTimeLabel(minutes: number) {
  const hour24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  }).format(new Date(`${date}T00:00:00`));
}

function addDays(baseDate: Date, days: number) {
  const cloned = new Date(baseDate);
  cloned.setDate(cloned.getDate() + days);
  return cloned;
}

function normalizeTime(value: string) {
  const trimmed = value.trim();
  if (/^\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed.slice(0, 5);
  }
  return "";
}

function getWeekday(dateValue: string) {
  return weekdayMap[new Date(`${dateValue}T00:00:00`).getDay()];
}

function hasAppointmentConflict(
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

function canDentistTakeSlot(
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

function buildTimeSlotsForDentist(
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

function buildTimeSlotsAcrossDentists(
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

export function ConvertAppointmentForm({
  requestId,
  redirectTo,
  services,
  dentists,
  activeAppointments,
  defaultServiceId,
  defaultDentistId,
  defaultDate,
  defaultTime,
  locked,
}: ConvertAppointmentFormProps) {
  const didMountRef = useRef(false);
  const [serviceId, setServiceId] = useState(defaultServiceId);
  const [flowMode, setFlowMode] = useState<FlowMode | null>(null);
  const [dentistId, setDentistId] = useState(defaultDentistId);
  const [dateValue, setDateValue] = useState(defaultDate);
  const [timeValue, setTimeValue] = useState(normalizeTime(defaultTime));
  const [durationMin, setDurationMin] = useState(30);
  const [appointmentStatus, setAppointmentStatus] = useState("confirmed");

  const isFlowBlocked = locked || !serviceId;
  const isFlowSelected = Boolean(flowMode);
  const isFlowPending = isFlowBlocked || !isFlowSelected;

  const dentistFlowDateOptions = useMemo(() => {
    if (!dentistId) {
      return [];
    }
    const selectedDentist = dentists.find((entry) => entry.id === dentistId);
    if (!selectedDentist) {
      return [];
    }

    const today = new Date();
    const options: string[] = [];
    for (let offset = 0; offset < 30; offset += 1) {
      const target = addDays(today, offset);
      const dateKey = toDateKey(target);
      const slots = buildTimeSlotsForDentist(
        selectedDentist,
        activeAppointments,
        dateKey,
        durationMin,
      );
      if (slots.length > 0) {
        options.push(dateKey);
      }
    }
    return options;
  }, [activeAppointments, dentists, dentistId, durationMin]);

  const dentistFlowTimeOptions = useMemo(() => {
    if (!dentistId || !dateValue) {
      return [];
    }
    const selectedDentist = dentists.find((entry) => entry.id === dentistId);
    if (!selectedDentist) {
      return [];
    }
    return buildTimeSlotsForDentist(
      selectedDentist,
      activeAppointments,
      dateValue,
      durationMin,
    );
  }, [activeAppointments, dateValue, dentists, dentistId, durationMin]);

  const datetimeFlowDateOptions = useMemo(() => {
    const today = new Date();
    const options: string[] = [];
    for (let offset = 0; offset < 30; offset += 1) {
      const target = addDays(today, offset);
      const dateKey = toDateKey(target);
      const slots = buildTimeSlotsAcrossDentists(
        dentists,
        activeAppointments,
        dateKey,
        durationMin,
      );
      if (slots.length > 0) {
        options.push(dateKey);
      }
    }
    return options;
  }, [activeAppointments, dentists, durationMin]);

  const datetimeFlowTimeOptions = useMemo(() => {
    if (!dateValue) {
      return [];
    }
    return buildTimeSlotsAcrossDentists(
      dentists,
      activeAppointments,
      dateValue,
      durationMin,
    );
  }, [activeAppointments, dateValue, dentists, durationMin]);

  const datetimeFlowDentists = useMemo(() => {
    if (!dateValue || !timeValue) {
      return [];
    }
    return dentists.filter((dentist) =>
      canDentistTakeSlot(
        dentist,
        activeAppointments,
        dateValue,
        timeValue,
        durationMin,
      ),
    );
  }, [activeAppointments, dateValue, dentists, durationMin, timeValue]);

  const activeTimeOptions =
    flowMode === "dentist" ? dentistFlowTimeOptions : datetimeFlowTimeOptions;

  useEffect(() => {
    if (!serviceId) {
      setDentistId("");
      setDateValue("");
      setTimeValue("");
    }
  }, [serviceId]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    setDentistId("");
    setDateValue("");
    setTimeValue("");
  }, [flowMode]);

  useEffect(() => {
    if (dateValue && !activeTimeOptions.includes(timeValue)) {
      setTimeValue("");
    }
  }, [activeTimeOptions, dateValue, timeValue]);

  useEffect(() => {
    if (flowMode !== "datetime") {
      return;
    }
    if (!dateValue || !timeValue) {
      return;
    }
    if (!datetimeFlowDentists.some((dentist) => dentist.id === dentistId)) {
      setDentistId("");
    }
  }, [dateValue, datetimeFlowDentists, dentistId, flowMode, timeValue]);

  const canSubmit = Boolean(serviceId && dentistId && dateValue && timeValue);

  return (
    <form
      action={convertBookingRequestToAppointment}
      className="mt-4 grid gap-4"
    >
      <input type="hidden" name="request_id" value={requestId} />
      <input type="hidden" name="redirect_to" value={redirectTo} />
      <input type="hidden" name="appointment_date" value={dateValue} />
      <input type="hidden" name="appointment_time" value={timeValue} />

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Service
        <select
          name="service_id"
          value={serviceId}
          onChange={(event) => setServiceId(event.target.value)}
          required
          disabled={locked}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
        >
          <option value="" disabled>
            Select service
          </option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </label>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Flow
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setFlowMode("dentist")}
            disabled={isFlowBlocked}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              flowMode === "dentist"
                ? "bg-[var(--color-primary)] text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-700"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Dentist Flow
          </button>
          <button
            type="button"
            onClick={() => setFlowMode("datetime")}
            disabled={isFlowBlocked}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              flowMode === "datetime"
                ? "bg-[var(--color-primary)] text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-700"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Date-time Flow
          </button>
        </div>
        {!serviceId ? (
          <p className="mt-2 text-xs text-amber-700">
            Select a service first to continue.
          </p>
        ) : !flowMode ? (
          <p className="mt-2 text-xs text-slate-600">
            Select a flow to unlock the rest of the appointment fields.
          </p>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Duration (minutes)
          <input
            name="duration_min"
            type="number"
            min={10}
            step={5}
            value={durationMin}
            onChange={(event) =>
              setDurationMin(Number.parseInt(event.target.value, 10) || 30)
            }
            required
            disabled={isFlowPending}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Appointment status
          <select
            name="appointment_status"
            value={appointmentStatus}
            onChange={(event) => setAppointmentStatus(event.target.value)}
            disabled={isFlowPending}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
          >
            <option value="confirmed">Confirmed</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </label>
      </div>

      {flowMode === "dentist" ? (
        <>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Dentist
            <select
              name="dentist_id"
              value={dentistId}
              onChange={(event) => {
                setDentistId(event.target.value);
                setDateValue("");
                setTimeValue("");
              }}
              required
              disabled={isFlowPending}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
            >
              <option value="" disabled>
                Select dentist
              </option>
              {dentists.map((dentist) => (
                <option key={dentist.id} value={dentist.id}>
                  {dentist.name}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Available dates
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {dentistFlowDateOptions.map((option) => {
                const selected = dateValue === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setDateValue(option);
                      setTimeValue("");
                    }}
                    disabled={isFlowPending || !dentistId}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      selected
                        ? "bg-[var(--color-primary)] text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-700"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {formatDate(option)}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : null}

      {flowMode === "datetime" ? (
        <>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Available dates
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {datetimeFlowDateOptions.map((option) => {
                const selected = dateValue === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setDateValue(option);
                      setTimeValue("");
                      setDentistId("");
                    }}
                    disabled={isFlowPending}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      selected
                        ? "bg-[var(--color-primary)] text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-700"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {formatDate(option)}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Appointment time
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {activeTimeOptions.map((option) => {
            const selected = timeValue === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setTimeValue(option)}
                disabled={isFlowPending || !dateValue}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  selected
                    ? "bg-[var(--color-primary)] text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-700"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {toTimeLabel(toMinutes(option))}
              </button>
            );
          })}
        </div>
      </div>

      {flowMode === "datetime" ? (
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Available dentists for selected slot
          <select
            name="dentist_id"
            value={dentistId}
            onChange={(event) => setDentistId(event.target.value)}
            required
            disabled={isFlowPending || !dateValue || !timeValue}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
          >
            <option value="" disabled>
              Select dentist
            </option>
            {datetimeFlowDentists.map((dentist) => (
              <option key={dentist.id} value={dentist.id}>
                {dentist.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Internal note
        <textarea
          name="notes"
          rows={3}
          placeholder="Optional note for staff about this appointment"
          disabled={isFlowPending}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:bg-white focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={locked || !isFlowSelected || !canSubmit}
        className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Convert to Appointment
      </button>
    </form>
  );
}
