import { init } from "../../../src/index";
import path from "path";

describe("i18nya init and makeT", () => {
  it('should return correct value for "hello"', async () => {
    const langDir = path.resolve(__dirname, "../langs");
    const { makeT } = await init({ defaultLang: "en", langDir });

    expect(makeT("en")("hello")).toBe("Hello, World!");
  });

  it("should return the key if translation is missing", async () => {
    const langDir = path.resolve(__dirname, "../langs");
    const { makeT } = await init({ defaultLang: "en", langDir });

    expect(makeT("en")("missing_key")).toBe("missing_key");
  });

  it("should interpolate variables in translation", async () => {
    const langDir = path.resolve(__dirname, "../langs");
    const { makeT } = await init({ defaultLang: "en", langDir });

    expect(makeT("en")("greet", { name: "Alice" })).toBe("Hello, Alice!");
  });
});
