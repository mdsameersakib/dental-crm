import { getPatientAppointmentsData } from "./appointment-queries";
import { getPatientDashboardData } from "./dashboard-queries";
import { getPatientFollowUpOptions } from "./follow-up";
import { getPatientProfileFormData } from "./profile";

export async function getPatientDashboardPageData(patientProfileId: string) {
  const [dashboard, options] = await Promise.all([
    getPatientDashboardData(patientProfileId),
    getPatientFollowUpOptions(),
  ]);

  return {
    ...dashboard,
    ...options,
  };
}

export { getPatientAppointmentsData, getPatientProfileFormData };
