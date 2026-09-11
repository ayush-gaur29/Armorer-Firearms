import { Link } from "@tanstack/react-router";
import { useContactContent } from "@/hooks/useArchive";
import { BrandMark } from "./BrandMark";

export function Footer() {
  const contact = useContactContent();
  return (
    <footer className="border-t border-brass-border bg-obsidian-2">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.6fr_1fr_1.2fr]" data-reveal>
        <div className="min-w-0">
          <BrandMark />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-parchment-dim">
            A private collection and working atelier devoted to the research, conservation, and placement of historically
            significant arms. Founded 1998, Bigfork, Montana.
          </p>
          <p className="mt-6 font-mono text-[0.7rem] tracking-[0.2em] text-brass-dark">48.0633° N, 114.0724° W</p>
        </div>

        <div>
          <p className="eyebrow mb-5">Archive</p>
          <ul className="space-y-3 text-sm text-parchment-dim">
            <li><Link to="/collection" className="hover:text-brass transition-colors">Full Collection</Link></li>
            <li><Link to="/about" className="hover:text-brass transition-colors">Heritage &amp; Atelier</Link></li>
            <li><Link to="/contact" className="hover:text-brass transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div className="min-w-0">
          <p className="eyebrow mb-5">Atelier</p>
          <ul className="space-y-3 text-sm text-parchment-dim">
            <li>{contact.address}</li>
            <li>{contact.city}</li>
            <li className="break-words"><a href={`tel:${contact.phone}`} className="hover:text-brass transition-colors">{contact.phone}</a></li>
            <li className="break-words"><a href={`mailto:${contact.email}`} className="hover:text-brass transition-colors">{contact.email}</a></li>
          </ul>
        </div>
      </div>

      <div className="hairline" />
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-[0.68rem] tracking-[0.12em] text-parchment-dim/70 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} Armorer Firearms. All rights reserved.</p>
        <p className="max-w-xl">
          All firearms sold in strict compliance with federal, state, and local law. Transfers via licensed FFL only. Antique
          status verified per 18 U.S.C. § 921(a)(16).
        </p>
      </div>
    </footer>
  );
}
