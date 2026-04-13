import { RoutePlaceholder } from "@/components/ui/route-placeholder";

export default function StaffPatientsPage() {
  return (
    <RoutePlaceholder
      area="Staff"
      title="Patients"
      path="/staff/patients"
      description="Patient management route for search, filtering, lifecycle status, and navigation into full patient records."
    />
  );
}
