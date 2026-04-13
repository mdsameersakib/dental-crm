import { RoutePlaceholder } from "@/components/ui/route-placeholder";

export default function PatientAppointmentsPage() {
  return (
    <RoutePlaceholder
      area="Patient"
      title="Patient Appointments"
      path="/appointments"
      description="Patient appointment management route for viewing, booking, rescheduling, and canceling visits."
      notes={["Can later add intercepted routes or modal states if needed."]}
    />
  );
}
