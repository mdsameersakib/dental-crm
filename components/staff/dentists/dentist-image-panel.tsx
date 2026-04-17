import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";

type DentistImagePanelProps = {
  imagePath: string | null;
  displayName: string;
};

export function DentistImagePanel({
  imagePath,
  displayName,
}: DentistImagePanelProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
        Image
      </p>
      <div className="mt-3 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#d9efee_0%,#edf4f8_100%)]">
        {imagePath ? (
          <img
            src={imagePath}
            alt={`${displayName} current profile`}
            className="h-56 w-full object-cover"
          />
        ) : (
          <div className="flex h-56 items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-teal-700">
              medical_services
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-3">
        <input
          name="profile_photo"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-primary-fixed)] file:px-3 file:py-1.5 file:font-semibold file:text-[var(--color-primary)]"
        />
        {imagePath ? (
          <div>
            <ConfirmSubmitButton
              className="inline-flex items-center rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
              confirmMessage="Remove this profile image? This action cannot be undone."
              label="Remove current image"
              name="remove_profile_photo"
              value="on"
            />
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            Upload a square portrait for best card presentation.
          </p>
        )}
      </div>
    </div>
  );
}
