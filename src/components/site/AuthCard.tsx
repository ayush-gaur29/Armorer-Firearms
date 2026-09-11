import type { ReactNode } from "react";
import { BrandMark } from "./BrandMark";
import { BackButton } from "./BackButton";

export function AuthCard({
  eyebrow,
  title,
  children,
  footer,
  backTo = "/",
  backLabel = "Back",
  showBack = true,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode | undefined;
  backTo?: string;
  backLabel?: string;
  showBack?: boolean;
}) {
  return (
    <section className="grain relative flex min-h-[100svh] items-center justify-center px-5 pt-28 pb-16">
      <div className="relative w-full max-w-md border border-brass-border bg-obsidian-2 p-8 shadow-vault sm:p-10">
        <div className="absolute -top-px left-8 right-8 h-px bg-brass" />
        <div className="flex items-center justify-between gap-4">
          <BrandMark />
          {showBack && <BackButton fallbackTo={backTo} label={backLabel} />}
        </div>
        <p className="eyebrow mt-8">{eyebrow}</p>
        <h1 className="mt-3 font-serif text-3xl text-ivory">{title}</h1>
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-8 border-t border-brass-border pt-6 text-sm text-parchment-dim">{footer}</div>}
      </div>
    </section>
  );
}

export function AuthField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.62rem] tracking-[0.22em] uppercase text-parchment-dim">{label}</span>
      <input className="field" {...props} />
    </label>
  );
}

export function AuthButton({ children, busy }: { children: ReactNode; busy?: boolean | undefined }) {
  return (
    <button type="submit" disabled={busy} className="w-full bg-brass py-3.5 text-[0.72rem] tracking-[0.24em] uppercase text-obsidian transition-colors hover:bg-brass-light disabled:opacity-60">
      {busy ? "Please wait…" : children}
    </button>
  );
}
