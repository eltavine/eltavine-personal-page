import { gsap, optionalPlugins, ScrollTrigger, SplitText } from "./gsap.ts";
import type { MotionContext, MotionModule } from "./types.ts";

const modules = import.meta.glob<MotionModule>("../features/*/motion.ts");
const root = document.documentElement;
const queries = {
	desktop: window.matchMedia("(min-width: 1080px)"),
	finePointer: window.matchMedia("(hover: hover) and (pointer: fine)"),
	motion: window.matchMedia("(prefers-reduced-motion: no-preference)"),
};

type Entry = { module: MotionModule; name: string };

const enterAt: MotionContext["enterAt"] = (ratio) => () =>
	`top ${Math.round(Math.max(window.innerHeight * ratio, window.innerHeight - 120))}px`;

function waitForFonts(timeout = 1500) {
	return Promise.race([
		document.fonts?.ready ?? Promise.resolve(),
		new Promise((resolve) => window.setTimeout(resolve, timeout)),
	]);
}

/** Gives the browser a turn between modules so setup never becomes one long task. */
function yieldToMain() {
	const scheduler = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
	return scheduler?.yield ? scheduler.yield() : new Promise<void>((resolve) => window.setTimeout(resolve, 0));
}

async function loadRequested(): Promise<Entry[]> {
	const names = new Set(
		[...document.querySelectorAll<HTMLElement>("[data-motion]")].flatMap((element) =>
			(element.dataset.motion ?? "").split(/\s+/).filter(Boolean),
		),
	);
	const loaded = await Promise.all(
		[...names].map(async (name) => {
			const load = modules[`../features/${name}/motion.ts`];
			if (!load) {
				console.warn(`No motion module for data-motion="${name}"`);
				return null;
			}
			return { module: await load(), name };
		}),
	);
	const entries = loaded
		.filter((entry) => entry !== null)
		.sort((a, b) => (a.module.order ?? 0) - (b.module.order ?? 0));
	await Promise.all(
		[...new Set(entries.flatMap((entry) => entry.module.plugins ?? []))].map((name) =>
			optionalPlugins[name](),
		),
	);
	return entries;
}

let generation = 0;
let contexts: ReturnType<typeof gsap.context>[] = [];

async function build(entries: Entry[]) {
	const current = ++generation;
	for (const context of contexts) {
		context.revert();
	}
	contexts = [];
	if (!queries.motion.matches) {
		return;
	}
	const conditions: MotionContext["conditions"] = {
		desktop: queries.desktop.matches,
		finePointer: queries.finePointer.matches,
	};
	for (const { module, name } of entries) {
		await yieldToMain();
		if (current !== generation) {
			return;
		}
		const roots = [...document.querySelectorAll<HTMLElement>(`[data-motion~="${name}"]`)];
		const context = gsap.context(() =>
			module.default({ conditions, enterAt, gsap, roots, ScrollTrigger, SplitText }),
		);
		contexts.push(context);
	}
	ScrollTrigger.refresh();
}

export async function startMotion() {
	const [entries] = await Promise.all([loadRequested(), waitForFonts()]);
	if (!root.classList.contains("js-motion")) {
		return;
	}
	root.dataset.motion = "ready";
	await build(entries);
	for (const query of Object.values(queries)) {
		query.addEventListener("change", () => void build(entries));
	}

	// Folded sheets open, late images decode and fonts swap after setup, so trigger positions follow the page size.
	let timer = 0;
	new ResizeObserver(() => {
		window.clearTimeout(timer);
		timer = window.setTimeout(() => ScrollTrigger.refresh(), 250);
	}).observe(document.body);
}
