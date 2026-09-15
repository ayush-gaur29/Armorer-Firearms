import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useHero, useAboutContent } from "@/hooks/useArchive";
import { ArchiveImage } from "@/components/site/FirearmCard";
import coverPic from "@/assets/cover_pic.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Armorer Firearms" },
      { name: "description", content: "A curated private collection and museum archive of historic firearms, conserved in the Bigfork, Montana armory since 1998." },
      { property: "og:title", content: "Armorer Firearms" },
      { property: "og:description", content: "Curated historic firearms, estate acquisitions, and museum-grade conservation from Bigfork, Montana." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const hero = useHero();
  const about = useAboutContent();

  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex flex-col justify-start sm:flex-row sm:min-h-[100svh] sm:items-end overflow-hidden bg-obsidian">
        <div className="relative w-full aspect-[16/9] mt-16 sm:mt-0 sm:aspect-auto sm:absolute sm:inset-0 sm:-z-10 overflow-hidden bg-obsidian">
          {/* Static Hero Cover Image */}
          <img
            src={coverPic}
            alt="Armorer Firearms"
            aria-hidden="true"
            className="hero-cover absolute inset-0 h-full w-full object-contain sm:object-cover sm:object-[center_35%] brightness-[1.05] contrast-[1.02]"
          />
          {/* Subtle directional vignettes for text readability while leaving video clear & vivid */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-12 sm:h-32 bg-gradient-to-b from-obsidian/70 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-full sm:max-w-4xl bg-gradient-to-r from-obsidian/60 sm:from-obsidian/75 via-transparent sm:via-obsidian/30 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:hidden bg-gradient-to-l from-obsidian/60 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-44 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent" />
          {/* Localized cinematic corner shadow/gradient to blend the bottom-right watermark naturally into the background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 z-0 h-24 w-32 sm:h-52 sm:w-64 md:h-64 md:w-80 lg:h-72 lg:w-96 xl:h-80 xl:w-[28rem] max-w-[48vw] max-h-[36vh]"
            style={{
              background:
                "radial-gradient(ellipse 95% 95% at 100% 100%, rgba(12, 13, 14, 0.95) 0%, rgba(16, 18, 20, 0.82) 32%, rgba(16, 18, 20, 0.42) 65%, transparent 100%)",
            }}
          />
        </div>
        <div className="mx-auto w-full max-w-7xl px-4 pt-3 pb-3 sm:px-6 sm:pt-32 sm:pb-4 lg:px-8 lg:pt-36 lg:pb-5">
          <h1 className="sr-only">Armorer Firearms — A Private Archive of Historic Arms</h1>

          <div className="hero-enter-cta flex justify-start sm:justify-end">
            <Link
              to="/collection"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-3 bg-brass px-8 py-3.5 sm:py-4 text-xs font-semibold tracking-[0.24em] uppercase text-obsidian transition-colors hover:bg-brass-light"
            >
              VIEW COLLECTION <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="hero-enter-stats mt-2.5 sm:mt-3 grid grid-cols-1 gap-2 border-y border-brass-border/80 py-2 sm:py-2.5 sm:grid-cols-2 sm:gap-6 sm:divide-x sm:divide-brass-border/80">
            <div className="flex flex-col gap-0.5 sm:px-6 sm:first:pl-0">
              <span className="font-serif text-2xl sm:text-3xl text-brass-light leading-tight">120+</span>
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-parchment-dim">Curated Pieces</span>
            </div>
            <div className="flex flex-col gap-0.5 border-t border-brass-border/50 pt-2 sm:border-t-0 sm:pt-0 sm:px-6">
              <span className="font-serif text-2xl sm:text-3xl text-brass-light light:text-brass-dark leading-tight">Bigfork, MT Armory</span>
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-parchment-dim">FFL # 9-81-029-01-9D-04359</span>
            </div>
          </div>
        </div>
      </section>

      {/* ARMORY STORY */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-10 sm:gap-14 px-4 sm:px-6 lg:px-8 lg:grid-cols-12">
          <div className="relative lg:col-span-5" data-reveal-image>
            <div className="aspect-[16/10] sm:aspect-[4/5] overflow-hidden border border-brass-border bg-obsidian-3">
              <ArchiveImage src={hero.imageUrl} alt="The Armorer Firearms armory" />
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
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl leading-[1.12] text-ivory tracking-tight">
              {about.heading}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-parchment-dim">{about.story}</p>
            <p className="mt-4 text-base leading-relaxed text-parchment-dim">{about.history}</p>
          </div>
        </div>
      </section>

    </>
  );
}
