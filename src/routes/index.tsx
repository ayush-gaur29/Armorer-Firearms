import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useCollectionIntro, useFirearms, useHero, useAboutContent } from "@/hooks/useArchive";
import { FirearmCard, ArchiveImage } from "@/components/site/FirearmCard";
import { SectionHeading } from "@/components/site/Section";
import coverVideo from "@/assets/cover_video.mp4";
import heroImg from "@/assets/hero-vault.jpg";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Armorer Firearms — Private Archive of Historic Arms, Bigfork MT" },
      { name: "description", content: "A curated private collection and museum archive of historic firearms, conserved in the Bigfork, Montana atelier since 1998." },
      { property: "og:title", content: "Armorer Firearms — Private Archive of Historic Arms" },
      { property: "og:description", content: "Curated historic firearms, estate acquisitions, and museum-grade conservation from Bigfork, Montana." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const hero = useHero();
  const intro = useCollectionIntro();
  const about = useAboutContent();
  const { firearms } = useFirearms();
  const featured = (firearms.filter((f) => f.featured).length ? firearms.filter((f) => f.featured) : firearms).slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden bg-obsidian">
          {/* Static poster fallback underneath to prevent black flash */}
          <img
            src={hero.imageUrl || heroImg}
            alt=""
            aria-hidden="true"
            className="hero-poster absolute inset-0 h-full w-full object-cover object-center brightness-[1.12] contrast-[1.04]"
          />
          {/* Background Video */}
          <video
            src={coverVideo}
            poster={hero.imageUrl || heroImg}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            className="hero-video absolute inset-0 h-full w-full object-cover object-center md:object-[center_35%] brightness-[1.14] contrast-[1.04] saturate-[1.04]"
          />
          {/* Subtle directional vignettes for text readability while leaving video clear & vivid */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-obsidian/60 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-full max-w-4xl bg-gradient-to-r from-obsidian/65 via-obsidian/25 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
        </div>
        <div className="mx-auto w-full max-w-7xl px-5 pt-36 pb-16 sm:px-8 sm:pb-24">
          <div className="max-w-3xl">
            {/* Mobile logo: sits cleanly above heading with tight spacing to prevent crowding on small viewports */}
            <div className="hero-enter-eyebrow mb-4 sm:hidden">
              <img
                src={logoImg}
                alt="Armorer Firearms"
                width={56}
                height={56}
                className="size-[54px] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
              />
            </div>

            <h1 className="hero-enter-heading font-serif text-[clamp(2.4rem,6vw,5.25rem)] font-normal leading-[1.04] tracking-tight text-ivory drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              <span className="block">A Private Archive of</span>
              <span className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-7 text-ivory">
                <span>Historic Arms</span>
                {/* Desktop & Tablet logo: visually integrated into the heading composition as a refined maker's mark */}
                <img
                  src={logoImg}
                  alt="Armorer Firearms"
                  width={92}
                  height={92}
                  className="hidden sm:inline-block size-16 md:size-20 lg:size-[5.5rem] object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] shrink-0 transition-transform duration-500 hover:scale-105"
                />
              </span>
            </h1>
            <p className="hero-enter-description mt-7 max-w-xl text-base font-medium leading-relaxed text-[#E8E3D9] [text-shadow:0_1px_8px_rgba(0,0,0,0.7)] sm:text-lg">
              {hero.subtitle}
            </p>
            <div className="hero-enter-cta mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/collection"
                className="inline-flex items-center justify-center gap-3 bg-brass px-8 py-4 text-[0.72rem] tracking-[0.24em] uppercase font-medium text-obsidian transition-colors hover:bg-brass-light"
              >
                {hero.ctaPrimary} <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="hero-enter-stats mt-16 grid grid-cols-1 divide-y divide-brass-border border-y border-brass-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              ["120+", "Curated Pieces"],
              ["1860 – 1945", "Historical Span"],
              ["Bigfork", "Montana Atelier"],
            ].map(([v, l]) => (
              <div key={l} className="flex items-baseline gap-4 py-5 sm:flex-col sm:gap-1 sm:px-6 sm:first:pl-0">
                <span className="font-serif text-3xl text-brass-light">{v}</span>
                <span className="text-[0.62rem] font-medium tracking-[0.24em] uppercase text-parchment-dim">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CURATED SELECTION */}
      <section className="scroll-mt-24 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div data-reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Curated Selection" title={intro.heading} text={intro.text} />
            <Link to="/collection" className="inline-flex shrink-0 items-center gap-2 text-[0.72rem] tracking-[0.22em] uppercase font-medium text-brass hover:text-brass-light transition-colors">
              View full catalog <ArrowRight className="size-4" />
            </Link>
          </div>
          <div data-reveal-group className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featured.map((f) => (
              <FirearmCard key={f.id} firearm={f} />
            ))}
          </div>
        </div>
      </section>

      <div className="hairline" />

      {/* ATELIER STORY */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-12">
          <div className="relative lg:col-span-5" data-reveal-image>
            <div className="aspect-[4/5] overflow-hidden border border-brass-border bg-obsidian-3">
              <ArchiveImage src={hero.imageUrl} alt="The Armorer Firearms atelier" />
            </div>
            <div className="absolute -right-4 -bottom-4 hidden border border-brass bg-obsidian px-6 py-5 sm:block shadow-vault">
              <p className="font-serif text-4xl text-brass-light">{about.founded}</p>
              <p className="text-[0.62rem] font-medium tracking-[0.24em] uppercase text-parchment-dim">{about.location}</p>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7" data-reveal>
            <SectionHeading eyebrow="The Atelier" title={about.heading} />
            <p className="mt-6 text-base leading-relaxed text-parchment-dim">{about.story}</p>
            <p className="mt-4 text-base leading-relaxed text-parchment-dim">{about.history}</p>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-[0.72rem] tracking-[0.22em] uppercase font-medium text-brass hover:text-brass-light transition-colors">
              Read our heritage <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="grain relative overflow-hidden border-y border-brass-border bg-obsidian-2 py-24">
        <div className="mx-auto max-w-7xl px-5 text-center sm:px-8" data-reveal>
          <p className="eyebrow">Curatorial Consultation</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-serif text-3xl leading-tight text-ivory sm:text-5xl">
            Seeking a specific piece, or placing a collection?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-parchment-dim">
            We work discreetly with estates, institutions, and private collectors. Every conversation begins in confidence.
          </p>
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center gap-3 border border-brass px-8 py-4 text-[0.72rem] tracking-[0.24em] uppercase font-medium text-brass transition-colors hover:bg-brass hover:text-obsidian"
          >
            Contact the Atelier <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
