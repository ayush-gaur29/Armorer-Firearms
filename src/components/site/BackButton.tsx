import { useRouter, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  fallbackTo?: string;
  label?: string;
  className?: string;
}

export function BackButton({
  fallbackTo = "/",
  label = "Back",
  className,
}: BackButtonProps) {
  const router = useRouter();
  const navigate = useNavigate();

  const handleBack = () => {
    // Check if router has internal history in the current session
    if (typeof window !== "undefined" && router.history.canGoBack()) {
      router.history.back();
    } else {
      navigate({ to: fallbackTo as string });
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label={label}
      className={cn(
        "group inline-flex items-center gap-2 px-3.5 py-2 min-h-[38px] text-xs font-mono tracking-[0.18em] uppercase text-parchment-dim transition-all duration-300 hover:text-brass focus-visible:outline-2 focus-visible:outline-brass focus-visible:outline-offset-2 border border-brass-border/60 hover:border-brass/50 bg-obsidian-2/80 hover:bg-obsidian-2 backdrop-blur-sm cursor-pointer active:scale-[0.98]",
        className,
      )}
    >
      <ArrowLeft className="size-3.5 text-brass transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden />
      <span>{label}</span>
    </button>
  );
}
