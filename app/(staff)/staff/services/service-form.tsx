import Link from "next/link";
import { ServiceCoreFields } from "@/components/staff/services/service-core-fields";
import { ServiceDetailsFields } from "@/components/staff/services/service-details-fields";
import { ServiceImageField } from "@/components/staff/services/service-image-field";

import type { StaffService } from "@/features/services/admin";

import { saveService } from "./actions";

type ServiceFormProps = {
  mode: "create" | "edit";
  service?: StaffService;
  suggestedDisplayOrder?: number;
};

export function ServiceForm({
  mode,
  service,
  suggestedDisplayOrder,
}: ServiceFormProps) {
  const isEdit = mode === "edit";
  const initialIcon = service?.icon_name?.trim() || "medical_services";
  const defaultDisplayOrder =
    service?.display_order ?? suggestedDisplayOrder ?? 0;

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
          <ServiceImageField
            imagePath={service?.image_path ?? null}
            iconName={initialIcon}
            serviceName={service?.name ?? "Service image"}
          />
          <ServiceCoreFields
            name={service?.name ?? ""}
            slug={service?.slug ?? ""}
            shortDescription={service?.short_description ?? ""}
            initialIcon={initialIcon}
          />
        </section>
        <ServiceDetailsFields
          fullDescription={service?.full_description ?? ""}
          basePrice={service?.base_price ?? null}
          durationMin={service?.duration_min ?? null}
          defaultDisplayOrder={defaultDisplayOrder}
          isEdit={isEdit}
          isActive={service?.is_active ?? true}
          isPublished={service?.is_published ?? false}
          isFeatured={service?.is_featured ?? false}
        />
      </form>
    </section>
  );
}
