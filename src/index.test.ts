import i18nya from "./index";

async function makeI18n() {
  return await i18nya({
    defaultLang: "en",
    langDir: "examples/hello/langs/",
  });
}

const fromVite = (
  langs: Record<string, Record<string, string>>,
  config: { defaultLang?: string; fallbackLangs?: Record<string, string> } = {},
) =>
  i18nya({
    langDir: "../langs",
    ...config,
    viteImports: Object.fromEntries(
      Object.entries(langs).map(([l, v]) => [`../langs/${l}.json`, { default: v }]),
    ),
  });

describe("i18n", () => {
  it("should not fallback subsequent existing keys", async () => {
    const t = (await makeI18n()).makeT("ja");
    expect(t("greet", { name: "John" })).toBe("Hello, John!");
    expect(t("hello")).toBe("こんにちは世界！");
  });

  it("defaults defaultLang to en and exposes it in config", async () => {
    const i = await i18nya({ langDir: "examples/hello/langs" });
    expect(i.config.defaultLang).toBe("en");
    expect(i.makeT()("hello")).toBe("Hello, World!");
  });

  it("falls back to the key for unknown languages and keys", async () => {
    const i = await makeI18n();
    expect(i.makeT("xx")("hello")).toBe("Hello, World!");
    expect(i.makeT("xx")("nope")).toBe("nope");
  });
});

describe("interpolation", () => {
  it("replaces every occurrence of a placeholder", async () => {
    const t = (await fromVite({ en: { k: "{{a}} and {{a}}" } })).makeT();
    expect(t("k", { a: "x" })).toBe("x and x");
  });

  it("does not re-expand placeholders inside values", async () => {
    const t = (await fromVite({ en: { k: "{{a}} {{b}}" } })).makeT();
    expect(t("k", { a: "{{b}}", b: "B" })).toBe("{{b}} B");
  });

  it("leaves unknown placeholders alone and tolerates whitespace", async () => {
    const t = (await fromVite({ en: { k: "{{ a }} {{missing}}" } })).makeT();
    expect(t("k", { a: 1 })).toBe("1 {{missing}}");
  });
});

describe("fallbacks", () => {
  it("follows fallbackLangs chains before defaultLang", async () => {
    const i = await fromVite(
      { en: { k: "en" }, zh_TW: { k: "tw" }, zh_HK: {} },
      { fallbackLangs: { zh_HK: "zh_TW" } },
    );
    expect(i.makeT("zh_HK")("k")).toBe("tw");
  });

  it("does not hang on fallback cycles", async () => {
    const i = await fromVite(
      { en: { k: "en" }, a: {}, b: {} },
      { fallbackLangs: { a: "b", b: "a" } },
    );
    expect(i.makeT("a")("k")).toBe("en");
  });

  it("does not hang on self-referencing fallbacks", async () => {
    const i = await fromVite({ en: { k: "en" }, a: {} }, { fallbackLangs: { a: "a" } });
    expect(i.makeT("a")("k")).toBe("en");
  });
});

describe("viteImports", () => {
  it("derives the language from the file name regardless of langDir format", async () => {
    const i = await i18nya({
      langDir: "./langs/", // trailing slash + different prefix than the glob
      viteImports: { "../../langs/ja_JP.json": { default: { k: "v" } } },
    });
    expect(Object.keys(i.translations)).toEqual(["ja_JP"]);
  });
});
