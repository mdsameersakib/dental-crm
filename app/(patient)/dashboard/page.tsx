import { RoutePlaceholder } from "@/components/ui/route-placeholder";

export default function PatientDashboardPage() {
  return (
    <RoutePlaceholder
      area="Patient"
      title="Patient Dashboard"
      path="/dashboard"
      description="Overview route for upcoming appointments, reminders, aftercare prompts, and patient quick actions."
      notes={["Protected by `proxy.ts` until real auth checks are added."]}
    />
  );
}
