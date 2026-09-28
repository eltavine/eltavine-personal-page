import { themeColors } from "../../config/site.ts";
import { defineElement, emit, EVENTS } from "../../lib/events.ts";

type Theme = keyof typeof themeColors;

const STORAGE_KEY = "eltavine-theme";
const PULL_MAX = 44;
const PULL_TRIGGER = 18;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

const currentTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

class ThemeLamp extends HTMLElement {
	#switch: HTMLButtonElement | null = null;
	#cord: HTMLElement | null = null;
	#glow: HTMLElement | null = null;
	#startY = 0;
	#pull = 0;
	#frame = 0;
	#pointer = { x: 0, y: 0 };

	connectedCallback() {
		this.#switch = this.querySelector("[data-lamp-switch]");
		this.#cord = this.querySelector("[data-lamp-cord]");
		this.#glow = document.querySelector("[data-lamp-glow]");
		this.#switch?.addEventListener("click", this.#onClick);
		this.#cord?.addEventListener("pointerdown", this.#onPointerDown);
		window.addEventListener("pointermove", this.#onGlowMove, { passive: true });
		this.#apply(currentTheme());
	}

	disconnectedCallback() {
		window.removeEventListener("pointermove", this.#onGlowMove);
	}

	#onClick = () => this.#toggle(this.#switch);

	#onPointerDown = (event: PointerEvent) => {
		const cord = this.#cord;
		if (!cord) {
			return;
		}
		cord.setPointerCapture(event.pointerId);
		cord.dataset.pulling = "";
		this.#startY = event.clientY;
		this.#pull = 0;
		cord.addEventListener("pointermove", this.#onPointerMove);
		cord.addEventListener("pointerup", this.#onPointerUp, { once: true });
		cord.addEventListener("pointercancel", this.#onPointerUp, { once: true });
	};

	#onPointerMove = (event: PointerEvent) => {
		this.#pull = Math.min(Math.max(event.clientY - this.#startY, 0), PULL_MAX);
		this.#cord?.style.setProperty("--pull", String(this.#pull));
	};

	#onPointerUp = (event: PointerEvent) => {
		const cord = this.#cord;
		if (!cord) {
			return;
		}
		cord.removeEventListener("pointermove", this.#onPointerMove);
		delete cord.dataset.pulling;
		cord.style.setProperty("--pull", "0");
		const tapped = this.#pull < 4 && event.type === "pointerup";
		if (tapped || this.#pull >= PULL_TRIGGER) {
			this.#toggle(cord.querySelector(".lamp-cord__bead"));
		}
	};

	#onGlowMove = (event: PointerEvent) => {
		if (!finePointer.matches || reducedMotion.matches) {
			return;
		}
		this.#pointer = { x: event.clientX, y: event.clientY };
		if (!this.#frame) {
			this.#frame = window.requestAnimationFrame(() => {
				this.#frame = 0;
				this.#glow?.style.setProperty("--lamp-x", `${this.#pointer.x}px`);
				this.#glow?.style.setProperty("--lamp-y", `${this.#pointer.y}px`);
			});
		}
	};

	#apply(theme: Theme) {
		const root = document.documentElement;
		root.dataset.theme = theme;
		root.style.colorScheme = theme;
		for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
			meta.setAttribute("content", themeColors[theme]);
		}
		this.#switch?.setAttribute("aria-pressed", String(theme === "dark"));
		this.#switch?.setAttribute(
			"aria-label",
			theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
		);
	}

	#toggle(origin: Element | null) {
		const next: Theme = currentTheme() === "dark" ? "light" : "dark";
		const commit = () => {
			try {
				window.localStorage.setItem(STORAGE_KEY, next);
			} catch {}
			this.#apply(next);
			emit(document, EVENTS.themeChange, { theme: next });
		};

		if (!document.startViewTransition || reducedMotion.matches || !origin) {
			commit();
			return;
		}

		const rect = origin.getBoundingClientRect();
		const x = rect.left + rect.width / 2;
		const y = rect.top + rect.height / 2;
		const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
		document
			.startViewTransition(commit)
			.ready.then(() => {
				document.documentElement.animate(
					{ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
					{
						duration: 680,
						easing: "cubic-bezier(0.65, 0, 0.35, 1)",
						pseudoElement: "::view-transition-new(root)",
					},
				);
			})
			.catch(() => {});
	}
}

defineElement("theme-lamp", ThemeLamp);
