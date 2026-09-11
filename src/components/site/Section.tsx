import { cn } from "@/lib/utils";
import { BackButton } from "./BackButton";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  text?: string | undefined;
  align?: "left" | "center";
  className?: string | undefined;
}) {
  return (
    <div data-reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 font-serif text-3xl leading-[1.15] text-ivory sm:text-4xl lg:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-base leading-relaxed text-parchment-dim">{text}</p>}
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  text,
  showBack = true,
  backTo = "/",
  backLabel = "Back",
}: {
  eyebrow: string;
  title: string;
  text?: string | undefined;
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
}) {
  return (
    <section className="relative border-b border-brass-border bg-obsidian-2 pt-28 pb-14 sm:pt-36 sm:pb-18">
      <div className="mx-auto max-w-7xl px-5 sm:px-8" data-reveal>
        {showBack && (
          <div className="mb-8">
            <BackButton fallbackTo={backTo} label={backLabel} />
          </div>
        )}
        <SectionHeading eyebrow={eyebrow} title={title} text={text} className="max-w-3xl" />
      </div>
    </section>
  );
}
