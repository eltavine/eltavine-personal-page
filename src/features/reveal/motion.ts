import type { MotionContext } from "../../motion/types.ts";

/** Runs after every feature module, animating section heads and any `[data-reveal]` nobody else claimed. */
export const order = 100;

export default function reveal({ enterAt, gsap, SplitText }: MotionContext) {
	for (const head of gsap.utils.toArray<HTMLElement>("[data-section-head]")) {
		const eyebrow = head.querySelector("[data-eyebrow]");
		const label = head.querySelector("[data-eyebrow-label]");
		const title = head.querySelector("h2");
		const lead = head.querySelector("[data-lead]");
		const timeline = gsap.timeline({
			defaults: { duration: 1, ease: "expo.out" },
			scrollTrigger: { once: true, start: enterAt(0.8), trigger: head },
		});

		if (eyebrow) {
			timeline.fromTo(eyebrow, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0);
		}
		if (label) {
			timeline.to(
				label,
				{
					duration: 0.9,
					ease: "none",
					scrambleText: { chars: "upperCase", speed: 0.5, text: label.textContent ?? "" },
				},
				0,
			);
		}
		if (title) {
			// No word masks here: a mask would clip the marks, circles and insertions that overhang the words.
			const split = SplitText.create(title, { ignore: ".marked", type: "words", wordsClass: "split-word" });
			timeline
				.fromTo(title, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.1)
				.from(split.words, { autoAlpha: 0, stagger: 0.06, yPercent: 45 }, 0.1)
				.from(head.querySelectorAll(".marked"), { autoAlpha: 0, yPercent: 50 }, 0.25);
		}
		timeline.to(
			head.querySelectorAll("[data-draw]"),
			{ duration: 0.8, ease: "power2.inOut", stagger: 0.12, strokeDashoffset: 0 },
			0.75,
		);
		if (lead) {
			timeline.fromTo(lead, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0 }, 0.45);
		}
	}

	for (const element of gsap.utils.toArray<HTMLElement>("[data-reveal]")) {
		if (gsap.getTweensOf(element).length > 0) {
			continue;
		}
		gsap.fromTo(
			element,
			{ autoAlpha: 0, y: 28 },
			{
				autoAlpha: 1,
				duration: 1,
				ease: "expo.out",
				scrollTrigger: { once: true, start: enterAt(0.88), trigger: element },
				y: 0,
			},
		);
	}

	// Anything drawn that no module picked up (e.g. marks outside a section head) still gets drawn in.
	for (const mark of gsap.utils.toArray<SVGElement>("[data-draw]")) {
		if (gsap.getTweensOf(mark).length === 0) {
			gsap.to(mark, {
				duration: 0.9,
				ease: "power2.inOut",
				scrollTrigger: { once: true, start: enterAt(0.9), trigger: mark },
				strokeDashoffset: 0,
			});
		}
	}
}
