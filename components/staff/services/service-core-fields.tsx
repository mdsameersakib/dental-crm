import { serviceIconOptions } from "@/features/services/presentation";

type ServiceCoreFieldsProps = {
  name: string;
  slug: string;
  shortDescription: string;
  initialIcon: string;
};

export function ServiceCoreFields({
  name,
  slug,
  shortDescription,
  initialIcon,
}: ServiceCoreFieldsProps) {
  const hasCustomIcon =
    initialIcon.length > 0 &&
    !serviceIconOptions.some((iconOption) => iconOption.value === initialIcon);
  const iconPickerOptions = hasCustomIcon
    ? [
        { value: initialIcon, label: `Current (${initialIcon})` },
        ...serviceIconOptions,
      ]
    : serviceIconOptions;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
        Core info
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>Service name</span>
          <input
            name="name"
            defaultValue={name}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-colors hover:border-slate-300 focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500/30"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>Slug</span>
          <input
            name="slug"
            defaultValue={slug}
            placeholder="URL ID, e.g. teeth-whitening (lowercase, use hyphens)"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-colors hover:border-slate-300 focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500/30"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
          <span>Short description</span>
          <textarea
            name="short_description"
            defaultValue={shortDescription}
            rows={3}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-colors hover:border-slate-300 focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500/30"
          />
        </label>
        <div className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
          <span>Icons</span>
          <div className="grid gap-2">
            <details className="group rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300 open:border-slate-300">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-slate-700">
                <span className="inline-flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl text-teal-700">
                    {initialIcon === "toothbrush" ? "dentistry" : initialIcon}
                  </span>
                  Icon picker
                </span>
                <span className="material-symbols-outlined text-base text-slate-500 transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </summary>

              <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-8">
                {iconPickerOptions.map((iconOption) => (
                  <label
                    key={iconOption.value}
                    title={iconOption.label}
                    className="relative flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-2.5 transition-colors hover:bg-slate-100"
                  >
                    <input
                      type="radio"
                      name="icon_name"
                      value={iconOption.value}
                      defaultChecked={iconOption.value === initialIcon}
                      className="peer sr-only"
                    />
                    <span className="material-symbols-outlined text-[22px] text-slate-700 transition-colors peer-checked:text-teal-700">
                      {iconOption.value === "toothbrush"
                        ? "dentistry"
                        : iconOption.value}
                    </span>
                    <span className="pointer-events-none absolute inset-0 rounded-lg border-2 border-transparent peer-checked:border-teal-500" />
                  </label>
                ))}
              </div>
            </details>
            <p className="text-xs text-slate-500">
              Open the picker and choose an icon tile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
