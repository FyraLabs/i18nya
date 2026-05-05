import type { GetStaticPathsResult } from "astro";
import type { I18Nya } from "i18nya";
import { makeGetStaticPaths } from "./util";

const makeI18nya = (defaultLang: string, langs: string[]): I18Nya<string> =>
  ({
    config: { defaultLang },
    translations: Object.fromEntries(langs.map((lang) => [lang, {}])),
  }) as I18Nya<string>;

describe("makeGetStaticPaths", () => {
  it("expands static paths for each language", () => {
    const i18nya = makeI18nya("en", ["en", "fr"]);
    const staticPaths: GetStaticPathsResult = [
      { params: { slug: "hello" }, props: { id: 1 } },
      { params: { slug: "about" }, props: { id: 2 } },
    ];

    const getStaticPaths = makeGetStaticPaths(i18nya, staticPaths);
    const result = getStaticPaths();

    expect(result).toEqual([
      { params: { slug: "hello", lang: undefined }, props: { id: 1 } },
      { params: { slug: "hello", lang: "fr" }, props: { id: 1 } },
      { params: { slug: "about", lang: undefined }, props: { id: 2 } },
      { params: { slug: "about", lang: "fr" }, props: { id: 2 } },
    ]);
  });

  it("uses undefined for default language", () => {
    const i18nya = makeI18nya("en", ["en", "ja"]);
    const staticPaths: GetStaticPathsResult = [{ params: { slug: "home" } }];

    const result = makeGetStaticPaths(i18nya, staticPaths)();

    expect(result[0].params.lang).toBeUndefined();
    expect(result[0].params.slug).toBe("home");
    expect(result[1].params.lang).toBe("ja");
    expect(result[1].params.slug).toBe("home");
  });

  it("returns empty array when no static paths provided", () => {
    const i18nya = makeI18nya("en", ["en", "fr"]);
    const result = makeGetStaticPaths(i18nya)();

    expect(result).toEqual([]);
  });
});
