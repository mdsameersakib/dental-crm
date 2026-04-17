import { getServicesForStaff } from "@/features/services/admin";

import { ServiceForm } from "../service-form";

export default async function NewServicePage() {
  const services = await getServicesForStaff();

  return (
    <ServiceForm mode="create" suggestedDisplayOrder={services.length + 1} />
  );
}
