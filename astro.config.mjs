// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Deployment: this site is served from the custom domain root
// (www.anantsudarshan.com), so `base` is '/' and `site` is the canonical URL
// used for the sitemap and absolute links. The public/CNAME file tells GitHub
// Pages to keep the custom domain on every deploy.
export default defineConfig({
  site: 'https://www.anantsudarshan.com',
  base: '/',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
