import type { I18Nya } from "i18nya";
import type { AstroIntegration } from "astro";
import react from "@astrojs/react";
import Trans from "./Trans";
import { listLang, getLangName } from "./util";
export { Trans, listLang, getLangName };

export default function (i18nya: I18Nya): AstroIntegration {
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
          integrations: [react({ experimentalReactChildren: true })],
        });
      },
    },
  };
}
