import { headers } from "next/headers";

export async function buildBaseUrlFromHeaders() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");

  if (!host) {
    return null;
  }

  const protocol = headerStore.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host}`;
}
