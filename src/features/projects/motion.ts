import type { MotionContext } from "../../motion/types.ts";

export default function projects({ enterAt, gsap, SplitText, conditions, roots }: MotionContext) {
	const section = roots[0];
	if (!section) {
		return;
	}

	for (const sheet of gsap.utils.toArray<HTMLElement>("[data-project-sheet]", section)) {
		const number = sheet.querySelector("[data-sheet-number]");
		const title = sheet.querySelector("[data-sheet-title]");
		const doodle = sheet.querySelector<HTMLElement>("[data-doodle]");
		const stamp = sheet.querySelector<HTMLElement>("[data-stamp]");
		const photo = sheet.querySelector<HTMLElement>("[data-photo]");
		const series = sheet.querySelectorAll('.star-chart [data-role="series"]');
		const items = sheet.querySelectorAll("[data-sheet-item]");
		const notes = sheet.querySelectorAll("[data-sheet-note]");
		const timeline = gsap.timeline({
			defaults: { duration: 1, ease: "expo.out" },
			scrollTrigger: { once: true, start: enterAt(0.96), trigger: sheet },
		});

		timeline.fromTo(
			sheet,
			{ autoAlpha: 0, rotation: -0.6, y: 44 },
			{ autoAlpha: 1, duration: 1.1, rotation: 0, y: 0 },
		);
		if (number) {
			timeline.fromTo(number, { autoAlpha: 0, yPercent: 40 }, { autoAlpha: 1, yPercent: 0 }, 0.1);
			gsap.fromTo(
				number,
				{ y: 40 },
				{
					ease: "none",
					scrollTrigger: { end: "bottom top", scrub: true, start: "top bottom", trigger: sheet },
					y: -40,
				},
			);
		}
		if (title) {
			const split = SplitText.create(title, { mask: "words", type: "words", wordsClass: "split-word" });
			timeline.from(split.words, { stagger: 0.07, yPercent: 110 }, 0.2);
			// The masks clip descenders and glyph overhang, so they only live for the entrance.
			timeline.eventCallback("onComplete", () => split.revert());
		}
		if (doodle) {
			// Doodle strokes carry pathLength="1", so the dash offset is animated in those units.
			gsap.set(doodle, { autoAlpha: 1 });
			timeline.fromTo(
				doodle.querySelectorAll(".diagram-stroke, .diagram-fill"),
				{ strokeDashoffset: 1.01 },
				{ duration: 1.5, ease: "power2.inOut", stagger: 0.12, strokeDashoffset: 0 },
				0.35,
			);
			timeline.fromTo(
				doodle.querySelectorAll(".diagram-solid"),
				{ autoAlpha: 0 },
				{ autoAlpha: 1, duration: 0.5 },
				1.1,
			);
		}
		if (stamp) {
			const rotation = Number(gsap.getProperty(stamp, "rotation")) || 0;
			timeline.fromTo(
				stamp,
				{ autoAlpha: 0, rotation: rotation - 16, scale: 1.9 },
				{ autoAlpha: 1, duration: 0.55, ease: "back.out(2.4)", rotation, scale: 1 },
				0.9,
			);
		}
		if (items.length > 0) {
			timeline.fromTo(items, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, stagger: 0.07, y: 0 }, 0.45);
		}
		if (photo) {
			const rotation = Number(gsap.getProperty(photo, "rotation")) || 0;
			timeline.fromTo(
				photo,
				{ autoAlpha: 0, rotation: rotation - 6, y: 50 },
				{ autoAlpha: 1, duration: 1.1, ease: "back.out(1.3)", rotation, y: 0 },
				0.6,
			);
		}
		if (series.length > 0) {
			gsap.fromTo(
				series,
				{ strokeDashoffset: 1.01 },
				{
					duration: 1.6,
					ease: "power2.inOut",
					scrollTrigger: { once: true, start: enterAt(0.8), trigger: photo ?? sheet },
					strokeDashoffset: 0,
				},
			);
		}
		if (notes.length > 0) {
			timeline.fromTo(notes, { autoAlpha: 0, x: 24 }, { autoAlpha: 1, stagger: 0.1, x: 0 }, 0.55);
		}
	}

	const index = section.querySelector("[data-project-index]");
	const progress = section.querySelector("[data-index-progress]");
	const sheets = section.querySelector("[data-project-sheets]");
	if (conditions.desktop && index && progress && sheets) {
		gsap.fromTo(
			index,
			{ autoAlpha: 0, x: -24 },
			{
				autoAlpha: 1,
				duration: 1,
				ease: "expo.out",
				scrollTrigger: { once: true, start: enterAt(0.75), trigger: sheets },
				x: 0,
			},
		);
		gsap.fromTo(
			progress,
			{ scaleY: 0 },
			{
				ease: "none",
				scaleY: 1,
				scrollTrigger: { end: "bottom 45%", scrub: 0.4, start: "top 45%", trigger: sheets },
			},
		);
	}
}
