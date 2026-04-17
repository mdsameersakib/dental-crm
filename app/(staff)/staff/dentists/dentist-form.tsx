import { DentistCoreFields } from "@/components/staff/dentists/dentist-core-fields";
import { DentistDetailsFields } from "@/components/staff/dentists/dentist-details-fields";
import { DentistImagePanel } from "@/components/staff/dentists/dentist-image-panel";
import { DentistProfileHeader } from "@/components/staff/dentists/dentist-profile-header";
import { DentistScheduleForm } from "@/components/staff/dentists/dentist-schedule-form";
import type {
  AvailableDentistStaff,
  StaffDentistProfile,
} from "@/features/dentists/admin";

import { saveDentistProfile } from "./actions";

type DentistFormProps = {
  mode: "create" | "edit";
  dentist?: StaffDentistProfile;
  availableDentists?: AvailableDentistStaff[];
};

export function DentistForm({
  mode,
  dentist,
  availableDentists = [],
}: DentistFormProps) {
  const isEdit = mode === "edit";
  const displayName = dentist
    ? `${dentist.firstName} ${dentist.lastName}`.trim() || dentist.email
    : "Add a dentist";

  return (
    <section className="space-y-6">
      <form
        action={saveDentistProfile}
        className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
      >
        <input type="hidden" name="id" value={dentist?.id ?? ""} />
        <input
          type="hidden"
          name="profile_id"
          value={isEdit ? dentist?.profile_id : ""}
        />
        <input
          type="hidden"
          name="redirect_to"
          value={
            isEdit && dentist
              ? `/staff/dentists/${dentist.id}`
              : "/staff/dentists/new"
          }
        />

        <DentistProfileHeader
          isEdit={isEdit}
          displayName={displayName}
          canSave={isEdit || availableDentists.length > 0}
        />

        <section className="grid gap-6 border-t border-slate-200 bg-[var(--color-surface-container-low)] px-6 py-6 lg:grid-cols-[0.88fr_1.12fr]">
          <DentistImagePanel
            imagePath={dentist?.profile_photo_path ?? null}
            displayName={displayName}
          />
          <DentistCoreFields
            isEdit={isEdit}
            dentist={dentist}
            availableDentists={availableDentists}
          />
        </section>
        <DentistDetailsFields dentist={dentist} />
      </form>

      {isEdit && dentist ? (
        <DentistScheduleForm dentist={dentist} />
      ) : (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Weekly availability
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
            Schedule
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Save the dentist profile first, then you can configure weekly
            availability on the edit page.
          </p>
        </section>
      )}
    </section>
  );
}
