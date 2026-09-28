import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.route(/api\.github\.com/, (route) => route.abort());
});

test.describe("without motion", () => {
	test.use({ contextOptions: { reducedMotion: "reduce" } });

	test("the lamp switch flips the theme and remembers it", async ({ page }) => {
		await page.goto("/");
		const before = await page.locator("html").getAttribute("data-theme");
		await page.locator("[data-lamp-switch]").click();
		const after = await page.locator("html").getAttribute("data-theme");
		expect(after).not.toBe(before);
		await expect(page.locator("[data-lamp-switch]")).toHaveAttribute(
			"aria-pressed",
			String(after === "dark"),
		);
		await page.reload();
		await expect(page.locator("html")).toHaveAttribute("data-theme", after ?? "");
	});

	test("the email is revealed from the keyboard in two presses", async ({ page }) => {
		await page.goto("/");
		const button = page.locator("[data-email-reveal]");
		await button.focus();
		await page.keyboard.press("Enter");
		await expect(button).toHaveAttribute("data-state", "primed");
		await page.keyboard.press("Enter");
		const link = page.locator('a.email-reveal[href^="mailto:"]');
		await expect(link).toBeVisible();
		await expect(link).toBeFocused();
	});

	test("the postcard turns over and keeps the hidden side inert and unpainted", async ({ page }) => {
		await page.goto("/");
		const scene = page.locator("[data-postcard]");
		const turn = page.locator("[data-postcard-turn]");
		const back = page.locator('[data-postcard-face="back"]');
		const front = page.locator('[data-postcard-face="front"]');
		await expect(turn).toBeVisible();
		await turn.click();
		await expect(scene).toHaveAttribute("data-face", "front");
		expect(await back.evaluate((face) => (face as HTMLElement).inert)).toBe(true);
		// WebKit ignores backface-visibility here, so the turned-away face must not be painted at all.
		await expect(back).toHaveCSS("opacity", "0");
		await expect(front).toHaveCSS("opacity", "1");
		await turn.click();
		await expect(scene).toHaveAttribute("data-face", "back");
		expect(await front.evaluate((face) => (face as HTMLElement).inert)).toBe(true);
		await expect(front).toHaveCSS("opacity", "0");
		await expect(back).toHaveCSS("opacity", "1");
	});

	test("the stack cross-reference highlights a project's tools", async ({ page }) => {
		await page.goto("/");
		const chip = page.locator('[data-stack-filter="duck-detector"]');
		await chip.click();
		await expect(chip).toHaveAttribute("aria-pressed", "true");
		await expect(page.locator(".tile.is-match")).toHaveCount(3);
		await expect(page.locator("[data-stack-status]")).toHaveText("3 tools highlighted for Duck Detector.");
		await chip.click();
		await expect(page.locator(".tile.is-match")).toHaveCount(0);
	});

	test("a working rule links to the sketch that proves it", async ({ page }) => {
		await page.goto("/");
		await page.waitForFunction(() =>
			Boolean(customElements.get("evidence-link") && customElements.get("mobile-fold")),
		);
		await page.locator(".rule-evidence").nth(2).click();
		await expect(page).toHaveURL(/#sketch-pingora-panel$/);
		await expect(page.locator("#sketch-pingora-panel")).toBeInViewport();
	});
});

test.describe("scratch card", () => {
	test.skip(({ hasTouch }) => Boolean(hasTouch), "mouse scratching is exercised on desktop");
	test.use({ contextOptions: { reducedMotion: "reduce" } });

	test("scratching the wax reveals the email", async ({ page }) => {
		await page.goto("/");
		// The wax is painted only when the slot comes near the viewport, so scroll the visible container first.
		await page.locator("scratch-reveal").scrollIntoViewIfNeeded();
		const canvas = page.locator("[data-scratch-canvas]");
		await expect(canvas).toBeVisible();
		const box = await canvas.boundingBox();
		if (!box) {
			throw new Error("scratch canvas has no box");
		}
		await page.mouse.move(box.x + 2, box.y + box.height / 2);
		await page.mouse.down();
		for (let pass = 0; pass < 2; pass++) {
			for (let step = 0; step <= 20; step++) {
				const x = box.x + (step / 20) * box.width;
				const y = box.y + (step % 2 === pass % 2 ? 4 : box.height - 4);
				await page.mouse.move(x, y, { steps: 3 });
			}
		}
		await page.mouse.up();
		await expect(page.locator('a.email-reveal[href^="mailto:"]')).toBeVisible();
	});
});

test.describe("lamp glow", () => {
	test.skip(({ hasTouch }) => Boolean(hasTouch), "the glow follows a mouse");

	test("stays centred on the pointer once the header blurs and slides away", async ({ page }) => {
		await page.addInitScript(() => window.localStorage.setItem("eltavine-theme", "dark"));
		await page.goto("/");
		await page.mouse.move(600, 400);
		await page.mouse.wheel(0, 1500);
		await expect(page.locator("site-header")).toHaveAttribute("data-hidden", "true");
		await page.mouse.move(640, 420);
		await expect
			.poll(() =>
				page.locator("[data-lamp-glow]").evaluate((glow) => {
					const rect = glow.getBoundingClientRect();
					return [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)];
				}),
			)
			.toEqual([640, 420]);
	});
});

test.describe("live sketches", () => {
	test.skip(({ viewport }) => (viewport?.width ?? 0) < 1080, "desktop-only motion checks");

	test("the play button runs the pipeline scenario", async ({ page }) => {
		await page.goto("/");
		await expect(page.locator("html[data-motion='ready']")).toBeAttached({ timeout: 10_000 });
		const sketch = page.locator("#sketch-pingora-panel");
		await sketch.scrollIntoViewIfNeeded();
		const play = sketch.locator("[data-sketch-play]");
		await expect(play).toBeVisible();
		await play.click();
		await expect
			.poll(() =>
				sketch.locator(".sketch-packet").evaluate((packet) => Number(getComputedStyle(packet).opacity)),
			)
			.toBeGreaterThan(0);
	});
});
