import { saveMyProfile } from "@/app/(staff)/staff/settings/actions";

type MyProfileCardProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
};

export function MyProfileCard({
  firstName,
  lastName,
  email,
  phone,
}: MyProfileCardProps) {
  return (
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
              defaultValue={firstName}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Last name
            <input
              name="last_name"
              defaultValue={lastName}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
            />
          </label>
        </div>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Email
          <input
            value={email}
            disabled
            className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Phone
          <input
            name="phone"
            defaultValue={phone ?? ""}
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
  );
}
