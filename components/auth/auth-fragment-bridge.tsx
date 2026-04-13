"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type AuthFragmentBridgeProps = {
  defaultNext?: string;
};

export function AuthFragmentBridge({
  defaultNext = "/staff/settings",
}: AuthFragmentBridgeProps) {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Completing sign-in...");
  const [error, setError] = useState<string | null>(null);
  const [hasAuthFragment, setHasAuthFragment] = useState(false);
  const next = useMemo(() => {
    const nextParam = searchParams.get("next");

    return nextParam?.startsWith("/") ? nextParam : defaultNext;
  }, [defaultNext, searchParams]);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    setHasAuthFragment(Boolean(hash));

    if (!hash) {
      return;
    }

    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    if (!accessToken || !refreshToken) {
      return;
    }

    const safeAccessToken = accessToken;
    const safeRefreshToken = refreshToken;

    let cancelled = false;

    async function completeSignIn() {
      const supabase = createClient();
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: safeAccessToken,
        refresh_token: safeRefreshToken,
      });

      if (cancelled) {
        return;
      }

      if (sessionError) {
        setError(sessionError.message || "Unable to complete sign-in.");
        return;
      }

      const fallbackNext = type === "invite" ? "/auth/staff-onboarding" : next;
      setMessage("Redirecting...");
      window.location.replace(fallbackNext);
    }

    void completeSignIn();

    return () => {
      cancelled = true;
    };
  }, [next]);

  if (!hasAuthFragment) {
    return null;
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white/95 px-4 py-3 text-sm text-[var(--color-on-surface-variant)] shadow-sm">
      {error ?? message}
    </div>
  );
}
