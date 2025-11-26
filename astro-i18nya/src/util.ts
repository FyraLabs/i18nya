import type { I18Nya } from "i18nya";

/**
 * Obtain the language name.
 * @param lang the language locale
 * @param displayLang in what language should the name of the language be shown. By default, use native language names.
 * @returns language name
 */
export const getLangName = (lang: string, displayLang?: string) =>
  new Intl.DisplayNames([displayLang ?? lang], { type: "language" }).of(lang);

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

export const makeGetStaticPaths =
  <T extends string | number | symbol>(i18nya: I18Nya<T>) =>
  async () =>
    Object.keys(i18nya.translations)
      .filter((lang) => lang !== i18nya.config.defaultLang)
      .map((lang) => ({ params: { lang: lang } }));
