import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Phone, Mail, Clock, ShieldCheck, FileCheck, Lock, ExternalLink } from "lucide-react";
import { useContactContent } from "@/hooks/useArchive";
import { InquiryForm } from "@/components/site/InquiryForm";
import { ArchiveImage } from "@/components/site/FirearmCard";
import { BackButton } from "@/components/site/BackButton";
import contactHeroImg from "@/assets/contact_hero_atelier.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Private Inquiry — Armorer Firearms Atelier, Bigfork MT" },
      {
        name: "description",
        content:
          "Arrange a private viewing at the Bigfork, Montana atelier or send a direct inquiry to the Armorer Firearms archive curators. All correspondence held in strict confidence.",
      },
      { property: "og:title", content: "Contact & Private Inquiry — Armorer Firearms" },
      {
        property: "og:description",
        content:
          "Private collection viewings by appointment. Direct curatorial inquiries answered in confidence.",
      },
    ],
  }),
  component: ContactPage,
});

export function ContactPage() {
  const contact = useContactContent();

  const protocols = [
    {
      num: "01",
      title: "ADVANCE NOTICE",
      subtitle: "Scheduled Viewings",
      desc: "Private collection viewings are arranged with at least 48 hours notice to allow our curatorial staff to retrieve pieces and assemble relevant provenance files.",
      icon: Clock,
    },
    {
      num: "02",
      title: "CURATORIAL PREPARATION",
      subtitle: "Research Dossiers",
      desc: "If you are examining a specific manufacturer, caliber, or historical patent era, original factory ledgers and serial research will be prepared for your inspection.",
      icon: FileCheck,
    },
    {
      num: "03",
      title: "SECURE TRANSFERS",
      subtitle: "Licensed Compliance",
      desc: "All transfers and acquisitions are executed in strict accordance with federal, Montana state, and local firearms statutes through our licensed FFL.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-obsidian text-parchment selection:bg-brass/20 selection:text-ivory">
      {/* ===================================================
          1. EDITORIAL CONTACT HERO
      =================================================== */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 border-b border-brass-border/30">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Top navigation / Back button */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <BackButton fallbackTo="/" label="Back to Archive" />
            <div className="flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.22em] text-brass-dark uppercase">
              <MapPin className="size-3 text-brass" aria-hidden />
              <span>Bigfork, Montana · 48.0633° N, 114.0724° W</span>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Hero Column: Typography & Statement */}
            <div className="lg:col-span-7" data-reveal>
              <div className="inline-flex items-center gap-2.5 border border-brass/30 bg-obsidian-2/80 px-3 py-1 font-mono text-[0.62rem] tracking-[0.26em] uppercase text-brass">
                <span className="size-1.5 rounded-full bg-brass animate-pulse" />
                <span>THE ATELIER · PRIVATE CORRESPONDENCE</span>
              </div>

              <h1 className="mt-6 font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-ivory leading-[1.08]">
                Contact Armorer Firearms
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-[0.68rem] tracking-[0.2em] text-parchment-dim uppercase">
                <span>{contact.address || "119 Jewel Basin Ct"}</span>
                <span className="text-brass/40">·</span>
                <span>{contact.city || "Bigfork, Montana 59911"}</span>
              </div>

              <div className="hairline my-6 max-w-md" />

              <p className="text-base sm:text-lg leading-relaxed text-parchment-dim max-w-2xl">
                Whether you are seeking a specific historic firearm, placing an estate collection, or wish to arrange a private viewing at our Montana atelier, we welcome your correspondence. All inquiries are received directly by our curatorial team.
              </p>

              {/* Provenance Indicators */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl">
                <div className="border border-brass-border/40 bg-obsidian-2/60 p-3.5">
                  <p className="font-mono text-[0.58rem] tracking-[0.2em] text-brass-dark uppercase">RESPONSE</p>
                  <p className="mt-1 font-serif text-base text-ivory">Within 2 Business Days</p>
                </div>
                <div className="border border-brass-border/40 bg-obsidian-2/60 p-3.5">
                  <p className="font-mono text-[0.58rem] tracking-[0.2em] text-brass-dark uppercase">DISPOSITION</p>
                  <p className="mt-1 font-serif text-base text-ivory">By Appointment</p>
                </div>
                <div className="border border-brass-border/40 bg-obsidian-2/60 p-3.5 col-span-2 sm:col-span-1">
                  <p className="font-mono text-[0.58rem] tracking-[0.2em] text-brass-dark uppercase">DISCRETION</p>
                  <p className="mt-1 font-serif text-base text-ivory">Confidential</p>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Museum Photography Plate */}
            <div className="lg:col-span-5" data-reveal-image>
              <div className="group relative border border-brass-border bg-obsidian-3 p-2 shadow-2xl transition-all duration-500 hover:border-brass/50">
                <div className="relative aspect-[4/3] overflow-hidden bg-obsidian">
                  <ArchiveImage
                    src={contactHeroImg}
                    alt="Private consultation desk inside the Armorer Firearms atelier in Bigfork Montana"
                    eager
                    className="transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="mt-2.5 flex items-center justify-between px-2 py-1 font-mono text-[0.6rem] tracking-[0.2em] text-brass-dark uppercase">
                  <span>PLATE 03 · THE PRIVATE CONSULTATION ATELIER</span>
                  <span className="text-parchment-dim/60">BIGFORK, MT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          2. CONTACT INFORMATION & PRIVATE INQUIRY FORM
      =================================================== */}
      <section className="py-20 sm:py-28 border-b border-brass-border/30">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16 items-start">
            {/* Left Column: Editorial Contact Information */}
            <aside className="lg:col-span-5 space-y-8" data-reveal>
              <div>
                <div className="inline-flex items-center gap-2 border-l border-brass pl-3 font-mono text-[0.62rem] tracking-[0.24em] text-brass uppercase">
                  ATELIER DOSSIER
                </div>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-ivory font-light">
                  Direct Correspondence
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-parchment-dim">
                  Direct contact channels for collectors, researchers, and estate trustees. Messages are answered in strict confidence.
                </p>
              </div>

              <div className="divide-y divide-brass-border/40 border-y border-brass-border/40">
                {/* Address */}
                <div className="py-6 group">
                  <div className="flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.22em] uppercase text-brass">
                    <MapPin className="size-3.5" aria-hidden />
                    <span>ATELIER ADDRESS</span>
                  </div>
                  <p className="mt-2 font-serif text-xl text-ivory leading-snug">
                    {contact.address || "119 Jewel Basin Ct"}
                  </p>
                  <p className="text-sm text-parchment-dim">
                    {contact.city || "Bigfork, Montana 59911"}
                  </p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      `${contact.address || "119 Jewel Basin Ct"}, ${contact.city || "Bigfork, Montana 59911"}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.16em] uppercase text-brass hover:text-brass-light transition-colors"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                </div>

                {/* Telephone */}
                <div className="py-6 group">
                  <div className="flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.22em] uppercase text-brass">
                    <Phone className="size-3.5" aria-hidden />
                    <span>TELEPHONE</span>
                  </div>
                  <p className="mt-2">
                    <a
                      href={`tel:${contact.phone || "(406) 555-0142"}`}
                      className="font-serif text-xl sm:text-2xl text-ivory hover:text-brass transition-colors"
                    >
                      {contact.phone || "(406) 555-0142"}
                    </a>
                  </p>
                  <p className="mt-1 text-xs text-parchment-dim">
                    Direct atelier line · Monday through Friday
                  </p>
                </div>

                {/* Email */}
                <div className="py-6 group">
                  <div className="flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.22em] uppercase text-brass">
                    <Mail className="size-3.5" aria-hidden />
                    <span>ELECTRONIC MAIL</span>
                  </div>
                  <p className="mt-2">
                    <a
                      href={`mailto:${contact.email || "ArmorerFirearms@outlook.com"}`}
                      className="font-serif text-lg sm:text-xl text-ivory hover:text-brass transition-colors break-all"
                    >
                      {contact.email || "ArmorerFirearms@outlook.com"}
                    </a>
                  </p>
                  <p className="mt-1 text-xs text-parchment-dim">
                    Encrypted and monitored daily by atelier staff
                  </p>
                </div>

                {/* Viewing Hours */}
                <div className="py-6 group">
                  <div className="flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.22em] uppercase text-brass">
                    <Clock className="size-3.5" aria-hidden />
                    <span>VIEWING HOURS</span>
                  </div>
                  <p className="mt-2 text-sm sm:text-base text-parchment leading-relaxed">
                    {contact.hours || "Monday – Friday, 9:00 AM – 5:00 PM MT · Appointments recommended"}
                  </p>
                </div>
              </div>

              {/* FFL Compliance Notice */}
              <div className="border border-brass-border/40 bg-obsidian-2/60 p-5">
                <div className="flex items-center gap-2.5 font-mono text-[0.62rem] tracking-[0.2em] text-brass uppercase">
                  <ShieldCheck className="size-4" aria-hidden />
                  <span>REGULATORY COMPLIANCE</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-parchment-dim">
                  {contact.note ||
                    "All firearms sold and transferred in strict compliance with federal, Montana state, and local law through a licensed FFL."}
                </p>
              </div>
            </aside>

            {/* Right Column: Private Inquiry Form */}
            <div className="lg:col-span-7" data-reveal>
              <div className="border border-brass-border/60 bg-obsidian-3/90 p-8 sm:p-12 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-brass-border/40 pb-6 mb-8">
                  <div>
                    <span className="font-mono text-[0.62rem] tracking-[0.24em] uppercase text-brass">
                      CONFIDENTIAL INQUIRY
                    </span>
                    <h2 className="mt-2 font-serif text-2xl sm:text-3xl text-ivory font-light">
                      Private Inquiry
                    </h2>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 font-mono text-[0.6rem] tracking-[0.16em] text-brass-dark uppercase">
                    <Lock className="size-3 text-brass" aria-hidden />
                    <span>Discreet Handling</span>
                  </div>
                </div>

                <p className="mb-8 text-sm leading-relaxed text-parchment-dim">
                  Please provide your details below. Whether inquiring about a catalog piece, offering a consignment, or scheduling an appointment, our curators will respond with an archival dossier.
                </p>

                <InquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          3. APPOINTMENT & VIEWING PROTOCOLS
      =================================================== */}
      <section className="bg-obsidian-2/30 py-20 sm:py-28 border-b border-brass-border/30">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16" data-reveal>
            <p className="font-mono text-[0.62rem] tracking-[0.24em] text-brass uppercase">VISITOR PROTOCOL</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-ivory font-light">
              Private Viewings by Appointment
            </h2>
            <p className="mt-3 text-sm text-parchment-dim">
              The Armorer Firearms collection is preserved in a secure private atelier overlooking Flathead Lake.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3" data-reveal-group>
            {protocols.map((protocol) => {
              const Icon = protocol.icon;
              return (
                <div
                  key={protocol.num}
                  className="border border-brass-border/40 bg-obsidian-2/70 p-8 transition-all duration-300 hover:border-brass/50 hover:bg-obsidian-2"
                >
                  <div className="flex items-center justify-between border-b border-brass-border/30 pb-4">
                    <span className="font-serif text-3xl text-brass-dark font-light">{protocol.num}</span>
                    <Icon className="size-4 text-brass/60" aria-hidden />
                  </div>
                  <h3 className="mt-5 font-serif text-xl text-ivory">{protocol.title}</h3>
                  <p className="font-mono text-[0.6rem] tracking-[0.18em] text-brass-dark uppercase mt-1">
                    {protocol.subtitle}
                  </p>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-parchment-dim">
                    {protocol.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================
          4. CLOSING COLLECTION CTA
      =================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-obsidian-2 to-obsidian py-24 sm:py-32 text-center">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-brass/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl px-5 sm:px-8" data-reveal>
          <div className="inline-flex items-center gap-2 border border-brass/30 bg-obsidian px-3.5 py-1 font-mono text-[0.62rem] tracking-[0.26em] text-brass uppercase">
            THE LIVING ARCHIVE
          </div>

          <h2 className="mt-6 font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-ivory tracking-tight leading-tight">
            Explore Before You Visit
          </h2>

          <p className="mt-6 text-base sm:text-lg leading-relaxed text-parchment max-w-2xl mx-auto">
            Browse our current register of over one hundred and twenty hand-selected historic firearms, complete with provenance documentation, raking light imagery, and clear pricing.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/collection"
              className="group inline-flex items-center justify-center gap-3 border border-brass bg-brass px-8 py-4 font-mono text-[0.72rem] font-semibold tracking-[0.24em] uppercase text-obsidian transition-all duration-300 hover:bg-brass-light hover:border-brass-light hover:shadow-lg hover:shadow-brass/20 cursor-pointer"
            >
              <span>EXPLORE THE COLLECTION</span>
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>

            <Link
              to="/about"
              className="inline-flex items-center justify-center border border-brass-border/60 bg-obsidian-2/80 px-8 py-4 font-mono text-[0.72rem] font-medium tracking-[0.24em] uppercase text-parchment transition-all duration-300 hover:border-brass hover:text-brass cursor-pointer"
            >
              READ OUR HERITAGE STORY
            </Link>
          </div>

          <p className="mt-8 font-mono text-[0.62rem] tracking-[0.2em] text-brass-dark uppercase">
            Armorer Firearms Atelier · Bigfork, Montana · Founded 1998
          </p>
        </div>
      </section>
    </div>
  );
}
