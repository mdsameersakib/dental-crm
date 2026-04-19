import { getLandingContactInfo } from "@/features/public-content/landing-queries";
import { getPublishedServices } from "@/features/public-content/service-queries";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

import { getPatientAppointmentsData } from "../appointment-queries";
import { getPatientDashboardData } from "../dashboard-queries";
import type { PatientAssistantContext } from "./types";

type DentistContextRow =
  Database["public"]["Tables"]["dentist_profiles"]["Row"] & {
    profiles:
      | Pick<
          Database["public"]["Tables"]["profiles"]["Row"],
          "first_name" | "last_name"
        >
      | Pick<
          Database["public"]["Tables"]["profiles"]["Row"],
          "first_name" | "last_name"
        >[]
      | null;
  };

function readEducationItems(value: DentistContextRow["education"]) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value.filter((entry): entry is string => typeof entry === "string");
}

type DentistScheduleRow =
  Database["public"]["Tables"]["dentist_schedules"]["Row"];

const dayLabelMap: Record<Database["public"]["Enums"]["day_of_week"], string> =
  {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday",
  };

function formatDentistName(row: DentistContextRow) {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  const firstName = profile?.first_name?.trim() ?? "";
  const lastName = profile?.last_name?.trim() ?? "";
  return `${firstName} ${lastName}`.trim() || "Clinic dentist";
}

function formatWeeklyAvailability(scheduleRows: DentistScheduleRow[]) {
  const availableRows = scheduleRows.filter((row) => row.is_available);
  if (availableRows.length === 0) {
    return ["Availability will be confirmed by staff."];
  }

  return availableRows.map((row) => {
    const dayLabel = dayLabelMap[row.day_of_week] ?? row.day_of_week;
    return `${dayLabel}: ${row.start_time.slice(0, 5)}-${row.end_time.slice(0, 5)}`;
  });
}

function buildClinicHours(scheduleRows: DentistScheduleRow[]) {
  const grouped = new Map<
    Database["public"]["Enums"]["day_of_week"],
    { start: string; end: string }
  >();

  for (const row of scheduleRows) {
    if (!row.is_available) {
      continue;
    }

    const existing = grouped.get(row.day_of_week);
    if (!existing) {
      grouped.set(row.day_of_week, {
        start: row.start_time,
        end: row.end_time,
      });
      continue;
    }

    grouped.set(row.day_of_week, {
      start: row.start_time < existing.start ? row.start_time : existing.start,
      end: row.end_time > existing.end ? row.end_time : existing.end,
    });
  }

  if (grouped.size === 0) {
    return ["Clinic hours are confirmed by staff."];
  }

  return Array.from(grouped.entries())
    .sort(
      (a, b) =>
        ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].indexOf(a[0]) -
        ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].indexOf(b[0]),
    )
    .map(
      ([day, range]) =>
        `${dayLabelMap[day]}: ${range.start.slice(0, 5)}-${range.end.slice(0, 5)}`,
    );
}

export async function buildPatientAssistantContext(input: {
  patientName: string;
  patientProfileId: string;
}) {
  const supabase = createAdminClient();
  const [
    { contactPhone, contactEmail, clinicAddress },
    services,
    appointments,
    dashboard,
    { data: dentistRowsData },
  ] = await Promise.all([
    getLandingContactInfo(),
    getPublishedServices(),
    getPatientAppointmentsData(input.patientProfileId),
    getPatientDashboardData(input.patientProfileId),
    supabase
      .from("dentist_profiles")
      .select(
        "id, specializations, education, is_accepting_patients, profiles!dentist_profiles_profile_id_fkey(first_name, last_name), dentist_schedules(day_of_week, start_time, end_time, is_available)",
      )
      .eq("is_published", true)
      .order("display_order", { ascending: true }),
  ]);

  const dentistRows = (dentistRowsData ?? []) as Array<
    DentistContextRow & {
      dentist_schedules: DentistScheduleRow[] | null;
    }
  >;
  const allScheduleRows = dentistRows.flatMap(
    (row) => row.dentist_schedules ?? [],
  );

  return {
    patientName: input.patientName,
    contact: {
      phone: contactPhone,
      email: contactEmail,
      address: clinicAddress,
      clinicHours: buildClinicHours(allScheduleRows),
    },
    services: services.map((service) => ({
      name: service.name,
      priceLabel: service.priceLabel,
      durationLabel: service.durationLabel,
      shortDescription: service.shortDescription,
      recommendedAftercare: service.recommendedAftercare,
    })),
    dentists: dentistRows.map((row) => ({
      name: formatDentistName(row),
      specialty: row.specializations[0] ?? "General Dentistry",
      education: readEducationItems(row.education),
      acceptingPatients: row.is_accepting_patients,
      weeklyAvailability: formatWeeklyAvailability(row.dentist_schedules ?? []),
    })),
    upcomingAppointments: appointments.upcoming
      .slice(0, 3)
      .map((appointment) => ({
        serviceName: appointment.serviceName,
        dentistName: appointment.dentistName,
        startAt: appointment.startAt,
      })),
    recentTreatments: dashboard.recentTreatments
      .slice(0, 3)
      .map((treatment) => ({
        treatmentName: treatment.treatmentName,
        serviceName: treatment.serviceName,
        dentistName: treatment.dentistName,
        aftercareInstructions: treatment.aftercareInstructions,
        followUpDate: treatment.followUpDate,
      })),
  } satisfies PatientAssistantContext;
}
