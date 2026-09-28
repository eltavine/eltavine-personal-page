import { EVENTS } from "../../lib/events.ts";
import type { MotionContext } from "../../motion/types.ts";

type FlipScene = HTMLElement & { show?: (face: "front" | "back") => void };

export default function contact({ enterAt, gsap, roots }: MotionContext) {
	const section = roots[0];
	const scene = section?.querySelector<FlipScene>("[data-postcard]");
	if (!section || !scene) {
		return;
	}

	const stamp = scene.querySelector("[data-postage]");
	const postmarkText = scene.querySelector("[data-postmark-text]");
	const greeting = scene.querySelector("[data-greeting]");
	const lines = scene.querySelectorAll("[data-postcard-line]");
	const groups = scene.querySelectorAll("[data-fingerprint] span");
	const drawn = scene.querySelectorAll("[data-draw]");

	// Arrive picture side up, then turn over to the message once it is in view.
	scene.show?.("front");
	const timeline = gsap.timeline({
		defaults: { duration: 1, ease: "expo.out" },
		scrollTrigger: { once: true, start: enterAt(0.78), trigger: scene },
	});
	timeline.fromTo(
		scene,
		{ autoAlpha: 0, rotation: 2.5, y: 90 },
		{ autoAlpha: 1, duration: 1.2, rotation: 0, y: 0 },
	);
	timeline.call(() => scene.show?.("back"), [], 1.3);
	if (greeting) {
		timeline.fromTo(
			greeting,
			{ clipPath: "inset(-20% 100% -20% 0)" },
			{ clipPath: "inset(-20% -2% -20% 0)", duration: 1.2, ease: "power2.inOut" },
			1.9,
		);
	}
	if (stamp) {
		const rotation = Number(gsap.getProperty(stamp, "rotation")) || 0;
		timeline.fromTo(
			stamp,
			{ autoAlpha: 0, rotation: rotation + 12, scale: 1.3 },
			{ autoAlpha: 1, duration: 0.7, ease: "back.out(2)", rotation, scale: 1 },
			1.9,
		);
	}
	timeline.to(drawn, { duration: 0.9, ease: "power2.inOut", stagger: 0.06, strokeDashoffset: 0 }, 2.2);
	if (postmarkText) {
		timeline.fromTo(postmarkText, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 2.4);
	}
	if (lines.length > 0) {
		timeline.fromTo(lines, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, stagger: 0.08, y: 0 }, 1.95);
	}
	groups.forEach((group, index) => {
		timeline.to(
			group,
			{
				duration: 1,
				ease: "none",
				scrambleText: { chars: "0123456789ABCDEF", speed: 0.4, text: group.textContent ?? "" },
			},
			2.2 + index * 0.06,
		);
	});

	const onReveal = (event: Event) => {
		const label = (event.target as Element).querySelector("[data-email-label]");
		if (label) {
			gsap.to(label, {
				duration: 1,
				ease: "none",
				scrambleText: { chars: "lowerCase", speed: 0.6, text: label.textContent ?? "" },
			});
		}
	};
	document.addEventListener(EVENTS.emailRevealed, onReveal);
	return () => document.removeEventListener(EVENTS.emailRevealed, onReveal);
}
