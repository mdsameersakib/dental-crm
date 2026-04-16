import { notFound } from "next/navigation";

import { getDentistForStaff } from "@/features/dentists/admin";

import { DentistForm } from "../dentist-form";

type EditDentistPageProps = {
  params: Promise<{ dentistId: string }>;
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function EditDentistPage({
  params,
  searchParams,
}: EditDentistPageProps) {
  const [{ dentistId }, query] = await Promise.all([params, searchParams]);
  const dentist = await getDentistForStaff(dentistId);

  if (!dentist) {
    notFound();
  }

  return (
    <section className="space-y-6">
      {query.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {query.error}
        </div>
      ) : null}

      {query.success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {query.success}
        </div>
      ) : null}

      <DentistForm mode="edit" dentist={dentist} />
    </section>
  );
}
