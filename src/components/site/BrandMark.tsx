import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo.png";

export function BrandMark({
  className,
  large,
  hideText,
}: {
  className?: string;
  large?: boolean;
  hideText?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <img
        src={logoImg}
        alt="Armorer Firearms"
        width={large ? 48 : 36}
        height={large ? 48 : 36}
        className={cn(
          "shrink-0 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:scale-105",
          large ? "h-11 sm:h-12 w-auto" : "h-8.5 sm:h-9 w-auto",
        )}
      />
      {!hideText && (
        <span className="flex min-w-0 items-center">
          <span
            className={cn(
              "font-serif text-ivory tracking-wide truncate",
              large ? "text-2xl sm:text-3xl" : "text-base sm:text-lg",
            )}
          >
            Armorer Firearms
          </span>
        </span>
      )}
    </span>
  );
}
