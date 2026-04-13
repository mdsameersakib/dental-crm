import { RoutePlaceholder } from "@/components/ui/route-placeholder";

export default async function StaffPatientDetailPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;

  return (
    <RoutePlaceholder
      area="Staff"
      title="Patient Detail"
      path={`/staff/patients/${patientId}`}
      description="Detailed patient record route for treatment notes, documents, medical info, and appointment context."
    />
  );
}
