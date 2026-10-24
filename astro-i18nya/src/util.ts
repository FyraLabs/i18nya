import type { GetStaticPathsItem, GetStaticPathsResult } from "astro";
import type { I18Nya, I18NyaKey } from "i18nya";

const toBcp47 = (lang: string) => lang.replaceAll("_", "-");

/**
 * Obtain the language name.
 * @param lang the language locale
 * @param displayLang in what language should the name of the language be shown. By default, use native language names.
 * @returns language name
 */
export const getLangName = (lang: string, displayLang?: string) => {
  // i18nya file names commonly use `ja_JP`, but BCP 47 wants `ja-JP`
  const tag = toBcp47(lang);
  return new Intl.DisplayNames([displayLang ? toBcp47(displayLang) : tag], {
    type: "language",
    style: "narrow",
  }).of(tag);
};

/**
 * List out available languages.
 * @param i18nya return value of `init()` from `i18nya`
 * @param displayLang in what language should the name of the language be shown. By default, use native language names.
 * @returns a map of language locale → language name
 */
export const listLang = <T extends I18NyaKey>(
  i18nya: I18Nya<T>,
  displayLang?: string,
) =>
  new Map(
    Object.keys(i18nya.translations).map((l) => [
      l,
      getLangName(l, displayLang),
    ]),
  );

/**
 * Build a `getStaticPaths` factory for Astro i18n routes.
 *
 * Returns a function that expands the provided `staticPaths` for every
 * language in `i18nya.translations`. By default, the default language uses
 * `{ params: { lang: undefined } }` so its route is not prefixed, while
 * other languages use `{ params: { lang } }`. When `prefixDefaultLocale`
 * is true, the default language also uses `{ params: { lang } }`.
 *
 * @param i18nya return value of `init()` from `i18nya`
 * @param staticPaths original `getStaticPaths` array to be localized
 * @returns a `getStaticPaths` function for Astro
 */
export const makeGetStaticPaths =
  <T extends I18NyaKey>(
    i18nya: I18Nya<T>,
    staticPaths: GetStaticPathsResult = [{ params: {} }],
    { prefixDefaultLocale = false }: { prefixDefaultLocale?: boolean } = {},
  ): (() => GetStaticPathsResult) =>
    (): GetStaticPathsResult =>
      staticPaths.flatMap(({ params, props }): GetStaticPathsResult =>
        Object.keys(i18nya.translations)
          .map((lang): GetStaticPathsItem => ({
            props,
            params: {
              ...params,
              lang:
                lang === i18nya.config.defaultLang && !prefixDefaultLocale
                  ? undefined
                  : lang,
            },
          })),
      );
