import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const githubApi = /api\.github\.com/;

test.beforeEach(async ({ page }) => {
	// The live star refresh is an optional enhancement; tests run against the build-time numbers.
	await page.route(githubApi, (route) => route.abort());
});

test("renders every section without horizontal overflow", async ({ page }) => {
	await page.goto("/");
	for (const id of ["projects", "about", "stack", "contact"]) {
		await expect(page.locator(`#${id}`)).toBeAttached();
	}
	const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
	expect(overflow).toBeLessThanOrEqual(0);
});

test("keeps all rendered HTML text at 11px or larger", async ({ page }) => {
	await page.goto("/");
	const tooSmall = await page.evaluate(() => {
		const offenders: string[] = [];
		const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
		while (walker.nextNode()) {
			const node = walker.currentNode as Text;
			const element = node.parentElement;
			if (!node.textContent?.trim() || !element || element.closest("svg, .sr-only, template")) {
				continue;
			}
			const style = getComputedStyle(element);
			if (style.visibility === "hidden" || element.getClientRects().length === 0) {
				continue;
			}
			const size = Number.parseFloat(style.fontSize);
			if (size < 10.95) {
				offenders.push(`${size}px "${node.textContent.trim().slice(0, 30)}" in .${element.className}`);
			}
		}
		return offenders;
	});
	expect(tooSmall).toEqual([]);
});

test("applies cascade layers in the declared order", async ({ page }) => {
	await page.goto("/");
	// A feature rule (.nav-mark hidden) must beat the ui-layer default (.crayon-mark drawn).
	const offsets = await page
		.locator(".nav-link:not([data-active]) .nav-mark")
		.evaluateAll((marks) => marks.map((mark) => Number.parseFloat(getComputedStyle(mark).strokeDashoffset)));
	expect(offsets.length).toBeGreaterThan(0);
	for (const offset of offsets) {
		expect(offset).toBeGreaterThan(1);
	}
});

test("folds project notes on narrow screens only", async ({ page }, testInfo) => {
	await page.goto("/");
	const folds = page.locator("details.sheet-more");
	await expect(folds.first()).toBeAttached();
	const narrow = (page.viewportSize()?.width ?? 1440) <= 720;
	const states = await folds.evaluateAll((items) => items.map((item) => (item as HTMLDetailsElement).open));
	expect(
		states.every((open) => open === !narrow),
		`${testInfo.project.name}: ${states.join(",")}`,
	).toBe(true);
	const summaryDisplay = await page
		.locator(".sheet-more-summary")
		.first()
		.evaluate((summary) => getComputedStyle(summary).display);
	expect(summaryDisplay === "none").toBe(!narrow);
});

test("loads nothing from third parties and logs no errors", async ({ page }) => {
	const origin = new URL(page.url() === "about:blank" ? "http://127.0.0.1:4321" : page.url()).origin;
	const foreign: string[] = [];
	const errors: string[] = [];
	page.on("request", (request) => {
		const url = new URL(request.url());
		if (!url.href.startsWith("data:") && url.origin !== origin && !githubApi.test(url.href)) {
			foreign.push(url.href);
		}
	});
	page.on("console", (message) => {
		if (message.type() === "error" && !/Failed to load resource/.test(message.text())) {
			errors.push(message.text());
		}
	});
	page.on("pageerror", (error) => errors.push(String(error)));
	await page.goto("/", { waitUntil: "networkidle" });
	await page.waitForTimeout(1500);
	expect(foreign).toEqual([]);
	expect(errors).toEqual([]);
});

test.describe("reduced motion", () => {
	test.use({ contextOptions: { reducedMotion: "reduce" } });

	test("renders every section in its final state", async ({ page }) => {
		await page.goto("/");
		expect(await page.evaluate(() => document.documentElement.classList.contains("js-motion"))).toBe(false);
		const hidden = await page
			.locator("[data-reveal]")
			.evaluateAll((items) => items.filter((item) => getComputedStyle(item).opacity !== "1").length);
		expect(hidden).toBe(0);
	});

	test("passes an axe accessibility scan", async ({ page }) => {
		await page.goto("/");
		const results = await new AxeBuilder({ page }).analyze();
		expect(results.violations.map((violation) => `${violation.id}: ${violation.nodes.length}`)).toEqual([]);
	});
});

test("margin notes stay in the margin, or out of narrow pages entirely", async ({ page }) => {
	await page.goto("/");
	const note = page.locator(".margin-note").first();
	const copy = page.locator(".notebook-copy").first();
	await copy.scrollIntoViewIfNeeded();
	if ((page.viewportSize()?.width ?? 0) < 1080) {
		// An inline note would split the sentence it annotates.
		await expect(note).toBeHidden();
		return;
	}
	// With motion on, the copy fades in; a transform on it would re-anchor the note onto the text.
	await expect.poll(() => copy.evaluate((element) => Number(getComputedStyle(element).opacity))).toBe(1);
	const [noteBox, copyBox] = await Promise.all([note.boundingBox(), copy.boundingBox()]);
	expect(noteBox && copyBox && noteBox.x + noteBox.width <= copyBox.x).toBe(true);
});

test.describe("motion", () => {
	test.skip(({ viewport }) => (viewport?.width ?? 0) < 1080, "desktop-only motion checks");

	test("reveals content once the motion runtime is ready", async ({ page }) => {
		await page.goto("/");
		await expect(page.locator("html[data-motion='ready']")).toBeAttached({ timeout: 10_000 });
		await page.locator("#project-duck-detector").scrollIntoViewIfNeeded();
		await expect
			.poll(() =>
				page.locator("#project-duck-detector").evaluate((sheet) => Number(getComputedStyle(sheet).opacity)),
			)
			.toBeGreaterThan(0.99);
	});
});

test.describe("tall screens", () => {
	test.skip(({ hasTouch }) => hasTouch, "one tall viewport per engine is enough");
	test.use({ viewport: { height: 1366, width: 1024 } });

	test("content already on screen is revealed without scrolling", async ({ page }) => {
		await page.goto("/");
		await expect(page.locator("html[data-motion='ready']")).toBeAttached({ timeout: 10_000 });
		const heading = page.locator("#projects-title");
		await expect(heading).toBeInViewport();
		await expect
			.poll(() => heading.evaluate((element) => Number(getComputedStyle(element).opacity)))
			.toBeGreaterThan(0.99);
	});
});

test.describe("phone widths", () => {
	test.skip(({ hasTouch }) => hasTouch, "one run per engine is enough");

	test("the header keeps the lamp inside the page margins", async ({ page }) => {
		await page.goto("/");
		await page.evaluate(async () => {
			await document.fonts.ready;
		});
		for (const width of [320, 360, 375, 390, 402, 430]) {
			await page.setViewportSize({ height: 800, width });
			const lopsided = await page.evaluate(() => {
				const brand = document.querySelector(".brand")?.getBoundingClientRect();
				const pill = document.querySelector(".nav-pill")?.getBoundingClientRect();
				return brand && pill ? document.documentElement.clientWidth - pill.right - brand.left : Number.NaN;
			});
			// The frame clips horizontal overflow, so a pill wider than the shell only shows as uneven margins.
			expect(lopsided, `${width}px`).toBeCloseTo(0, 0);
		}
	});
});
