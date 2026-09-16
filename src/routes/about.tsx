import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Compass, ShieldCheck, Sparkles, Award, Scale, MapPin } from "lucide-react";
import { useAboutContent } from "@/hooks/useArchive";
import { ArchiveImage } from "@/components/site/FirearmCard";
import { BackButton } from "@/components/site/BackButton";
import atelierHeroImg from "@/assets/about/atelier_hero.jpg";
import conservationDetailImg from "@/assets/about/conservation_detail.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Armorer Firearms" },
      {
        name: "description",
        content:
          "The heritage and philosophy of Armorer Firearms: founded 1998 in Bigfork, Montana. A private collection and working armory built on estate acquisitions, conservation over restoration, and verified provenance.",
      },
      { property: "og:title", content: "Armorer Firearms" },
      {
        property: "og:description",
        content:
          "Estate acquisitions, preservation philosophy and standards of authenticity from the Montana armory.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const about = useAboutContent();

  const philosophyPillars = [
    {
      num: "01",
      title: "CURATION",
      subtitle: "Hand-Selected Acquisition",
      text: "Every firearm enters the archive deliberately, acquired piece by piece from estates, private museums, and multi-generational family collections across the northern Rockies. We decline far more than we accept.",
      icon: Compass,
    },
    {
      num: "02",
      title: "RESEARCH",
      subtitle: "Unbroken Provenance",
      text: "Historical context and ownership records are rigorously documented. We favor pieces accompanied by surviving factory letters, regimental rosters, period ledgers, and original bills of sale.",
      icon: BookOpen,
    },
    {
      num: "03",
      title: "CONSERVATION",
      subtitle: "Stabilize & Protect",
      text: "Conservation, not restoration. Original finish, aged case colors, figured walnut, and honest wear are the indelible record of an object's life; we do not erase that history to make it artificially prettier.",
      icon: ShieldCheck,
    },
    {
      num: "04",
      title: "ACCESS",
      subtitle: "Discreet Viewings",
      text: "Every piece is presented with honest condition notes and clear, transparent pricing. We do not advertise to the masses; examinations and acquisitions are conducted strictly by private appointment.",
      icon: Sparkles,
    },
  ];

  const timelineMilestones = [
    {
      year: "1998",
      label: "FOUNDING ON FLATHEAD LAKE",
      description:
        "Armorer Firearms began as a single craftsman workbench on the shore of Flathead Lake in Bigfork, Montana, appraising precious metals and conserving family heirlooms for neighbors across the valley.",
    },
    {
      year: "2000s",
      label: "ESTATE ACQUISITIONS ACROSS THE ROCKIES",
      description:
        "Deep roots in regional Montana estate settlements revealed historically extraordinary arms. The focus expanded into quietly assembling a private archive of revolvers, lever guns, and sporting arms with verified lineage.",
    },
    {
      year: "TODAY",
      label: "THE WORKING ARMORY & ARCHIVE",
      description:
        "A dedicated research and conservation armory housing over one hundred and twenty hand-selected historical firearms, catalogued under museum standards and accessible exclusively by private appointment.",
    },
  ];

  const trustPillars = [
    {
      title: "PRIVATE SPECIALTY HOUSE",
      desc: "Discreet private collection focused on historically significant arms, never marketed as commercial retail.",
    },
    {
      title: "FACTORY RECORD VERIFICATION",
      desc: "Serial numbers and roll marks cross-referenced against surviving Colt, Winchester, and Remington factory ledgers.",
    },
    {
      title: "CONSERVATION INTEGRITY",
      desc: "Strict preservation ethics maintaining original bluing, case-hardening colors, and wood patina without modern refinishing.",
    },
    {
      title: "LICENSED & COMPLIANT TRANSFERS",
      desc: "Every acquisition and transfer handled in full compliance with federal, Montana state, and local FFL regulations.",
    },
  ];

  return (
    <div className="min-h-screen bg-obsidian text-parchment selection:bg-brass/20 selection:text-ivory">
      {/* ===================================================
          1. EDITORIAL PAGE HERO
      =================================================== */}
      <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-18 lg:pt-36 lg:pb-24 border-b border-brass-border/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top navigation / Back button */}
          <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3">
            <BackButton fallbackTo="/" label="Back to Archive" />
            <div className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-brass-dark uppercase">
              <MapPin className="size-3.5 text-brass" aria-hidden />
              <span>Bigfork, Montana · Est. {about.founded || 1998}</span>
            </div>
          </div>

          <div className="grid gap-10 sm:gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Hero Column: Typography & Provenance */}
            <div className="lg:col-span-6 xl:col-span-7" data-reveal>
              <div className="inline-flex items-center gap-2 border border-brass/30 bg-obsidian-2/80 px-3 py-1 font-mono text-xs tracking-[0.24em] uppercase text-brass">
                <span className="size-1.5 rounded-full bg-brass animate-pulse" />
                <span>THE ARMORY</span>
              </div>

              <h1 className="mt-4 sm:mt-6 font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-ivory leading-[1.08]">
                {about.heading || "About Armorer Firearms"}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-xs tracking-[0.18em] text-parchment-dim uppercase">
                <span>EST. {about.founded || 1998}</span>
                <span className="text-brass/40">·</span>
                <span>{about.location || "BIGFORK, MONTANA"}</span>
                <span className="text-brass/40 hidden sm:inline">·</span>
                <span className="hidden sm:inline">48°03'47.9"N, 114°04'20.6"W</span>
              </div>

              <div className="hairline my-5 sm:my-6 max-w-md" />

              <p className="text-base sm:text-lg leading-relaxed text-parchment-dim max-w-2xl">
                A private collection and working armory devoted to the research, conservation, and placement of historically
                significant arms. Curated quietly on Flathead Lake, where provenance is traced directly to the hands that carried them.
              </p>

              {/* Quick Provenance Badges */}
              <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl">
                <div className="border border-brass-border/40 bg-obsidian-2/60 p-3 sm:p-3.5">
                  <p className="font-mono text-xs tracking-[0.16em] text-brass-dark uppercase">COLLECTION</p>
                  <p className="mt-1 font-serif text-base text-ivory">120+ Historic Arms</p>
                </div>
                <div className="border border-brass-border/40 bg-obsidian-2/60 p-3 sm:p-3.5">
                  <p className="font-mono text-xs tracking-[0.16em] text-brass-dark uppercase">METHOD</p>
                  <p className="mt-1 font-serif text-base text-ivory">Estate Acquisitions</p>
                </div>
                <div className="border border-brass-border/40 bg-obsidian-2/60 p-3 sm:p-3.5 col-span-2 sm:col-span-1">
                  <p className="font-mono text-xs tracking-[0.16em] text-brass-dark uppercase">ETHICS</p>
                  <p className="mt-1 font-serif text-base text-ivory">Conservation First</p>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Museum Photography Plate */}
            <div className="lg:col-span-6 xl:col-span-5" data-reveal-image>
              <div className="group relative border border-brass-border bg-obsidian-3 p-2 shadow-2xl transition-all duration-500 hover:border-brass/50 max-w-md mx-auto lg:max-w-none">
                <div className="relative aspect-[4/3] overflow-hidden bg-obsidian">
                  <ArchiveImage
                    src={atelierHeroImg}
                    alt="Armorer Firearms master craftsman workbench in Bigfork Montana"
                    eager
                    className="transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="mt-2.5 flex items-center justify-between px-2 py-1 font-mono text-xs tracking-[0.16em] text-brass-dark uppercase">
                  <span>PLATE 01 · ARMORY BENCH</span>
                  <span className="text-parchment-dim/60">EST. 1998</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          2. HERITAGE INTRODUCTION & PULL QUOTE
      =================================================== */}
      <section className="border-b border-brass-border/30 bg-obsidian-2/40 py-14 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center" data-reveal>
            <p className="font-mono text-xs tracking-[0.24em] text-brass uppercase">PROVENANCE & ORIGIN</p>
            <blockquote className="mt-5 sm:mt-6 font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-ivory leading-snug">
              &ldquo;What began as a precious metals business grew into a serious firearms collection, built piece by piece from
              estate acquisitions across the northern Rockies.&rdquo;
            </blockquote>
            <p className="mt-4 font-mono text-xs tracking-[0.2em] text-brass-dark uppercase">
              — The Armorer Firearms Archive Charter
            </p>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-2 lg:gap-16 border-t border-brass-border/30 pt-12" data-reveal>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-parchment-dim">
              <p>
                Armorer Firearms is a privately owned specialty house in Bigfork, Montana. Founded on the western shore of
                Flathead Lake, the armory was originally established around fine metallurgy and precious metals appraisal.
              </p>
              <p>
                Decades of trusted appraisal work brought the house into contact with multi-generational ranching families,
                private collectors, and historic Montana estates. Within those private holdings rested extraordinary firearms
                that had witnessed the unfolding of the American frontier.
              </p>
            </div>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-parchment-dim">
              <p>
                Rather than treating these historical artifacts as commercial commodities, the armory evolved into a focused
                archive. We chose a deliberate path: we do not advertise to the masses.
              </p>
              <p>
                Every firearm is hand-selected, inspected, researched against archival factory records, and presented with
                honest condition notes and clear pricing. Viewings are conducted strictly by appointment for collectors who
                value historical truth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          3. THE STORY: "FROM PRECIOUS METALS TO HISTORIC ARMS"
      =================================================== */}
      <section className="py-14 sm:py-20 lg:py-28 border-b border-brass-border/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 items-start">
            {/* Left Story Column */}
            <div className="lg:col-span-5" data-reveal>
              <div className="lg:sticky lg:top-28 space-y-5">
                <div className="inline-flex items-center gap-2 border-l border-brass pl-3 font-mono text-xs tracking-[0.22em] text-brass uppercase">
                  CHAPTER I · THE EVOLUTION
                </div>
                <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light text-ivory leading-tight">
                  From Precious Metals to Historic Arms
                </h2>
                <p className="text-sm leading-relaxed text-parchment-dim">
                  How a metallurgical trade on Flathead Lake grew into one of the northern Rockies’ most rigorous private firearms archives.
                </p>
                <div className="border border-brass-border/40 bg-obsidian-2 p-4 sm:p-5">
                  <p className="font-mono text-xs tracking-[0.18em] text-brass uppercase">CURATORIAL PRINCIPLE</p>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-parchment-dim">
                    &ldquo;{about.history || "Our acquisitions come almost entirely from estates, private museums, and multi-generational family collections. We favor pieces with an unbroken paper trail and we decline far more than we accept."}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Right Story Column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8" data-reveal>
              <div className="border-l border-brass-border/40 pl-5 sm:pl-8 space-y-3">
                <h3 className="font-serif text-xl sm:text-2xl text-ivory">The Metallurgical Foundation</h3>
                <p className="text-sm sm:text-base leading-relaxed text-parchment-dim">
                  In 1998, when work began in Bigfork, the discipline was defined by precision weighing, assaying, and understanding
                  the honest chemistry of metals. That same reverence for authenticity translated seamlessly into antique firearms:
                  recognizing original case-color hardening, carbon bluing, hand-engraved scrollwork, and the genuine patina of aged steel.
                </p>
              </div>

              <div className="border-l border-brass-border/40 pl-5 sm:pl-8 space-y-3">
                <h3 className="font-serif text-xl sm:text-2xl text-ivory">Building the Estate Network</h3>
                <p className="text-sm sm:text-base leading-relaxed text-parchment-dim">
                  Over decades, collectors and estate executors across Montana, Wyoming, and Idaho sought our counsel. Instead of
                  clearing estates in wholesale auctions, families entrusted specific heirloom arms to our care — knowing they would
                  be researched, documented, and placed into hands that appreciate their historical context.
                </p>
              </div>

              <div className="border-l border-brass-border/40 pl-5 sm:pl-8 space-y-3">
                <h3 className="font-serif text-xl sm:text-2xl text-ivory">The Modern Specialty House</h3>
                <p className="text-sm sm:text-base leading-relaxed text-parchment-dim">
                  Today, the Armorer Firearms armory operates with quiet discretion. We maintain a curated collection of over one
                  hundred and twenty exceptional lever-action rifles, single-action revolvers, sporting long guns, and military arms.
                  Each arm is catalogued under museum standards, complete with archival dossiers and honest appraisals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          4. ESTABLISHED / HERITAGE TIMELINE SECTION
      =================================================== */}
      <section className="bg-obsidian-2/30 py-14 sm:py-20 lg:py-28 border-b border-brass-border/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16" data-reveal>
            <p className="font-mono text-xs tracking-[0.22em] text-brass uppercase">PROVEN CHRONOLOGY</p>
            <h2 className="mt-3 font-serif text-2xl sm:text-4xl text-ivory font-light">
              A History Built on Discipline
            </h2>
            <p className="mt-3 text-sm text-parchment-dim">
              Rooted in Bigfork, Montana since 1998 — founded on verified provenance and careful stewardship.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 relative" data-reveal-group>
            {timelineMilestones.map((milestone, idx) => (
              <div
                key={milestone.year}
                className="relative border border-brass-border/40 bg-obsidian-2 p-6 sm:p-8 transition-all duration-300 hover:border-brass/40"
              >
                <div className="flex items-baseline justify-between border-b border-brass-border/30 pb-3">
                  <span className="font-serif text-3xl sm:text-4xl text-brass font-light">{milestone.year}</span>
                  <span className="font-mono text-xs tracking-[0.18em] text-brass-dark uppercase">MILESTONE 0{idx + 1}</span>
                </div>
                <h3 className="mt-4 font-serif text-lg sm:text-xl text-ivory">{milestone.label}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-parchment-dim">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          5. COLLECTION PHILOSOPHY (01 - 04)
      =================================================== */}
      <section className="py-14 sm:py-20 lg:py-28 border-b border-brass-border/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-16" data-reveal>
            <div>
              <p className="font-mono text-xs tracking-[0.22em] text-brass uppercase">ARMORY DOCTRINE</p>
              <h2 className="mt-2.5 font-serif text-2xl sm:text-4xl lg:text-5xl text-ivory font-light">
                Collection Philosophy
              </h2>
            </div>
            <p className="max-w-md text-sm text-parchment-dim">
              Four fundamental commitments that govern every firearm considered, documented, and placed by Armorer Firearms.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal-group>
            {philosophyPillars.map((p) => {
              const Icon = p.icon;
              return (
                <article
                  key={p.num}
                  className="group relative border border-brass-border/40 bg-obsidian-2/70 p-6 sm:p-8 transition-all duration-300 hover:border-brass/60 hover:bg-obsidian-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-3xl font-light text-brass-dark transition-colors group-hover:text-brass">
                      {p.num}
                    </span>
                    <Icon className="size-4 text-brass/50 transition-colors group-hover:text-brass" aria-hidden />
                  </div>
                  <h3 className="mt-5 font-serif text-xl text-ivory tracking-wide">{p.title}</h3>
                  <p className="font-mono text-xs tracking-[0.16em] text-brass-dark uppercase mt-1">
                    {p.subtitle}
                  </p>
                  <div className="hairline my-4" />
                  <p className="text-xs sm:text-sm leading-relaxed text-parchment-dim">{p.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================
          6. PREMIUM VISUAL FEATURE SECTION: "THE CONSERVATION ARMORY"
      =================================================== */}
      <section className="bg-obsidian-2/20 py-14 sm:py-20 lg:py-28 border-b border-brass-border/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:gap-12 lg:grid-cols-12 lg:items-center">
            {/* Image (58% width on desktop) */}
            <div className="lg:col-span-7" data-reveal-image>
              <div className="group border border-brass-border bg-obsidian-3 p-2 shadow-2xl transition-all duration-500 hover:border-brass/50 max-w-xl mx-auto lg:max-w-none">
                <div className="relative aspect-[4/3] overflow-hidden bg-obsidian">
                  <ArchiveImage
                    src={conservationDetailImg}
                    alt="Close-up examination of historical firearm receiver under raking light in the Montana armory"
                    className="transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="mt-2.5 flex items-center justify-between px-2 py-1 font-mono text-xs tracking-[0.16em] text-brass-dark uppercase">
                  <span>PLATE 02 · RAKING LIGHT EXAMINATION</span>
                  <span className="text-brass">ARCHIVE RECORD</span>
                </div>
              </div>
            </div>

            {/* Editorial Content (42% width on desktop) */}
            <div className="lg:col-span-5 space-y-5 sm:space-y-6" data-reveal>
              <div className="inline-flex items-center gap-2 border-l border-brass pl-3 font-mono text-xs tracking-[0.22em] text-brass uppercase">
                PRESERVATION ETHICS
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl text-ivory font-light leading-tight">
                Conservation, Not Restoration
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-parchment-dim">
                {about.philosophy ||
                  "Conservation, not restoration. We stabilize, document, and protect. Original finish, original wood, and honest wear are the record of an object's life; we do not erase that record to make it prettier."}
              </p>
              <p className="text-sm leading-relaxed text-parchment-dim">
                {about.standards ||
                  "Every piece is inspected against factory records where they survive, measured, photographed under raking light, and assigned an accession number that follows it for as long as it remains in our archive."}
              </p>

              {/* Raking Light Protocol Checklist */}
              <div className="border-t border-brass-border/30 pt-4 space-y-2.5 font-mono text-xs tracking-[0.14em] text-parchment-dim uppercase">
                <div className="flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-brass shrink-0" />
                  <span>Raking Light Photographic Inspection</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-brass shrink-0" />
                  <span>Factory Serial &amp; Cartouche Verification</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-brass shrink-0" />
                  <span>Mechanical Bore &amp; Timing Measurement</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-brass shrink-0" />
                  <span>Permanent Archival Accession Dossier</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          7. TRUST & AUTHENTICITY SECTION
      =================================================== */}
      <section className="py-14 sm:py-20 lg:py-28 border-b border-brass-border/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16" data-reveal>
            <p className="font-mono text-xs tracking-[0.22em] text-brass uppercase">CURATORIAL STANDARDS</p>
            <h2 className="mt-3 font-serif text-2xl sm:text-4xl text-ivory font-light">
              Trust &amp; Rigorous Authenticity
            </h2>
            <p className="mt-3 text-sm text-parchment-dim">
              Discreet, professional stewardship grounded in documented historical lineage and federal compliance.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal-group>
            {trustPillars.map((tp, idx) => (
              <div
                key={tp.title}
                className="border border-brass-border/40 bg-obsidian-2/50 p-5 sm:p-6 transition-all duration-300 hover:border-brass/40"
              >
                <span className="font-mono text-xs tracking-[0.18em] text-brass uppercase">STANDARD 0{idx + 1}</span>
                <h3 className="mt-3 font-serif text-base text-ivory tracking-wide">{tp.title}</h3>
                <div className="hairline my-3" />
                <p className="text-xs leading-relaxed text-parchment-dim">{tp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          8. "EVERY PIECE HAS A HISTORY" & COLLECTION CTA
      =================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-obsidian-2 to-obsidian py-16 sm:py-24 lg:py-32 text-center">
        {/* Subtle decorative background glow */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-brass/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8" data-reveal>
          <div className="inline-flex items-center gap-2 border border-brass/30 bg-obsidian px-3.5 py-1 font-mono text-xs tracking-[0.22em] text-brass uppercase">
            THE LIVING ARCHIVE
          </div>

          <h2 className="mt-5 font-serif text-2xl sm:text-4xl lg:text-5xl font-light text-ivory tracking-tight leading-tight">
            Every Piece Has a History
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-parchment max-w-2xl mx-auto">
            Over one hundred and twenty hand-selected revolvers, lever guns, sporting rifles, shotguns, and martial arms —
            each one inspected, researched, and catalogued with its own provenance.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/collection"
              className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 border border-brass bg-brass px-8 py-4 font-mono text-xs font-semibold tracking-[0.22em] uppercase text-obsidian transition-all duration-300 hover:bg-brass-light hover:border-brass-light hover:shadow-lg hover:shadow-brass/20 cursor-pointer"
            >
              <span>EXPLORE THE COLLECTION</span>
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>

            <Link
              to="/contact"
              className="inline-flex w-full sm:w-auto items-center justify-center border border-brass-border/60 bg-obsidian-2/80 px-8 py-4 font-mono text-xs font-medium tracking-[0.22em] uppercase text-parchment transition-all duration-300 hover:border-brass hover:text-brass cursor-pointer"
            >
              ARRANGE A PRIVATE VIEWING
            </Link>
          </div>

          <p className="mt-6 sm:mt-8 font-mono text-xs tracking-[0.18em] text-brass-dark uppercase">
            Private viewings conducted by appointment at the Grand Avenue Armory in Bigfork, Montana.
          </p>
        </div>
      </section>
    </div>
  );
}
