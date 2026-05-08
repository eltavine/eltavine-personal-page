// @ts-check
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL ?? 'https://eltavine.com';

// https://astro.build/config
export default defineConfig({
	site,
	integrations: [icon(), sitemap()],
});
