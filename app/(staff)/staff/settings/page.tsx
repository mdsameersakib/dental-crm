import { FlashBanner } from "@/components/staff/flash-banner";
import { BookingDefaultsCard } from "@/components/staff/settings/booking-defaults-card";
import { MyProfileCard } from "@/components/staff/settings/my-profile-card";
import { PasswordCard } from "@/components/staff/settings/password-card";
import { StaffAccessCard } from "@/components/staff/settings/staff-access-card";
import {
  getClinicSettingsForStaff,
  getStaffMemberList,
} from "@/features/settings/admin";
import { requireStaffProfile } from "@/lib/auth/session";

type StaffSettingsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function StaffSettingsPage({
  searchParams,
}: StaffSettingsPageProps) {
  const profile = await requireStaffProfile();
  const params = await searchParams;
  const [clinicSettings, staffMembers] = await Promise.all([
    getClinicSettingsForStaff(),
    profile.role === "admin" ? getStaffMemberList() : Promise.resolve([]),
  ]);

  const isAdmin = profile.role === "admin";

  return (
    <section className="space-y-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          Workspace
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold text-slate-900">
          Settings
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Manage your staff profile, booking defaults, and core staff access in
          one place.
        </p>
      </div>

      <FlashBanner error={params.error} success={params.success} />

      <div className="grid gap-5 xl:grid-cols-2">
        <MyProfileCard
          firstName={profile.firstName}
          lastName={profile.lastName}
          email={profile.email}
          phone={profile.phone}
        />
        <PasswordCard />
      </div>

      <BookingDefaultsCard clinicSettings={clinicSettings} />

      {isAdmin ? (
        <StaffAccessCard
          currentProfileId={profile.id}
          staffMembers={staffMembers}
        />
      ) : null}
    </section>
  );
}
