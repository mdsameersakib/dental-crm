import { PortalLayout } from "@/components/ui/portal-layout";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/appointments", label: "Appointments" },
  { href: "/history", label: "History" },
  { href: "/aftercare", label: "Aftercare" },
  { href: "/documents", label: "Documents" },
  { href: "/profile", label: "Profile" },
];

export default function PatientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PortalLayout
      title="Patient Portal"
      subtitle="Patient-facing self-service routes for appointments, treatment history, documents, and profile."
      links={links}
    >
      {children}
    </PortalLayout>
  );
}
