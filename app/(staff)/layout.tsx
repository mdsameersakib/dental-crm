import { signOutStaff } from "@/app/auth/actions";
import { StaffShell } from "@/components/staff/staff-shell";
import { requireStaffProfile } from "@/lib/auth/session";

export default function StaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StaffLayoutInner>{children}</StaffLayoutInner>;
}

async function StaffLayoutInner({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireStaffProfile();

  return <StaffShell signOutAction={signOutStaff}>{children}</StaffShell>;
}
