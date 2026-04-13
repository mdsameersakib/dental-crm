import { Suspense } from "react";

import { PublicSiteShell } from "@/components/public/public-site-shell";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Suspense><PublicSiteShell>{children}</PublicSiteShell></Suspense>;
}
