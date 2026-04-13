import { RoutePlaceholder } from "@/components/ui/route-placeholder";

export default function ResetPasswordPage() {
  return (
    <RoutePlaceholder
      area="Auth"
      title="Reset Password"
      path="/auth/reset-password"
      description="Password reset completion route that will consume recovery tokens from Supabase Auth."
      notes={["Keep this isolated so callback and reset concerns do not mix."]}
    />
  );
}
