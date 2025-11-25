import type { I18Nya } from "i18nya";
import type { AstroIntegration } from "astro";
import Trans from "./Trans.js";
import { listLang, getLangName } from "./util.js";
export { Trans, listLang, getLangName };

export default function astroI18nya<T extends string | number | symbol>(
  i18nya: I18Nya<T>,
): AstroIntegration {
  return {
    name: "astro-i18nya",
    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
        updateConfig({
          i18n: {
            defaultLocale: i18nya.config.defaultLang,
            locales: Object.keys(i18nya.translations),
          },
          // required for <Trans>
          // integrations: [react({ experimentalReactChildren: true })],
        });
      },
    },
  };
}
