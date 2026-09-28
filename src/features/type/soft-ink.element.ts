import { defineElement, onIdle } from "../../lib/events.ts";

const root = document.documentElement;

function wantsSoftInk() {
	const connection = (navigator as { connection?: { saveData?: boolean } }).connection;
	return !connection?.saveData && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
}

/**
 * First paint uses Fraunces with SOFT pinned (small, preloaded). Once the page is idle, the
 * four-axis cut is fetched and swapped in; at rest both render identically, so only the
 * hover "ink bleed" and the settling headline reveal that anything changed.
 */
const INTERACTIONS = ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"] as const;

class SoftInk extends HTMLElement {
	#started = false;
	#timer = 0;

	connectedCallback() {
		if (!wantsSoftInk() || root.classList.contains("soft-ink")) {
			return;
		}
		// The first interaction (a hover needs the pointer to move first) or a quiet five seconds, whichever comes first,
		// so the ~270 KB never competes with first paint.
		for (const type of INTERACTIONS) {
			window.addEventListener(type, this.#start, { once: true, passive: true });
		}
		const arm = () => (this.#timer = window.setTimeout(this.#start, 5000));
		if (document.readyState === "complete") {
			arm();
		} else {
			window.addEventListener("load", arm, { once: true });
		}
	}

	#start = () => {
		if (this.#started) {
			return;
		}
		this.#started = true;
		window.clearTimeout(this.#timer);
		for (const type of INTERACTIONS) {
			window.removeEventListener(type, this.#start);
		}
		onIdle(() => void this.#swap(), 1500);
	};

	async #swap() {
		const family = getComputedStyle(root).getPropertyValue("--font-display-soft").split(",")[0]?.trim();
		if (!family || !document.fonts) {
			return;
		}
		try {
			await Promise.all([
				document.fonts.load(`400 1em ${family}`),
				document.fonts.load(`italic 300 1em ${family}`),
			]);
			root.classList.add("soft-ink");
		} catch {}
	}
}

defineElement("soft-ink", SoftInk);
