import Link from "next/link";

type LandingHeroSectionProps = {
  imageSrc: string;
  servicesCount: number;
  dentistsCount: number;
};

export function LandingHeroSection({
  imageSrc,
  servicesCount,
  dentistsCount,
}: LandingHeroSectionProps) {
  return (
    <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden">
      <div className="absolute inset-0">
        <img
          alt="Bright modern dental clinic"
          className="h-full w-full object-cover"
          src={imageSrc}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,24,29,0.84)_0%,rgba(10,24,29,0.62)_42%,rgba(10,24,29,0.18)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl items-center px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
            Staff-managed dental clinic website
          </p>
          <h1 className="mt-6 max-w-2xl font-heading text-5xl font-extrabold leading-[1.02] tracking-tight text-white md:text-7xl">
            Modern dental care with clear booking and staff-managed updates.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/78 md:text-lg">
            Browse services, review dentist profiles, and send a booking request
            from one clinic website.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-bold text-slate-900 transition-transform hover:-translate-y-0.5"
            >
              Book Appointment
            </Link>
            <Link
              href="/dentists"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/55 bg-white/14 px-7 py-3.5 text-sm font-bold !text-white shadow-[0_18px_40px_rgba(10,24,29,0.18)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/22"
            >
              Meet Our Dentists
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="mt-12 grid max-w-2xl gap-4 border-t border-white/12 pt-8 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-heading font-extrabold text-white">
                {servicesCount}+
              </p>
              <p className="mt-1 text-sm text-white/68">Published services</p>
            </div>
            <div>
              <p className="text-3xl font-heading font-extrabold text-white">
                {dentistsCount}+
              </p>
              <p className="mt-1 text-sm text-white/68">Clinic dentists</p>
            </div>
            <div>
              <p className="text-3xl font-heading font-extrabold text-white">
                1
              </p>
              <p className="mt-1 text-sm text-white/68">Patients served</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
