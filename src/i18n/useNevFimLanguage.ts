"use client";

import { useCallback, useEffect, useState } from "react";

import type { Language } from "@/i18n/translations";

const STORAGE_KEY = "nevfim-language";
const EVENT_NAME = "nevfim-language-change";

function isLanguage(value: string | null): value is Language {
  return value === "ru" || value === "cs" || value === "en";
}

function languageFromCookie(): Language | null {
  if (typeof document === "undefined") return null;

  const value = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${STORAGE_KEY}=`))
    ?.split("=")[1];

  return isLanguage(value ?? null) ? value : null;
}

function savedLanguage(): Language {
  if (typeof window === "undefined") return "ru";

  try {
    const local = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(local)) return local;
  } catch {
    // Local storage may be blocked; the cookie is enough.
  }

  return languageFromCookie() ?? "ru";
}

function applyDocumentLanguage(language: Language) {
  if (typeof document === "undefined") return;
  document.documentElement.lang =
    language === "cs" ? "cs" : language === "en" ? "en" : "ru";
}

export function useNevFimLanguage() {
  const [language, setLanguageState] = useState<Language>("ru");
  const [isLanguageReady, setIsLanguageReady] = useState(false);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    applyDocumentLanguage(next);

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Keep the cookie even if storage is unavailable.
    }

    document.cookie = `${STORAGE_KEY}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    window.dispatchEvent(
      new CustomEvent<Language>(EVENT_NAME, { detail: next }),
    );
  }, []);

  useEffect(() => {
    const initial = savedLanguage();
    setLanguageState(initial);
    applyDocumentLanguage(initial);
    setIsLanguageReady(true);

    const handleLanguage = (event: Event) => {
      const next = (event as CustomEvent<Language>).detail;
      if (!isLanguage(next)) return;
      setLanguageState(next);
      applyDocumentLanguage(next);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !isLanguage(event.newValue)) return;
      setLanguageState(event.newValue);
      applyDocumentLanguage(event.newValue);
    };

    window.addEventListener(EVENT_NAME, handleLanguage);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(EVENT_NAME, handleLanguage);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return {
    language,
    setLanguage,
    isLanguageReady,
  };
}
