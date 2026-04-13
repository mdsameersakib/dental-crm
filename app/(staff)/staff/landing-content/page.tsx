import { RoutePlaceholder } from "@/components/ui/route-placeholder";

export default function StaffLandingContentPage() {
  return (
    <RoutePlaceholder
      area="Staff"
      title="Landing Content"
      path="/staff/landing-content"
      description="Content editing workspace for homepage messaging, clinic contact details, and other public website copy managed by staff."
      notes={[
        "This page will control the public landing page source of truth.",
        "Services and dentists stay in their own dedicated modules.",
      ]}
    />
  );
}
