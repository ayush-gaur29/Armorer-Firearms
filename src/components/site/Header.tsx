import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { BrandMark } from "./BrandMark";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/collection", label: "Collection" },
  { to: "/", hash: "highlights", label: "Archive Highlights" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, ready } = useAuth();
  const navigate = useNavigate();

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

  const goToHighlights = () => {
    setOpen(false);
    navigate({ to: "/", hash: "highlights" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "bg-obsidian/90 backdrop-blur-md border-b border-brass-border" : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" className="flex min-w-0 items-center" onClick={() => setOpen(false)}>
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV.map((item) =>
            "hash" in item ? (
              <button
                key={item.label}
                onClick={goToHighlights}
                className="text-[0.72rem] tracking-[0.22em] uppercase text-parchment-dim transition-colors hover:text-brass"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className="text-[0.72rem] tracking-[0.22em] uppercase text-parchment-dim transition-colors hover:text-brass"
                activeProps={{ className: "text-brass" }}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {ready && user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 text-[0.72rem] tracking-[0.2em] uppercase text-parchment-dim hover:text-brass"
            >
              <UserRound className="size-4" aria-hidden />
              {user.displayName?.split(" ")[0] ?? "Profile"}
            </Link>
          ) : (
            <Link to="/login" className="text-[0.72rem] tracking-[0.2em] uppercase text-parchment-dim hover:text-brass">
              Collector Login
            </Link>
          )}
          <Link
            to="/contact"
            className="border border-brass px-5 py-2.5 text-[0.72rem] tracking-[0.22em] uppercase text-brass transition-colors hover:bg-brass hover:text-obsidian"
          >
            Private Inquiry
          </Link>
        </div>

        <button
          className="grid size-10 shrink-0 place-items-center text-parchment lg:hidden"
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
        <span className="eyebrow mb-6">Navigate</span>
        <nav className="flex flex-col gap-5">
          {NAV.map((item) =>
            "hash" in item ? (
              <button key={item.label} onClick={goToHighlights} className="text-left font-serif text-2xl text-parchment hover:text-brass">
                {item.label}
              </button>
            ) : (
              <Link key={item.label} to={item.to} onClick={() => setOpen(false)} className="font-serif text-2xl text-parchment hover:text-brass">
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="hairline my-8" />
        <div className="flex flex-col gap-4">
          {ready && user ? (
            <Link to="/profile" onClick={() => setOpen(false)} className="text-[0.72rem] tracking-[0.2em] uppercase text-parchment-dim hover:text-brass">
              My Profile
            </Link>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="text-[0.72rem] tracking-[0.2em] uppercase text-parchment-dim hover:text-brass">
              Collector Login
            </Link>
          )}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="border border-brass px-5 py-3 text-center text-[0.72rem] tracking-[0.22em] uppercase text-brass hover:bg-brass hover:text-obsidian"
          >
            Private Inquiry
          </Link>
        </div>
        <p className="mt-auto text-xs text-parchment-dim">Bigfork, Montana · Est. 1998</p>
      </aside>
    </header>
  );
}
