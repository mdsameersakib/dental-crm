import type { TreatmentStatus } from "./types";

export const treatmentStatusOptions: Array<{
  value: TreatmentStatus | "all";
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export const treatmentStatusColorMap: Record<TreatmentStatus, string> = {
  planned: "bg-cyan-100 text-cyan-700",
  in_progress: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
};

export function getTreatmentStatusLabel(status: TreatmentStatus) {
  return (
    treatmentStatusOptions.find((option) => option.value === status)?.label ??
    status
  );
}

export function sanitizeTreatmentsRedirectPath(path: string) {
  if (path.startsWith("/staff/treatments")) {
    return path;
  }

  return "/staff/treatments";
}

export function buildTreatmentsHref(
  query: string,
  status: TreatmentStatus | "all",
) {
  const params = new URLSearchParams();
  if (query) {
    params.set("q", query);
  }
  if (status !== "all") {
    params.set("status", status);
  }

  const queryString = params.toString();
  return queryString ? `/staff/treatments?${queryString}` : "/staff/treatments";
}

export function buildTreatmentDetailHref(
  treatmentId: string,
  query: string,
  status: TreatmentStatus | "all",
) {
  const params = new URLSearchParams();
  if (query) {
    params.set("q", query);
  }
  if (status !== "all") {
    params.set("status", status);
  }

  const queryString = params.toString();
  return queryString
    ? `/staff/treatments/${treatmentId}?${queryString}`
    : `/staff/treatments/${treatmentId}`;
}

export function toDateTimeInputValue(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const pad = (input: number) => String(input).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
