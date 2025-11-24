import { readdirSync } from "fs";

export type I18NyaConfig = {
  /** Path to directory containing language files */
  langDir: string;
  /** Locale ID for default language */
  defaultLang: string;
  fallbackLangs?: Record<string, string>;
};

export type I18Nya = {
  translations: Record<string, Record<string, string>>;
  makeT: (lang: string) => (key: string, its?: Interpolations) => string;
  config: I18NyaConfig;
}

export type Interpolations = Record<string, string | { toString(): string }>;
const opts = { with: { type: "json" } };

export const init = async (config: I18NyaConfig) => {
  const {
    langDir,
    defaultLang: rootLang,
    fallbackLangs: fb = {},
  } = config;
  let i18nya: I18Nya = {
    translations: {},
    makeT: (l) => (k, its = {}) => {
      let s: string | undefined;
      for (; !(s = i18nya.translations[l]?.[k]); l = fb[l] ?? rootLang)
        if (l === rootLang)
          return String(k);
      for (const [k, v] of Object.entries(its))
        s = s.replace(`{{${k}}}`, `${v}`);
      return s;
    },
    config
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
