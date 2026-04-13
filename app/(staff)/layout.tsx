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
  const profile = await requireStaffProfile();

  return (
    <StaffShell
      profile={{
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: profile.role,
        email: profile.email,
      }}
    >
      {children}
    </StaffShell>
  );
}
