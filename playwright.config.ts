import { defineConfig } from "@playwright/test";

const port = 4321;
// Locally we drive the installed Edge; CI installs Playwright's own Chromium.
const chromium = {
	browserName: "chromium",
	channel: process.env.PW_CHANNEL ?? (process.env.CI ? undefined : "msedge"),
} as const;
// Safari renders 3D, SVG filters and gradients differently enough to need its own runs.
const webkit = { browserName: "webkit" } as const;

export default defineConfig({
	forbidOnly: Boolean(process.env.CI),
	fullyParallel: true,
	projects: [
		{ name: "desktop", use: { ...chromium, viewport: { height: 900, width: 1440 } } },
		{ name: "tablet", use: { ...chromium, hasTouch: true, viewport: { height: 1112, width: 834 } } },
		{
			name: "mobile",
			use: { ...chromium, hasTouch: true, isMobile: true, viewport: { height: 844, width: 390 } },
		},
		{
			name: "small",
			use: { ...chromium, hasTouch: true, isMobile: true, viewport: { height: 640, width: 320 } },
		},
		{ name: "webkit-desktop", use: { ...webkit, viewport: { height: 900, width: 1440 } } },
		{
			name: "webkit-mobile",
			use: { ...webkit, hasTouch: true, isMobile: true, viewport: { height: 844, width: 390 } },
		},
	],
	reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
	retries: process.env.CI ? 1 : 0,
	testDir: "tests/e2e",
	use: {
		baseURL: `http://127.0.0.1:${port}`,
		trace: "retain-on-failure",
	},
	webServer: {
		command: `pnpm preview --host 127.0.0.1 --port ${port}`,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
		url: `http://127.0.0.1:${port}/`,
	},
});
