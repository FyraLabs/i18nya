import type { GetStaticPathsItem, GetStaticPathsResult } from "astro";
import type { I18Nya } from "i18nya";

/**
 * Obtain the language name.
 * @param lang the language locale
 * @param displayLang in what language should the name of the language be shown. By default, use native language names.
 * @returns language name
 */
export const getLangName = (lang: string, displayLang?: string) =>
  new Intl.DisplayNames([displayLang ?? lang], {
    type: "language",
    style: "narrow",
  }).of(lang);

/**
 * List out available languages.
 * @param i18nya return value of `init()` from `i18nya`
 * @param displayLang in what language should the name of the language be shown. By default, use native language names.
 * @returns a map of language locale → language name
 */
export const listLang = <T extends string | number | symbol>(
  i18nya: I18Nya<T>,
  displayLang?: string,
) =>
  new Map(
    Object.keys(i18nya.translations).map((l) => [
      l,
      getLangName(l.replace("_", "-"), displayLang),
    ]),
  );

/**
 * Build a `getStaticPaths` factory for Astro i18n routes.
 *
 * Returns a function that expands the provided `staticPaths` for every
 * language in `i18nya.translations`. The default language uses
 * `{ params: { lang: undefined } }` so its route is not prefixed, while
 * other languages use `{ params: { lang } }`.
 *
 * @param i18nya return value of `init()` from `i18nya`
 * @param staticPaths original `getStaticPaths` array to be localized
 * @returns a `getStaticPaths` function for Astro
 */
export const makeGetStaticPaths =
  <T extends string | number | symbol>(
    i18nya: I18Nya<T>,
    staticPaths: GetStaticPathsResult = [],
  ): (() => GetStaticPathsResult) =>
    (): GetStaticPathsResult =>
      staticPaths.flatMap((origPath): GetStaticPathsResult =>
        Object.keys(i18nya.translations).map((lang): GetStaticPathsItem => ({
          ...origPath,
          params: {
            ...origPath.params,
            lang: lang === i18nya.config.defaultLang ? undefined : lang,
          },
        })),
      );
