/** DOM events features use to talk to each other without importing each other. */
export const EVENTS = {
	emailRevealed: "eltavine:email-revealed",
	sketchPlay: "eltavine:sketch-play",
	themeChange: "eltavine:theme-change",
} as const;

export interface SketchPlayDetail {
	project: string;
	segment: string;
}

export function emit<T>(target: EventTarget, name: (typeof EVENTS)[keyof typeof EVENTS], detail?: T) {
	target.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
}

export function onIdle(callback: () => void, timeout = 1000) {
	if (typeof window.requestIdleCallback === "function") {
		window.requestIdleCallback(callback, { timeout });
	} else {
		globalThis.setTimeout(callback, Math.min(timeout, 200));
	}
}

function firstContentfulPaint(fallbackMs = 3000) {
	return new Promise<void>((resolve) => {
		if (performance.getEntriesByName("first-contentful-paint").length > 0) {
			resolve();
			return;
		}
		const timer = window.setTimeout(resolve, fallbackMs);
		try {
			new PerformanceObserver((list, observer) => {
				if (list.getEntriesByName("first-contentful-paint").length > 0) {
					observer.disconnect();
					window.clearTimeout(timer);
					resolve();
				}
			}).observe({ buffered: true, type: "paint" });
		} catch {}
	});
}

const loaded = () =>
	new Promise<void>((resolve) =>
		document.readyState === "complete"
			? resolve()
			: window.addEventListener("load", () => resolve(), { once: true }),
	);

/**
 * After `load` and after the first contentful paint, then when idle. On fast machines `load` can
 * fire before anything is painted, so waiting for `load` alone lets optional work race first paint.
 */
export function afterPaint(callback: () => void, timeout = 1000) {
	void Promise.all([loaded(), firstContentfulPaint()]).then(() => onIdle(callback, timeout));
}

export function defineElement(name: string, constructor: CustomElementConstructor) {
	if (!customElements.get(name)) {
		customElements.define(name, constructor);
	}
}
