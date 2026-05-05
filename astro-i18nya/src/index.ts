import type { I18Nya } from "i18nya";
import type { AstroIntegration } from "astro";
import Trans from "./Trans.js";
import { listLang, getLangName, makeGetStaticPaths } from "./util.js";
export { Trans, listLang, getLangName, makeGetStaticPaths };

export type AstroI18nyaConfig = {
  prefixDefaultLocale?: boolean;
  redirectToDefaultLocale?: boolean;
};

export default function astroI18nya<T extends string | number | symbol>(
  i18nya: I18Nya<T>,
  { prefixDefaultLocale = false, redirectToDefaultLocale = false }: AstroI18nyaConfig = {},
): AstroIntegration {
  return {
    name: "astro-i18nya",
    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
        updateConfig({
          i18n: {
            defaultLocale: i18nya.config.defaultLang,
            locales: Object.keys(i18nya.translations),
            routing: {
              prefixDefaultLocale,
              redirectToDefaultLocale,
              fallbackType: "redirect",
            },
          },
          // required for <Trans>
          // integrations: [react({ experimentalReactChildren: true })],
        });
      },
    },
  };
}
