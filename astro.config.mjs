import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://kreatornetwork.com',
  trailingSlash: 'always',
  output: 'static',
  build: {
    compressHTML: true,
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
