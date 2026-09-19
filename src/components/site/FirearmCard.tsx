import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { formatPrice, accessionNo, PLACEHOLDER_IMAGE, type Firearm } from "@/lib/fallbacks";
import { cn } from "@/lib/utils";

export function ArchiveImage({
  src,
  alt,
  className,
  eager,
  contain = false,
}: {
  src?: string | undefined;
  alt: string;
  className?: string;
  eager?: boolean;
  contain?: boolean;
}) {
  return (
    <img
      src={src || PLACEHOLDER_IMAGE}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      width={1200}
      height={900}
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src !== PLACEHOLDER_IMAGE && !img.src.endsWith(PLACEHOLDER_IMAGE)) img.src = PLACEHOLDER_IMAGE;
      }}
      className={cn(
        "h-full w-full transition-all duration-500 ease-out",
        contain ? "object-contain" : "object-cover",
        className,
      )}
    />
  );
}

/**
 * Status chips removed per requirement:
 * No firearm availability status is displayed on the Collection or Product Detail UI.
 */
export function StatusChip({ status: _status }: { status?: string | undefined }) {
  return null;
}

export function Chip({ children, accent }: { children: React.ReactNode; accent?: boolean | undefined }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 font-mono text-[0.68rem] sm:text-xs font-medium tracking-[0.12em] uppercase",
        accent
          ? "border-brass-dark/70 text-brass-light bg-brass/10"
          : "border-brass-border bg-obsidian-2/80 text-parchment-dim",
      )}
    >
      {children}
    </span>
  );
}

export function FirearmCard({ firearm }: { firearm: Firearm }) {
  return (
    <Link
      to="/collection/$id"
      params={{ id: firearm.id }}
      className="group flex h-full flex-col border border-brass-border/70 bg-[#16181B] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brass/50 hover:bg-[#1A1D21] hover:shadow-vault focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass"
    >
      {/* Museum Archive Photography Presentation */}
      <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-obsidian-3 via-obsidian-2 to-obsidian border-b border-brass-border/60 flex items-center justify-center p-3 sm:p-4">
        <ArchiveImage
          src={firearm.images[0]}
          alt={firearm.name}
          contain
          className="h-full w-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.14)] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        {/* Subtle border vignette for depth */}
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.06)]" />
        <span className="absolute top-3 left-3 border border-brass-border/50 bg-obsidian/90 px-2 py-0.5 font-mono text-[0.72rem] tracking-[0.16em] text-brass backdrop-blur-md whitespace-nowrap">
          Item # {accessionNo(firearm.id)}
        </span>
      </div>

      {/* Catalog Entry Dossier */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Eyebrow: Maker & Category */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-brass truncate">
            {firearm.maker || "Armorer Archive"}
          </span>
          <span className="text-xs font-mono tracking-[0.14em] uppercase text-parchment-dim shrink-0">
            {firearm.category}
          </span>
        </div>

        {/* Single-line Brief Title/Description */}
        <h3
          className="mt-2 font-serif text-lg sm:text-xl text-ivory tracking-tight truncate transition-colors duration-300 group-hover:text-brass-light"
          title={firearm.name}
        >
          {firearm.name}
        </h3>

        {/* Specification chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {firearm.caliber && <Chip>{firearm.caliber}</Chip>}
          {firearm.condition && <Chip accent>{firearm.condition}</Chip>}
          {firearm.year && <Chip>{firearm.year}</Chip>}
        </div>

        {/* Footer: Price & Examine Action */}
        <div className="mt-auto border-t border-brass-border/40 pt-4 mt-5 flex items-center justify-between gap-3">
          <span className="font-sans font-semibold text-lg sm:text-xl text-brass tracking-tight">
            {formatPrice(firearm.price)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.16em] uppercase text-parchment-dim transition-colors duration-300 group-hover:text-brass group-hover:translate-x-0.5">
            Examine Piece <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function FirearmCardSkeleton() {
  return (
    <div className="flex h-full flex-col border border-brass-border/40 bg-[#16181B]/80 animate-pulse">
      <div className="aspect-[16/10] sm:aspect-[4/3] w-full bg-obsidian-3" />
      <div className="flex flex-1 flex-col p-5 space-y-4">
        <div className="flex justify-between">
          <div className="h-3 w-1/3 bg-obsidian-2 rounded" />
          <div className="h-3 w-1/4 bg-obsidian-2 rounded" />
        </div>
        <div className="h-6 w-3/4 bg-obsidian-2 rounded" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-obsidian-2 rounded" />
          <div className="h-5 w-16 bg-obsidian-2 rounded" />
        </div>
        <div className="mt-auto pt-4 border-t border-brass-border/30 flex justify-between items-center">
          <div className="h-5 w-20 bg-obsidian-2 rounded" />
          <div className="h-4 w-24 bg-obsidian-2 rounded" />
        </div>
      </div>
    </div>
  );
}
