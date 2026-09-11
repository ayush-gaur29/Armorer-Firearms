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
        "group inline-flex items-center gap-2.5 px-3 py-2 text-[0.68rem] tracking-[0.22em] uppercase text-parchment-dim transition-all duration-300 hover:text-brass focus-visible:outline-2 focus-visible:outline-brass focus-visible:outline-offset-2 border border-brass-border/40 hover:border-brass/50 bg-obsidian-2/60 hover:bg-obsidian-2 backdrop-blur-sm cursor-pointer",
        className,
      )}
    >
      <ArrowLeft className="size-3.5 text-brass transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden />
      <span>{label}</span>
    </button>
  );
}
