import { RoutePlaceholder } from "@/components/ui/route-placeholder";

export default function ForgotPasswordPage() {
  return (
    <RoutePlaceholder
      area="Auth"
      title="Forgot Password"
      path="/auth/forgot-password"
      description="Password recovery route for requesting a reset email via Supabase Auth."
    />
  );
}
