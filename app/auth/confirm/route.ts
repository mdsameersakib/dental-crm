import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const nextParam = url.searchParams.get("next");
  const next = nextParam?.startsWith("/") ? nextParam : "/staff/settings";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, staff_onboarding_completed_at")
          .eq("id", user.id)
          .maybeSingle();

        if (
          profile &&
          ["admin", "receptionist", "dentist"].includes(profile.role) &&
          profile.staff_onboarding_completed_at === null
        ) {
          return NextResponse.redirect(new URL("/auth/staff-onboarding", url.origin));
        }
      }

      return NextResponse.redirect(new URL(next, url.origin));
    }
  }

  return NextResponse.redirect(
    new URL("/auth/login?error=Unable+to+complete+sign-in.", url.origin),
  );
}
