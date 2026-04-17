import { RoutePlaceholder } from "@/components/ui/route-placeholder";

export default function PatientAftercarePage() {
  return (
    <RoutePlaceholder
      area="Patient"
      title="Aftercare"
      path="/aftercare"
      description="Aftercare route for procedure-specific instructions, medication guidance, and follow-up recommendations."
      notes={[
        "Designed for post-treatment guidance and AI-assisted summaries later.",
      ]}
    />
  );
}
