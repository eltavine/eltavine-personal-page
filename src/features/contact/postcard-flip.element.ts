import { defineElement } from "../../lib/events.ts";

type Face = "front" | "back";

class PostcardFlip extends HTMLElement {
	connectedCallback() {
		const button = this.querySelector<HTMLButtonElement>("[data-postcard-turn]");
		if (button) {
			button.hidden = false;
			button.addEventListener("click", () => this.show(this.face === "back" ? "front" : "back"));
		}
		this.show(this.face);
	}

	get face(): Face {
		return this.dataset.face === "front" ? "front" : "back";
	}

	show(face: Face) {
		this.dataset.face = face;
		for (const side of this.querySelectorAll<HTMLElement>("[data-postcard-face]")) {
			const hidden = side.dataset.postcardFace !== face;
			side.inert = hidden;
			side.setAttribute("aria-hidden", String(hidden));
		}
		const label = this.querySelector("[data-postcard-turn-label]");
		if (label) {
			label.textContent = face === "back" ? "See the picture side" : "Back to the message";
		}
	}
}

defineElement("postcard-flip", PostcardFlip);
