import type { DashboardMetric } from "@/features/dashboard/types";

type DashboardMetricCardProps = {
  metric: DashboardMetric;
};

export function DashboardMetricCard({ metric }: DashboardMetricCardProps) {
  return (
    <article className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
        {metric.label}
      </p>
      <p className="mt-3 font-heading text-4xl font-bold text-slate-900">
        {metric.value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{metric.helper}</p>
    </article>
  );
}
