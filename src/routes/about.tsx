import { createFileRoute, Link } from "@tanstack/react-router";
import { useAboutContent, useHero } from "@/hooks/useArchive";
import { ArchiveImage } from "@/components/site/FirearmCard";
import { PageIntro } from "@/components/site/Section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Heritage & Atelier — Armorer Firearms, Bigfork Montana" },
      { name: "description", content: "The story of the Armorer Firearms atelier: founded 1998 in Bigfork, Montana, built on estate acquisitions, conservation over restoration, and rigorous standards of authenticity." },
      { property: "og:title", content: "Heritage & Atelier — Armorer Firearms" },
      { property: "og:description", content: "Estate acquisitions, preservation philosophy and standards of authenticity from the Montana atelier." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const about = useAboutContent();
  const hero = useHero();
  const pillars = [
    ["I", "Estate Acquisitions", about.history],
    ["II", "Preservation Philosophy", about.philosophy ?? ""],
    ["III", "Standards of Authenticity", about.standards ?? ""],
  ].filter(([, , t]) => t);

  return (
    <>
      <PageIntro eyebrow={`Est. ${about.founded} · ${about.location}`} title={about.heading} />

      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-serif text-2xl leading-snug text-parchment sm:text-3xl">{about.story}</p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="aspect-[3/4] overflow-hidden border border-brass-border">
              <ArchiveImage src={hero.imageUrl} alt="Inside the Bigfork atelier" />
            </div>
            <p className="mt-3 font-mono text-[0.62rem] tracking-[0.2em] text-brass-dark">PLATE 01 · THE BENCH, BIGFORK</p>
          </div>
        </div>
      </section>

      <div className="hairline" />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-px border border-brass-border bg-brass-border md:grid-cols-3">
            {pillars.map(([n, title, text]) => (
              <article key={n} className="bg-obsidian p-8 lg:p-10">
                <p className="font-serif text-4xl text-brass-dark">{n}</p>
                <h2 className="mt-6 font-serif text-2xl text-ivory">{title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-parchment-dim">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-brass-border bg-obsidian-2 py-20 text-center">
        <div className="mx-auto max-w-2xl px-5">
          <p className="eyebrow">Visit the Atelier</p>
          <h2 className="mt-4 font-serif text-3xl text-ivory sm:text-4xl">Private viewings by appointment.</h2>
          <Link to="/contact" className="mt-8 inline-block border border-brass px-8 py-4 text-[0.72rem] tracking-[0.24em] uppercase text-brass hover:bg-brass hover:text-obsidian">
            Arrange a visit
          </Link>
        </div>
      </section>
    </>
  );
}
