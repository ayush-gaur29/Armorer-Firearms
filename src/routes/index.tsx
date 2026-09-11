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
      { title: "Armorer Firearms" },
      { name: "description", content: "A curated private collection and museum archive of historic firearms, conserved in the Bigfork, Montana atelier since 1998." },
      { property: "og:title", content: "Armorer Firearms" },
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
            className="hero-poster absolute inset-0 h-full w-full object-cover object-[center_28%] sm:object-[center_35%] brightness-[1.12] contrast-[1.04]"
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
            className="hero-video absolute inset-0 h-full w-full object-cover object-[center_28%] sm:object-[center_35%] brightness-[1.14] contrast-[1.04] saturate-[1.04]"
          />
          {/* Subtle directional vignettes for text readability while leaving video clear & vivid */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-obsidian/70 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-full max-w-4xl bg-gradient-to-r from-obsidian/75 via-obsidian/30 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent" />
          {/* Localized cinematic corner shadow/gradient to blend the bottom-right watermark naturally into the background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 z-0 h-40 w-48 sm:h-52 sm:w-64 md:h-64 md:w-80 lg:h-72 lg:w-96 xl:h-80 xl:w-[28rem] max-w-[48vw] max-h-[36vh]"
            style={{
              background:
                "radial-gradient(ellipse 95% 95% at 100% 100%, rgba(12, 13, 14, 0.95) 0%, rgba(16, 18, 20, 0.82) 32%, rgba(16, 18, 20, 0.42) 65%, transparent 100%)",
            }}
          />
        </div>
        <div className="mx-auto w-full max-w-7xl px-4 pt-24 pb-12 sm:px-6 sm:pt-32 sm:pb-16 lg:px-8 lg:pt-36 lg:pb-24">
          <div className="max-w-3xl">
            {/* Mobile logo: sits cleanly above heading with intentional spacing */}
            <div className="hero-enter-eyebrow mb-3 sm:hidden">
              <img
                src={logoImg}
                alt="Armorer Firearms"
                width={52}
                height={52}
                className="size-[50px] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
              />
            </div>

            <h1 className="hero-enter-heading font-serif text-[clamp(1.95rem,6.2vw,4.75rem)] font-normal leading-[1.08] tracking-tight text-ivory drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              <span className="block">A Private Archive of</span>
              <span className="flex flex-wrap items-center gap-3 sm:gap-6 md:gap-7 text-ivory">
                <span>Historic Arms</span>
                {/* Desktop & Tablet logo: visually integrated into the heading composition */}
                <img
                  src={logoImg}
                  alt="Armorer Firearms"
                  width={92}
                  height={92}
                  className="hidden sm:inline-block size-16 md:size-20 lg:size-[5.5rem] object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] shrink-0 transition-transform duration-500 hover:scale-105"
                />
              </span>
            </h1>
            <p className="hero-enter-description mt-5 max-w-xl text-base font-normal leading-relaxed text-[#E8E3D9] [text-shadow:0_1px_8px_rgba(0,0,0,0.7)] sm:text-lg">
              {hero.subtitle}
            </p>
            <div className="hero-enter-cta mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/collection"
                className="inline-flex w-full items-center justify-center gap-3 bg-brass px-8 py-4 text-xs font-semibold tracking-[0.24em] uppercase text-obsidian transition-colors hover:bg-brass-light sm:w-auto"
              >
                {hero.ctaPrimary} <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="hero-enter-stats mt-10 grid grid-cols-2 gap-4 border-y border-brass-border/80 py-5 sm:mt-16 sm:grid-cols-3 sm:gap-6 sm:divide-x sm:divide-brass-border/80 sm:py-6">
            <div className="flex flex-col gap-1 sm:px-6 sm:first:pl-0">
              <span className="font-serif text-2xl sm:text-3xl text-brass-light">120+</span>
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-parchment-dim">Curated Pieces</span>
            </div>
            <div className="flex flex-col gap-1 sm:px-6">
              <span className="font-serif text-2xl sm:text-3xl text-brass-light">1860 – 1945</span>
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-parchment-dim">Historical Span</span>
            </div>
            <div className="col-span-2 flex flex-col gap-1 border-t border-brass-border/50 pt-3 sm:col-span-1 sm:border-t-0 sm:pt-0 sm:px-6">
              <span className="font-serif text-2xl sm:text-3xl text-brass-light">Bigfork</span>
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-parchment-dim">Montana Atelier</span>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED SELECTION */}
      <section className="scroll-mt-20 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Curated Selection" title={intro.heading} text={intro.text} />
            <Link to="/collection" className="inline-flex shrink-0 items-center gap-2 text-xs tracking-[0.22em] uppercase font-medium text-brass hover:text-brass-light transition-colors py-1">
              View full catalog <ArrowRight className="size-4" />
            </Link>
          </div>
          <div data-reveal-group className="mt-10 sm:mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 sm:gap-8">
            {featured.map((f) => (
              <FirearmCard key={f.id} firearm={f} />
            ))}
          </div>
        </div>
      </section>

      <div className="hairline" />

      {/* ATELIER STORY */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-10 sm:gap-14 px-4 sm:px-6 lg:px-8 lg:grid-cols-12">
          <div className="relative lg:col-span-5" data-reveal-image>
            <div className="aspect-[16/10] sm:aspect-[4/5] overflow-hidden border border-brass-border bg-obsidian-3">
              <ArchiveImage src={hero.imageUrl} alt="The Armorer Firearms atelier" />
            </div>
            <div className="mt-3 flex items-center justify-between border border-brass-border/60 bg-obsidian-2 px-4 py-3 sm:absolute sm:-right-4 sm:-bottom-4 sm:mt-0 sm:border-brass sm:bg-obsidian sm:px-6 sm:py-5 shadow-vault">
              <div>
                <p className="font-serif text-2xl sm:text-4xl text-brass-light">{about.founded}</p>
                <p className="text-xs font-medium tracking-[0.2em] uppercase text-parchment-dim">{about.location}</p>
              </div>
              <span className="font-mono text-xs tracking-widest text-brass sm:hidden">EST. 1998</span>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7" data-reveal>
            <SectionHeading eyebrow="The Atelier" title={about.heading} />
            <p className="mt-6 text-base leading-relaxed text-parchment-dim">{about.story}</p>
            <p className="mt-4 text-base leading-relaxed text-parchment-dim">{about.history}</p>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-xs tracking-[0.22em] uppercase font-medium text-brass hover:text-brass-light transition-colors py-1">
              Read our heritage <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="grain relative overflow-hidden border-y border-brass-border bg-obsidian-2 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8" data-reveal>
          <p className="eyebrow">Curatorial Consultation</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-serif text-2xl leading-tight text-ivory sm:text-4xl lg:text-5xl">
            Seeking a specific piece, or placing a collection?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-parchment-dim">
            We work discreetly with estates, institutions, and private collectors. Every conversation begins in confidence.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/contact"
              className="inline-flex w-full items-center justify-center gap-3 border border-brass px-8 py-4 text-xs tracking-[0.24em] uppercase font-semibold text-brass transition-colors hover:bg-brass hover:text-obsidian sm:w-auto"
            >
              Contact the Atelier <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
