import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFirearm, useFirearms } from "@/hooks/useArchive";
import { accessionNo, formatPrice } from "@/lib/fallbacks";
import { ArchiveImage, Chip, FirearmCard, StatusChip } from "@/components/site/FirearmCard";
import { InquiryForm } from "@/components/site/InquiryForm";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/collection/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Accession ${accessionNo(params.id)} — Armorer Firearms Archive` },
      { name: "description", content: "Archival dossier: maker, year of manufacture, caliber, condition grade and historical provenance for this piece in the Armorer Firearms collection." },
      { property: "og:title", content: `Accession ${accessionNo(params.id)} — Armorer Firearms` },
      { property: "og:description", content: "Full archival dossier and provenance for a piece in the Armorer Firearms private collection." },
    ],
  }),
  component: DetailPage,
});

function DetailPage() {
  const { id } = Route.useParams();
  const { firearm, loading } = useFirearm(id);
  const { firearms } = useFirearms();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => setActive(0), [id]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!firearm) {
    return (
      <section className="mx-auto max-w-7xl px-5 pt-40 pb-32 text-center sm:px-8">
        {loading && firearm === undefined ? (
          <p className="eyebrow animate-pulse">Retrieving dossier…</p>
        ) : (
          <>
            <p className="eyebrow">Accession not found</p>
            <h1 className="mt-4 font-serif text-4xl text-ivory">This piece is no longer in the archive.</h1>
            <Link to="/collection" className="mt-8 inline-flex items-center gap-2 text-[0.72rem] tracking-[0.22em] uppercase text-brass">
              <ArrowLeft className="size-4" /> Return to the collection
            </Link>
          </>
        )}
      </section>
    );
  }

  const related = firearms.filter((f) => f.id !== firearm.id && f.category === firearm.category).slice(0, 3);
  const dossier: [string, string][] = [
    ["Maker", firearm.maker],
    ["Model", firearm.model],
    ["Year of Manufacture", String(firearm.year)],
    ["Serial / Accession No.", `${firearm.serial ? firearm.serial + " · " : ""}${accessionNo(firearm.id)}`],
    ["Caliber", firearm.caliber],
    ["Condition Grade", firearm.condition],
    ["Category", firearm.category],
    ["Status", firearm.status ?? "Available"],
  ];

  return (
    <>
      <section className="pt-28 sm:pt-36">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Link to="/collection" className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.22em] uppercase text-parchment-dim hover:text-brass">
            <ArrowLeft className="size-4" /> Collection
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-12">
            {/* Gallery */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/3] overflow-hidden border border-brass-border bg-obsidian-3">
                <ArchiveImage key={firearm.images[active]} src={firearm.images[active]} alt={firearm.name} eager className="animate-in fade-in duration-500" />
                <span className="absolute top-4 left-4 bg-obsidian/80 px-2.5 py-1.5 font-mono text-[0.62rem] tracking-[0.2em] text-brass backdrop-blur">
                  ACCESSION NO. {accessionNo(firearm.id)}
                </span>
              </div>
              {firearm.images.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
                  {firearm.images.map((src, i) => (
                    <button
                      key={src + i}
                      onClick={() => setActive(i)}
                      aria-label={`View image ${i + 1}`}
                      className={cn("aspect-[4/3] overflow-hidden border transition-colors", i === active ? "border-brass" : "border-brass-border hover:border-brass-dark")}
                    >
                      <ArchiveImage src={src} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dossier */}
            <div className="lg:col-span-5">
              <p className="text-[0.62rem] tracking-[0.26em] uppercase text-parchment-dim">{firearm.maker}</p>
              <h1 className="mt-3 font-serif text-3xl leading-tight text-ivory sm:text-4xl xl:text-5xl">{firearm.name}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Chip>{firearm.year}</Chip>
                <Chip>{firearm.caliber}</Chip>
                <Chip accent>{firearm.condition}</Chip>
                <StatusChip status={firearm.status} />
              </div>
              <p className="mt-8 font-serif text-3xl text-brass">{formatPrice(firearm.price)}</p>
              <p className="mt-6 leading-relaxed text-parchment-dim">{firearm.description}</p>

              <button
                onClick={() => setOpen(true)}
                className="mt-8 w-full bg-brass px-8 py-4 text-[0.72rem] tracking-[0.24em] uppercase text-obsidian transition-colors hover:bg-brass-light sm:w-auto"
              >
                Inquire on This Piece
              </button>

              <div className="mt-10 border-t border-brass-border">
                <p className="eyebrow pt-6">Archival Dossier</p>
                <dl className="mt-4 divide-y divide-brass-border">
                  {dossier.filter(([, v]) => v).map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-4 py-3 text-sm">
                      <dt className="text-[0.62rem] tracking-[0.2em] uppercase text-parchment-dim self-center">{k}</dt>
                      <dd className="text-parchment break-words">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          {firearm.history && (
            <div className="mt-20 grid gap-8 border-y border-brass-border py-14 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="eyebrow">Historical Provenance</p>
                <h2 className="mt-3 font-serif text-3xl text-ivory">Chain of custody &amp; narrative</h2>
              </div>
              <p className="text-lg leading-relaxed text-parchment-dim lg:col-span-7 lg:col-start-6 font-serif italic">{firearm.history}</p>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="eyebrow">Related Pieces</p>
            <h2 className="mt-3 font-serif text-3xl text-ivory">More from {firearm.category}</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((f) => <FirearmCard key={f.id} firearm={f} />)}
            </div>
          </div>
        </section>
      )}

      {/* Inquiry modal */}
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-obsidian/80 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="Inquire on this piece">
          <div className="max-h-[92svh] w-full max-w-2xl overflow-y-auto border border-brass-border bg-obsidian-2 p-6 shadow-vault animate-in slide-in-from-bottom-4 fade-in duration-300 sm:p-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Private Acquisition Inquiry</p>
                <h2 className="mt-2 font-serif text-2xl text-ivory sm:text-3xl">{firearm.name}</h2>
                <p className="mt-1 font-mono text-[0.62rem] tracking-[0.2em] text-brass-dark">ACCESSION NO. {accessionNo(firearm.id)}</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="grid size-9 shrink-0 place-items-center text-parchment-dim hover:text-brass">
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-8">
              <InquiryForm firearmName={firearm.name} firearmId={firearm.id} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
