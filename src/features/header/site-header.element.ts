import { defineElement } from "../../lib/events.ts";

class SiteHeader extends HTMLElement {
	#frame = 0;
	#lastY = 0;
	#observer: IntersectionObserver | null = null;

	connectedCallback() {
		window.addEventListener("scroll", this.#onScroll, { passive: true });
		this.addEventListener("focusin", this.#onFocus);
		this.#frame = window.requestAnimationFrame(() => {
			this.#lastY = window.scrollY;
			this.#update();
		});
		this.#observeSections();
	}

	disconnectedCallback() {
		window.removeEventListener("scroll", this.#onScroll);
		this.#observer?.disconnect();
	}

	#onScroll = () => {
		if (!this.#frame) {
			this.#frame = window.requestAnimationFrame(this.#update);
		}
	};

	#onFocus = () => {
		this.dataset.hidden = "false";
	};

	#update = () => {
		this.#frame = 0;
		const y = window.scrollY;
		const delta = y - this.#lastY;
		this.dataset.scrolled = String(y > 12);
		if (Math.abs(delta) < 6) {
			return;
		}
		this.dataset.hidden = String(delta > 0 && y > 240 && !this.contains(document.activeElement));
		this.#lastY = y;
	};

	#observeSections() {
		const links = [...this.querySelectorAll<HTMLAnchorElement>("[data-nav-link]")];
		const sections = links
			.map((link) => document.getElementById(link.hash.slice(1)))
			.filter((section): section is HTMLElement => section !== null);
		const visible = new Map<Element, boolean>();

		this.#observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					visible.set(entry.target, entry.isIntersecting);
				}
				const active = sections.find((section) => visible.get(section)) ?? null;
				for (const link of links) {
					const isActive = active !== null && link.hash === `#${active.id}`;
					link.toggleAttribute("data-active", isActive);
					if (isActive) {
						link.setAttribute("aria-current", "location");
					} else {
						link.removeAttribute("aria-current");
					}
				}
			},
			{ rootMargin: "-45% 0px -54% 0px" },
		);
		for (const section of sections) {
			this.#observer.observe(section);
		}
	}
}

defineElement("site-header", SiteHeader);
