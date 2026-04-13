import { AuthLayout } from "@/components/ui/auth-layout";

export default function AuthRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthLayout
      title="Staff Access"
      description="Sign in with your professional account to manage clinic operations and public-site content."
    >
      {children}
    </AuthLayout>
  );
}
