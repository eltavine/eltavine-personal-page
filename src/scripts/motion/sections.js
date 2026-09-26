import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

const drawn = (scope) => scope.querySelectorAll("[data-draw] path");

function revealSectionHeads() {
	for (const head of gsap.utils.toArray("[data-section-head]")) {
		const eyebrow = head.querySelector("[data-eyebrow]");
		const eyebrowLabel = head.querySelector("[data-eyebrow-label]");
		const title = head.querySelector("h2");
		const marked = head.querySelectorAll(".marked");
		const lead = head.querySelector("[data-lead]");
		const timeline = gsap.timeline({
			defaults: { duration: 1, ease: "expo.out" },
			scrollTrigger: { once: true, start: "top 80%", trigger: head },
		});

		if (eyebrow) {
			timeline.fromTo(eyebrow, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0);
		}

		if (eyebrowLabel) {
			timeline.to(
				eyebrowLabel,
				{
					duration: 0.9,
					ease: "none",
					scrambleText: { chars: "upperCase", speed: 0.5, text: eyebrowLabel.textContent ?? "" },
				},
				0,
			);
		}

		if (title) {
			const split = SplitText.create(title, {
				ignore: ".marked",
				mask: "words",
				type: "words",
				wordsClass: "split-word",
			});
			timeline
				.fromTo(title, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.1)
				.from(split.words, { stagger: 0.06, yPercent: 110 }, 0.1)
				.from(marked, { autoAlpha: 0, yPercent: 50 }, 0.25);
		}

		timeline.to(
			drawn(head),
			{ duration: 0.8, ease: "power2.inOut", stagger: 0.12, strokeDashoffset: 0 },
			0.75,
		);

		if (lead) {
			timeline.fromTo(lead, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0 }, 0.45);
		}
	}
}

function revealStack() {
	for (const row of gsap.utils.toArray("[data-specimen-row]")) {
		const label = row.querySelector("[data-specimen-label]");
		const tiles = row.querySelectorAll("[data-tile]");
		const timeline = gsap.timeline({
			scrollTrigger: { once: true, start: "top 84%", trigger: row },
		});

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
			{
				autoAlpha: 1,
				duration: 0.8,
				ease: "back.out(1.7)",
				scale: 1,
				stagger: { each: 0.045, from: "center", grid: "auto" },
				y: 0,
			},
			0.1,
		);
	}
}

function revealPostcard() {
	const card = document.querySelector("[data-postcard]");

	if (!card) {
		return;
	}

	const stamp = card.querySelector("[data-postage]");
	const postmarkText = card.querySelector("[data-postmark-text]");
	const greeting = card.querySelector("[data-greeting]");
	const lines = card.querySelectorAll("[data-postcard-line]");
	const groups = card.querySelectorAll("[data-fingerprint] span");
	const timeline = gsap.timeline({
		defaults: { duration: 1, ease: "expo.out" },
		scrollTrigger: { once: true, start: "top 78%", trigger: card },
	});

	timeline.fromTo(
		card,
		{ autoAlpha: 0, rotation: 2.5, y: 90 },
		{ autoAlpha: 1, duration: 1.2, rotation: 0, y: 0 },
	);

	if (greeting) {
		timeline.fromTo(
			greeting,
			{ clipPath: "inset(-20% 100% -20% 0)" },
			{ clipPath: "inset(-20% -2% -20% 0)", duration: 1.2, ease: "power2.inOut" },
			0.5,
		);
	}

	if (stamp) {
		const rotation = Number(gsap.getProperty(stamp, "rotation")) || 0;
		timeline.fromTo(
			stamp,
			{ autoAlpha: 0, rotation: rotation + 12, scale: 1.3 },
			{ autoAlpha: 1, duration: 0.7, ease: "back.out(2)", rotation, scale: 1 },
			0.5,
		);
	}

	timeline.to(
		drawn(card),
		{ duration: 0.9, ease: "power2.inOut", stagger: 0.06, strokeDashoffset: 0 },
		0.85,
	);

	if (postmarkText) {
		timeline.fromTo(postmarkText, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 1.1);
	}

	if (lines.length > 0) {
		timeline.fromTo(lines, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, stagger: 0.08, y: 0 }, 0.65);
	}

	groups.forEach((group, index) => {
		timeline.to(
			group,
			{
				duration: 1,
				ease: "none",
				scrambleText: { chars: "0123456789ABCDEF", speed: 0.4, text: group.textContent ?? "" },
			},
			0.9 + index * 0.06,
		);
	});
}

function revealFooter() {
	const wordmark = document.querySelector("[data-wordmark]");
	const text = wordmark?.querySelector("[data-wordmark-text]");

	if (!wordmark || !text) {
		return;
	}

	const split = SplitText.create(text, { charsClass: "split-char", mask: "chars", type: "chars" });
	gsap
		.timeline({ scrollTrigger: { once: true, start: "top 92%", trigger: wordmark } })
		.set(wordmark, { autoAlpha: 1 })
		.from(split.chars, { duration: 1.3, ease: "expo.out", stagger: 0.055, yPercent: 110 })
		.to(drawn(wordmark), { duration: 1.1, ease: "power2.inOut", strokeDashoffset: 0 }, 0.7);
}

function revealRemaining() {
	for (const element of gsap.utils.toArray("[data-reveal]")) {
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
				scrollTrigger: { once: true, start: "top 88%", trigger: element },
				y: 0,
			},
		);
	}
}

export function initSections() {
	revealSectionHeads();
	revealStack();
	revealPostcard();
	revealFooter();
	revealRemaining();
	return undefined;
}

export function initEmailScramble() {
	const onReveal = (event) => {
		const label = event.target.querySelector("[data-email-label]");
		if (!label) {
			return;
		}
		gsap.to(label, {
			duration: 1,
			ease: "none",
			scrambleText: { chars: "lowerCase", speed: 0.6, text: label.textContent ?? "" },
		});
	};

	document.addEventListener("eltavine:email-revealed", onReveal);
	return () => document.removeEventListener("eltavine:email-revealed", onReveal);
}
