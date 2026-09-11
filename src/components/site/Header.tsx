import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandMark } from "./BrandMark";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/collection", label: "Collection" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "bg-obsidian/90 backdrop-blur-md border-b border-brass-border" : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link to="/" className="flex min-w-0 items-center" onClick={() => setOpen(false)} aria-label="Armorer Firearms Home">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="text-[0.72rem] tracking-[0.22em] uppercase font-medium text-[#F1EDE4] transition-colors hover:text-brass [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]"
              activeProps={{ className: "!text-brass font-semibold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="grid size-10 shrink-0 place-items-center text-[#F1EDE4] lg:hidden cursor-pointer"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 top-18 z-40 bg-obsidian/70 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed top-18 right-0 bottom-0 z-50 flex w-[min(20rem,85vw)] flex-col border-l border-brass-border bg-obsidian-2 px-8 py-10 transition-transform duration-500 lg:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Mobile navigation"
      >
        <span className="eyebrow mb-8">Navigation</span>
        <nav className="flex flex-col gap-6">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "!text-brass font-semibold" }}
              onClick={() => setOpen(false)}
              className="font-serif text-2xl font-medium text-[#F1EDE4] hover:text-brass transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hairline my-8" />
        <p className="text-xs tracking-wider text-parchment-dim leading-relaxed">
          Armorer Firearms Atelier<br />
          Bigfork, Montana · Est. 1998
        </p>
        <p className="mt-auto text-xs text-parchment-dim/70">A Private Archive of Historic Arms</p>
      </aside>
    </header>
  );
}
