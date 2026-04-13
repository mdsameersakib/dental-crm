"use client";

import Link from "next/link";
import { useState } from "react";

import { deleteService } from "./actions";

type ServiceCardActionsProps = {
  serviceId: string;
  serviceName: string;
};

export function ServiceCardActions({
  serviceId,
  serviceName,
}: ServiceCardActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        <Link
          href={`/staff/services/${serviceId}`}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700"
        >
          Delete
        </button>
      </div>

      {isDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">
              Confirm deletion
            </p>
            <h3 className="mt-3 font-heading text-2xl font-bold text-slate-900">
              Delete {serviceName}?
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              This will remove the service from the database and from the public
              website. Use this only when you are sure the service should no
              longer exist.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
              <form action={deleteService}>
                <input type="hidden" name="id" value={serviceId} />
                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Delete service
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
