import { defineElement } from "../../lib/events.ts";

class StackFilter extends HTMLElement {
	#pinned: string | null = null;

	connectedCallback() {
		const chips = [...this.querySelectorAll<HTMLButtonElement>("[data-stack-filter]")];
		for (const chip of chips) {
			chip.disabled = false;
			chip.addEventListener("click", () => this.#pin(chip.dataset.stackFilter ?? null));
			chip.addEventListener("pointerenter", (event) => {
				if (event.pointerType === "mouse") this.#highlight(chip.dataset.stackFilter ?? null);
			});
			chip.addEventListener("pointerleave", (event) => {
				if (event.pointerType === "mouse") this.#highlight(this.#pinned);
			});
		}
		document.addEventListener("click", this.#onExternalFocus);
	}

	disconnectedCallback() {
		document.removeEventListener("click", this.#onExternalFocus);
	}

	#onExternalFocus = (event: Event) => {
		const link = (event.target as Element | null)?.closest<HTMLElement>("[data-stack-focus]");
		if (link) {
			this.#pinned = null;
			this.#pin(link.dataset.stackFocus ?? null);
		}
	};

	#chip(id: string | null) {
		return id ? this.querySelector<HTMLButtonElement>(`[data-stack-filter="${CSS.escape(id)}"]`) : null;
	}

	#highlight(id: string | null) {
		const chip = this.#chip(id);
		const specimen = this.querySelector<HTMLElement>("[data-specimen]");
		let matches = 0;
		for (const tile of this.querySelectorAll<HTMLElement>("[data-tile]")) {
			const isMatch = Boolean(chip && id) && (tile.dataset.refs ?? "").split(" ").includes(id!);
			tile.classList.toggle("is-match", isMatch);
			matches += Number(isMatch);
		}
		if (specimen) {
			specimen.toggleAttribute("data-focusing", Boolean(chip));
			specimen.style.setProperty("--focus-color", chip?.style.getPropertyValue("--chip-color") ?? "");
			specimen.style.setProperty("--focus-ink", chip?.style.getPropertyValue("--chip-ink") ?? "");
		}
		return matches;
	}

	#pin(id: string | null) {
		this.#pinned = this.#pinned === id ? null : id;
		const matches = this.#highlight(this.#pinned);
		for (const chip of this.querySelectorAll<HTMLButtonElement>("[data-stack-filter]")) {
			chip.setAttribute("aria-pressed", String(chip.dataset.stackFilter === this.#pinned));
		}
		const status = this.querySelector("[data-stack-status]");
		if (status) {
			const title = this.#chip(this.#pinned)?.dataset.title;
			status.textContent = title
				? `${matches} ${matches === 1 ? "tool" : "tools"} highlighted for ${title}.`
				: "Highlight cleared.";
		}
	}
}

defineElement("stack-filter", StackFilter);
