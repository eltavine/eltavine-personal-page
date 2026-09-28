import { defineElement } from "../../lib/events.ts";

/** Borrows the front image's resolved source for the folded flap, so peeling costs no extra download. */
class StickerPeel extends HTMLElement {
	connectedCallback() {
		this.addEventListener("pointerenter", this.#prepare, { once: true });
		this.addEventListener("focusin", this.#prepare, { once: true });
	}

	#prepare = () => {
		const front = this.querySelector<HTMLImageElement>(".sticker-front img");
		const flap = this.querySelector<HTMLImageElement>("[data-flap]");
		const source = front?.currentSrc || front?.src;
		if (!flap || !source) {
			return;
		}
		flap.src = source;
		this.dataset.ready = "";
	};
}

defineElement("sticker-peel", StickerPeel);
