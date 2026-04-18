import { PatientShell } from "@/components/patient/patient-shell";
import { requirePatientProfile } from "@/lib/auth/session";

import { signOutPatient } from "../actions";

export default async function PatientPortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await requirePatientProfile();
  const fullName =
    `${profile.firstName} ${profile.lastName}`.trim() || "Patient";

  return (
    <PatientShell
      fullName={fullName}
      email={profile.email}
      signOutAction={signOutPatient}
    >
      {children}
    </PatientShell>
  );
}
