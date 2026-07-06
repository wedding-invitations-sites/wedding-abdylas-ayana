import { useCallback, useEffect, useMemo, useState } from "react";
import en from "./en";
import ru from "./ru";
import kg from "./kg";
import { weddingConfig } from "../config/wedding.config";
import { LangContext } from "./LangContext";

const dictionaries = { en, ru, kg };
const STORAGE_KEY = "wedding-lang";

function detectInitialLocale() {
  if (typeof window === "undefined") return weddingConfig.defaultLocale;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && weddingConfig.availableLocales.includes(stored)) return stored;
  const browser = (navigator.language || "").slice(0, 2).toLowerCase();
  if (weddingConfig.availableLocales.includes(browser)) return browser;
  return weddingConfig.defaultLocale;
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLocale);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    if (weddingConfig.availableLocales.includes(next)) setLangState(next);
  }, []);

  const t = useCallback(
    (path) => {
      const parts = path.split(".");
      let node = dictionaries[lang];
      for (const p of parts) {
        if (node == null) return path;
        node = node[p];
      }
      return node ?? path;
    },
    [lang]
  );

  const localize = useCallback(
    (value) => {
      if (value == null) return "";
      if (typeof value === "string") return value;
      if (typeof value === "object") {
        return value[lang] ?? value[weddingConfig.defaultLocale] ?? "";
      }
      return String(value);
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, t, localize, locales: weddingConfig.availableLocales }),
    [lang, setLang, t, localize]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
