import Link from "next/link";

import { FlashBanner } from "@/components/staff/flash-banner";
import { StaffServiceCard } from "@/components/staff/services/staff-service-card";
import { getServicesForStaff } from "@/features/services/admin";

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

      <FlashBanner error={params.error} success={params.success} />

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
            <StaffServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </section>
  );
}
