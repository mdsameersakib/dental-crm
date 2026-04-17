"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

import { PasswordField } from "@/components/auth/password-field";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isPreparing, setIsPreparing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function prepareRecoverySession() {
      const supabase = createClient();
      const hash = window.location.hash.replace(/^#/, "");

      if (hash) {
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (cancelled) {
            return;
          }

          if (sessionError) {
            setError(
              sessionError.message ||
                "Recovery link is invalid or has expired. Please request a new one.",
            );
            setIsPreparing(false);
            return;
          }

          setMessage("Recovery verified. Set your new password.");
          setIsPreparing(false);
          return;
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled) {
        return;
      }

      if (!session) {
        setError(
          "Recovery link is invalid or has expired. Please request a new one.",
        );
        setIsPreparing(false);
        return;
      }

      setMessage("Recovery verified. Set your new password.");
      setIsPreparing(false);
    }

    void prepareRecoverySession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirm_password") ?? "");

    if (!password || !confirmPassword) {
      setError("Please complete both password fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);

    if (updateError) {
      setError(
        updateError.message || "Unable to reset password. Please try again.",
      );
      return;
    }

    setMessage("Password updated. Redirecting to login...");
    await supabase.auth.signOut();
    router.replace("/auth/login?reset=1");
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {isPreparing ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-container-low)] px-4 py-3 text-sm text-[var(--color-on-surface-variant)]">
          Verifying your recovery link...
        </div>
      ) : null}

      {!isPreparing && !error ? (
        <form onSubmit={handleReset} className="space-y-6">
          <div className="space-y-2">
            <label
              className="ml-1 block text-sm font-semibold text-[var(--color-on-surface-variant)]"
              htmlFor="password"
            >
              New Password
            </label>
            <PasswordField
              id="password"
              name="password"
              required
              placeholder="Minimum 8 characters"
            />
          </div>

          <div className="space-y-2">
            <label
              className="ml-1 block text-sm font-semibold text-[var(--color-on-surface-variant)]"
              htmlFor="confirm_password"
            >
              Confirm New Password
            </label>
            <PasswordField
              id="confirm_password"
              name="confirm_password"
              required
              placeholder="Re-enter your new password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="hero-gradient flex w-full items-center justify-center space-x-2 rounded-xl px-6 py-4 font-bold text-white shadow-lg shadow-[rgba(0,101,101,0.1)] transition-all duration-150 hover:shadow-[rgba(0,101,101,0.2)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="text-sm tracking-wide">
              {isSubmitting ? "Updating..." : "Set New Password"}
            </span>
            <span className="material-symbols-outlined text-lg">
              lock_reset
            </span>
          </button>
        </form>
      ) : null}

      <p className="text-center text-sm font-medium text-[var(--color-on-surface-variant)]">
        <Link
          href="/auth/forgot-password"
          className="font-semibold text-[var(--color-accent)] transition-colors hover:text-[var(--color-primary)]"
        >
          Request another reset link
        </Link>
      </p>
    </div>
  );
}
