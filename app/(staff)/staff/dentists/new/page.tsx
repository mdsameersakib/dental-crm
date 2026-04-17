import { getAvailableDentistStaff } from "@/features/dentists/admin";

import { DentistForm } from "../dentist-form";

type NewDentistPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function NewDentistPage({
  searchParams,
}: NewDentistPageProps) {
  const [params, availableDentists] = await Promise.all([
    searchParams,
    getAvailableDentistStaff(),
  ]);

  return (
    <section className="space-y-6">
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

      <DentistForm mode="create" availableDentists={availableDentists} />
    </section>
  );
}
