import type { StaffDentistProfile } from "@/features/dentists/admin";

function toEducationText(education: unknown) {
  if (!Array.isArray(education)) {
    return "";
  }

  return education
    .filter((entry): entry is string => typeof entry === "string")
    .join("\n");
}

type DentistDetailsFieldsProps = {
  dentist?: StaffDentistProfile;
};

export function DentistDetailsFields({ dentist }: DentistDetailsFieldsProps) {
  return (
    <section className="grid gap-5 border-t border-slate-200 px-6 py-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          Profile details
        </p>
        <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
          Professional information
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>Specializations</span>
          <input
            name="specializations"
            defaultValue={dentist?.specializations.join(", ") ?? ""}
            placeholder="Cosmetic Dentistry, Orthodontics"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>Display order</span>
          <input
            name="display_order"
            type="number"
            defaultValue={dentist?.display_order ?? 0}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
          <span>Education (one item per line)</span>
          <textarea
            name="education"
            defaultValue={toEducationText(dentist?.education)}
            rows={4}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>Short bio</span>
          <textarea
            name="short_bio"
            defaultValue={dentist?.short_bio ?? ""}
            rows={4}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>Full bio</span>
          <textarea
            name="bio"
            defaultValue={dentist?.bio ?? ""}
            rows={4}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
        <label className="flex items-center gap-2 rounded-lg px-2 py-1">
          <input
            type="checkbox"
            name="is_accepting_patients"
            defaultChecked={dentist?.is_accepting_patients ?? true}
          />
          Accepting patients
        </label>
        <label className="flex items-center gap-2 rounded-lg px-2 py-1">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={dentist?.is_published ?? false}
          />
          Published
        </label>
        <label className="flex items-center gap-2 rounded-lg px-2 py-1">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={dentist?.is_featured ?? false}
          />
          Featured
        </label>
      </div>
    </section>
  );
}
