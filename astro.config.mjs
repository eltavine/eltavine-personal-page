// @ts-check
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import { defineConfig, fontProviders } from 'astro/config';

const site = process.env.SITE_URL ?? 'https://eltavine.com';

// https://astro.build/config
export default defineConfig({
	site,
	build: {
		inlineStylesheets: 'always',
	},
	integrations: [icon(), sitemap()],
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Fraunces',
			cssVariable: '--font-display',
			weights: ['300 800'],
			styles: ['normal', 'italic'],
			fallbacks: ['Iowan Old Style', 'Georgia', 'serif'],
			options: {
				experimental: {
					variableAxis: { opsz: [['9', '144']] },
				},
			},
		},
		{
			provider: fontProviders.fontsource(),
			name: 'Geist',
			cssVariable: '--font-sans',
			weights: ['300 700'],
			styles: ['normal'],
			fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
		},
		{
			provider: fontProviders.fontsource(),
			name: 'Geist Mono',
			cssVariable: '--font-mono',
			weights: ['400 600'],
			styles: ['normal'],
			fallbacks: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
		},
		{
			provider: fontProviders.fontsource(),
			name: 'Caveat',
			cssVariable: '--font-hand',
			weights: [600],
			styles: ['normal'],
			fallbacks: ['cursive'],
		},
	],
});
