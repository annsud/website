// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// NOTE on deployment:
// For a GitHub Pages *project* site the URL is https://<user>.github.io/<repo>/,
// so `base` must be the repo name. When you move to the custom domain
// (anantsudarshan.com) set `site` to that and `base` to '/'.
export default defineConfig({
  site: 'https://annsud.github.io',
  base: '/website',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
