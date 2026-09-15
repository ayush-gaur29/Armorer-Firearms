import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Check,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useFirearms } from "@/hooks/useArchive";
import { FirearmCard, FirearmCardSkeleton } from "@/components/site/FirearmCard";
import { BackButton } from "@/components/site/BackButton";
import { cn } from "@/lib/utils";
import collectionHeroImg from "@/assets/collection_hero_archival.jpg";

export const Route = createFileRoute("/collection/")({
  head: () => ({
    meta: [
      { title: "Armorer Firearms" },
      {
        name: "description",
        content:
          "Browse the complete Armorer Firearms archive: historical revolvers, lever-action rifles, sporting shotguns, and rare martial arms, researched and curated in Bigfork, Montana.",
      },
      { property: "og:title", content: "Armorer Firearms" },
      {
        property: "og:description",
        content:
          "Explore the complete museum catalog of historic firearms with documented provenance and high-resolution dossiers.",
      },
    ],
  }),
  component: CollectionPage,
});

type SortKey = "year-asc" | "year-desc" | "price-asc" | "price-desc" | "name";

const toNum = (v: unknown) => {
  const n = typeof v === "string" ? Number(v.replace(/[^0-9.]/g, "")) : Number(v);
  return Number.isFinite(n) ? n : 0;
};

function CollectionPage() {
  const { firearms, loading } = useFirearms();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [maker, setMaker] = useState("");
  const [caliber, setCaliber] = useState("");
  const [condition, setCondition] = useState("");
  const [sort, setSort] = useState<SortKey>("year-asc");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Dynamic filter options based on available firearms
  const categories = useMemo(
    () => Array.from(new Set(firearms.map((f) => f.category).filter(Boolean))).sort(),
    [firearms],
  );
  const makers = useMemo(
    () => Array.from(new Set(firearms.map((f) => f.maker).filter(Boolean))).sort(),
    [firearms],
  );
  const calibers = useMemo(
    () => Array.from(new Set(firearms.map((f) => f.caliber).filter(Boolean))).sort(),
    [firearms],
  );
  const conditions = useMemo(
    () => Array.from(new Set(firearms.map((f) => f.condition).filter(Boolean))).sort(),
    [firearms],
  );

  const matchesCategory = (itemCategory: string | undefined, selectedCategory: string) => {
    if (!selectedCategory) return true;
    if (!itemCategory) return false;
    return itemCategory.toLowerCase().trim() === selectedCategory.toLowerCase().trim();
  };

  // Filter & Sort Results
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = firearms.filter(
      (f) =>
        matchesCategory(f.category, category) &&
        (!maker || f.maker === maker) &&
        (!caliber || f.caliber === caliber) &&
        (!condition || f.condition === condition) &&
        (!needle ||
          [f.name, f.maker, f.model, f.caliber, f.description, f.category, f.serial, f.year]
            .join(" ")
            .toLowerCase()
            .includes(needle)),
    );
    return list.sort((a, b) => {
      switch (sort) {
        case "year-asc":
          return toNum(a.year) - toNum(b.year);
        case "year-desc":
          return toNum(b.year) - toNum(a.year);
        case "price-asc":
          return toNum(a.price) - toNum(b.price);
        case "price-desc":
          return toNum(b.price) - toNum(a.price);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [firearms, q, category, maker, caliber, condition, sort]);

  const activeFiltersCount = [category, maker, caliber, condition].filter(Boolean).length;
  const isFiltered = Boolean(q || activeFiltersCount > 0);

  const resetAll = () => {
    setQ("");
    setCategory("");
    setMaker("");
    setCaliber("");
    setCondition("");
    setSort("year-asc");
  };

  return (
    <div className="relative min-h-screen bg-background text-parchment overflow-x-clip">
      {/* Background Architectural Depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_50%_at_50%_-15%,rgba(201,174,110,0.07),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

      {/* HERO / EDITORIAL HEADER */}
      <section className="relative pt-24 pb-10 sm:pt-32 sm:pb-14 lg:pt-36 lg:pb-16 border-b border-brass-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back button & Eyebrow */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <BackButton fallbackTo="/" label="Back to Main" />
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-parchment-dim/80">
              ACCESSION REGISTER · BIGFORK, MT
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
            {/* Left: Text content */}
            <div data-reveal className="flex-1 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-brass" />
                <p className="font-mono text-xs font-medium tracking-[0.24em] uppercase text-brass">
                  THE ARMORER ARCHIVE
                </p>
              </div>

              <h1 className="mt-4 font-serif text-[clamp(2.2rem,5.5vw,4.85rem)] font-normal leading-[1.06] tracking-tight text-ivory drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] light:drop-shadow-none">
                The Collection
              </h1>

              <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-[#E8E3D9] light:text-foreground [text-shadow:0_1px_6px_rgba(0,0,0,0.5)] light:[text-shadow:none] sm:text-lg">
                Every piece is examined, documented, and conserved in our Montana armory before
                it enters the permanent public register. Filter by maker, caliber, or condition, or
                explore the catalog directly.
              </p>
            </div>

            {/* Right: Hero image */}
            <div className="mt-8 lg:mt-0 lg:w-[42%] xl:w-[38%] shrink-0">
              <div className="relative overflow-hidden border border-brass-border/60 shadow-[0_8px_40px_rgba(0,0,0,0.55)]">
                <img
                  src={collectionHeroImg}
                  alt="Armorer Firearms Collection"
                  className="w-full h-[260px] sm:h-[320px] lg:h-[360px] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* SEARCH & FILTERS BAR (Sticky) */}
      <section className="sticky top-16 sm:top-18 z-30 border-b border-brass-border/80 bg-obsidian/95 backdrop-blur-md shadow-lg transition-all">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-3.5 lg:px-8">
          {/* Category Tabs within existing search/archive area */}
          <div className="mb-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setCategory("")}
              className={cn(
                "shrink-0 whitespace-nowrap px-3 py-1.5 font-mono text-[0.68rem] tracking-[0.14em] uppercase transition-colors border cursor-pointer",
                !category
                  ? "border-brass bg-brass text-obsidian font-bold"
                  : "border-brass-border/60 bg-obsidian-2/80 text-parchment-dim hover:border-brass hover:text-ivory"
              )}
            >
              All Pieces
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(category === cat ? "" : cat)}
                className={cn(
                  "shrink-0 whitespace-nowrap px-3 py-1.5 font-mono text-[0.68rem] tracking-[0.14em] uppercase transition-colors border cursor-pointer",
                  category === cat
                    ? "border-brass bg-brass text-obsidian font-bold"
                    : "border-brass-border/60 bg-obsidian-2/80 text-parchment-dim hover:border-brass hover:text-ivory"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Desktop Search & Filters */}
          <div className="hidden lg:grid lg:grid-cols-[1.8fr_repeat(4,1fr)_1.2fr] lg:gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-parchment-dim" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search archive by maker, model, caliber..."
                className="h-10 w-full rounded-none border border-brass-border bg-obsidian-2/80 pl-10 pr-9 text-xs tracking-wider text-ivory placeholder:text-parchment-dim/60 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-colors"
                aria-label="Search the archive"
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 text-parchment-dim hover:text-ivory"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Selects */}
            <FilterSelect
              label="Category"
              value={category}
              onChange={setCategory}
              options={categories}
            />
            <FilterSelect label="Maker" value={maker} onChange={setMaker} options={makers} />
            <FilterSelect
              label="Caliber"
              value={caliber}
              onChange={setCaliber}
              options={calibers}
            />
            <FilterSelect
              label="Condition"
              value={condition}
              onChange={setCondition}
              options={conditions}
            />

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort catalog"
                className="h-10 w-full rounded-none border border-brass-border bg-obsidian-2/80 px-3 text-xs tracking-wider text-ivory focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass transition-colors cursor-pointer"
              >
                <option value="year-asc">Year · Oldest First</option>
                <option value="year-desc">Year · Newest First</option>
                <option value="price-asc">Price · Low to High</option>
                <option value="price-desc">Price · High to Low</option>
                <option value="name">Name · A to Z</option>
              </select>
            </div>
          </div>

          {/* Mobile & Tablet Search & Filter Controls (<1024px) */}
          <div className="flex flex-col gap-2.5 lg:hidden">
            {/* Search */}
            <div className="relative w-full">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-parchment-dim" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search archive by maker, model..."
                className="h-11 w-full rounded-none border border-brass-border bg-obsidian-2/90 pl-10 pr-10 text-xs sm:text-sm tracking-wider text-ivory placeholder:text-parchment-dim/60 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
                aria-label="Search the archive"
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 p-1.5 text-parchment-dim hover:text-ivory"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Filter Drawer Trigger & Sort */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className={cn(
                  "flex-1 h-11 inline-flex items-center justify-center gap-2 border px-3 text-xs font-semibold tracking-wider uppercase transition-colors active:scale-[0.99]",
                  activeFiltersCount > 0
                    ? "border-brass bg-brass/15 text-brass"
                    : "border-brass-border bg-obsidian-2 text-parchment hover:border-brass-border-strong",
                )}
                aria-label="Open filter drawer"
              >
                <SlidersHorizontal className="size-3.5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="grid size-4.5 place-items-center rounded-full bg-brass text-xs font-bold text-obsidian">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex-1 relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  aria-label="Sort collection"
                  className="h-11 w-full rounded-none border border-brass-border bg-obsidian-2 px-3 text-xs tracking-wider text-ivory focus:border-brass focus:outline-none"
                >
                  <option value="year-asc">Year · Oldest</option>
                  <option value="year-desc">Year · Newest</option>
                  <option value="price-asc">Price · Low</option>
                  <option value="price-desc">Price · High</option>
                  <option value="name">Name · A–Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* MAIN CATALOG CONTENT */}
      < main className="py-8 sm:py-12 lg:py-16" >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Active Filter Chips & Results Count Bar */}
          <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-brass-border/40 pb-4 sm:pb-5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-xs tracking-wider uppercase text-parchment-dim">
                <span className="font-bold text-brass">{results.length}</span>{" "}
                {results.length === 1 ? "Piece" : "Pieces"} in view · {firearms.length} in Archive
              </p>

              {/* Active filter badges */}
              {category && (
                <FilterChip label={`Category: ${category}`} onRemove={() => setCategory("")} />
              )}
              {maker && <FilterChip label={`Maker: ${maker}`} onRemove={() => setMaker("")} />}
              {caliber && <FilterChip label={`Caliber: ${caliber}`} onRemove={() => setCaliber("")} />}
              {condition && (
                <FilterChip label={`Condition: ${condition}`} onRemove={() => setCondition("")} />
              )}
              {q && <FilterChip label={`Search: "${q}"`} onRemove={() => setQ("")} />}
            </div>

            {isFiltered && (
              <button
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase text-brass hover:text-brass-light transition-colors cursor-pointer py-1"
              >
                <RotateCcw className="size-3" /> Reset Filters
              </button>
            )}
          </div>

          {/* Firearm Grid */}
          {loading && firearms.length === 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <FirearmCardSkeleton key={i} />
              ))}
            </div>
          ) : results.length > 0 ? (
            <div
              data-reveal-group
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8 is-revealed"
            >
              {results.map((f) => (
                <FirearmCard key={f.id} firearm={f} />
              ))}
            </div>
          ) : (
            /* Refined Museum Empty State */
            <div
              data-reveal
              className="mx-auto max-w-2xl border border-brass-border/80 bg-obsidian-2/70 p-8 sm:p-14 text-center backdrop-blur-sm"
            >
              <div className="mx-auto grid size-12 place-items-center rounded-full border border-brass/40 bg-obsidian text-brass">
                <SlidersHorizontal className="size-5" />
              </div>
              <h2 className="mt-5 font-serif text-2xl sm:text-3xl text-ivory">
                No Archival Records Found
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-parchment-dim">
                No cataloged pieces match the currently selected criteria. Broaden your search or
                reset filters to explore the entire archive.
              </p>
              <div className="mt-6 sm:mt-8 flex justify-center">
                <button
                  onClick={resetAll}
                  className="inline-flex items-center gap-2 bg-brass px-6 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase text-obsidian transition-colors hover:bg-brass-light cursor-pointer"
                >
                  <RotateCcw className="size-3.5" /> Reset Archival Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </main >

      {/* MOBILE FILTER DRAWER */}
      {
        mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileFilterOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer Body */}
            <aside
              className="relative z-10 flex h-full w-[min(22rem,90vw)] flex-col border-l border-brass-border bg-elevated px-6 py-6 shadow-2xl overflow-y-auto"
              aria-label="Filters Drawer"
            >
              <div className="flex items-center justify-between border-b border-brass-border/60 pb-4">
                <div>
                  <p className="font-mono text-xs font-medium tracking-[0.2em] uppercase text-brass">
                    ARCHIVAL REGISTER
                  </p>
                  <h2 className="mt-1 font-serif text-2xl text-ivory">Filter Archive</h2>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex size-10 items-center justify-center border border-brass-border text-parchment hover:text-ivory cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-6 flex-1">
                <MobileFilterSection
                  title="Category"
                  selected={category}
                  options={categories}
                  onSelect={(val) => setCategory(category === val ? "" : val)}
                />
                <MobileFilterSection
                  title="Maker"
                  selected={maker}
                  options={makers}
                  onSelect={(val) => setMaker(maker === val ? "" : val)}
                />
                <MobileFilterSection
                  title="Caliber"
                  selected={caliber}
                  options={calibers}
                  onSelect={(val) => setCaliber(caliber === val ? "" : val)}
                />
                <MobileFilterSection
                  title="Condition"
                  selected={condition}
                  options={conditions}
                  onSelect={(val) => setCondition(condition === val ? "" : val)}
                />
              </div>

              {/* Drawer Actions */}
              <div className="mt-8 border-t border-brass-border/60 pt-6 flex flex-col gap-3">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      setCategory("");
                      setMaker("");
                      setCaliber("");
                      setCondition("");
                    }}
                    className="w-full border border-brass-border py-3 font-mono text-xs tracking-[0.2em] uppercase text-parchment-dim hover:text-ivory cursor-pointer"
                  >
                    Clear Selection
                  </button>
                )}
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-brass py-3.5 font-sans text-xs font-semibold tracking-[0.2em] uppercase text-obsidian hover:bg-brass-light transition-colors cursor-pointer"
                >
                  View {results.length} {results.length === 1 ? "Piece" : "Pieces"}
                </button>
              </div>
            </aside>
          </div>
        )
      }
    </div >
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`Filter by ${label}`}
        className={cn(
          "h-10 w-full rounded-none border px-3 text-xs tracking-wider transition-colors cursor-pointer focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass",
          value
            ? "border-brass/80 bg-brass/10 text-brass font-medium"
            : "border-brass-border bg-obsidian-2/80 text-parchment-dim hover:border-brass-border-strong",
        )}
      >
        <option value="">All {label === "Category" ? "Categories" : `${label}s`}</option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-obsidian text-ivory">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-brass-border/80 bg-obsidian-2 px-2.5 py-1 font-mono text-xs text-brass">
      {label}
      <button
        onClick={onRemove}
        className="text-parchment-dim hover:text-ivory p-0.5 ml-0.5 cursor-pointer"
        aria-label={`Remove filter ${label}`}
      >
        <X className="size-3.5" />
      </button>
    </span>
  );
}

function MobileFilterSection({
  title,
  selected,
  options,
  onSelect,
}: {
  title: string;
  selected: string;
  options: string[];
  onSelect: (v: string) => void;
}) {
  return (
    <div>
      <p className="font-mono text-xs font-medium tracking-[0.2em] uppercase text-parchment-dim mb-2.5">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected === opt;
          return (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className={cn(
                "min-h-[38px] border px-3 py-1.5 text-xs transition-colors flex items-center gap-1.5 cursor-pointer",
                isSelected
                  ? "border-brass bg-brass text-obsidian font-semibold"
                  : "border-brass-border bg-obsidian text-parchment hover:border-brass-border-strong",
              )}
            >
              {isSelected && <Check className="size-3.5 text-obsidian stroke-[3]" />}
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
