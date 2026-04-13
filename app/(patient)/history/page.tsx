import { RoutePlaceholder } from "@/components/ui/route-placeholder";

export default function PatientHistoryPage() {
  return (
    <RoutePlaceholder
      area="Patient"
      title="Treatment History"
      path="/history"
      description="Historical treatment route for completed procedures, notes, clinical summaries, and future plans."
    />
  );
}
