"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type PublicSiteShellProps = {
  children: React.ReactNode;
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/dentists", label: "Dentists" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

const copy = {
  en: {
    brand: "Dental CRM",
    nav: ["Home", "Services", "Dentists", "About", "Contact"],
    staffLogin: "Staff Login",
    book: "Book Appointment",
    footerTagline:
      "Elevating dental care through precision technology and boutique attention. Precision Care, Editorial Elegance.",
    explore: "Explore",
    support: "Support",
    newsletter: "Newsletter",
    newsletterText: "Receive dental wellness tips and clinic updates.",
    email: "Email",
    copyright: "© 2024 Dental CRM. Precision Care, Editorial Elegance.",
    language: "বাংলা",
  },
  bn: {
    brand: "ডেন্টাল সিআরএম",
    nav: ["হোম", "সার্ভিসেস", "ডেন্টিস্টস", "আমাদের সম্পর্কে", "যোগাযোগ"],
    staffLogin: "স্টাফ লগইন",
    book: "অ্যাপয়েন্টমেন্ট বুক করুন",
    footerTagline:
      "নির্ভুল প্রযুক্তি ও বুটিক যত্নের মাধ্যমে ডেন্টাল কেয়ারকে উন্নত করছি। প্রিসিশন কেয়ার, এডিটোরিয়াল এলিগেন্স।",
    explore: "এক্সপ্লোর",
    support: "সহায়তা",
    newsletter: "নিউজলেটার",
    newsletterText: "ডেন্টাল ওয়েলনেস টিপস ও ক্লিনিক আপডেট পেতে সাবস্ক্রাইব করুন।",
    email: "ইমেইল",
    copyright: "© ২০২৪ ডেন্টাল সিআরএম। প্রিসিশন কেয়ার, এডিটোরিয়াল এলিগেন্স।",
    language: "EN",
  },
} as const;

function withLang(href: string, lang: "en" | "bn") {
  if (lang === "en") {
    return href;
  }

  const [base, hash] = href.split("#");
  const separator = base.includes("?") ? "&" : "?";
  const localized = `${base}${base ? separator : "?"}lang=bn`;

  return hash ? `${localized}#${hash}` : localized;
}

export function PublicSiteShell({ children }: PublicSiteShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "bn" ? "bn" : "en";
  const t = copy[lang];

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <header className="fixed top-0 z-50 w-full bg-white/80 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-teal-700">
              medical_services
            </span>
            <span className="text-xl font-extrabold tracking-tighter text-teal-800">
              {t.brand}
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link, index) => {
              const isActive =
                (link.href === "/" && pathname === "/") ||
                (link.href !== "/" && !link.href.includes("#") && pathname === link.href);

              return (
                <Link
                  key={link.href}
                  href={withLang(link.href, lang)}
                  className={
                    isActive
                      ? "border-b-2 border-teal-600 text-sm font-semibold text-teal-700"
                      : "text-sm text-slate-600 transition-colors hover:text-teal-600"
                  }
                >
                  {t.nav[index]}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={lang === "bn" ? pathname : withLang(pathname, "bn")}
              className="hidden rounded-xl border border-slate-200 bg-white/70 px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-teal-300 hover:bg-teal-50 md:inline-flex"
            >
              {t.language}
            </Link>

            <Link
              href={withLang("/auth/login", lang)}
              className="hidden rounded-xl border border-teal-200 bg-white/70 px-4 py-2.5 text-sm font-semibold text-teal-800 transition-colors hover:border-teal-300 hover:bg-teal-50 md:inline-flex"
            >
              {t.staffLogin}
            </Link>

            <Link
              href={withLang("/book", lang)}
              className="rounded-xl bg-[var(--color-primary-container)] px-6 py-2.5 text-sm font-semibold !text-white transition-all duration-150 hover:scale-95"
            >
              {t.book}
            </Link>
          </div>
        </div>
      </header>

      {children}

      <footer className="w-full border-t border-slate-100 bg-slate-50 pt-16 pb-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-8 md:grid-cols-4">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-teal-800">
                medical_services
              </span>
              <span className="text-lg font-bold text-slate-900">{t.brand}</span>
            </div>
            <p className="text-sm font-light leading-relaxed text-slate-500">
              {t.footerTagline}
            </p>
          </div>

          <div>
            <h5 className="mb-6 font-heading font-bold text-slate-900">{t.explore}</h5>
            <div className="grid gap-4 text-sm text-slate-500">
              <Link href={withLang("/", lang)}>{t.nav[0]}</Link>
              <Link href={withLang("/services", lang)}>{t.nav[1]}</Link>
              <Link href={withLang("/dentists", lang)}>{t.nav[2]}</Link>
            </div>
          </div>

          <div>
            <h5 className="mb-6 font-heading font-bold text-slate-900">{t.support}</h5>
            <div className="grid gap-4 text-sm text-slate-500">
              <Link href={withLang("/#about", lang)}>{t.nav[3]}</Link>
              <Link href={withLang("/#contact", lang)}>{t.nav[4]}</Link>
              <Link href={withLang("/auth/login", lang)}>{t.staffLogin}</Link>
            </div>
          </div>

          <div>
            <h5 className="mb-6 font-heading font-bold text-slate-900">{t.newsletter}</h5>
            <p className="mb-4 text-xs font-light text-slate-500">
              {t.newsletterText}
            </p>
            <div className="flex gap-2">
              <input
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                placeholder={t.email}
                type="email"
              />
              <button className="rounded-lg bg-[var(--color-primary)] p-2 text-white">
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-slate-100 px-8 pt-8 md:flex-row">
          <p className="text-xs font-light text-slate-500">
            {t.copyright}
          </p>
          <div className="flex gap-6 text-slate-400">
            <span className="material-symbols-outlined">public</span>
            <span className="material-symbols-outlined">language</span>
            <span className="material-symbols-outlined">share</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
