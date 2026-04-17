import Link from "next/link";
import { ConfirmSubmitButton } from "@/components/ui/confirm-submit-button";

import type { StaffService } from "@/features/services/admin";

import { saveService } from "./actions";

type ServiceFormProps = {
  mode: "create" | "edit";
  service?: StaffService;
  suggestedDisplayOrder?: number;
};

const serviceIconOptions = [
  { value: "medical_services", label: "Medical Services" },
  { value: "dentistry", label: "Dentistry" },
  { value: "health_and_safety", label: "Health & Safety" },
  { value: "monitor_heart", label: "Monitor Heart" },
  { value: "biotech", label: "Biotech" },
  { value: "radiology", label: "Radiology" },
  { value: "healing", label: "Healing" },
  { value: "favorite", label: "Favorite" },
  { value: "shield_with_heart", label: "Shield & Heart" },
  { value: "stethoscope", label: "Stethoscope" },
  { value: "local_hospital", label: "Hospital" },
  { value: "self_improvement", label: "Self Improvement" },
] as const;

function getRenderableIcon(iconName: string) {
  if (iconName === "toothbrush") {
    return "dentistry";
  }

  return iconName;
}

export function ServiceForm({
  mode,
  service,
  suggestedDisplayOrder,
}: ServiceFormProps) {
  const isEdit = mode === "edit";
  const initialIcon = service?.icon_name?.trim() || "medical_services";
  const defaultDisplayOrder =
    service?.display_order ?? suggestedDisplayOrder ?? 0;
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
    <section className="space-y-6">
      <form
        action={saveService}
        className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
      >
        <input type="hidden" name="id" value={service?.id ?? ""} />

        <div className="flex flex-wrap items-start justify-between gap-4 px-4 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              {isEdit ? "Edit service" : "New service"}
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold text-slate-900">
              {isEdit ? service?.name : "Add a service"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Manage service content, media, and pricing for the public website
              and booking flow.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/staff/services"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
            >
              Back
            </Link>
            <button
              type="submit"
              className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
            >
              Save service
            </button>
          </div>
        </div>
        <section className="grid gap-6 border-t border-slate-200 bg-[var(--color-surface-container-low)] px-4 py-5 sm:px-6 sm:py-6 lg:grid-cols-[0.88fr_1.12fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              Image
            </p>
            <div className="mt-3 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#d9efee_0%,#edf4f8_100%)]">
              {service?.image_path ? (
                <img
                  src={service.image_path}
                  alt={service.name}
                  className="h-56 w-full object-cover"
                />
              ) : (
                <div className="flex h-56 items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-teal-700">
                    {getRenderableIcon(initialIcon)}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-3">
              <input
                name="service_image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-colors hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-primary-fixed)] file:px-3 file:py-1.5 file:font-semibold file:text-[var(--color-primary)]"
              />
              {service?.image_path ? (
                <div>
                  <ConfirmSubmitButton
                    className="inline-flex items-center rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                    confirmMessage="Remove this service image? This action cannot be undone."
                    label="Remove current image"
                    name="remove_service_image"
                    value="on"
                  />
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Upload a clean rectangular image for better service cards.
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              Core info
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Service name</span>
                <input
                  name="name"
                  defaultValue={service?.name ?? ""}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-colors hover:border-slate-300 focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500/30"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Slug</span>
                <input
                  name="slug"
                  defaultValue={service?.slug ?? ""}
                  placeholder="URL ID, e.g. teeth-whitening (lowercase, use hyphens)"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-colors hover:border-slate-300 focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500/30"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                <span>Short description</span>
                <textarea
                  name="short_description"
                  defaultValue={service?.short_description ?? ""}
                  rows={3}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-colors hover:border-slate-300 focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500/30"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                <span>Icons</span>
                <div className="grid gap-2">
                  <details className="group rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300 open:border-slate-300">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-slate-700">
                      <span className="inline-flex items-center gap-2">
                        <span className="material-symbols-outlined text-xl text-teal-700">
                          {getRenderableIcon(initialIcon)}
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
                            {getRenderableIcon(iconOption.value)}
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
              </label>
            </div>
          </div>
        </section>

        <section className="grid gap-5 border-t border-slate-200 px-4 py-5 sm:px-6 sm:py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              Details
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900">
              Public service content
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <label className="grid text-sm font-medium text-slate-700">
              <textarea
                name="full_description"
                defaultValue={service?.full_description ?? ""}
                rows={8}
                placeholder="Full description"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-colors hover:border-slate-300 focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500/30"
              />
            </label>

            <div className="grid h-fit gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-heading text-lg font-bold text-slate-900">
                Pricing & ordering
              </h3>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Base price</span>
                <input
                  name="base_price"
                  defaultValue={service?.base_price ?? ""}
                  type="number"
                  step="0.01"
                  min="0"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-colors hover:border-slate-300 focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500/30"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Duration (min)</span>
                <input
                  name="duration_min"
                  defaultValue={service?.duration_min ?? ""}
                  type="number"
                  min="0"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-colors hover:border-slate-300 focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500/30"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                <span>Display order</span>
                <input
                  name="display_order"
                  defaultValue={defaultDisplayOrder}
                  type="number"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-colors hover:border-slate-300 focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500/30"
                />
                {!isEdit ? (
                  <p className="text-xs text-slate-500">
                    Defaulted to next position ({defaultDisplayOrder}).
                  </p>
                ) : null}
              </label>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
              <span>Active</span>
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={service?.is_active ?? true}
                className="h-4 w-4"
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
              <span>Published</span>
              <input
                type="checkbox"
                name="is_published"
                defaultChecked={service?.is_published ?? false}
                className="h-4 w-4"
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
              <span>Featured</span>
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={service?.is_featured ?? false}
                className="h-4 w-4"
              />
            </label>
          </div>
        </section>
      </form>
    </section>
  );
}
