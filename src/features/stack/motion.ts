import type { MotionContext } from "../../motion/types.ts";

export default function stack({ enterAt, gsap, roots }: MotionContext) {
	for (const row of roots.flatMap((root) => [...root.querySelectorAll<HTMLElement>("[data-specimen-row]")])) {
		const label = row.querySelector("[data-specimen-label]");
		const tiles = row.querySelectorAll("[data-tile]");
		const timeline = gsap.timeline({ scrollTrigger: { once: true, start: enterAt(0.86), trigger: row } });
		if (label) {
			timeline.fromTo(
				label,
				{ autoAlpha: 0, x: -24 },
				{ autoAlpha: 1, duration: 0.9, ease: "expo.out", x: 0 },
			);
		}
		timeline.fromTo(
			tiles,
			{ autoAlpha: 0, scale: 0.92, y: 22 },
			{ autoAlpha: 1, duration: 0.8, ease: "back.out(1.7)", scale: 1, stagger: 0.045, y: 0 },
			0.1,
		);
	}
}
