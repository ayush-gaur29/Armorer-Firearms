import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useCollectionIntro, useFirearms, useHero, useAboutContent } from "@/hooks/useArchive";
import { FirearmCard, ArchiveImage } from "@/components/site/FirearmCard";
import { SectionHeading } from "@/components/site/Section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Armorer Firearms — Private Archive of Historic Arms, Bigfork MT" },
      { name: "description", content: "A curated private collection and museum archive of historic firearms, conserved in the Bigfork, Montana atelier since 1998. Private acquisitions by inquiry." },
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
        <div className="absolute inset-0 -z-10">
          <ArchiveImage src={hero.imageUrl} alt="" eager className="scale-[1.02]" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-obsidian/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 via-transparent to-transparent" />
        </div>
        <div className="mx-auto w-full max-w-7xl px-5 pt-36 pb-16 sm:px-8 sm:pb-24">
          <div className="max-w-3xl">
            <p className="font-mono text-[0.62rem] tracking-[0.3em] text-brass">ACCESSION NO. AF-HERO · {hero.tagline}</p>
            {hero.logoUrl && (
              <img src={hero.logoUrl} alt="Armorer Firearms" className="mt-6 h-14 w-auto object-contain" width={200} height={56} />
            )}
            <h1 className="mt-6 font-serif text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.98] text-ivory">{hero.title}</h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-parchment/85 sm:text-lg">{hero.subtitle}</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/collection"
                className="inline-flex items-center justify-center gap-3 bg-brass px-8 py-4 text-[0.72rem] tracking-[0.24em] uppercase text-obsidian transition-colors hover:bg-brass-light"
              >
                {hero.ctaPrimary} <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center border border-parchment/40 px-8 py-4 text-[0.72rem] tracking-[0.24em] uppercase text-ivory transition-colors hover:border-brass hover:text-brass"
              >
                {hero.ctaSecondary}
              </Link>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 divide-y divide-brass-border border-y border-brass-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              ["120+", "Curated Pieces"],
              ["1860 – 1945", "Historical Span"],
              ["Bigfork", "Montana Atelier"],
            ].map(([v, l]) => (
              <div key={l} className="flex items-baseline gap-4 py-5 sm:flex-col sm:gap-1 sm:px-6 sm:first:pl-0">
                <span className="font-serif text-3xl text-brass-light">{v}</span>
                <span className="text-[0.62rem] tracking-[0.24em] uppercase text-parchment-dim">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section id="highlights" className="scroll-mt-24 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Archive Highlights" title={intro.heading} text={intro.text} />
            <Link to="/collection" className="inline-flex shrink-0 items-center gap-2 text-[0.72rem] tracking-[0.22em] uppercase text-brass hover:text-brass-light">
              View full catalog <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
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
          <div className="relative lg:col-span-5">
            <div className="aspect-[4/5] overflow-hidden border border-brass-border">
              <ArchiveImage src={hero.imageUrl} alt="The Armorer Firearms atelier" />
            </div>
            <div className="absolute -right-4 -bottom-4 hidden border border-brass bg-obsidian px-6 py-5 sm:block">
              <p className="font-serif text-4xl text-brass-light">{about.founded}</p>
              <p className="text-[0.62rem] tracking-[0.24em] uppercase text-parchment-dim">{about.location}</p>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <SectionHeading eyebrow="The Atelier" title={about.heading} />
            <p className="mt-6 text-base leading-relaxed text-parchment-dim">{about.story}</p>
            <p className="mt-4 text-base leading-relaxed text-parchment-dim">{about.history}</p>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-[0.72rem] tracking-[0.22em] uppercase text-brass hover:text-brass-light">
              Read our heritage <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="grain relative overflow-hidden border-y border-brass-border bg-obsidian-2 py-24">
        <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
          <p className="eyebrow">Curatorial Inquiries</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-serif text-3xl leading-tight text-ivory sm:text-5xl">
            Seeking a specific piece, or placing a collection?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-parchment-dim">
            We work discreetly with estates, institutions, and private collectors. Every conversation begins in confidence.
          </p>
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center gap-3 border border-brass px-8 py-4 text-[0.72rem] tracking-[0.24em] uppercase text-brass transition-colors hover:bg-brass hover:text-obsidian"
          >
            Begin a private inquiry <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
