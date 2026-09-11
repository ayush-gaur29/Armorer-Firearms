import { cn } from "@/lib/utils";

export function BrandMark({ className, large }: { className?: string; large?: boolean }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span
        aria-hidden
        className={cn(
          "grid shrink-0 place-items-center border border-brass font-serif text-brass",
          large ? "size-14 text-2xl" : "size-9 text-base",
        )}
      >
        A
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className={cn("font-serif text-ivory tracking-wide truncate", large ? "text-3xl" : "text-lg")}>
          Armorer Firearms
        </span>
        <span className="mt-1 text-[0.58rem] tracking-[0.32em] uppercase text-brass-dark">Private Archive · MT</span>
      </span>
    </span>
  );
}
