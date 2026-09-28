import { defineElement } from "../../lib/events.ts";

/** Tracks the sheet in the middle of the viewport and lends its crayon to the index. */
class ProjectsSpy extends HTMLElement {
	#observer: IntersectionObserver | null = null;

	connectedCallback() {
		const sheets = [...this.querySelectorAll<HTMLElement>("[data-project-sheet]")];
		const links = [...this.querySelectorAll<HTMLElement>("[data-index-link]")];
		const visible = new Map<Element, boolean>();

		this.#observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					visible.set(entry.target, entry.isIntersecting);
				}
				const active = sheets.find((sheet) => visible.get(sheet));
				if (!active) {
					return;
				}
				const { crayon, projectId } = active.dataset;
				this.style.setProperty("--project-color", `var(--crayon-${crayon})`);
				this.style.setProperty("--project-ink", `var(--crayon-${crayon}-ink)`);
				for (const link of links) {
					link.toggleAttribute("data-active", link.dataset.indexLink === projectId);
				}
			},
			{ rootMargin: "-38% 0px -60% 0px" },
		);
		for (const sheet of sheets) {
			this.#observer.observe(sheet);
		}
	}

	disconnectedCallback() {
		this.#observer?.disconnect();
	}
}

defineElement("projects-spy", ProjectsSpy);
