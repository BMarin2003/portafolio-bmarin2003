import { defineConfig } from 'astro/config';

// El nombre real del proyecto de Pages sale en la Tarea 6.
export default defineConfig({
  site: 'https://portafolio-bmarin2003.pages.dev',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
