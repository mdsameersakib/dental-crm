import { RoutePlaceholder } from "@/components/ui/route-placeholder";

export default function StaffSettingsPage() {
  return (
    <RoutePlaceholder
      area="Staff"
      title="Settings"
      path="/staff/settings"
      description="Settings route for clinic preferences, workspace defaults, and the smaller MVP staff configuration surface."
    />
  );
}
