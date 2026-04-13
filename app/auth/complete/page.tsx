import { AuthFragmentBridge } from "@/components/auth/auth-fragment-bridge";

type AuthCompletePageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function AuthCompletePage({
  searchParams,
}: AuthCompletePageProps) {
  const params = await searchParams;
  const next =
    params.next && params.next.startsWith("/") ? params.next : "/staff/settings";

  return (
    <div className="space-y-4">
      <AuthFragmentBridge defaultNext={next} />
      <div className="rounded-xl border border-[var(--color-border)] bg-white/95 px-4 py-3 text-sm text-[var(--color-on-surface-variant)] shadow-sm">
        Completing sign-in...
      </div>
    </div>
  );
}
