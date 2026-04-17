import { changeMyPassword } from "@/app/(staff)/staff/settings/actions";

export function PasswordCard() {
  return (
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
  );
}
