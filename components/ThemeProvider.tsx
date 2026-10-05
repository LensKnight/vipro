"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemePref = "system" | "light" | "dark";

const Ctx = createContext<{ pref: ThemePref; setPref: (p: ThemePref) => void } | null>(null);

export const useTheme = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useTheme must be used inside ThemeProvider");
  return c;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>("system");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as ThemePref | null;
    if (saved) setPrefState(saved);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const t = pref === "system" ? (mq.matches ? "dark" : "light") : pref;
      document.documentElement.dataset.theme = t;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [pref]);

  const setPref = (p: ThemePref) => {
    localStorage.setItem("theme", p);
    setPrefState(p);
  };

  return <Ctx.Provider value={{ pref, setPref }}>{children}</Ctx.Provider>;
}