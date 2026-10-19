import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '');
const site = env.PUBLIC_SITE_URL || 'http://localhost:4321';
const legalAlternates = [
  { es: '/es/legal/privacidad/', en: '/en/legal/privacy/' },
  { es: '/es/legal/terminos/', en: '/en/legal/terms/' },
  {
    es: '/es/legal/cancelaciones-y-reembolsos/',
    en: '/en/legal/cancellations-and-refunds/',
  },
];

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  i18n: { defaultLocale: 'es', locales: ['es', 'en'], routing: { prefixDefaultLocale: true } },
  integrations: env.PUBLIC_SITE_URL
    ? [
        sitemap({
          i18n: { defaultLocale: 'es', locales: { es: 'es-EC', en: 'en' } },
          filter: (page) => !['/', '/404/', '/404.html'].includes(new URL(page).pathname),
          serialize: (item) => {
            const path = new URL(item.url).pathname;
            const alternate = legalAlternates.find(({ es, en }) => path === es || path === en);
            if (!alternate) return item;
            return {
              ...item,
              links: [
                { lang: 'es-EC', url: new URL(alternate.es, site).href },
                { lang: 'en', url: new URL(alternate.en, site).href },
              ],
            };
          },
        }),
      ]
    : [],
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
});
