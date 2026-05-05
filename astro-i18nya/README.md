# astro-i18nya

I18n support for astro.

## Features

- Integration with [`i18nya`](https://www.npmjs.com/package/i18nya) and [`astro`](https://astro.build/)
- A `<Trans />` component that works better than the one in [`react-i18next`](https://react.i18next.com/latest/trans-component)!

## Installation

```sh
npx astro add astro-i18nya
# or
npm install astro-i18nya
```

Make sure you called `init()` from `i18nya` in `src/i18n.ts`:

```ts
import { init } from 'i18nya';

const i18nya = await init({ ... });
export default i18nya;
```

Then in `astro.config.mjs`:

```ts
import i18nya from "./src/i18n";
import astro_i18nya from "astro-i18nya";

export default defineConfig({
  integrations: [astro_i18nya(i18nya)],
  // `i18n:` is not needed
});
```

Then for all pages in `src/pages/[...lang]/*.astro`:

```ts
import i18nya, { makeT } from "../../i18n.ts";
import { makeGetStaticPaths } from "astro-i18nya";
const t = makeT(Astro.params.lang);
// generate paths only for languages in your `langs/` folder!
export const getStaticPaths = makeGetStaticPaths(i18nya);
```

## Examples

See [`hello-astro`](https://github.com/FyraLabs/i18nya/tree/main/examples/hello-astro).

## Trans

This requires `experimentalReactChildren` in `astro.config.mjs`:
```
export default defineConfig({
  integrations: [
    react({ experimentalReactChildren: true }),
    astro_i18nya(i18nya),
  ],
});
```

```tsx
<Trans t={t("test", { user: "John" })}>
  <b />
  <a href="https://example.com" />
</Trans>
```

With `"test": "Hello <1>{{user}}</1>, welcome to <2><1>my site</1></2>."`, the above element will become:

```html
Hello <b>John</b>, welcome to <a href="https://example.com"><b>my site</b></a>.
```

## `prefixDefaultLocale`

Pass `prefixDefaultLocale: true` to `astro_i18nya()` and `makeGetStaticPaths()`. See their respective JSDoc for more info.

