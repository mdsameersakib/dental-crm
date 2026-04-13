import { RoutePlaceholder } from "@/components/ui/route-placeholder";

export default function PatientDocumentsPage() {
  return (
    <RoutePlaceholder
      area="Patient"
      title="Documents"
      path="/documents"
      description="Patient document portal for invoices, consent forms, reports, and downloadable treatment files."
      notes={["Intended to use Supabase Storage buckets and signed URLs."]}
    />
  );
}
