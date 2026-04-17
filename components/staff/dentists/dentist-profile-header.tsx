import Link from "next/link";

type DentistProfileHeaderProps = {
  isEdit: boolean;
  displayName: string;
  canSave: boolean;
};

export function DentistProfileHeader({
  isEdit,
  displayName,
  canSave,
}: DentistProfileHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 px-6 pt-6 pb-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          {isEdit ? "Edit dentist" : "New dentist"}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-slate-900">
          {displayName}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
          {isEdit
            ? "Update public profile details, contact data, and publishing status."
            : "Create a dentist profile for an existing staff dentist account."}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/staff/dentists"
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Back
        </Link>
        <button
          type="submit"
          className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
          disabled={!canSave}
        >
          Save profile
        </button>
      </div>
    </div>
  );
}
