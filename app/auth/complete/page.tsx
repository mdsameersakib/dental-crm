import { redirect } from "next/navigation";

import { AuthFragmentBridge } from "@/components/auth/auth-fragment-bridge";

type AuthCompletePageProps = {
  searchParams: Promise<{
    code?: string;
    next?: string;
    token_hash?: string;
    type?: string;
  }>;
};

export default async function AuthCompletePage({
  searchParams,
}: AuthCompletePageProps) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/staff/settings";

  if (params.code) {
    redirect(
      `/auth/callback?code=${encodeURIComponent(params.code)}&next=${encodeURIComponent(next)}`,
    );
  }

  if (params.token_hash && params.type) {
    redirect(
      `/auth/confirm?token_hash=${encodeURIComponent(
        params.token_hash,
      )}&type=${encodeURIComponent(params.type)}&next=${encodeURIComponent(next)}`,
    );
  }

  return (
    <div className="space-y-4">
      <AuthFragmentBridge defaultNext={next} />
      <div className="rounded-xl border border-[var(--color-border)] bg-white/95 px-4 py-3 text-sm text-[var(--color-on-surface-variant)] shadow-sm">
        Completing sign-in...
      </div>
    </div>
  );
}
