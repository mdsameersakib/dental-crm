type ServiceDetailsFieldsProps = {
  fullDescription: string;
  recommendedAftercare: string;
  basePrice: number | null;
  durationMin: number | null;
  defaultDisplayOrder: number;
  isEdit: boolean;
  isActive: boolean;
  isPublished: boolean;
  isFeatured: boolean;
};

export function ServiceDetailsFields({
  fullDescription,
  recommendedAftercare,
  basePrice,
  durationMin,
  defaultDisplayOrder,
  isEdit,
  isActive,
  isPublished,
  isFeatured,
}: ServiceDetailsFieldsProps) {
  return (
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
        <div className="grid gap-4">
          <label className="grid text-sm font-medium text-slate-700">
            <textarea
              name="full_description"
              defaultValue={fullDescription}
              rows={8}
              placeholder="Full description"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-colors hover:border-slate-300 focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500/30"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Recommended aftercare</span>
            <textarea
              name="recommended_aftercare"
              defaultValue={recommendedAftercare}
              rows={6}
              placeholder="Default aftercare guidance staff can reuse later for this service"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-colors hover:border-slate-300 focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500/30"
            />
          </label>
        </div>

        <div className="grid h-fit gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-heading text-lg font-bold text-slate-900">
            Pricing & ordering
          </h3>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Base price</span>
            <input
              name="base_price"
              defaultValue={basePrice ?? ""}
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
              defaultValue={durationMin ?? ""}
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
            defaultChecked={isActive}
            className="h-4 w-4"
          />
        </label>
        <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
          <span>Published</span>
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={isPublished}
            className="h-4 w-4"
          />
        </label>
        <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
          <span>Featured</span>
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={isFeatured}
            className="h-4 w-4"
          />
        </label>
      </div>
    </section>
  );
}
