import {
  inviteStaffAccount,
  sendStaffPasswordResetEmail,
} from "@/app/(staff)/staff/settings/actions";
import { StaffStatusToggle } from "@/app/(staff)/staff/settings/staff-status-toggle";
import type { StaffMember } from "@/features/settings/admin";

type StaffAccessCardProps = {
  currentProfileId: string;
  staffMembers: StaffMember[];
};

function displayName(firstName: string, lastName: string, fallback: string) {
  return `${firstName} ${lastName}`.trim() || fallback;
}

export function StaffAccessCard({
  currentProfileId,
  staffMembers,
}: StaffAccessCardProps) {
  return (
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
                {displayName(member.first_name, member.last_name, member.email)}
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
                disabled={member.id === currentProfileId}
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
  );
}
