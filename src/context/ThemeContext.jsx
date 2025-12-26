/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEYS = {
  mode: "sv_theme_mode", // auto | light | dark
  accent: "sv_theme_accent", // ocean | forest | steel | amber
};

const DEFAULTS = {
  mode: "auto",
  accent: "ocean",
};

const getSystemTheme = () => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(DEFAULTS.mode);
  const [accent, setAccent] = useState(DEFAULTS.accent);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const storedMode = localStorage.getItem(STORAGE_KEYS.mode);
      const storedAccent = localStorage.getItem(STORAGE_KEYS.accent);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (storedMode) setMode(storedMode);
      if (storedAccent) setAccent(storedAccent);
    } catch {
      // ignore
    }
  }, []);

  // apply to <html>
  useEffect(() => {
    const root = document.documentElement;

    const apply = () => {
      const resolved = mode === "auto" ? getSystemTheme() : mode;
      root.dataset.theme = resolved;
      root.dataset.accent = accent;
      root.style.colorScheme = resolved;
    };

    apply();

    // if auto, keep in sync with system
    if (mode === "auto" && window.matchMedia) {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = () => apply();
      if (mql.addEventListener) mql.addEventListener("change", onChange);
      else mql.addListener(onChange);

      return () => {
        if (mql.removeEventListener) mql.removeEventListener("change", onChange);
        else mql.removeListener(onChange);
      };
    }
  }, [mode, accent]);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.mode, mode);
      localStorage.setItem(STORAGE_KEYS.accent, accent);
    } catch {
      // ignore
    }
  }, [mode, accent]);

  const value = useMemo(
    () => ({
      mode,
      accent,
      setMode,
      setAccent,
      palettes: [
        { id: "ocean", label: "Ocean" },
        { id: "forest", label: "Forest" },
        { id: "steel", label: "Steel" },
        { id: "amber", label: "Amber" },
      ],
      modes: [
        { id: "auto", label: "Auto" },
        { id: "light", label: "Light" },
        { id: "dark", label: "Dark" },
      ],
    }),
    [mode, accent]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
