import { readdirSync } from "fs";
import path from "path";

export type I18NyaConfig = {
  /** Path to directory containing language files */
  langDir: string;
  /** Locale ID for default language */
  defaultLang: string;
  fallbackLangs?: Record<string, string>;
};

export type Interpolations = Record<string, string | { toString(): string }>;
const opts = { with: { type: "json" } };

export const init = async ({
  langDir,
  defaultLang: rootLang,
  fallbackLangs: fb = {},
}: I18NyaConfig) => {
  let DefaultTranslations;
  try {
    // HACK: ignore error when import json fails in javascript
    DefaultTranslations = await import(`${langDir}/${rootLang}.json`, opts);
  } catch (_) {}
  type TransKeys = keyof typeof DefaultTranslations;
  type I18Nya = {
    translations: Record<string, Record<TransKeys, string>>;
    makeT: (lang: string) => (key: TransKeys, its?: Interpolations) => string;
  };
  let i18nya: I18Nya = {
    translations: {},
    makeT:
      (l: string) =>
      (k: TransKeys, its: Interpolations = {}) => {
        let s: string | undefined;
        for (; !(s = i18nya.translations[l]?.[k]); l = fb[l] ?? rootLang) {
          if (l === rootLang) {
            return String(k);
          }
        }
        for (const [k, v] of Object.entries(its)) {
          s = s.replace(`{{${k}}}`, `${v}`);
        }
        return s;
      },
  };
  for (const entry of readdirSync(langDir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".json")) {
      const lang = entry.name.slice(0, -5);
      const imp = await import(`${langDir}/${lang}.json`, opts);
      i18nya.translations[lang] = imp.default;
    }
  }
  return i18nya;
};
