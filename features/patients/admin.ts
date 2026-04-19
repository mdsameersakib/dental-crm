import {
  getDentistNameMap,
  getServiceNameMap,
} from "@/features/bookings/lookups";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

import type {
  StaffPatientAppointmentHistoryItem,
  StaffPatientBookingRequestHistoryItem,
  StaffPatientDetail,
  StaffPatientSummary,
  StaffPatientTreatmentHistoryItem,
} from "./types";

type PatientProfileJoinedRow =
  Database["public"]["Tables"]["patient_profiles"]["Row"] & {
    profiles:
      | Database["public"]["Tables"]["profiles"]["Row"]
      | Database["public"]["Tables"]["profiles"]["Row"][]
      | null;
  };

type AppointmentRow = Pick<
  Database["public"]["Tables"]["appointments"]["Row"],
  | "id"
  | "patient_id"
  | "patient_email"
  | "patient_name"
  | "dentist_id"
  | "service_id"
  | "start_at"
  | "duration_min"
  | "status"
  | "source"
  | "notes"
>;

type TreatmentRow = Pick<
  Database["public"]["Tables"]["treatments"]["Row"],
  | "id"
  | "patient_id"
  | "treatment_name"
  | "status"
  | "performed_at"
  | "aftercare_instructions"
  | "follow_up_date"
  | "service_id"
  | "dentist_id"
>;

type BookingRequestRow = Pick<
  Database["public"]["Tables"]["booking_requests"]["Row"],
  | "id"
  | "patient_name"
  | "email"
  | "phone"
  | "preferred_date"
  | "preferred_time"
  | "service_id"
  | "preferred_dentist_id"
  | "status"
  | "notes"
  | "created_at"
>;

type RegistryAggregate = {
  registryKey: string;
  patientProfileId: string | null;
  profileId: string | null;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  hasAccount: boolean;
  isActive: boolean | null;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  allergies: string[];
  currentMedications: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  appointments: StaffPatientAppointmentHistoryItem[];
  treatments: StaffPatientTreatmentHistoryItem[];
  bookingRequests: StaffPatientBookingRequestHistoryItem[];
  lastVisitAt: string | null;
};

function buildName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  fallback?: string | null,
) {
  const joined = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  return joined || fallback?.trim() || "Unknown patient";
}

function splitName(fullName: string | null | undefined) {
  const parts = sanitizeText(fullName).split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }

  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

function normalizeEmail(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function sanitizeText(value: string | null | undefined) {
  return value?.trim() ?? "";
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function createRegistryKey(input: {
  patientProfileId?: string | null;
  email?: string | null;
  fallbackPrefix: string;
  fallbackId: string;
}) {
  const email = normalizeEmail(input.email);
  if (email) {
    return `email:${email}`;
  }

  if (input.patientProfileId) {
    return `patient:${input.patientProfileId}`;
  }

  return `${input.fallbackPrefix}:${input.fallbackId}`;
}

function toSummary(patient: RegistryAggregate): StaffPatientSummary {
  return {
    registryKey: patient.registryKey,
    patientProfileId: patient.patientProfileId,
    profileId: patient.profileId,
    name: patient.name,
    email: patient.email,
    phone: patient.phone,
    hasAccount: patient.hasAccount,
    accountLabel: patient.hasAccount ? "Has account" : "Guest only",
    appointmentCount: patient.appointments.length,
    treatmentCount: patient.treatments.length,
    lastVisitAt: patient.lastVisitAt,
  };
}

function sortByMostRecent(a: RegistryAggregate, b: RegistryAggregate) {
  const aTime = a.lastVisitAt ? new Date(a.lastVisitAt).getTime() : 0;
  const bTime = b.lastVisitAt ? new Date(b.lastVisitAt).getTime() : 0;

  if (aTime !== bTime) {
    return bTime - aTime;
  }

  return a.name.localeCompare(b.name);
}

async function buildPatientRegistry() {
  const supabase = createAdminClient();
  const [
    { data: patientProfiles },
    { data: appointments },
    { data: treatments },
    { data: bookingRequests },
  ] = await Promise.all([
    supabase
      .from("patient_profiles")
      .select(
        "id, profile_id, date_of_birth, gender, blood_type, allergies, current_medications, emergency_contact_name, emergency_contact_phone, address, profiles!patient_profiles_profile_id_fkey(id, first_name, last_name, email, phone, address, is_active)",
      ),
    supabase
      .from("appointments")
      .select(
        "id, patient_id, patient_email, patient_name, dentist_id, service_id, start_at, duration_min, status, source, notes",
      )
      .order("start_at", { ascending: false }),
    supabase
      .from("treatments")
      .select(
        "id, patient_id, treatment_name, status, performed_at, aftercare_instructions, follow_up_date, service_id, dentist_id",
      )
      .order("performed_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("booking_requests")
      .select(
        "id, patient_name, email, phone, preferred_date, preferred_time, service_id, preferred_dentist_id, status, notes, created_at",
      )
      .order("created_at", { ascending: false }),
  ]);

  const patientProfileRows = (patientProfiles ??
    []) as PatientProfileJoinedRow[];
  const appointmentRows = (appointments ?? []) as AppointmentRow[];
  const treatmentRows = (treatments ?? []) as TreatmentRow[];
  const bookingRequestRows = (bookingRequests ?? []) as BookingRequestRow[];

  const serviceIds = new Set<string>();
  const dentistIds = new Set<string>();

  for (const row of appointmentRows) {
    if (row.service_id) {
      serviceIds.add(row.service_id);
    }
    dentistIds.add(row.dentist_id);
  }

  for (const row of treatmentRows) {
    if (row.service_id) {
      serviceIds.add(row.service_id);
    }
    dentistIds.add(row.dentist_id);
  }

  for (const row of bookingRequestRows) {
    if (row.service_id) {
      serviceIds.add(row.service_id);
    }
    if (row.preferred_dentist_id) {
      dentistIds.add(row.preferred_dentist_id);
    }
  }

  const [serviceMap, dentistMap] = await Promise.all([
    getServiceNameMap(Array.from(serviceIds)),
    getDentistNameMap(Array.from(dentistIds)),
  ]);

  const registry = new Map<string, RegistryAggregate>();
  const patientProfileKeyMap = new Map<string, string>();
  const emailKeyMap = new Map<string, string>();

  const ensurePatient = (input: {
    registryKey: string;
    patientProfileId?: string | null;
    profileId?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    hasAccount?: boolean;
    isActive?: boolean | null;
    dateOfBirth?: string | null;
    gender?: string | null;
    bloodType?: string | null;
    allergies?: string[] | null;
    currentMedications?: string[] | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
  }) => {
    const existing = registry.get(input.registryKey);
    if (existing) {
      if (!existing.patientProfileId && input.patientProfileId) {
        existing.patientProfileId = input.patientProfileId;
      }
      if (!existing.profileId && input.profileId) {
        existing.profileId = input.profileId;
      }
      if (sanitizeText(input.firstName) && !existing.firstName) {
        existing.firstName = sanitizeText(input.firstName);
      }
      if (
        sanitizeText(input.lastName) &&
        !existing.lastName &&
        existing.firstName
      ) {
        existing.lastName = sanitizeText(input.lastName);
      }
      if (sanitizeText(input.name) && existing.name === "Unknown patient") {
        existing.name = sanitizeText(input.name);
      }
      if (sanitizeText(input.email) && !existing.email) {
        existing.email = sanitizeText(input.email);
      }
      if (sanitizeText(input.phone) && !existing.phone) {
        existing.phone = sanitizeText(input.phone);
      }
      if (sanitizeText(input.address) && !existing.address) {
        existing.address = sanitizeText(input.address);
      }
      if (input.hasAccount) {
        existing.hasAccount = true;
      }
      if (input.isActive !== undefined && input.isActive !== null) {
        existing.isActive = input.isActive;
      }
      if (sanitizeText(input.dateOfBirth) && !existing.dateOfBirth) {
        existing.dateOfBirth = sanitizeText(input.dateOfBirth);
      }
      if (sanitizeText(input.gender) && !existing.gender) {
        existing.gender = sanitizeText(input.gender);
      }
      if (sanitizeText(input.bloodType) && !existing.bloodType) {
        existing.bloodType = sanitizeText(input.bloodType);
      }
      if (
        (input.allergies?.length ?? 0) > 0 &&
        existing.allergies.length === 0
      ) {
        existing.allergies = input.allergies ?? [];
      }
      if (
        (input.currentMedications?.length ?? 0) > 0 &&
        existing.currentMedications.length === 0
      ) {
        existing.currentMedications = input.currentMedications ?? [];
      }
      if (
        sanitizeText(input.emergencyContactName) &&
        !existing.emergencyContactName
      ) {
        existing.emergencyContactName = sanitizeText(
          input.emergencyContactName,
        );
      }
      if (
        sanitizeText(input.emergencyContactPhone) &&
        !existing.emergencyContactPhone
      ) {
        existing.emergencyContactPhone = sanitizeText(
          input.emergencyContactPhone,
        );
      }

      return existing;
    }

    const patient: RegistryAggregate = {
      registryKey: input.registryKey,
      patientProfileId: input.patientProfileId ?? null,
      profileId: input.profileId ?? null,
      firstName: sanitizeText(input.firstName),
      lastName: sanitizeText(input.lastName),
      name: sanitizeText(input.name) || "Unknown patient",
      email: sanitizeText(input.email),
      phone: sanitizeText(input.phone),
      address: sanitizeText(input.address),
      hasAccount: Boolean(input.hasAccount),
      isActive: input.isActive ?? null,
      dateOfBirth: sanitizeText(input.dateOfBirth),
      gender: sanitizeText(input.gender),
      bloodType: sanitizeText(input.bloodType),
      allergies: input.allergies ?? [],
      currentMedications: input.currentMedications ?? [],
      emergencyContactName: sanitizeText(input.emergencyContactName),
      emergencyContactPhone: sanitizeText(input.emergencyContactPhone),
      appointments: [],
      treatments: [],
      bookingRequests: [],
      lastVisitAt: null,
    };

    registry.set(input.registryKey, patient);
    return patient;
  };

  for (const row of patientProfileRows) {
    const profile = Array.isArray(row.profiles)
      ? row.profiles[0]
      : row.profiles;
    const registryKey = createRegistryKey({
      patientProfileId: row.id,
      email: profile?.email,
      fallbackPrefix: "patient",
      fallbackId: row.id,
    });

    patientProfileKeyMap.set(row.id, registryKey);
    const email = normalizeEmail(profile?.email);
    if (email) {
      emailKeyMap.set(email, registryKey);
    }

    ensurePatient({
      registryKey,
      patientProfileId: row.id,
      profileId: row.profile_id,
      firstName: profile?.first_name,
      lastName: profile?.last_name,
      name: buildName(profile?.first_name, profile?.last_name),
      email: profile?.email,
      phone: profile?.phone,
      address: profile?.address ?? row.address,
      hasAccount: true,
      isActive: profile?.is_active ?? null,
      dateOfBirth: row.date_of_birth,
      gender: row.gender,
      bloodType: row.blood_type,
      allergies: row.allergies,
      currentMedications: row.current_medications,
      emergencyContactName: row.emergency_contact_name,
      emergencyContactPhone: row.emergency_contact_phone,
    });
  }

  for (const row of appointmentRows) {
    const normalizedEmail = normalizeEmail(row.patient_email);
    const existingKey =
      (row.patient_id ? patientProfileKeyMap.get(row.patient_id) : null) ??
      (normalizedEmail ? emailKeyMap.get(normalizedEmail) : null);
    const registryKey =
      existingKey ??
      createRegistryKey({
        patientProfileId: row.patient_id,
        email: row.patient_email,
        fallbackPrefix: "appointment",
        fallbackId: row.id,
      });

    if (row.patient_id) {
      patientProfileKeyMap.set(row.patient_id, registryKey);
    }
    if (normalizedEmail) {
      emailKeyMap.set(normalizedEmail, registryKey);
    }

    const patient = ensurePatient({
      registryKey,
      patientProfileId: row.patient_id,
      ...splitName(row.patient_name),
      name: row.patient_name,
      email: row.patient_email,
    });

    patient.appointments.push({
      id: row.id,
      dentistName: dentistMap.get(row.dentist_id) ?? "Clinic dentist",
      serviceName: row.service_id
        ? (serviceMap.get(row.service_id) ?? null)
        : null,
      startAt: row.start_at,
      durationMin: row.duration_min,
      status: row.status,
      source: row.source,
      notes: row.notes,
    });

    if (
      !patient.lastVisitAt ||
      new Date(row.start_at) > new Date(patient.lastVisitAt)
    ) {
      patient.lastVisitAt = row.start_at;
    }
  }

  for (const row of treatmentRows) {
    const registryKey =
      patientProfileKeyMap.get(row.patient_id) ??
      createRegistryKey({
        patientProfileId: row.patient_id,
        fallbackPrefix: "treatment",
        fallbackId: row.id,
      });

    patientProfileKeyMap.set(row.patient_id, registryKey);
    const patient = ensurePatient({
      registryKey,
      patientProfileId: row.patient_id,
    });

    patient.treatments.push({
      id: row.id,
      treatmentName: row.treatment_name,
      dentistName: dentistMap.get(row.dentist_id) ?? "Clinic dentist",
      serviceName: row.service_id
        ? (serviceMap.get(row.service_id) ?? null)
        : null,
      performedAt: row.performed_at,
      status: row.status,
      aftercareInstructions: row.aftercare_instructions,
      followUpDate: row.follow_up_date,
    });

    if (
      row.performed_at &&
      (!patient.lastVisitAt ||
        new Date(row.performed_at) > new Date(patient.lastVisitAt))
    ) {
      patient.lastVisitAt = row.performed_at;
    }
  }

  for (const row of bookingRequestRows) {
    const normalizedEmail = normalizeEmail(row.email);
    const existingKey = normalizedEmail
      ? emailKeyMap.get(normalizedEmail)
      : null;
    const registryKey =
      existingKey ??
      createRegistryKey({
        email: row.email,
        fallbackPrefix: "request",
        fallbackId: row.id,
      });

    if (normalizedEmail) {
      emailKeyMap.set(normalizedEmail, registryKey);
    }

    const patient = ensurePatient({
      registryKey,
      ...splitName(row.patient_name),
      name: row.patient_name,
      email: row.email,
      phone: row.phone,
    });

    patient.bookingRequests.push({
      id: row.id,
      createdAt: row.created_at,
      serviceName: row.service_id
        ? (serviceMap.get(row.service_id) ?? null)
        : null,
      preferredDentistName: row.preferred_dentist_id
        ? (dentistMap.get(row.preferred_dentist_id) ?? null)
        : null,
      preferredDate: row.preferred_date,
      preferredTime: row.preferred_time,
      status: row.status,
      notes: row.notes,
    });
  }

  return Array.from(registry.values()).sort(sortByMostRecent);
}

export async function getPatientsForStaff(query = "") {
  const patients = await buildPatientRegistry();
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return patients.map(toSummary);
  }

  return patients
    .filter((patient) =>
      [patient.name, patient.email, patient.phone]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    )
    .map(toSummary);
}

export async function getPatientInfoMapForStaff(patientIds: string[]) {
  if (patientIds.length === 0) {
    return new Map<string, { name: string; email: string }>();
  }

  const patientIdSet = new Set(patientIds);
  const patients = await buildPatientRegistry();

  return new Map(
    patients
      .filter(
        (patient) =>
          patient.patientProfileId &&
          patientIdSet.has(patient.patientProfileId),
      )
      .map((patient) => [
        patient.patientProfileId as string,
        {
          name: patient.name || "Unknown patient",
          email: patient.email,
        },
      ]),
  );
}

export async function getPatientDetailForStaff(registryKey: string) {
  const patients = await buildPatientRegistry();
  const patient = patients.find((entry) => entry.registryKey === registryKey);

  if (!patient) {
    return null;
  }

  return {
    ...toSummary(patient),
    firstName: patient.firstName,
    lastName: patient.lastName,
    address: patient.address,
    dateOfBirth: patient.dateOfBirth,
    gender: patient.gender,
    bloodType: patient.bloodType,
    allergies: patient.allergies,
    currentMedications: patient.currentMedications,
    emergencyContactName: patient.emergencyContactName,
    emergencyContactPhone: patient.emergencyContactPhone,
    appointments: patient.appointments.sort(
      (a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime(),
    ),
    treatments: patient.treatments.sort((a, b) => {
      const aTime = a.performedAt ? new Date(a.performedAt).getTime() : 0;
      const bTime = b.performedAt ? new Date(b.performedAt).getTime() : 0;
      return bTime - aTime;
    }),
    bookingRequests: patient.bookingRequests.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  } satisfies StaffPatientDetail;
}

export async function savePatientMedicalProfileForStaff(input: {
  patientProfileId: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  allergiesText: string;
  currentMedicationsText: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}) {
  const supabase = createAdminClient();

  return supabase
    .from("patient_profiles")
    .update({
      date_of_birth: input.dateOfBirth || null,
      gender: input.gender || null,
      blood_type: input.bloodType || null,
      allergies: splitLines(input.allergiesText),
      current_medications: splitLines(input.currentMedicationsText),
      emergency_contact_name: input.emergencyContactName || null,
      emergency_contact_phone: input.emergencyContactPhone || null,
    })
    .eq("id", input.patientProfileId);
}

export async function savePatientContactProfileForStaff(input: {
  profileId: string;
  patientProfileId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}) {
  const supabase = createAdminClient();
  const normalizedEmail = input.email.trim().toLowerCase();

  const { data: currentProfile, error: currentProfileError } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", input.profileId)
    .maybeSingle();

  if (currentProfileError) {
    return { error: currentProfileError };
  }

  if (
    normalizedEmail &&
    currentProfile?.email &&
    normalizedEmail !== currentProfile.email.toLowerCase()
  ) {
    const { error: authError } = await supabase.auth.admin.updateUserById(
      input.profileId,
      {
        email: normalizedEmail,
        email_confirm: true,
      },
    );

    if (authError) {
      return { error: authError };
    }
  }

  const profileResult = await supabase
    .from("profiles")
    .update({
      first_name: input.firstName,
      last_name: input.lastName,
      email: normalizedEmail,
      phone: input.phone || null,
      address: input.address || null,
    })
    .eq("id", input.profileId);

  if (profileResult.error) {
    return profileResult;
  }

  if (!input.patientProfileId) {
    return { error: null };
  }

  return supabase
    .from("patient_profiles")
    .update({
      address: input.address || null,
    })
    .eq("id", input.patientProfileId);
}
