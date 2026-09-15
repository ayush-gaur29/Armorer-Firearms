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
        threshold: 0.02,
        rootMargin: "0px 0px 80px 0px",
      },
    );

    const observeElements = () => {
      const elements = document.querySelectorAll(
        "[data-reveal]:not(.is-revealed), [data-reveal-group]:not(.is-revealed), [data-reveal-image]:not(.is-revealed)",
      );
      elements.forEach((el) => {
        observer.observe(el);
        // Immediate viewport check so elements already visible in or near the viewport reveal without waiting
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
          el.classList.add("is-revealed");
          observer.unobserve(el);
        }
      });
    };

    // Defer the first observeElements call with requestAnimationFrame so it
    // runs strictly after React has finished hydrating the server-rendered HTML.
    // Calling it synchronously inside useEffect can race with hydration and
    // cause a className mismatch (server: no class, client: "is-revealed").
    let rafId = requestAnimationFrame(observeElements);

    // Setup MutationObserver so dynamically injected elements (e.g. Firebase async data, filters, dynamic cards)
    // are automatically observed and revealed as soon as they are added to the DOM
    let mutationObserver: MutationObserver | null = null;
    if (typeof MutationObserver !== "undefined") {
      mutationObserver = new MutationObserver(() => {
        observeElements();
      });
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    // Multi-stage backup timers for any late-arriving network responses or animations
    const t1 = setTimeout(observeElements, 200);
    const t2 = setTimeout(observeElements, 600);
    const t3 = setTimeout(observeElements, 1500);
    const t4 = setTimeout(observeElements, 3000);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      if (mutationObserver) mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [pathname]);
}

