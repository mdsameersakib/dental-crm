import Link from "next/link";

import { getServicesForStaff } from "@/features/services/admin";

import { ServiceCardActions } from "./service-card-actions";

type StaffServicesPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function StaffServicesPage({
  searchParams,
}: StaffServicesPageProps) {
  const [params, services] = await Promise.all([
    searchParams,
    getServicesForStaff(),
  ]);

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Content Management
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-slate-900">
            Services
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Review the services shown on the public website, then add, edit,
            publish, or remove them from one place.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
            {services.length} service{services.length === 1 ? "" : "s"}
          </div>
          <Link
            href="/staff/services/new"
            className="rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white"
          >
            Add Service
          </Link>
        </div>
      </div>

      {params.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {params.error}
        </div>
      ) : null}

      {params.success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {params.success}
        </div>
      ) : null}

      {services.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white px-8 py-14 text-center shadow-sm">
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            No services yet
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Start by creating the clinic services that should appear on the
            public website and in the booking flow.
          </p>
          <Link
            href="/staff/services/new"
            className="mt-6 inline-flex rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white"
          >
            Add Service
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.id}
              className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {service.image_path ? (
                <div className="h-28 overflow-hidden">
                  <img
                    alt={service.name}
                    className="h-full w-full object-cover"
                    src={service.image_path}
                  />
                </div>
              ) : (
                <div className="flex h-28 items-center justify-center bg-[linear-gradient(135deg,#d9efee_0%,#edf4f8_100%)]">
                  <span className="material-symbols-outlined text-4xl text-teal-700">
                    {service.icon_name || "medical_services"}
                  </span>
                </div>
              )}

              <div className="grid gap-3 p-3.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                    {service.slug}
                  </span>
                  {service.is_published ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700">
                      Draft
                    </span>
                  )}
                  {!service.is_active ? (
                    <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-700">
                      Inactive
                    </span>
                  ) : null}
                  {service.is_featured ? (
                    <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-teal-700">
                      Featured
                    </span>
                  ) : null}
                </div>

                <div>
                  <h2 className="font-heading text-lg font-bold leading-tight text-slate-900">
                    {service.name}
                  </h2>
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-slate-600">
                    {service.short_description ||
                      "No short description added yet."}
                  </p>
                </div>

                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl bg-slate-50 px-3 py-2.5 text-[12px]">
                  <div>
                    <dt className="font-bold uppercase tracking-[0.12em] text-slate-500">
                      Price
                    </dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      {service.base_price === null
                        ? "By consultation"
                        : `৳${service.base_price}`}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold uppercase tracking-[0.12em] text-slate-500">
                      Duration
                    </dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      {service.duration_min === null
                        ? "Custom"
                        : `${service.duration_min} min`}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold uppercase tracking-[0.12em] text-slate-500">
                      Order
                    </dt>
                    <dd className="mt-1 font-semibold text-slate-900">
                      {service.display_order}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold uppercase tracking-[0.12em] text-slate-500">
                      Icon
                    </dt>
                    <dd className="mt-1 truncate font-semibold text-slate-900">
                      {service.icon_name || "default"}
                    </dd>
                  </div>
                </dl>

                <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
                  <p className="text-xs text-slate-500">
                    {service.image_path ? "Image attached" : "No image added"}
                  </p>
                  <ServiceCardActions
                    serviceId={service.id}
                    serviceName={service.name}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
