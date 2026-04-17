import type { Database } from "@/types/database";

export type AppRole = Database["public"]["Enums"]["app_role"];

export const staffRoles: readonly AppRole[] = [
  "admin",
  "receptionist",
  "dentist",
];
export const landingManagerRoles: readonly AppRole[] = [
  "admin",
  "receptionist",
];

export function isStaffRole(role: AppRole) {
  return staffRoles.includes(role);
}

export function isLandingManagerRole(role: AppRole) {
  return landingManagerRoles.includes(role);
}

export function isAdminRole(role: AppRole) {
  return role === "admin";
}
