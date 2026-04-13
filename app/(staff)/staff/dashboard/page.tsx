import { RoutePlaceholder } from "@/components/ui/route-placeholder";

export default function StaffDashboardPage() {
  return (
    <RoutePlaceholder
      area="Staff"
      title="Dashboard"
      path="/staff/dashboard"
      description="Staff dashboard route for MVP clinic metrics, booking volume, appointment summaries, and quick operational shortcuts."
      notes={[
        "This dashboard is part of the reduced MVP staff workspace.",
        "Deferred modules should not drive the first submission UI.",
      ]}
    />
  );
}
