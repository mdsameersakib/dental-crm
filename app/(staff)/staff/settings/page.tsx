import { requireStaffProfile } from "@/lib/auth/session";
import {
  getClinicSettingsForStaff,
  getStaffMemberList,
} from "@/features/settings/admin";

import {
  changeMyPassword,
  inviteStaffAccount,
  saveBookingDefaults,
  saveMyProfile,
  sendStaffPasswordResetEmail,
} from "./actions";
import { StaffStatusToggle } from "./staff-status-toggle";

type StaffSettingsPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

function displayName(firstName: string, lastName: string, fallback: string) {
  return `${firstName} ${lastName}`.trim() || fallback;
}

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

      {params.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {params.error}
        </div>
      ) : null}

      {params.success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {params.success}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-slate-900">
            My Profile
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Update your basic staff account details.
          </p>

          <form action={saveMyProfile} className="mt-4 grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                First name
                <input
                  name="first_name"
                  defaultValue={profile.firstName}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Last name
                <input
                  name="last_name"
                  defaultValue={profile.lastName}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
                />
              </label>
            </div>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Email
              <input
                value={profile.email}
                disabled
                className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Phone
              <input
                name="phone"
                defaultValue={profile.phone ?? ""}
                placeholder="Add contact number"
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:bg-white focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="mt-1 w-full rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Save Profile
            </button>
          </form>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-slate-900">
            Password
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Change your login password for the staff portal.
          </p>

          <form action={changeMyPassword} className="mt-4 grid gap-3">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              New password
              <input
                name="password"
                type="password"
                minLength={8}
                placeholder="Minimum 8 characters"
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:bg-white focus:outline-none"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Confirm password
              <input
                name="confirm_password"
                type="password"
                minLength={8}
                placeholder="Repeat new password"
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:bg-white focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="mt-1 w-full rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Update Password
            </button>
          </form>
        </article>
      </div>

      <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-xl font-bold text-slate-900">
          Booking Defaults
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Control default appointment duration and workspace timezone.
        </p>

        <form
          action={saveBookingDefaults}
          className="mt-4 grid gap-3 md:grid-cols-3"
        >
          <input type="hidden" name="id" value={clinicSettings.id ?? ""} />
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Default duration (minutes)
            <input
              name="duration_min"
              type="number"
              min={5}
              step={5}
              defaultValue={clinicSettings.booking_default_duration_min}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
            Timezone
            <input
              name="timezone"
              defaultValue={clinicSettings.booking_timezone}
              placeholder="e.g. Asia/Dhaka"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:bg-white focus:outline-none"
            />
          </label>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white sm:w-auto"
            >
              Save Booking Defaults
            </button>
          </div>
        </form>
      </article>

      {isAdmin ? (
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-slate-900">
            Staff Access
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Activate or deactivate staff accounts for MVP access control.
          </p>

          <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-slate-800">
              Invite new staff account
            </summary>
            <form action={inviteStaffAccount} className="mt-4 grid gap-3">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="staff@clinic.com"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:outline-none"
                  />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Role
                  <select
                    name="role"
                    required
                    defaultValue="dentist"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="dentist">Dentist</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="admin">Administrator</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  First name (optional)
                  <input
                    name="first_name"
                    placeholder="Given name"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:outline-none"
                  />
                </label>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Last name (optional)
                  <input
                    name="last_name"
                    placeholder="Family name"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-teal-500 focus:outline-none"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white sm:w-auto"
              >
                Send Invite
              </button>
            </form>
          </details>

          <div className="mt-4 grid gap-3">
            {staffMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {displayName(
                      member.first_name,
                      member.last_name,
                      member.email,
                    )}
                  </p>
                  <p className="text-xs text-slate-600">{member.email}</p>
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                    {member.role}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StaffStatusToggle
                    profileId={member.id}
                    isActive={member.is_active}
                    disabled={member.id === profile.id}
                  />
                  <form action={sendStaffPasswordResetEmail}>
                    <input type="hidden" name="email" value={member.email} />
                    <button
                      type="submit"
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      Send reset email
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </article>
      ) : null}
    </section>
  );
}
