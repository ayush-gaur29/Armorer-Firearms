import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ShoppingBag, Edit3, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useFirearm, useFirearms } from "@/hooks/useArchive";
import { accessionNo, formatPrice } from "@/lib/fallbacks";
import { ArchiveImage, Chip, FirearmCard } from "@/components/site/FirearmCard";
import { BackButton } from "@/components/site/BackButton";
import { useCart } from "@/hooks/useCart";
import { FirearmContentEditor } from "@/components/site/FirearmContentEditor";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/collection/$id")({
  head: () => ({
    meta: [
      { title: "Armorer Firearms" },
      {
        name: "description",
        content:
          "Historical provenance and specifications for this piece in the Armorer Firearms private collection.",
      },
      { property: "og:title", content: "Armorer Firearms" },
      {
        property: "og:description",
        content:
          "Full provenance and archival photography for a piece in the Armorer Firearms collection.",
      },
    ],
  }),
  component: DetailPage,
});

function DetailPage() {
  const { id } = Route.useParams();
  const { firearm, loading } = useFirearm(id);
  const { firearms } = useFirearms();
  const { addItem, isInCart, openCart } = useCart();
  const [active, setActive] = useState(0);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => setActive(0), [id]);

  if (!firearm) {
    return (
      <section className="mx-auto max-w-7xl px-5 pt-40 pb-32 text-center sm:px-8">
        {loading && firearm === undefined ? (
          <p className="eyebrow animate-pulse">Retrieving piece…</p>
        ) : (
          <>
            <p className="eyebrow">Accession not found</p>
            <h1 className="mt-4 font-serif text-4xl text-ivory">This piece is no longer in the archive.</h1>
            <Link
              to="/collection"
              className="mt-8 inline-flex items-center gap-2 text-[0.72rem] tracking-[0.22em] uppercase font-medium text-brass"
            >
              <ArrowLeft className="size-4" /> Return to the collection
            </Link>
          </>
        )}
      </section>
    );
  }

  const inCart = isInCart(firearm.id);

  const handleCartClick = () => {
    if (inCart) {
      openCart();
    } else {
      addItem(firearm);
    }
  };

  return (
    <>
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Navigation Bar: Back to Collection & Breadcrumb */}
          <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <BackButton fallbackTo="/collection" label="Back to Collection" />
              <span className="text-brass-border/80">/</span>
              <Link
                to="/collection"
                className="font-mono text-xs tracking-wider uppercase text-parchment-dim hover:text-brass transition-colors"
              >
                Collection
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setEditorOpen(true)}
              className="inline-flex items-center gap-2 border border-brass-border/70 bg-obsidian-2 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-brass hover:border-brass hover:text-brass-light transition-colors cursor-pointer"
              title="Configure firearm content and invoice charges in Firestore"
            >
              <Edit3 className="size-3.5" />
              <span>Edit Record</span>
            </button>
          </div>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12" data-reveal>
            {/* Gallery */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden border border-brass-border bg-gradient-to-b from-[#FAF8F5] via-[#F2EFE9] to-[#E5E0D8] p-4 sm:p-6 flex items-center justify-center shadow-vault">
                <ArchiveImage
                  key={firearm.images[active]}
                  src={firearm.images[active]}
                  alt={firearm.name}
                  eager
                  contain
                  className="animate-in fade-in duration-500 h-full w-full object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.16)]"
                />
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-obsidian/95 px-2.5 py-1 font-mono text-xs tracking-[0.16em] text-brass backdrop-blur border border-brass-border/40 shadow-sm">
                  ITEM # {accessionNo(firearm.id)}
                </span>
              </div>

              {/* Thumbnails */}
              {firearm.images.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-3">
                  {firearm.images.map((src, i) => (
                    <button
                      key={src + i}
                      onClick={() => setActive(i)}
                      aria-label={`View image ${i + 1}`}
                      className={cn(
                        "aspect-[4/3] overflow-hidden border transition-colors cursor-pointer bg-obsidian-3 min-h-[44px]",
                        i === active ? "border-brass ring-1 ring-brass" : "border-brass-border hover:border-brass-dark",
                      )}
                    >
                      <ArchiveImage src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information Panel */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              <p className="text-xs font-medium tracking-[0.24em] uppercase text-brass">{firearm.maker}</p>
              <h1 className="mt-2.5 font-serif text-2xl sm:text-4xl lg:text-5xl leading-tight text-ivory tracking-tight">
                {firearm.name}
              </h1>

              {/* Specification Chips (no status badges) */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {firearm.year && <Chip>{firearm.year}</Chip>}
                {firearm.caliber && <Chip>{firearm.caliber}</Chip>}
                {firearm.condition && <Chip accent>{firearm.condition}</Chip>}
                {firearm.category && <Chip>{firearm.category}</Chip>}
              </div>

              {/* Price Section — preserved design */}
              <p className="mt-6 font-sans font-semibold text-2xl sm:text-3xl text-brass">
                {formatPrice(firearm.price)}
              </p>

              {/* Firearm Description - Expandable based on content */}
              {firearm.description && (
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-parchment-dim whitespace-pre-line break-words">
                  {firearm.description}
                </p>
              )}

              {/* Primary Call-to-Actions: Add to Cart + Contact Armorer */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  type="button"
                  onClick={handleCartClick}
                  suppressHydrationWarning
                  className={cn(
                    "flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 font-mono text-xs tracking-[0.22em] uppercase font-semibold transition-all cursor-pointer active:scale-[0.99]",
                    inCart
                      ? "bg-brass/20 border border-brass text-brass hover:bg-brass/30"
                      : "bg-brass text-obsidian hover:bg-brass-light hover:shadow-lg",
                  )}
                >
                  {inCart ? (
                    <>
                      <Check className="size-4 text-brass" />
                      <span>In Cart · View Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="size-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-3 border border-brass-border/80 bg-obsidian-2/80 px-7 py-4 font-mono text-xs tracking-[0.22em] uppercase font-medium text-parchment transition-colors hover:border-brass hover:text-brass"
                >
                  <span>Contact the Armorer</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* LOWER CONTENT AREA — HISTORICAL PROVENANCE & EDITABLE CONTENT */}
          {firearm.history && (
            <div
              className="mt-14 sm:mt-20 border-y border-brass-border py-10 sm:py-14"
              data-reveal
            >
              <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-start">
                <div className="lg:col-span-4">
                  <p className="eyebrow">Archival Record</p>
                  <h2 className="mt-2 sm:mt-3 font-serif text-2xl sm:text-3xl text-ivory">
                    Historical Provenance
                  </h2>
                </div>
                <div className="lg:col-span-7 lg:col-start-6 space-y-4">
                  <p className="text-base sm:text-lg leading-relaxed text-parchment font-serif italic">
                    {firearm.history}
                  </p>

                  {/* Optional Additional Lower Content / Curatorial Notes */}
                  {firearm.notes && (
                    <div className="mt-6 border-t border-brass-border/40 pt-4">
                      <p className="font-mono text-xs uppercase tracking-wider text-brass mb-2">
                        Curatorial Notes
                      </p>
                      <p className="text-sm leading-relaxed text-parchment-dim">
                        {firearm.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Armorer Content Editor Modal */}
      <FirearmContentEditor
        firearm={firearm}
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
      />
    </>
  );
}
