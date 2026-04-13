import Link from "next/link";

import { getServicesForStaff } from "@/features/services/admin";

import { deleteService } from "./actions";

type StaffServicesPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function StaffServicesPage({
  searchParams,
}: StaffServicesPageProps) {
  const [params, services] = await Promise.all([searchParams, getServicesForStaff()]);

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
            Review the services shown on the public website, then add, edit, publish, or remove them from one place.
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
            Start by creating the clinic services that should appear on the public website and in the booking flow.
          </p>
          <Link
            href="/staff/services/new"
            className="mt-6 inline-flex rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white"
          >
            Add Service
          </Link>
        </div>
      ) : (
        <div className="grid gap-5">
          {services.map((service) => (
            <article
              key={service.id}
              className="flex flex-col gap-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-heading text-2xl font-bold text-slate-900">
                    {service.name}
                  </h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                    {service.slug}
                  </span>
                  {service.is_published ? (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
                      Draft
                    </span>
                  )}
                  {!service.is_active ? (
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                      Inactive
                    </span>
                  ) : null}
                </div>

                <p className="max-w-3xl text-sm leading-7 text-slate-600">
                  {service.short_description || "No short description added yet."}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span>Price: {service.base_price === null ? "By consultation" : `৳${service.base_price}`}</span>
                  <span>Duration: {service.duration_min === null ? "Custom" : `${service.duration_min} min`}</span>
                  <span>Order: {service.display_order}</span>
                  <span>Icon: {service.icon_name || "default"}</span>
                </div>
                {service.image_path ? (
                  <p className="text-xs text-slate-500">Image: {service.image_path}</p>
                ) : null}
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/staff/services/${service.id}`}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Edit
                </Link>
                <form action={deleteService}>
                  <input type="hidden" name="id" value={service.id} />
                  <button
                    type="submit"
                    className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
