# i18nya

**i18n as small as a cat's paw** — `i18nya` is a minimal, fast, and easy-to-use internationalization library for Node.js and TypeScript projects.  
Its tiny footprint and simple API make it perfect for projects that want localization without the bloat.

## Features

- 🐾 **Tiny**: Less than 50 lines of TypeScript, 0 dependencies.
- ⏬️ **Flexible fallback**: Supports fallback languages out of the box.
- 🧩 **Extensible**: Can be easily extended to integrate into other frameworks (e.g. `astro-i18nya`).
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
  langDir: "./langs", // only this is required
  defaultLang: "en",
  fallbackLangs: {
    // all languages fallback to English, specify special fallbacks here
    zh_HK: "zh_TW",
  },
});

export default i18nya;
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
import { makeT } from "i18n";
const t = makeT("ja_JP");
console.log(t("i18nya.description", { emoji: "🐾" })); // 🐾 猫の足くらいちっちゃい国際化ツール
```

### Typed Keys & Completions

The type for the keys can be manually specified:

```ts
import { init } from "i18nya";
// requires tsconfig `resolveJsonModule`
import { defaultTranslations } from "../langs/en.json";

const i18nya = init<keyof typeof defaultTranslations>(...);
```

Your editor will now show the translation keys when invoking `t()`.
