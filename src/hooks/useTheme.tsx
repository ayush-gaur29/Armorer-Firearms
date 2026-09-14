import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("armorer-theme") as Theme | null;
      if (stored === "light" || stored === "dark") return stored;
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
    try {
      localStorage.setItem("armorer-theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  const [localTheme, setLocalTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("armorer-theme") as Theme | null;
      if (stored === "light" || stored === "dark") return stored;
      if (document.documentElement.classList.contains("light")) return "light";
    }
    return "dark";
  });

  if (ctx) {
    return ctx;
  }

  const toggleLocalTheme = () => {
    const next = localTheme === "dark" ? "light" : "dark";
    setLocalTheme(next);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (next === "light") {
        root.classList.add("light");
        root.classList.remove("dark");
      } else {
        root.classList.add("dark");
        root.classList.remove("light");
      }
      try {
        localStorage.setItem("armorer-theme", next);
      } catch {
        // ignore
      }
    }
  };

  const setExplicitTheme = (t: Theme) => {
    setLocalTheme(t);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (t === "light") {
        root.classList.add("light");
        root.classList.remove("dark");
      } else {
        root.classList.add("dark");
        root.classList.remove("light");
      }
      try {
        localStorage.setItem("armorer-theme", t);
      } catch {
        // ignore
      }
    }
  };

  return {
    theme: localTheme,
    toggleTheme: toggleLocalTheme,
    setTheme: setExplicitTheme,
  };
}
