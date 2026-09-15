import { Link } from "@tanstack/react-router";
import { useContactContent } from "@/hooks/useArchive";
import { BrandMark } from "./BrandMark";

export function Footer() {
  const contact = useContactContent();
  return (
    <footer className="border-t border-brass-border bg-obsidian-2">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:gap-12 sm:px-6 sm:py-16 md:grid-cols-[1.6fr_1fr_1.2fr] lg:px-8" data-reveal>
        <div className="min-w-0">
          <BrandMark />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-parchment-dim">
            A private collection and working armory devoted to the research, conservation, and placement of historically
            significant arms. Founded 1998, Bigfork, Montana.
          </p>
          <p className="mt-5 font-mono text-xs tracking-[0.2em] text-brass-dark">48°03'47.9"N 114°04'20.6"W</p>
        </div>

        <div>
          <p className="eyebrow mb-4">Archive</p>
          <ul className="space-y-2 text-sm text-parchment-dim">
            <li><Link to="/" className="inline-block py-1 hover:text-brass transition-colors">Home</Link></li>
            <li><Link to="/collection" className="inline-block py-1 hover:text-brass transition-colors">Full Collection</Link></li>
            <li><Link to="/contact" className="inline-block py-1 hover:text-brass transition-colors">Contact &amp; Inquiries</Link></li>
          </ul>
        </div>

        <div className="min-w-0">
          <p className="eyebrow mb-4">Armory</p>
          <ul className="space-y-2 text-sm text-parchment-dim">
            <li className="py-0.5">{contact.address}</li>
            <li className="py-0.5">{contact.city}</li>
            <li className="break-words py-0.5"><a href={`tel:${contact.phone}`} className="inline-block hover:text-brass transition-colors">{contact.phone}</a></li>
            <li className="break-words py-0.5"><a href={`mailto:${contact.email}`} className="inline-block hover:text-brass transition-colors">{contact.email}</a></li>
          </ul>
        </div>
      </div>

      <div className="hairline" />
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-xs tracking-wider text-parchment-dim/75 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Armorer Firearms. All rights reserved.</p>
        <p className="max-w-xl text-xs leading-relaxed text-parchment-dim/60">
          All firearms sold in strict compliance with federal, state, and local law. Transfers via licensed FFL only. Antique
          status verified per 18 U.S.C. § 921(a)(16).
        </p>
      </div>
    </footer>
  );
}
