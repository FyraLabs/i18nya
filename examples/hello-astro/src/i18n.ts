import en from "../langs/en.json";
import { init } from "i18nya";

const i18nya = await init<keyof typeof en>({
  defaultLang: "en",
  langDir: "../langs",
  viteImports: import.meta.glob("../langs/*.json", { eager: true }),
});

export default i18nya;
const { makeT } = i18nya;
export { makeT };
