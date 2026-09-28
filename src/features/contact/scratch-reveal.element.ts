import { defineElement, emit, EVENTS } from "../../lib/events.ts";
import { assembleEmail } from "../../lib/format.ts";

const DONE_RATIO = 0.42;
const BRUSH = 24;
const canScratch = window.matchMedia("(any-pointer: fine), (any-pointer: coarse)");

/**
 * Crayon scratch art over the email slot. The address is only assembled once someone
 * scratches or presses the button; the button stays the keyboard and screen-reader path.
 */
class ScratchReveal extends HTMLElement {
	#canvas: HTMLCanvasElement | null = null;
	#context: CanvasRenderingContext2D | null = null;
	#last: { x: number; y: number } | null = null;
	#lastCheck = 0;
	#done = false;

	connectedCallback() {
		const button = this.querySelector<HTMLButtonElement>("[data-email-reveal]");
		button?.addEventListener("click", this.#onButton);
		button?.addEventListener("focus", () => this.#canvas?.classList.add("is-dismissed"));
		this.#canvas = this.querySelector("[data-scratch-canvas]");
		if (
			!button ||
			!this.#canvas ||
			!canScratch.matches ||
			window.matchMedia("(forced-colors: active)").matches
		) {
			return;
		}
		// The observer hands over the button's box from the rendering step, so painting never forces a layout.
		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries.find((item) => item.isIntersecting);
				if (entry) {
					observer.disconnect();
					void this.#paintWax(entry.boundingClientRect);
				}
			},
			{ rootMargin: "600px 0px" },
		);
		observer.observe(button);
	}

	get #email() {
		const { emailDomain = "", emailTld = "", emailUser = "" } = this.dataset;
		return emailUser && emailDomain && emailTld
			? assembleEmail({ domain: emailDomain, tld: emailTld, user: emailUser })
			: null;
	}

	#onButton = (event: Event) => {
		const button = event.currentTarget as HTMLButtonElement;
		if (button.dataset.state !== "primed") {
			button.dataset.state = "primed";
			const label = button.querySelector("[data-email-label]");
			if (label) label.textContent = "Reveal email";
			return;
		}
		this.#reveal({ focus: true });
	};

	async #paintWax(rect: DOMRectReadOnly) {
		const canvas = this.#canvas;
		if (!canvas || this.#done || rect.width === 0) {
			return;
		}
		const styles = getComputedStyle(this);
		const font = `600 1.25rem ${styles.getPropertyValue("--font-hand") || "cursive"}`;
		await document.fonts?.load(font).catch(() => []);
		const ratio = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = Math.round(rect.width * ratio);
		canvas.height = Math.round(rect.height * ratio);
		canvas.style.width = `${rect.width}px`;
		canvas.style.height = `${rect.height}px`;
		const context = canvas.getContext("2d", { willReadFrequently: true });
		if (!context) {
			return;
		}
		this.#context = context;
		context.scale(ratio, ratio);

		context.fillStyle = styles.getPropertyValue("--wax").trim() || "#1f1b16";
		context.beginPath();
		context.roundRect(0, 0, rect.width, rect.height, rect.height / 2);
		context.fill();
		for (let stroke = 0; stroke < 90; stroke++) {
			const y = Math.random() * rect.height;
			const x = Math.random() * rect.width;
			context.strokeStyle = `rgb(255 255 255 / ${0.03 + Math.random() * 0.05})`;
			context.lineWidth = 1 + Math.random() * 2;
			context.beginPath();
			context.moveTo(x, y);
			context.lineTo(x + 10 + Math.random() * 30, y + (Math.random() - 0.5) * 4);
			context.stroke();
		}
		context.fillStyle = styles.getPropertyValue("--wax-ink").trim() || "#fbf7ef";
		context.font = font;
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillText("scratch here ✎", rect.width / 2, rect.height / 2 + 1);

		canvas.hidden = false;
		canvas.addEventListener("pointerdown", this.#onDown);
	}

	#point(event: PointerEvent) {
		const rect = this.#canvas!.getBoundingClientRect();
		return { x: event.clientX - rect.left, y: event.clientY - rect.top };
	}

	#onDown = (event: PointerEvent) => {
		const canvas = this.#canvas!;
		canvas.setPointerCapture(event.pointerId);
		this.#prepareUnderlay();
		this.#last = this.#point(event);
		this.#scratch(this.#last);
		canvas.addEventListener("pointermove", this.#onMove);
		canvas.addEventListener("pointerup", this.#onUp, { once: true });
		canvas.addEventListener("pointercancel", this.#onUp, { once: true });
	};

	#onMove = (event: PointerEvent) => {
		const point = this.#point(event);
		this.#scratch(point);
		this.#last = point;
		if (event.timeStamp - this.#lastCheck > 120) {
			this.#lastCheck = event.timeStamp;
			if (this.#cleared() >= DONE_RATIO) {
				this.#reveal({ focus: false });
			}
		}
	};

	#onUp = () => {
		this.#canvas?.removeEventListener("pointermove", this.#onMove);
		this.#last = null;
		if (!this.#done && this.#cleared() >= DONE_RATIO) {
			this.#reveal({ focus: false });
		}
	};

	#scratch(point: { x: number; y: number }) {
		const context = this.#context;
		if (!context || !this.#last) {
			return;
		}
		// destination-out erases by the source alpha, so the brush must be fully opaque.
		context.globalCompositeOperation = "destination-out";
		context.strokeStyle = "#000";
		context.lineCap = "round";
		context.lineJoin = "round";
		context.lineWidth = BRUSH;
		context.beginPath();
		context.moveTo(this.#last.x, this.#last.y);
		context.lineTo(point.x + (Math.random() - 0.5) * 2, point.y + (Math.random() - 0.5) * 2);
		context.stroke();
	}

	#cleared() {
		const canvas = this.#canvas;
		const context = this.#context;
		if (!canvas || !context || canvas.width === 0) {
			return 0;
		}
		const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
		let clear = 0;
		let total = 0;
		for (let index = 3; index < data.length; index += 4 * 8) {
			total++;
			if ((data[index] ?? 0) < 40) clear++;
		}
		return total === 0 ? 0 : clear / total;
	}

	#prepareUnderlay() {
		const underlay = this.querySelector("[data-scratch-underlay]");
		const email = this.#email;
		if (underlay && email && !underlay.textContent) {
			underlay.textContent = email;
		}
	}

	#reveal({ focus }: { focus: boolean }) {
		const email = this.#email;
		const button = this.querySelector<HTMLButtonElement>("[data-email-reveal]");
		if (this.#done || !email || !button) {
			return;
		}
		this.#done = true;
		const link = document.createElement("a");
		link.className = "email-reveal";
		link.href = `mailto:${email}`;
		link.dataset.state = "revealed";
		link.setAttribute("aria-label", `Email ${email}`);
		const text = document.createElement("span");
		text.dataset.emailLabel = "";
		text.textContent = email;
		link.append(text);
		button.replaceWith(link);
		this.#canvas?.classList.add("is-done");
		this.dataset.revealed = "";
		if (focus) {
			link.focus({ preventScroll: true });
		}
		emit(link, EVENTS.emailRevealed);
	}
}

defineElement("scratch-reveal", ScratchReveal);
