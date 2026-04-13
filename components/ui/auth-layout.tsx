type AuthLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthLayout({
  title,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--color-surface)] px-6 py-10 selection:bg-[var(--color-primary-fixed)]">
      <div className="absolute top-[-10%] right-[-5%] -z-10 h-[40%] w-[40%] rounded-full bg-[rgba(147,242,242,0.2)] blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-5%] -z-10 h-[40%] w-[40%] rounded-full bg-[rgba(212,227,255,0.2)] blur-[120px]" />

      <main className="flex w-full max-w-[440px] flex-col items-center">
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--color-primary)] shadow-lg shadow-[rgba(0,101,101,0.2)]">
            <span className="material-symbols-outlined text-3xl text-white">
              medical_services
            </span>
          </div>
          <h1 className="font-heading text-2xl font-extrabold leading-tight tracking-tight text-[var(--color-foreground)]">
            Clinical Atelier
          </h1>
          <p className="mt-1 text-sm font-medium tracking-wide text-[var(--color-primary)]">
            {title}
          </p>
        </div>

        <div className="w-full rounded-xl bg-[var(--color-surface-container-lowest)] p-10 shadow-[0_20px_40px_rgba(25,28,30,0.06)] ring-1 ring-[rgba(189,201,200,0.2)]">
          <p className="mb-8 text-center text-sm leading-7 text-[var(--color-on-surface-variant)]">
            {description}
          </p>
          {children}
        </div>

        <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-[#6e7979]">
          System Secure & Encrypted
        </p>
      </main>
    </div>
  );
}
