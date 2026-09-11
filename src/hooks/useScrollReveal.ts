import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

export function useScrollReveal() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-reveal], [data-reveal-group], [data-reveal-image]").forEach((el) => {
        el.classList.add("is-revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    const observeElements = () => {
      const elements = document.querySelectorAll(
        "[data-reveal]:not(.is-revealed), [data-reveal-group]:not(.is-revealed), [data-reveal-image]:not(.is-revealed)",
      );
      elements.forEach((el) => observer.observe(el));
    };

    observeElements();

    // Re-check after short delay for dynamically rendered cards/content
    const timer = setTimeout(observeElements, 250);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname]);
}
