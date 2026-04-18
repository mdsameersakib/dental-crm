"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function sanitizePatientNext(path: string) {
  if (path.startsWith("/patient") || path === "/patient") {
    return path;
  }

  return "/patient/dashboard";
}

function buildPatientLoginRedirect(
  type: "error" | "success",
  message: string,
  next = "/patient/dashboard",
) {
  const params = new URLSearchParams({
    [type]: message,
    next: sanitizePatientNext(next),
  });

  return `/patient/login?${params.toString()}`;
}

function buildPatientVerifyRedirect(input: {
  email: string;
  next?: string;
  error?: string;
  success?: string;
}) {
  const params = new URLSearchParams({
    email: input.email,
    next: sanitizePatientNext(input.next ?? "/patient/dashboard"),
  });

  if (input.error) {
    params.set("error", input.error);
  }

  if (input.success) {
    params.set("success", input.success);
  }

  return `/patient/verify?${params.toString()}`;
}

export async function requestPatientOtp(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const nextValue = String(formData.get("next") ?? "/patient/dashboard");
  const next = sanitizePatientNext(nextValue);

  if (!email) {
    redirect(
      buildPatientLoginRedirect(
        "error",
        "Email is required to continue.",
        next,
      ),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      data: {
        role: "patient",
      },
    },
  });

  if (error) {
    redirect(
      buildPatientLoginRedirect(
        "error",
        "Unable to send a code right now. Please try again.",
        next,
      ),
    );
  }

  redirect(
    buildPatientVerifyRedirect({
      email,
      next,
      success: "Enter the 6-digit code we sent to your email.",
    }),
  );
}

export async function verifyPatientOtp(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const token = String(formData.get("token") ?? "")
    .trim()
    .replace(/\s+/g, "");
  const next = sanitizePatientNext(
    String(formData.get("next") ?? "/patient/dashboard"),
  );

  if (!email) {
    redirect(
      buildPatientLoginRedirect(
        "error",
        "Email is required before entering a verification code.",
        next,
      ),
    );
  }

  if (!token || token.length !== 6) {
    redirect(
      buildPatientVerifyRedirect({
        email,
        next,
        error: "Enter the 6-digit code from your email.",
      }),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    redirect(
      buildPatientVerifyRedirect({
        email,
        next,
        error: "Invalid or expired code. Request a new one and try again.",
      }),
    );
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function resendPatientOtp(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const next = sanitizePatientNext(
    String(formData.get("next") ?? "/patient/dashboard"),
  );

  if (!email) {
    redirect(
      buildPatientLoginRedirect(
        "error",
        "Enter your email address first.",
        next,
      ),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      data: {
        role: "patient",
      },
    },
  });

  if (error) {
    redirect(
      buildPatientVerifyRedirect({
        email,
        next,
        error: "Unable to resend a code right now. Please wait and try again.",
      }),
    );
  }

  redirect(
    buildPatientVerifyRedirect({
      email,
      next,
      success: "A new 6-digit code has been sent to your email.",
    }),
  );
}

export async function signOutPatient() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect(
    buildPatientLoginRedirect(
      "success",
      "You have been signed out.",
      "/patient/dashboard",
    ),
  );
}
