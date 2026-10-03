import { readFileSync } from 'node:fs';
import type { NuxtPage } from 'nuxt/schema';

const { version } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { version: string };

const PRIVATE_SEGMENT = /\/_[^/]+\//;

function removePrivatePages(pages: NuxtPage[]): void {
  for (let index = pages.length - 1; index >= 0; index--) {
    const page = pages[index]!;
    if (page.file && PRIVATE_SEGMENT.test(page.file)) {
      pages.splice(index, 1);
    } else if (page.children) {
      removePrivatePages(page.children);
    }
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2026-05-15',
  ssr: false,
  devtools: { enabled: false },
  modules: ['@pinia/nuxt'],
  components: [{ path: '~/components', pathPrefix: false }],
  css: ['@fontsource-variable/plus-jakarta-sans', '~/assets/scss/main.scss'],
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:4000',
      appVersion: version,
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Susi Air Pilot',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#0E2138' },
        {
          name: 'description',
          content: 'Susi Air Pilot App: schedule, flight hours and duty limits.',
        },
        { name: 'apple-mobile-web-app-title', content: 'Susi Pilot' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/logo.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
      ],
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/abstracts" as *;\n',
        },
      },
    },
  },
  hooks: {
    'pages:extend': removePrivatePages,
  },
  typescript: {
    strict: true,
  },
});
