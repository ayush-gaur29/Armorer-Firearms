import { cn } from "@/lib/utils";

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
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 font-serif text-3xl leading-[1.1] text-ivory sm:text-4xl lg:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-base leading-relaxed text-parchment-dim">{text}</p>}
    </div>
  );
}

export function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string | undefined }) {
  return (
    <section className="relative border-b border-brass-border pt-36 pb-16 sm:pt-44 sm:pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow={eyebrow} title={title} text={text} className="max-w-3xl" />
      </div>
    </section>
  );
}
