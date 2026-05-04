import en from "./en.json";
import es from "./es.json";

export const DEFAULT_LOCALE = "en" as const;
export const LOCALES = ["en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

const dictionaries = { en, es } as const;

export type UIDict = typeof en;

/**
 * Recursive dot-notation key paths for the UI dictionary
 * (e.g. "nav.about", "hero.tagline", "footer.rights").
 */
type Leaves<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends string
    ? P extends ""
      ? K
      : `${P}.${K}`
    : Leaves<T[K], P extends "" ? K : `${P}.${K}`>;
}[keyof T & string];

export type UIKey = Leaves<UIDict>;

function getByPath(obj: unknown, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
}

/**
 * Returns a translation helper bound to a given locale. Falls back to the
 * default locale, then to the raw key, so missing strings stay visible.
 *
 * Usage:
 *   const t = useTranslations(locale);
 *   t("nav.about");
 *   t("footer.rights", { year: "2026" });
 */
export function useTranslations(locale: Locale) {
  const dict = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
  const fallback = dictionaries[DEFAULT_LOCALE];

  return function t(key: UIKey, vars?: Record<string, string | number>): string {
    const raw = getByPath(dict, key) ?? getByPath(fallback, key) ?? key;
    if (!vars) return raw;
    return raw.replace(/\{(\w+)\}/g, (_, name: string) =>
      vars[name] !== undefined ? String(vars[name]) : `{${name}}`,
    );
  };
}

/**
 * Detects the current locale from a URL pathname.
 * `/es` and `/es/...` → "es", anything else → default ("en").
 */
export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && (LOCALES as readonly string[]).includes(first)) {
    return first as Locale;
  }
  return DEFAULT_LOCALE;
}

/**
 * Returns the equivalent path in the given locale, preserving the rest of the
 * URL. Default-locale paths have no prefix; non-default locales are prefixed
 * with `/<locale>`.
 */
export function localizePath(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  const rest =
    first && (LOCALES as readonly string[]).includes(first)
      ? segments.slice(1)
      : segments;

  const tail = rest.length > 0 ? `/${rest.join("/")}` : "/";
  if (locale === DEFAULT_LOCALE) return tail;
  return `/${locale}${tail === "/" ? "" : tail}`;
}

export const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  es: "ES",
};
