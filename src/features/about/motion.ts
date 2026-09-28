import type { MotionContext } from "../../motion/types.ts";

export default function about({ enterAt, gsap, roots }: MotionContext) {
	const notebook = roots[0]?.querySelector<HTMLElement>("[data-notebook]");
	if (!notebook) {
		return;
	}

	gsap.fromTo(
		notebook,
		{ autoAlpha: 0, y: 70 },
		{
			autoAlpha: 1,
			duration: 1.2,
			ease: "expo.out",
			scrollTrigger: { once: true, start: enterAt(0.8), trigger: notebook },
			y: 0,
		},
	);

	for (const page of notebook.querySelectorAll<HTMLElement>("[data-notebook-page]")) {
		const greeting = page.querySelector("[data-notebook-greeting]");
		const lines = [...page.querySelectorAll<HTMLElement>("[data-notebook-line]")];
		// Any transform would make a line the containing block of its margin notes and drag them off the margin.
		const anchoring = lines.filter((line) => line.querySelector(".margin-note"));
		const sliding = lines.filter((line) => !anchoring.includes(line));
		const rules = page.querySelectorAll("[data-rule]");
		const marks = page.querySelectorAll("[data-draw]");
		const highlights = page.querySelectorAll("[data-highlight]");
		const timeline = gsap.timeline({
			defaults: { duration: 0.9, ease: "expo.out" },
			scrollTrigger: { once: true, start: enterAt(0.72), trigger: page },
		});

		if (greeting) {
			timeline.fromTo(
				greeting,
				{ clipPath: "inset(-20% 100% -20% 0)" },
				{ clipPath: "inset(-20% -2% -20% 0)", duration: 1.1, ease: "power2.inOut" },
				0.15,
			);
		}
		if (anchoring.length > 0) {
			timeline.fromTo(anchoring, { autoAlpha: 0 }, { autoAlpha: 1 }, 0.3);
		}
		if (sliding.length > 0) {
			timeline.fromTo(sliding, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, stagger: 0.1, y: 0 }, 0.4);
		}
		if (highlights.length > 0) {
			timeline.to(highlights, { "--highlight-size": "100%", duration: 0.9, ease: "power2.inOut" }, 1);
		}
		if (rules.length > 0) {
			timeline.fromTo(rules, { autoAlpha: 0, x: 16 }, { autoAlpha: 1, stagger: 0.14, x: 0 }, 0.2);
		}
		if (marks.length > 0) {
			timeline.to(marks, { duration: 0.55, ease: "power2.inOut", stagger: 0.16, strokeDashoffset: 0 }, 0.55);
		}
	}
}
