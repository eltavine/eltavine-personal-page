import { defineElement, emit, EVENTS, type SketchPlayDetail } from "../../lib/events.ts";

/** Lets the native anchor scroll to the sketch, then asks it to replay the matching segment once it is in view. */
class EvidenceLink extends HTMLElement {
	connectedCallback() {
		this.querySelector("a")?.addEventListener("click", this.#onClick);
	}

	#onClick = (event: Event) => {
		const link = event.currentTarget as HTMLAnchorElement;
		const target = document.getElementById(link.hash.slice(1));
		const detail: SketchPlayDetail = {
			project: this.dataset.project ?? "",
			segment: this.dataset.segment ?? "all",
		};
		if (!target || !detail.project) {
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					observer.disconnect();
					emit(document, EVENTS.sketchPlay, detail);
				}
			},
			{ threshold: 0.6 },
		);
		observer.observe(target);
	};
}

defineElement("evidence-link", EvidenceLink);
