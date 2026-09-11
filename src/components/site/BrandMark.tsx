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
    <span className={cn("flex items-center gap-2.5 sm:gap-3", className)}>
      <img
        src={logoImg}
        alt="Armorer Firearms"
        width={large ? 48 : 36}
        height={large ? 48 : 36}
        className={cn(
          "shrink-0 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:scale-105",
          large ? "h-10 sm:h-12 w-auto" : "h-7.5 sm:h-8.5 md:h-9 w-auto",
        )}
      />
      {!hideText && (
        <span className="flex min-w-0 items-center">
          <span
            className={cn(
              "font-serif text-ivory tracking-wide truncate",
              large ? "text-xl sm:text-2xl md:text-3xl" : "text-sm sm:text-base md:text-lg",
            )}
          >
            Armorer Firearms
          </span>
        </span>
      )}
    </span>
  );
}
