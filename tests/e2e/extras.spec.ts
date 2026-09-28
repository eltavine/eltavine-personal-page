import { expect, test } from "@playwright/test";

test("unknown pages get the torn-out 404", async ({ page }) => {
	const response = await page.goto("/definitely-not-a-page");
	expect(response?.status()).toBe(404);
	await expect(page.locator("#missing-title")).toContainText("torn out");
});

test("build-time artifacts are served", async ({ request }) => {
	const card = await request.get("/card.txt");
	expect(card.ok()).toBe(true);
	const text = await card.text();
	expect(text).toContain("46CC 2913 C0B6 460F F498");
	expect(text).toContain("[drunken bishop]");

	const og = await request.get("/og.png");
	expect(og.headers()["content-type"]).toContain("image/png");
	expect((await og.body()).byteLength).toBeGreaterThan(20_000);

	const favicon = await request.get("/favicon.svg");
	expect(await favicon.text()).toMatch(/^<svg /);
});

test.describe("print", () => {
	test.skip(
		({ browserName, viewport, isMobile }) =>
			browserName !== "chromium" || Boolean(isMobile) || (viewport?.width ?? 0) < 1080,
		"one PDF run is enough, and only Chromium prints to PDF",
	);
	test.use({ contextOptions: { reducedMotion: "reduce" } });

	test("prints as a single-page spec sheet", async ({ page }) => {
		await page.route(/api\.github\.com/, (route) => route.abort());
		await page.goto("/", { waitUntil: "networkidle" });
		await page.emulateMedia({ media: "print" });
		// The message side prints even if the postcard was still picture side up on screen.
		await page.locator("[data-postcard]").evaluate((scene) => {
			scene.dataset.face = "front";
		});
		await expect(page.locator('[data-postcard-face="back"]')).toHaveCSS("opacity", "1");
		const pdf = await page.pdf({ format: "A4", printBackground: true });
		const pages = pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? [];
		expect(pages.length).toBe(1);
	});
});
