import i18nya from "./index";

async function makeI18n() {
    return await i18nya({
        defaultLang: "en",
        langDir: "examples/hello/langs/",
    });
}

describe("i18n", () => {
    it("should not fallback subsequent existing keys", async () => {
        const t = (await makeI18n()).makeT("ja");
        expect(t("greet", { "name": "John" })).toBe("Hello, John!");
        expect(t("hello")).toBe("こんにちは世界！");
    });
});
