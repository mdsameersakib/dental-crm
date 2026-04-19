import { FlashBanner } from "@/components/staff/flash-banner";
import { StaffWaitlistCard } from "@/components/staff/waitlist/staff-waitlist-card";
import { getWaitlistEntriesForStaff } from "@/features/waitlist/admin";

import { saveWaitlistStatus } from "./actions";

export const dynamic = "force-dynamic";

type StaffWaitlistPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function StaffWaitlistPage({
  searchParams,
}: StaffWaitlistPageProps) {
  const params = await searchParams;
  const entries = await getWaitlistEntriesForStaff();

  return (
    <section className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Operations
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold text-slate-900">
            Waitlist
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Track patients waiting for a preferred slot without building a full
            automated slot-matching engine.
          </p>
        </div>
        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
          {entries.length} waitlist entr{entries.length === 1 ? "y" : "ies"}
        </div>
      </div>

      <FlashBanner error={params.error} success={params.success} />

      {entries.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white px-8 py-14 text-center shadow-sm">
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            No waitlist entries yet
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Patients can join the waitlist from the portal when they are
            flexible on the exact appointment slot.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(320px,380px))]">
          {entries.map((entry) => (
            <StaffWaitlistCard
              key={entry.id}
              entry={entry}
              action={saveWaitlistStatus}
            />
          ))}
        </div>
      )}
    </section>
  );
}
