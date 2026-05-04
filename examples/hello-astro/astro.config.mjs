// @ts-check
import { defineConfig } from 'astro/config';
import i18nya from './src/i18n';
import astro_i18nya from 'astro-i18nya';

// https://astro.build/config
export default defineConfig({
  integrations: [astro_i18nya(i18nya)],
});
