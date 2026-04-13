import Link from "next/link";

import { HeroTrustCarousel } from "@/components/public/hero-trust-carousel";
import { LandingInteractive } from "@/components/public/landing-interactive";
import type {
  PublicDentist,
  PublicService,
} from "@/features/public-content/queries";
import { getLandingPageData } from "@/features/public-content/queries";

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC0ox8WVCeIgSYFcKX1H9Xatki4vdSjR-vl36W6rFvQ2LrILoq3DnF0AtFIoVcxT5G_lj7o85jeiDDQolnxvpF6SU0U5eGg78Mr8HZ4vY4MmXXAhoIytV4uOV6TeO1HI0X5dNSWu6BIHIHUkhyk5fL90x2x-Y_qaUYhQ3F9_cSWcfGnms3IaZwq5s31CybnzJ1APKPftKJrDIveuuwA6sah8DdobO3FPIzdt0WaYlCA5mtrJJzsFARQ4Eenf0h8LbeP-CnVmkhFzBs";
const mapImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuASYwjkn1KX2ahCSKEzdHaReFVU7fH1i5ITDM9KL9TPCdgMAjv7sBSRfWx8SwksXwIBzphrZUKBT1wDWznfBp12yjBI5ImM8aDazO34wl4F4VR0K7h1DyzAexkxZ6KYZHXRD7sFY6un0-Nn6cNyCzMWHyIfbRVTseW5RG07nfzvGtkP7f40zQK3o9j4DZT7YNuZbOJLP6wvsiD8eS2MWIE2_8aaq9ZtiY0fd_4Ys0c78-kzcBj2-_6mj2bvGjO9EJCLYIhIshiPKfA";

const copy = {
  en: {
    heroTitle: "Precision Care, Editorial Elegance.",
    heroAccent: "Editorial",
    heroSubtitle:
      "Experience a new standard of dental wellness. We combine clinical mastery with a boutique atmosphere to redefine your journey to a perfect smile.",
    primaryCtaLabel: "Book Appointment",
    secondaryCtaLabel: "Meet Our Dentists",
    servicesHeading: "Curated Oral Wellness",
    servicesText:
      "From aesthetic enhancements to complex reconstructive surgery, our services are tailored to your unique anatomy.",
    dentistsHeading: "The Clinical Artisans",
    dentistsText:
      "Meet the clinicians who bridge the gap between medical science and aesthetic artistry.",
    viewAll: "View All Clinicians",
    viewProfile: "View Profile",
    contactHeading: "Reach Out to Our Atelier",
    location: "Our Location",
    call: "Call Us",
    email: "Email",
    openMaps: "Open in Maps",
    consultation: "Request a Consultation",
    firstName: "First Name",
    lastName: "Last Name",
    emailAddress: "Email Address",
    serviceInterest: "Service of Interest",
    selectService: "Select a service",
    message: "Message",
    sendRequest: "Send Request",
    faqs: [
      "How do I prepare for my first appointment?",
      "Do you accept major insurance providers?",
      "What modern technologies do you use?",
    ],
  },
  bn: {
    heroTitle: "নির্ভুল যত্ন, এডিটোরিয়াল এলিগেন্স।",
    heroAccent: "এডিটোরিয়াল",
    heroSubtitle:
      "ডেন্টাল ওয়েলনেসের এক নতুন মান অনুভব করুন। আমরা ক্লিনিক্যাল দক্ষতা ও বুটিক পরিবেশকে একত্র করে আপনার নিখুঁত হাসির যাত্রাকে নতুনভাবে সংজ্ঞায়িত করি।",
    primaryCtaLabel: "অ্যাপয়েন্টমেন্ট বুক করুন",
    secondaryCtaLabel: "আমাদের ডেন্টিস্টদের দেখুন",
    servicesHeading: "নির্বাচিত ওরাল ওয়েলনেস",
    servicesText:
      "নান্দনিক উন্নয়ন থেকে জটিল পুনর্গঠনমূলক সার্জারি পর্যন্ত, আমাদের সেবাগুলো আপনার প্রয়োজন অনুযায়ী সাজানো।",
    dentistsHeading: "ক্লিনিক্যাল আর্টিজানস",
    dentistsText:
      "চিকিৎসা-বিজ্ঞান ও নান্দনিক শিল্পের সমন্বয় ঘটান যে বিশেষজ্ঞরা, তাদের সঙ্গে পরিচিত হোন।",
    viewAll: "সব ক্লিনিশিয়ান দেখুন",
    viewProfile: "প্রোফাইল দেখুন",
    contactHeading: "আমাদের আতেলিয়েতে যোগাযোগ করুন",
    location: "আমাদের অবস্থান",
    call: "কল করুন",
    email: "ইমেইল",
    openMaps: "ম্যাপে খুলুন",
    consultation: "কনসালটেশন অনুরোধ করুন",
    firstName: "নামের প্রথম অংশ",
    lastName: "নামের শেষ অংশ",
    emailAddress: "ইমেইল ঠিকানা",
    serviceInterest: "যে সেবাটি চান",
    selectService: "একটি সেবা বাছাই করুন",
    message: "বার্তা",
    sendRequest: "অনুরোধ পাঠান",
    faqs: [
      "প্রথম অ্যাপয়েন্টমেন্টের আগে কীভাবে প্রস্তুতি নেব?",
      "আপনারা কি প্রধান ইনস্যুরেন্স প্রোভাইডার গ্রহণ করেন?",
      "আপনারা কোন আধুনিক প্রযুক্তিগুলো ব্যবহার করেন?",
    ],
  },
} as const;

const trustCardTranslations: Record<
  string,
  {
    title: string;
    description: string;
  }
> = {
  "Board Certified": {
    title: "বোর্ড সার্টিফায়েড",
    description: "শিল্পের শীর্ষ বিশেষজ্ঞদের তত্ত্বাবধানে চিকিৎসা",
  },
  "Modern Tech": {
    title: "আধুনিক প্রযুক্তি",
    description: "ডিজিটাল স্ক্যানিং ও এআই-সহায়ক নির্ভুলতা",
  },
  "Painless Clinic": {
    title: "আরামদায়ক ক্লিনিক",
    description: "ভয়মুক্ত ও স্বস্তিকর ডেন্টাল কেয়ার",
  },
  "Flexible Timing": {
    title: "নমনীয় সময়সূচি",
    description: "সাপ্তাহিক ছুটিতেও অ্যাপয়েন্টমেন্ট সুবিধা",
  },
};

const serviceTranslations: Record<
  string,
  {
    name: string;
    shortDescription: string;
  }
> = {
  "comprehensive-exam": {
    name: "সমন্বিত পরীক্ষা",
    shortDescription:
      "ইমেজিং, ওরাল হাইজিন রিভিউ এবং পরিষ্কার ট্রিটমেন্ট রোডম্যাপসহ পূর্ণাঙ্গ মূল্যায়ন।",
  },
  "laser-whitening": {
    name: "লেজার হোয়াইটেনিং",
    shortDescription:
      "আরও উজ্জ্বল ফলাফলের জন্য আরামদায়ক, আধুনিক ইন-ক্লিনিক হোয়াইটেনিং অভিজ্ঞতা।",
  },
  invisalign: {
    name: "ইনভিসালাইন",
    shortDescription:
      "অদৃশ্য অ্যালাইনারের মাধ্যমে বাইট ও স্মাইল কারেকশনের জন্য কনসালটেশন ও পরিকল্পনা।",
  },
  "dental-implants": {
    name: "ডেন্টাল ইমপ্লান্টস",
    shortDescription:
      "দীর্ঘস্থায়ী ও প্রাকৃতিক অনুভূতির দাঁত প্রতিস্থাপনের জন্য ইমপ্লান্ট পরিকল্পনা ও রিস্টোরেশন।",
  },
};

const dentistTranslations: Record<
  string,
  {
    name: string;
    specialty: string;
    shortBio: string;
  }
> = {
  "dr-elena-vance": {
    name: "ডা. এলেনা ভ্যান্স",
    specialty: "চিফ প্রোস্থোডন্টিস্ট",
    shortBio:
      "নান্দনিক রিস্টোরেশন ও জটিল ইমপ্লান্ট কেসে দক্ষ, এবং রোগীকেন্দ্রিক সুনির্দিষ্ট চিকিৎসা পদ্ধতিতে পরিচিত।",
  },
  "dr-marcus-thorne": {
    name: "ডা. মার্কাস থর্ন",
    specialty: "অর্থোডন্টিক ডিরেক্টর",
    shortBio:
      "ডিজিটাল অ্যালাইনার থেরাপি ও বাইট কারেকশন প্রোগ্রাম পরিচালনা করেন, আরাম ও ফেসিয়াল ব্যালান্সে বিশেষ গুরুত্ব দিয়ে।",
  },
  "dr-sarah-chen": {
    name: "ডা. সারা চেন",
    specialty: "ওরাল সার্জন",
    shortBio:
      "সার্জিক্যাল নিখুঁততা, ইমপ্লান্টোলজি এবং উন্নত ট্রিটমেন্ট জার্নি জুড়ে স্পষ্ট যোগাযোগে মনোযোগী।",
  },
};

function withLang(href: string, lang: "en" | "bn") {
  if (lang === "en") {
    return href;
  }

  const [base, hash] = href.split("#");
  const separator = base.includes("?") ? "&" : "?";
  const localized = `${base}${separator}lang=bn`;
  return hash ? `${localized}#${hash}` : localized;
}

function localizeTrustCards(
  items: Array<{ title: string; description: string }>,
  lang: "en" | "bn",
) {
  if (lang === "en") {
    return items;
  }

  return items.map((item) => {
    const translated = trustCardTranslations[item.title];
    return translated ?? item;
  });
}

function localizeServices(services: PublicService[], lang: "en" | "bn") {
  if (lang === "en") {
    return services;
  }

  return services.map((service) => ({
    ...service,
    name: serviceTranslations[service.slug]?.name ?? service.name,
    shortDescription:
      serviceTranslations[service.slug]?.shortDescription ??
      service.shortDescription,
  }));
}

function localizeDentists(dentists: PublicDentist[], lang: "en" | "bn") {
  if (lang === "en") {
    return dentists;
  }

  return dentists.map((dentist) => ({
    ...dentist,
    name: dentistTranslations[dentist.slug]?.name ?? dentist.name,
    specialty:
      dentistTranslations[dentist.slug]?.specialty ?? dentist.specialty,
    shortBio: dentistTranslations[dentist.slug]?.shortBio ?? dentist.shortBio,
  }));
}

type PublicLandingPageProps = {
  searchParams: Promise<{
    lang?: string;
  }>;
};

export default async function PublicLandingPage({
  searchParams,
}: PublicLandingPageProps) {
  const { landing, services, dentists } = await getLandingPageData();
  const params = await searchParams;
  const lang = params.lang === "bn" ? "bn" : "en";
  const t = copy[lang];
  const localizedServices = localizeServices(services, lang);
  const localizedDentists = localizeDentists(dentists, lang);
  const localizedTrustCards = localizeTrustCards(landing.whyChooseUs, lang);
  return (
    <main className="pt-20" id="top">
      <section className="relative flex min-h-[870px] items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Modern Dental Office"
            className="h-full w-full object-cover"
            src={heroImage}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <h1 className="mb-6 font-heading text-5xl font-extrabold leading-[1.1] tracking-tight text-[var(--color-foreground)] md:text-7xl">
              {lang === "bn" ? (
                <>
                  নির্ভুল যত্ন,
                  <br />
                  <span className="italic text-[var(--color-primary)]">
                    {t.heroAccent}
                  </span>{" "}
                  এলিগেন্স।
                </>
              ) : (
                <>
                  Precision Care,
                  <br />
                  <span className="italic text-[var(--color-primary)]">
                    {t.heroAccent}
                  </span>{" "}
                  Elegance.
                </>
              )}
            </h1>
            <p className="mb-10 text-lg font-light leading-relaxed text-[var(--color-on-surface-variant)] md:text-xl">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href={withLang(landing.primaryCtaHref, lang)}
                className="rounded-xl bg-[var(--color-primary)] px-8 py-4 text-lg font-bold !text-white transition-all duration-300 hover:shadow-lg hover:shadow-[rgba(0,101,101,0.2)]"
              >
                {t.primaryCtaLabel}
              </Link>
              <Link
                href={withLang(landing.secondaryCtaHref, lang)}
                className="rounded-xl bg-[var(--color-surface-container-high)] px-8 py-4 text-lg font-bold text-[#003c70] transition-all duration-300 hover:bg-[var(--color-surface-container-highest)]"
              >
                {t.secondaryCtaLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HeroTrustCarousel items={localizedTrustCards} />

      <section className="bg-[var(--color-surface)] py-24" id="services">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-heading text-4xl font-bold text-[var(--color-foreground)] md:text-5xl">
              {t.servicesHeading}
            </h2>
            <p className="mx-auto max-w-xl font-light text-[var(--color-on-surface-variant)]">
              {t.servicesText}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {localizedServices.length > 0
              ? localizedServices.slice(0, 6).map((service) => (
                  <article
                    key={service.slug}
                    className="group rounded-xl bg-[var(--color-surface-container-lowest)] p-8 shadow-sm transition-all duration-500 hover:bg-[var(--color-primary)]"
                  >
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-fixed)] transition-colors group-hover:bg-[var(--color-primary-container)]">
                      <span className="material-symbols-outlined text-[var(--color-on-primary-fixed-variant)]">
                        {service.iconName}
                      </span>
                    </div>
                    <h3 className="mb-3 font-heading text-xl font-bold text-[var(--color-foreground)] transition-colors group-hover:text-white">
                      {service.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--color-on-surface-variant)] transition-colors group-hover:text-white/80">
                      {service.shortDescription}
                    </p>
                  </article>
                ))
              : Array.from({ length: 3 }, (_, index) => (
                  <article
                    key={`service-placeholder-${index + 1}`}
                    className="rounded-xl border border-dashed border-[var(--color-outline-variant)]/20 bg-[var(--color-surface-container-lowest)] p-8"
                  >
                    <div className="mb-6 h-14 w-14 rounded-full bg-[var(--color-surface-container-low)]" />
                    <div className="h-6 w-40 rounded-full bg-[var(--color-surface-container-low)]" />
                    <div className="mt-4 h-4 w-full rounded-full bg-[var(--color-surface-container-low)]" />
                    <div className="mt-3 h-4 w-5/6 rounded-full bg-[var(--color-surface-container-low)]" />
                  </article>
                ))}
          </div>
        </div>
      </section>

      <section
        className="bg-[var(--color-surface-container-low)] py-24"
        id="about"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-xl">
              <h2 className="mb-4 font-heading text-4xl font-bold text-[var(--color-foreground)] md:text-5xl">
                {t.dentistsHeading}
              </h2>
              <p className="font-light text-[var(--color-on-surface-variant)]">
                {t.dentistsText}
              </p>
            </div>
            <Link
              href={withLang("/dentists", lang)}
              className="mt-8 rounded-xl border-2 border-[var(--color-primary)] px-6 py-3 font-bold text-[var(--color-primary)] transition-all hover:bg-[var(--color-primary)] hover:text-white md:mt-0"
            >
              {t.viewAll}
            </Link>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {localizedDentists.length > 0
              ? localizedDentists.slice(0, 3).map((dentist) => (
                  <article
                    key={dentist.id}
                    className="group relative overflow-hidden rounded-2xl bg-[var(--color-surface-container-lowest)] shadow-sm"
                  >
                    <Link
                      href={withLang(`/dentists/${dentist.slug}`, lang)}
                      className="block"
                    >
                      <div className="aspect-[4/5] overflow-hidden">
                        <img
                          src={dentist.imageUrl}
                          alt={dentist.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <div className="p-8">
                      <Link
                        href={withLang(`/dentists/${dentist.slug}`, lang)}
                        className="block"
                      >
                        <h3 className="font-heading text-2xl font-extrabold text-[var(--color-foreground)] transition-colors hover:text-[var(--color-primary)]">
                          {dentist.name}
                        </h3>
                      </Link>
                      <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[var(--color-primary)]">
                        {dentist.specialty}
                      </p>
                      <p className="text-sm font-light text-[var(--color-on-surface-variant)]">
                        {dentist.shortBio}
                      </p>
                      <div className="mt-6">
                        <Link
                          href={withLang(`/dentists/${dentist.slug}`, lang)}
                          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)]"
                        >
                          {t.viewProfile}
                          <span className="material-symbols-outlined text-base">
                            arrow_forward
                          </span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))
              : Array.from({ length: 3 }, (_, index) => (
                  <article
                    key={`dentist-placeholder-${index + 1}`}
                    className="overflow-hidden rounded-2xl border border-dashed border-[var(--color-outline-variant)]/20 bg-[var(--color-surface-container-lowest)]"
                  >
                    <div className="aspect-[4/5] bg-[var(--color-surface-container-low)]" />
                    <div className="space-y-4 p-8">
                      <div className="h-7 w-40 rounded-full bg-[var(--color-surface-container-low)]" />
                      <div className="h-4 w-28 rounded-full bg-[var(--color-surface-container-low)]" />
                      <div className="h-4 w-full rounded-full bg-[var(--color-surface-container-low)]" />
                      <div className="h-4 w-5/6 rounded-full bg-[var(--color-surface-container-low)]" />
                    </div>
                  </article>
                ))}
          </div>
        </div>
      </section>

      <LandingInteractive faqs={t.faqs} lang={lang} />

      <section className="bg-[var(--color-surface)] py-24" id="contact">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
            <div>
              <h2 className="mb-8 font-heading text-4xl font-bold text-[var(--color-foreground)] md:text-5xl">
                {t.contactHeading}
              </h2>
              <div className="mb-12 space-y-8">
                <div className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-fixed)]">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">
                      location_on
                    </span>
                  </div>
                  <div>
                    <h4 className="mb-1 font-heading font-bold text-[var(--color-foreground)]">
                      {t.location}
                    </h4>
                    <p className="text-sm font-light text-[var(--color-on-surface-variant)]">
                      {landing.clinicAddress ||
                        "422 Medical Plaza, Suite 10, Lexington Avenue, New York"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-fixed)]">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">
                      call
                    </span>
                  </div>
                  <div>
                    <h4 className="mb-1 font-heading font-bold text-[var(--color-foreground)]">
                      {t.call}
                    </h4>
                    <p className="text-sm font-light text-[var(--color-on-surface-variant)]">
                      {landing.contactPhone}
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-fixed)]">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">
                      mail
                    </span>
                  </div>
                  <div>
                    <h4 className="mb-1 font-heading font-bold text-[var(--color-foreground)]">
                      {t.email}
                    </h4>
                    <p className="text-sm font-light text-[var(--color-on-surface-variant)]">
                      {landing.contactEmail}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-[var(--color-surface-container-low)] p-1">
                <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-xl bg-[var(--color-surface-container-highest)]">
                  <img
                    alt="Map"
                    className="h-full w-full object-cover grayscale opacity-50"
                    src={mapImage}
                  />
                  <div className="absolute rounded-lg bg-white px-4 py-2 font-bold text-[var(--color-primary)] shadow-lg">
                    {t.openMaps}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[3rem] bg-[var(--color-surface-container-lowest)] p-10 shadow-sm">
              <h3 className="mb-8 font-heading text-2xl font-bold text-[var(--color-foreground)]">
                {t.consultation}
              </h3>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="landing-first-name"
                      className="mb-2 block text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]"
                    >
                      {t.firstName}
                    </label>
                    <input
                      id="landing-first-name"
                      className="w-full rounded-xl bg-[var(--color-surface-container-low)] p-4 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="landing-last-name"
                      className="mb-2 block text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]"
                    >
                      {t.lastName}
                    </label>
                    <input
                      id="landing-last-name"
                      className="w-full rounded-xl bg-[var(--color-surface-container-low)] p-4 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="landing-email"
                    className="mb-2 block text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]"
                  >
                    {t.emailAddress}
                  </label>
                  <input
                    id="landing-email"
                    className="w-full rounded-xl bg-[var(--color-surface-container-low)] p-4 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="landing-service-interest"
                    className="mb-2 block text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]"
                  >
                    {t.serviceInterest}
                  </label>
                  <select
                    id="landing-service-interest"
                    className="w-full rounded-xl bg-[var(--color-surface-container-low)] p-4 text-sm"
                  >
                    <option>{t.selectService}</option>
                    {localizedServices.slice(0, 6).map((service) => (
                      <option key={service.slug}>{service.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="landing-message"
                    className="mb-2 block text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]"
                  >
                    {t.message}
                  </label>
                  <textarea
                    id="landing-message"
                    className="w-full rounded-xl bg-[var(--color-surface-container-low)] p-4 text-sm"
                    rows={4}
                  />
                </div>
                <button
                  type="button"
                  className="hero-gradient w-full rounded-xl py-4 text-lg font-bold text-white shadow-lg shadow-[rgba(0,101,101,0.2)] transition-transform hover:scale-[0.98]"
                >
                  {t.sendRequest}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
