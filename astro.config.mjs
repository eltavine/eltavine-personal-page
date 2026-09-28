// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import { defineConfig, fontProviders } from "astro/config";

const site = process.env.SITE_URL ?? "https://eltavine.com";

// The copy is English: printable ASCII plus the few marks it uses. Anything outside this set still renders,
// just in the fallback face (the generated unicode-range tells the browser where to look).
const siteGlyphs = [
	...Array.from({ length: 95 }, (_, index) => String.fromCharCode(32 + index)),
	..."—–·’“”→↓↘✎✳©",
];

// https://astro.build/config
export default defineConfig({
	site,
	build: {
		inlineStylesheets: "always",
	},
	integrations: [icon(), mdx(), sitemap({ filter: (page) => !/\/(card\.txt|og\.png)$/.test(page) })],
	fonts: [
		{
			// First paint: SOFT pinned at 0 (Google can only drop the axis at an end value) keeps this ~67 KB instead of ~120 KB.
			provider: fontProviders.google(),
			name: "Fraunces",
			cssVariable: "--font-display",
			weights: ["300 600"],
			styles: ["normal", "italic"],
			fallbacks: ["Iowan Old Style", "Georgia", "serif"],
			options: {
				experimental: {
					glyphs: siteGlyphs,
					variableAxis: { opsz: [["9", "144"]], SOFT: ["0"], WONK: ["1"] },
				},
			},
		},
		{
			// Swapped in after load (features/type): all four axes, so SOFT, the "wetness" of the ink, can animate.
			provider: fontProviders.local(),
			name: "Fraunces Soft",
			cssVariable: "--font-display-soft",
			fallbacks: ["Iowan Old Style", "Georgia", "serif"],
			options: {
				variants: [
					{
						weight: "100 900",
						style: "normal",
						src: ["./node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2"],
					},
					{
						weight: "100 900",
						style: "italic",
						src: ["./node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-italic.woff2"],
					},
				],
			},
		},
		{
			provider: fontProviders.google(),
			name: "Geist",
			cssVariable: "--font-sans",
			weights: ["300 700"],
			styles: ["normal"],
			fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
			options: { experimental: { glyphs: siteGlyphs } },
		},
		{
			provider: fontProviders.google(),
			name: "Geist Mono",
			cssVariable: "--font-mono",
			weights: ["400 600"],
			styles: ["normal"],
			fallbacks: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
			options: { experimental: { glyphs: siteGlyphs } },
		},
		{
			// Swap this entry for `fontProviders.local()` pointing at your own handwriting font to make every note truly yours.
			provider: fontProviders.google(),
			name: "Caveat",
			cssVariable: "--font-hand",
			weights: [600],
			styles: ["normal"],
			fallbacks: ["cursive"],
			options: { experimental: { glyphs: siteGlyphs } },
		},
	],
});
