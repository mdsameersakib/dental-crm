type AuthStatusBannerProps = {
  error?: string | null;
  success?: string | null;
  info?: string | null;
};

export function AuthStatusBanner({
  error,
  success,
  info,
}: AuthStatusBannerProps) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        {success}
      </div>
    );
  }

  if (info) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-container-low)] px-4 py-3 text-sm text-[var(--color-on-surface-variant)]">
        {info}
      </div>
    );
  }

  return null;
}
