"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  messages,
  supportedLocales,
  type Locale,
  type Messages,
} from "./messages";

const STORAGE_KEY = "oasfuse-locale";

interface I18nContextValue {
  locale: Locale;
  setLocale(locale: Locale): void;
  messages: Messages;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function resolveLocale(value?: string | null): Locale {
  if (value && supportedLocales.includes(value as Locale))
    return value as Locale;
  if (value?.toLowerCase().startsWith("pt")) return "pt-BR";
  if (value?.toLowerCase().startsWith("es")) return "es-ES";
  return "en-US";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en-US");

  useEffect(() => {
    const detected = resolveLocale(
      window.localStorage.getItem(STORAGE_KEY) ?? navigator.language,
    );
    const timer = window.setTimeout(() => setLocaleState(detected), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      messages: messages[locale],
      setLocale(nextLocale) {
        window.localStorage.setItem(STORAGE_KEY, nextLocale);
        setLocaleState(nextLocale);
      },
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
