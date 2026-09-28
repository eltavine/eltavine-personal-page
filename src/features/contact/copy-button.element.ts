import { defineElement } from "../../lib/events.ts";

class CopyButton extends HTMLElement {
	#timer = 0;

	connectedCallback() {
		const button = this.querySelector("button");
		if (!button || !navigator.clipboard?.writeText) {
			return;
		}
		button.hidden = false;
		button.addEventListener("click", () => void this.#copy(button));
	}

	async #copy(button: HTMLButtonElement) {
		const label = button.querySelector("[data-copy-label]");
		const status = this.querySelector("[data-copy-status]");
		let message = "Copied";
		try {
			await navigator.clipboard.writeText(this.dataset.copy ?? "");
			button.dataset.state = "copied";
		} catch {
			message = "Copy failed";
			button.dataset.state = "error";
		}
		if (label) label.textContent = message;
		if (status) status.textContent = message === "Copied" ? "Fingerprint copied to clipboard." : message;

		window.clearTimeout(this.#timer);
		this.#timer = window.setTimeout(() => {
			delete button.dataset.state;
			if (label) label.textContent = "Copy";
			if (status) status.textContent = "";
		}, 1800);
	}
}

defineElement("copy-button", CopyButton);
