import { Link } from "@tanstack/react-router";
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
      className={cn("h-full w-full object-cover", className)}
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
        "border bg-obsidian/80 px-2 py-1 text-[0.6rem] tracking-[0.2em] uppercase backdrop-blur",
        sold
          ? "border-parchment-dim/40 text-parchment-dim"
          : hold
            ? "border-brass-dark text-brass-dark"
            : "border-brass text-brass",
      )}
    >
      {status}
    </span>
  );
}

export function FirearmCard({ firearm }: { firearm: Firearm }) {
  return (
    <Link
      to="/collection/$id"
      params={{ id: firearm.id }}
      className="group flex h-full flex-col border border-brass-border bg-card transition-all duration-500 hover:border-brass/60 hover:shadow-vault focus-visible:outline-2 focus-visible:outline-brass"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-obsidian-3">
        <ArchiveImage
          src={firearm.images[0]}
          alt={firearm.name}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 bg-obsidian/80 px-2 py-1 font-mono text-[0.6rem] tracking-[0.2em] text-brass backdrop-blur">
          ACCESSION NO. {accessionNo(firearm.id)}
        </span>
        <div className="absolute right-3 bottom-3">
          <StatusChip status={firearm.status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.62rem] tracking-[0.24em] uppercase text-parchment-dim">{firearm.maker}</p>
        <h3 className="mt-2 font-serif text-xl leading-tight text-ivory transition-colors group-hover:text-brass-light">
          {firearm.name}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {firearm.year && <Chip>{firearm.year}</Chip>}
          {firearm.caliber && <Chip>{firearm.caliber}</Chip>}
          {firearm.condition && <Chip accent>{firearm.condition}</Chip>}
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <span className="text-[0.62rem] tracking-[0.2em] uppercase text-parchment-dim">{firearm.category}</span>
          <span className="font-serif text-lg text-brass">{formatPrice(firearm.price)}</span>
        </div>
      </div>
    </Link>
  );
}

export function Chip({ children, accent }: { children: React.ReactNode; accent?: boolean | undefined }) {
  return (
    <span
      className={cn(
        "border px-2 py-1 text-[0.62rem] tracking-[0.14em] uppercase",
        accent ? "border-brass-dark/70 text-brass-light" : "border-brass-border-strong text-parchment-dim",
      )}
    >
      {children}
    </span>
  );
}
