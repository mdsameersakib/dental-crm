import { RoutePlaceholder } from "@/components/ui/route-placeholder";

export default function StaffDocumentsPage() {
  return (
    <RoutePlaceholder
      area="Staff"
      title="Documents"
      path="/staff/documents"
      description="Internal documents route for uploaded records, consent files, and patient-specific document operations."
    />
  );
}
