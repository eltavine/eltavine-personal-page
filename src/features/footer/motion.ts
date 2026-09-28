import type { MotionContext } from "../../motion/types.ts";

export default function footer({ enterAt, gsap, SplitText, roots }: MotionContext) {
	const wordmark = roots[0]?.querySelector<HTMLElement>("[data-wordmark]");
	const text = wordmark?.querySelector<HTMLElement>("[data-wordmark-text]");
	if (!wordmark || !text) {
		return;
	}

	const split = SplitText.create(text, { charsClass: "split-char", mask: "chars", type: "chars" });
	gsap
		.timeline({
			onComplete: () => split.revert(),
			scrollTrigger: { once: true, start: enterAt(0.92), trigger: wordmark },
		})
		.set(wordmark, { autoAlpha: 1 })
		.from(split.chars, { duration: 1.3, ease: "expo.out", stagger: 0.055, yPercent: 110 })
		.to(
			wordmark.querySelectorAll("[data-draw]"),
			{ duration: 1.1, ease: "power2.inOut", strokeDashoffset: 0 },
			0.7,
		);
}
