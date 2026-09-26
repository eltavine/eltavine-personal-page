import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

const drawableShapes = "path, line, polyline, polygon, circle, ellipse, rect";

const restingRotation = (element) => Number(gsap.getProperty(element, "rotation")) || 0;

function revealSketch(sketch) {
	gsap
		.timeline({ scrollTrigger: { once: true, start: "top 85%", trigger: sketch } })
		.to(sketch.querySelectorAll(".sketch-stroke, .sketch-fill"), {
			duration: 0.7,
			ease: "power2.inOut",
			stagger: 0.03,
			strokeDashoffset: 0,
		})
		.to(
			sketch.querySelectorAll(".sketch-dashed, .sketch-text"),
			{ autoAlpha: 1, duration: 0.45, ease: "power1.out", stagger: 0.025 },
			0.25,
		);
}

function revealSheet(sheet) {
	const number = sheet.querySelector("[data-sheet-number]");
	const title = sheet.querySelector("[data-sheet-title]");
	const doodle = sheet.querySelector("[data-doodle]");
	const stamp = sheet.querySelector("[data-stamp]");
	const photo = sheet.querySelector("[data-photo]");
	const items = sheet.querySelectorAll("[data-sheet-item]");
	const notes = sheet.querySelectorAll("[data-sheet-note]");
	const sketch = sheet.querySelector("[data-sketch]");

	if (sketch) {
		revealSketch(sketch);
	}

	const timeline = gsap.timeline({
		defaults: { duration: 1, ease: "expo.out" },
		scrollTrigger: { once: true, start: "top 96%", trigger: sheet },
	});

	timeline.fromTo(
		sheet,
		{ autoAlpha: 0, rotation: -0.6, y: 44 },
		{ autoAlpha: 1, duration: 1.1, rotation: 0, y: 0 },
	);

	if (number) {
		timeline.fromTo(number, { autoAlpha: 0, yPercent: 40 }, { autoAlpha: 1, yPercent: 0 }, 0.1);
	}

	if (title) {
		const split = SplitText.create(title, { mask: "words", type: "words", wordsClass: "split-word" });
		timeline.from(split.words, { stagger: 0.07, yPercent: 110 }, 0.2);
	}

	if (doodle) {
		gsap.set(doodle, { autoAlpha: 1 });
		timeline.from(
			doodle.querySelectorAll(drawableShapes),
			{ drawSVG: "0%", duration: 1.5, ease: "power2.inOut", stagger: 0.14 },
			0.35,
		);
	}

	if (stamp) {
		const rotation = restingRotation(stamp);
		timeline.fromTo(
			stamp,
			{ autoAlpha: 0, rotation: rotation - 16, scale: 1.9 },
			{ autoAlpha: 1, duration: 0.55, ease: "back.out(2.4)", rotation, scale: 1 },
			0.7,
		);
	}

	if (items.length > 0) {
		timeline.fromTo(
			items,
			{ autoAlpha: 0, y: 18 },
			{ autoAlpha: 1, stagger: 0.07, y: 0 },
			0.45,
		);
	}

	if (photo) {
		const rotation = restingRotation(photo);
		timeline.fromTo(
			photo,
			{ autoAlpha: 0, rotation: rotation - 6, y: 50 },
			{ autoAlpha: 1, duration: 1.1, ease: "back.out(1.3)", rotation, y: 0 },
			0.6,
		);
	}

	if (notes.length > 0) {
		timeline.fromTo(
			notes,
			{ autoAlpha: 0, x: 24 },
			{ autoAlpha: 1, stagger: 0.1, x: 0 },
			0.55,
		);
	}

	if (number) {
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
}

export function initProjects({ desktop }) {
	const section = document.querySelector("[data-projects]");

	if (!section) {
		return undefined;
	}

	for (const sheet of gsap.utils.toArray("[data-project-sheet]", section)) {
		revealSheet(sheet);
	}

	const index = section.querySelector("[data-project-index]");
	const progress = section.querySelector("[data-index-progress]");
	const sheets = section.querySelector("[data-project-sheets]");

	if (desktop && index && progress && sheets) {
		gsap.fromTo(
			index,
			{ autoAlpha: 0, x: -24 },
			{
				autoAlpha: 1,
				duration: 1,
				ease: "expo.out",
				scrollTrigger: { once: true, start: "top 75%", trigger: sheets },
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

	return undefined;
}
