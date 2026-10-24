export type I18NyaKey = string | number | symbol;

export type I18NyaConfig<T extends I18NyaKey> = {
  /**
   * Path to directory containing language files.
   *
   * When loading from the filesystem (i.e. without `viteImports`), relative
   * paths are resolved against `process.cwd()`, *not* the calling module.
   */
  langDir: string;
  /** Locale ID for default language. Defaults to `"en"`. */
  defaultLang?: string;
  /** Per-language fallbacks; anything not listed falls back to `defaultLang`. */
  fallbackLangs?: Record<string, string>;
  /** Feed in `import.meta.glob("./langs/*.json", { eager: true })` */
  viteImports?: Record<string, { default: Partial<Record<T, string>> }>;
};

export type I18Nya<T extends I18NyaKey> = {
  translations: Record<string, Partial<Record<T, string>>>;
  makeT: (lang?: string) => (key: T, its?: Interpolations) => string;
  /** The config passed to `init()`, with defaults filled in. */
  config: I18NyaConfig<T> & { defaultLang: string };
};

export type Interpolations = Record<string, string | { toString(): string }>;

const PLACEHOLDER = /\{\{\s*([^{}\s]+)\s*\}\}/g;

/** Strip directories and the `.json` extension: `../langs/ja_JP.json` → `ja_JP` */
const langFromPath = (path: string) =>
  path.slice(path.lastIndexOf("/") + 1).replace(/\.json$/, "");

export const init = async <T extends I18NyaKey = string>(
  config: I18NyaConfig<T>,
): Promise<I18Nya<T>> => {
  const {
    langDir,
    defaultLang: rootLang = "en",
    fallbackLangs = {},
    viteImports,
  } = config;

  const translations: I18Nya<T>["translations"] = {};

  const lookup = (lang: string, key: T): string | undefined => {
    // follow the fallback chain, guarding against cycles in `fallbackLangs`
    const seen = new Set<string>();
    for (let l: string | undefined = lang; l !== undefined && !seen.has(l); ) {
      seen.add(l);
      const s = translations[l]?.[key];
      if (s) return s;
      l = l === rootLang ? undefined : (fallbackLangs[l] ?? rootLang);
    }
    // a cycle might've skipped rootLang; always try it last
    return translations[rootLang]?.[key] || undefined;
  };

  const makeT: I18Nya<T>["makeT"] =
    (lang = rootLang) =>
    (key, its = {}) => {
      const s = lookup(lang, key);
      if (s === undefined) return String(key);
      // single pass so interpolated values containing `{{x}}` aren't re-expanded
      return s.replace(PLACEHOLDER, (match, name: string) =>
        Object.hasOwn(its, name) ? String(its[name]) : match,
      );
    };

  if (viteImports) {
    for (const [path, mod] of Object.entries(viteImports))
      translations[langFromPath(path)] = mod.default;
  } else {
    const { readdir, readFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const entries = await readdir(langDir, { withFileTypes: true });
    await Promise.all(
      entries
        .filter((e) => e.isFile() && e.name.endsWith(".json"))
        .map(async (e) => {
          const raw = await readFile(join(langDir, e.name), "utf8");
          translations[langFromPath(e.name)] = JSON.parse(raw);
        }),
    );
  }

  return {
    translations,
    makeT,
    config: { ...config, defaultLang: rootLang },
  };
};

export default init;
