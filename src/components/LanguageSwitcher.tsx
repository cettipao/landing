import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import {
  LOCALES,
  LOCALE_LABEL,
  localizePath,
  type Locale,
} from "@i18n/ui";

interface Props {
  locale: Locale;
  currentPath: string;
}

const STORAGE_KEY = "paolocetti.locale";

export default function LanguageSwitcher({ locale, currentPath }: Props) {
  const [active, setActive] = useState<Locale>(locale);

  // Persist user's choice once they switch — used on next visit to redirect
  // (handled in BaseLayout via inline script, kept simple here).
  useEffect(() => {
    setActive(locale);
  }, [locale]);

  const handleSelect = (next: Locale) => {
    if (next === active) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage errors (private mode, quota, etc.)
    }
    window.location.href = localizePath(currentPath, next);
  };

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-tertiary/40 px-1 py-1 text-xs"
    >
      <Globe size={14} aria-hidden="true" className="ml-1 text-text-tertiary" />
      {LOCALES.map((code) => {
        const isActive = code === active;
        return (
          <button
            key={code}
            type="button"
            onClick={() => handleSelect(code)}
            aria-pressed={isActive}
            aria-label={
              code === "es" ? "Cambiar a español" : "Switch to English"
            }
            className={
              "rounded-full px-2 py-0.5 font-mono transition-colors " +
              (isActive
                ? "bg-accent text-bg-primary"
                : "text-text-secondary hover:text-text-primary")
            }
          >
            {LOCALE_LABEL[code]}
          </button>
        );
      })}
    </div>
  );
}
