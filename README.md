# i18nya

**i18n as small as a cat's paw** — `i18nya` is a minimal, fast, and easy-to-use internationalization library for Node.js and TypeScript projects.  
Its tiny footprint and simple API make it perfect for projects that want localization without the bloat.

## Features

- 🐾 **Tiny**: Less than 100 lines of TypeScript, 0 dependencies.
- ⏬️ **Flexible fallback**: Supports fallback languages out of the box.
- 🧩 **Extensible**: Can be easily extended to integrate into other frameworks (e.g. [`astro-i18nya`](https://www.npmjs.com/package/astro-i18nya)).
- 🔨 **Typed**: Optional translation key completions for `t()`.

## Installation

```sh
npm install i18nya
```

## Getting Started

Project structure:

```
package.json
src/
└╴i18n.ts (or js)
langs/
├╴ja_JP.json
└╴en.json
```

```ts
// src/i18n.ts
import { init } from "i18nya";

const i18nya = await init({
  // only this is required. without `viteImports`, this is resolved
  // relative to the current working directory, not this file!
  langDir: "langs",
  defaultLang: "en", // default: "en"
  fallbackLangs: {
    // all languages fallback to defaultLang, specify special fallbacks here
    zh_HK: "zh_TW",
  },
  // if you use vite, you need to import manually using this:
  viteImports: import.meta.glob("../langs/*.json", { eager: true }),
  // otherwise, i18nya will search & import the json files using node modules
  // (which vite does not ship)
});

export default i18nya;
export const { makeT } = i18nya;
```

```json
// langs/en.json
{
  "i18nya.description": "{{emoji}} i18n as small as a cat's paw"
}
```

```json
// langs/ja_JP.json
{
  "i18nya.description": "{{emoji}} 猫の足くらいちっちゃい国際化ツール"
}
```

```ts
// usage
import { makeT } from "./i18n";
const t = makeT("ja_JP");
console.log(t("i18nya.description", { emoji: "🐾" })); // 🐾 猫の足くらいちっちゃい国際化ツール
```

Every `{{name}}` placeholder is replaced; unknown placeholders are left as-is.
Missing (or empty) translations fall back through `fallbackLangs`, then `defaultLang`, then the key itself.

### Typed Keys & Completions

The type for the keys can be manually specified:

```ts
import { init } from "i18nya";
// requires tsconfig `resolveJsonModule`
import type en from "../langs/en.json";

const i18nya = await init<keyof typeof en>(...);
```

Your editor will now show the translation keys when invoking `t()`.
