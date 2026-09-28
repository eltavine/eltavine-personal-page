import { defineElement } from "../../lib/events.ts";

/** A draftsman's loupe over the footer wordmark that shows the construction lines underneath. */
class WordmarkLens extends HTMLElement {
	#frame = 0;
	#hideTimer = 0;
	#point = { x: 0, y: 0 };

	connectedCallback() {
		this.addEventListener("pointerenter", this.#onEnter);
		this.addEventListener("pointerdown", this.#onDown);
		this.addEventListener("pointermove", this.#onMove);
		this.addEventListener("pointerleave", this.#onLeave);
		this.addEventListener("pointerup", this.#onRelease);
		this.addEventListener("pointercancel", this.#onRelease);
	}

	#render = () => {
		this.#frame = 0;
		this.style.setProperty("--lens-x", `${this.#point.x}px`);
		this.style.setProperty("--lens-y", `${this.#point.y}px`);
	};

	#track(event: PointerEvent) {
		const rect = this.getBoundingClientRect();
		this.#point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
		if (!this.#frame) {
			this.#frame = window.requestAnimationFrame(this.#render);
		}
	}

	#show(event: PointerEvent) {
		window.clearTimeout(this.#hideTimer);
		this.#track(event);
		this.#render();
		this.dataset.lens = "";
	}

	#hide(delay = 0) {
		window.clearTimeout(this.#hideTimer);
		this.#hideTimer = window.setTimeout(() => delete this.dataset.lens, delay);
	}

	#onEnter = (event: PointerEvent) => event.pointerType === "mouse" && this.#show(event);
	#onDown = (event: PointerEvent) => event.pointerType !== "mouse" && this.#show(event);
	#onMove = (event: PointerEvent) => "lens" in this.dataset && this.#track(event);
	#onLeave = (event: PointerEvent) => event.pointerType === "mouse" && this.#hide();
	#onRelease = (event: PointerEvent) => event.pointerType !== "mouse" && this.#hide(900);
}

defineElement("wordmark-lens", WordmarkLens);
