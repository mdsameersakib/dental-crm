import { RoutePlaceholder } from "@/components/ui/route-placeholder";

export default function StaffAppointmentsPage() {
  return (
    <RoutePlaceholder
      area="Staff"
      title="Appointments"
      path="/staff/appointments"
      description="Appointments route for the MVP list view where staff will manage confirmed clinic appointments and schedule filters."
      notes={[
        "The first version uses a table/list view instead of a calendar.",
      ]}
    />
  );
}
