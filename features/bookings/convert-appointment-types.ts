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
