/**
 * Tiny conditional class joiner — keeps templates clean without pulling in
 * a dependency. Skips falsy values (false, null, undefined, "").
 */
export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Formats a date as "MMM YYYY" in the given locale. Used by experience
 * timeline entries (e.g. "Nov 2025").
 */
export function formatMonthYear(date: Date, locale: string = "en"): string {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
  }).format(date);
}

export const SITE_URL = "https://paolocetti.com";

export const SOCIAL = {
  email: "cettipao@gmail.com",
  linkedin: "https://www.linkedin.com/in/cettipao",
  github: "https://github.com/cettipao",
  calendly: "https://calendly.com/paolocetti/30min",
} as const;
