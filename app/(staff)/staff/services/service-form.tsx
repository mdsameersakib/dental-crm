import Link from "next/link";

import type { StaffService } from "@/features/services/admin";

import { saveService } from "./actions";

type ServiceFormProps = {
  mode: "create" | "edit";
  service?: StaffService;
};

export function ServiceForm({ mode, service }: ServiceFormProps) {
  const isEdit = mode === "edit";

  return (
    <form
      action={saveService}
      className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="id" value={service?.id ?? ""} />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            {isEdit ? "Edit service" : "New service"}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-slate-900">
            {isEdit ? service?.name : "Add a service"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Define the service content, pricing, and visibility used across the public website and booking flow.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/staff/services"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Back
          </Link>
          <button
            type="submit"
            className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
          >
            Save
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>Service name</span>
          <input
            name="name"
            defaultValue={service?.name ?? ""}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>Slug</span>
          <input
            name="slug"
            defaultValue={service?.slug ?? ""}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
            required
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium text-slate-700">
        <span>Short description</span>
        <textarea
          name="short_description"
          defaultValue={service?.short_description ?? ""}
          rows={2}
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-slate-700">
        <span>Full description</span>
        <textarea
          name="full_description"
          defaultValue={service?.full_description ?? ""}
          rows={5}
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-4">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>Icon name</span>
          <input
            name="icon_name"
            defaultValue={service?.icon_name ?? ""}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-3">
          <span>Image URL or storage path</span>
          <input
            name="image_path"
            defaultValue={service?.image_path ?? ""}
            placeholder="https://images.unsplash.com/... or clinic-assets/services/whitening.jpg"
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>Base price</span>
          <input
            name="base_price"
            defaultValue={service?.base_price ?? ""}
            type="number"
            step="0.01"
            min="0"
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>Duration (min)</span>
          <input
            name="duration_min"
            defaultValue={service?.duration_min ?? ""}
            type="number"
            min="0"
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          <span>Display order</span>
          <input
            name="display_order"
            defaultValue={service?.display_order ?? 0}
            type="number"
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-slate-700">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={service?.is_active ?? true}
          />
          Active
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={service?.is_published ?? false}
          />
          Published
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={service?.is_featured ?? false}
          />
          Featured
        </label>
      </div>
    </form>
  );
}
