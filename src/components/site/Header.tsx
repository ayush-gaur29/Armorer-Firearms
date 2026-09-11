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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-obsidian/95 backdrop-blur-md border-b border-brass-border/80 shadow-lg"
          : "bg-gradient-to-b from-obsidian/80 via-obsidian/40 to-transparent border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 sm:h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex min-w-0 items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass"
          onClick={() => setOpen(false)}
          aria-label="Armorer Firearms Home"
        >
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="text-[0.75rem] tracking-[0.22em] uppercase font-medium text-[#F1EDE4] transition-colors hover:text-brass [text-shadow:0_1px_4px_rgba(0,0,0,0.6)] py-1"
              activeProps={{ className: "!text-brass font-semibold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="flex size-11 shrink-0 items-center justify-center -mr-2 text-ivory hover:text-brass lg:hidden cursor-pointer transition-colors active:scale-95"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 top-16 sm:top-18 z-40 bg-obsidian/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed top-16 sm:top-18 right-0 bottom-0 z-50 flex w-[min(22rem,85vw)] flex-col border-l border-brass-border bg-[#131518] px-6 sm:px-8 py-8 sm:py-10 shadow-2xl transition-transform duration-300 ease-out lg:hidden overflow-y-auto",
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Mobile navigation"
      >
        <span className="eyebrow mb-6">Navigation</span>
        <nav className="flex flex-col">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "!text-brass font-semibold !border-brass/60" }}
              onClick={() => setOpen(false)}
              className="group flex items-center justify-between py-3.5 border-b border-brass-border/30 font-serif text-2xl font-normal text-[#F1EDE4] hover:text-brass transition-colors"
            >
              <span>{item.label}</span>
              <span className="font-mono text-xs text-brass-dark opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </Link>
          ))}
        </nav>
        <div className="hairline my-6" />
        <p className="text-xs tracking-wider text-parchment-dim leading-relaxed">
          Armorer Firearms Atelier<br />
          Bigfork, Montana · Est. 1998
        </p>
        <p className="mt-auto pt-8 text-xs text-parchment-dim/70 font-mono tracking-wider">
          A Private Archive of Historic Arms
        </p>
      </aside>
    </header>
  );
}
