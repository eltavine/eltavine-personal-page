import { defineElement } from "../../lib/events.ts";

const compact = window.matchMedia("(max-width: 720px)");

/** Details ship open (so nothing is hidden without JS) and fold away only on narrow screens. */
class MobileFold extends HTMLElement {
	#sync = () => {
		const details = this.querySelector("details");
		if (details) {
			details.open = !compact.matches;
		}
	};

	connectedCallback() {
		this.#sync();
		compact.addEventListener("change", this.#sync);
	}

	disconnectedCallback() {
		compact.removeEventListener("change", this.#sync);
	}
}

defineElement("mobile-fold", MobileFold);
