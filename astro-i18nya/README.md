# astro-i18nya

I18n support for astro.

## Features

- Integration with `i18nya` and `astro`
- A `<Trans />` component that works better than the one in `react-i18next`!

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
import i18nya from "./i18n";
import astro_i18nya from "astro-i18nya";

export default defineConfig({
  integrations: [astro_i18nya(i18nya)],
  // `i18n:` is not needed
});
```

## Trans

```tsx
<Trans t={t("test", { user: "John" })}>
  <b />
  <a href="https://example.com" />
</Trans>
```

With `"test": "Hello <1>{{user}}</1>, welcome to <2><1>my site</1></2>."`, the above element will become:

```html
<b>Hello John</b>, welcome to <a href="https://example.com"><b>my site</b></a
>.
```
