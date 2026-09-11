import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { accessionNo, formatPrice, PLACEHOLDER_IMAGE, type Firearm } from "@/lib/fallbacks";
import { cn } from "@/lib/utils";

export function ArchiveImage({
  src,
  alt,
  className,
  eager,
}: {
  src?: string | undefined;
  alt: string;
  className?: string;
  eager?: boolean;
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
      className={cn("h-full w-full object-cover transition-all duration-700 ease-out", className)}
    />
  );
}

export function StatusChip({ status }: { status?: string | undefined }) {
  if (!status) return null;
  const sold = /sold/i.test(status);
  const hold = /hold|reserved/i.test(status);
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 font-mono text-[0.68rem] sm:text-xs font-semibold tracking-[0.16em] uppercase backdrop-blur-md",
        sold
          ? "border-parchment-dim/30 bg-obsidian/90 text-parchment-dim"
          : hold
            ? "border-[#C98A4B]/70 bg-obsidian/90 text-[#E0A266]"
            : "border-brass/80 bg-obsidian/90 text-brass",
      )}
    >
      {status}
    </span>
  );
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
      {/* Museum catalog plate image frame */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-obsidian-3">
        <ArchiveImage
          src={firearm.images[0]}
          alt={firearm.name}
          className="group-hover:scale-[1.03] group-hover:brightness-[1.04]"
        />
        {/* Subtle cinematic gradient overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-obsidian/60 to-transparent" />

        {/* Accession tag */}
        <span className="absolute top-3 left-3 border border-brass-border/60 bg-obsidian/95 px-2.5 py-1 font-mono text-[0.65rem] sm:text-xs tracking-[0.16em] text-brass backdrop-blur-md">
          ACCESSION NO. {accessionNo(firearm.id)}
        </span>

        {/* Status chip */}
        <div className="absolute right-3 top-3">
          <StatusChip status={firearm.status} />
        </div>
      </div>

      {/* Catalog Entry Dossier */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
        {/* Eyebrow: Maker & Category */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-brass">
            {firearm.maker || "Armorer Archive"}
          </span>
          <span className="text-xs font-mono tracking-[0.14em] uppercase text-parchment-dim">
            {firearm.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-2.5 font-serif text-lg sm:text-xl leading-snug text-ivory tracking-tight transition-colors duration-300 group-hover:text-brass-light">
          {firearm.name}
        </h3>

        {/* Specification chips */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {firearm.caliber && <Chip>{firearm.caliber}</Chip>}
          {firearm.condition && <Chip accent>{firearm.condition}</Chip>}
          {firearm.year && <Chip>{firearm.year}</Chip>}
        </div>

        {/* Archival description snippet */}
        {firearm.description && (
          <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-parchment-dim/80 line-clamp-2">
            {firearm.description}
          </p>
        )}

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
      <div className="aspect-[4/3] w-full bg-obsidian-3/80" />
      <div className="flex flex-1 flex-col p-5 sm:p-6 space-y-4">
        <div className="flex justify-between">
          <div className="h-3 w-1/3 bg-obsidian-2 rounded" />
          <div className="h-3 w-1/4 bg-obsidian-2 rounded" />
        </div>
        <div className="h-6 w-3/4 bg-obsidian-2 rounded" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-obsidian-2 rounded" />
          <div className="h-5 w-16 bg-obsidian-2 rounded" />
        </div>
        <div className="h-8 w-full bg-obsidian-2/50 rounded" />
        <div className="mt-auto pt-4 border-t border-brass-border/30 flex justify-between items-center">
          <div className="h-5 w-20 bg-obsidian-2 rounded" />
          <div className="h-4 w-24 bg-obsidian-2 rounded" />
        </div>
      </div>
    </div>
  );
}
