# astro-i18nya

I18n support for astro.

## Installation

```sh
npx astro add astro-i18nya
# or
npm install astro-i18nya
```

Make sure you called `init()` from `i18nya` in `src/i18n.ts`:

```ts
import { init } from 'i18nya';


```

Then in `astro.config.mjs`:

```ts
import i18nya from "./i18n";
import astro_i18nya from "astro-i18nya";

export default defineConfig({
  integrations: [astro_i18nya(i18nya)],
  // `i18n:` is not needed
});
```

## Usage

