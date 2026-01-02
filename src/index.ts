export type I18NyaKey = string | number | symbol;

export type I18NyaConfig<T extends I18NyaKey> = {
  /** Path to directory containing language files */
  langDir: string;
  /** Locale ID for default language */
  defaultLang: string;
  fallbackLangs?: Record<string, string>;
  /** Feed in `import.meta.glob("./langs/*.json", { eager: true })` */
  viteImports?: Record<string, { default: Record<T, string> }>;
};

export type I18Nya<T extends I18NyaKey> = {
  translations: Record<string, Record<T, string>>;
  makeT: (lang?: string) => (key: T, its?: Interpolations) => string;
  config: I18NyaConfig<T>;
};

export type Interpolations = Record<string, string | { toString(): string }>;
const opts = { with: { type: "json" } };

export const init = async <T extends string | number | symbol = string>(
  config: I18NyaConfig<T>,
) => {
  const {
    langDir,
    defaultLang: rootLang = "en",
    fallbackLangs = {},
    viteImports = undefined,
  } = config;
  let i18nya: I18Nya<T> = {
    translations: {},
    makeT:
      (lang = rootLang) =>
      (key, its = {}) => {
        let s: string | undefined;
        for (
          ;
          !(s = i18nya.translations[lang]?.[key]);
          lang = fallbackLangs[lang] ?? rootLang
        )
          if (lang === rootLang) return String(key);
        for (const [k, v] of Object.entries(its))
          s = s.replace(`{{${k}}}`, `${v}`);
        return s;
      },
    config,
  };
  if (viteImports) {
    for (const [k, v] of Object.entries(viteImports))
      i18nya.translations[k.slice(langDir.length + 1, -5)] = v.default;
  } else {
    const { readdirSync } = await import("fs");
    const { resolve } = await import("path");
    for (const entry of readdirSync(langDir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith(".json")) {
        const imp = await import(resolve(langDir, entry.name), opts);
        i18nya.translations[entry.name.slice(0, -5)] = imp.default;
      }
    }
  }
  return i18nya;
};
export default init;
