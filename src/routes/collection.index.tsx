import { createFileRoute } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useFirearms } from "@/hooks/useArchive";
import { FirearmCard } from "@/components/site/FirearmCard";
import { PageIntro } from "@/components/site/Section";

export const Route = createFileRoute("/collection/")({
  head: () => ({
    meta: [
      { title: "The Collection — Armorer Firearms Archive Catalog" },
      { name: "description", content: "Browse the full Armorer Firearms archive: lever actions, revolvers, military arms and fine shotguns, searchable by maker, caliber, condition and era." },
      { property: "og:title", content: "The Collection — Armorer Firearms" },
      { property: "og:description", content: "Search and filter the complete archive catalog of historic firearms." },
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
  const { firearms } = useFirearms();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [maker, setMaker] = useState("");
  const [caliber, setCaliber] = useState("");
  const [condition, setCondition] = useState("");
  const [sort, setSort] = useState<SortKey>("year-asc");

  const opts = (k: "category" | "maker" | "caliber" | "condition") =>
    Array.from(new Set(firearms.map((f) => f[k]).filter(Boolean))).sort();

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = firearms.filter(
      (f) =>
        (!category || f.category === category) &&
        (!maker || f.maker === maker) &&
        (!caliber || f.caliber === caliber) &&
        (!condition || f.condition === condition) &&
        (!needle || [f.name, f.maker, f.model, f.caliber, f.description, f.category].join(" ").toLowerCase().includes(needle)),
    );
    return list.sort((a, b) => {
      switch (sort) {
        case "year-asc": return toNum(a.year) - toNum(b.year);
        case "year-desc": return toNum(b.year) - toNum(a.year);
        case "price-asc": return toNum(a.price) - toNum(b.price);
        case "price-desc": return toNum(b.price) - toNum(a.price);
        default: return a.name.localeCompare(b.name);
      }
    });
  }, [firearms, q, category, maker, caliber, condition, sort]);

  const active = Boolean(q || category || maker || caliber || condition);
  const reset = () => { setQ(""); setCategory(""); setMaker(""); setCaliber(""); setCondition(""); };

  return (
    <>
      <PageIntro
        eyebrow="Archive Catalog"
        title="The Collection"
        text="Every piece is examined, documented and photographed in the atelier. Filter by maker, caliber, or condition, or search the catalog directly."
      />

      <section className="sticky top-18 z-30 border-b border-brass-border bg-obsidian/95 backdrop-blur">
        <div className="mx-auto grid max-w-7xl gap-3 px-5 py-4 sm:px-8 md:grid-cols-[1.6fr_repeat(4,1fr)_1fr]">
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-parchment-dim" />
            <input className="field pl-10" placeholder="Search the archive…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
          </label>
          <Select label="Category" value={category} onChange={setCategory} options={opts("category")} />
          <Select label="Maker" value={maker} onChange={setMaker} options={opts("maker")} />
          <Select label="Caliber" value={caliber} onChange={setCaliber} options={opts("caliber")} />
          <Select label="Condition" value={condition} onChange={setCondition} options={opts("condition")} />
          <select className="field" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort">
            <option value="year-asc">Year · Oldest</option>
            <option value="year-desc">Year · Newest</option>
            <option value="price-asc">Price · Low to High</option>
            <option value="price-desc">Price · High to Low</option>
            <option value="name">Name · A–Z</option>
          </select>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[0.68rem] tracking-[0.24em] uppercase text-parchment-dim">
              <span className="text-brass">{results.length}</span> {results.length === 1 ? "piece" : "pieces"} in view · {firearms.length} in archive
            </p>
            {active && (
              <button onClick={reset} className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.2em] uppercase text-brass hover:text-brass-light">
                <X className="size-3.5" /> Reset filters
              </button>
            )}
          </div>

          {results.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {results.map((f) => <FirearmCard key={f.id} firearm={f} />)}
            </div>
          ) : (
            <div className="border border-brass-border py-24 text-center">
              <p className="font-serif text-2xl text-ivory">No pieces match that search.</p>
              <p className="mt-2 text-sm text-parchment-dim">Try broadening your filters, or contact the atelier for pieces not yet cataloged.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select className="field" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
      <option value="">All {label === "Category" ? "Categories" : label + "s"}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
