import { notFound } from "next/navigation";

import { getServiceForStaff } from "@/features/services/admin";

import { ServiceForm } from "../service-form";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  const service = await getServiceForStaff(serviceId);

  if (!service) {
    notFound();
  }

  return <ServiceForm mode="edit" service={service} />;
}
