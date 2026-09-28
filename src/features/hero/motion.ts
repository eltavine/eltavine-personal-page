import type { MotionContext } from "../../motion/types.ts";

export default function hero({ gsap, conditions, roots }: MotionContext) {
	const hero = roots[0];
	if (!hero) {
		return;
	}

	const copy = hero.querySelector("[data-hero-copy]");
	const sticker = hero.querySelector("[data-hero-sticker]");
	const sparkles = gsap.utils.toArray<HTMLElement>("[data-hero-sparkle]", hero);
	const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", hero);

	for (const sparkle of sparkles) {
		gsap.to(sparkle, {
			delay: gsap.utils.random(0, 1.2),
			duration: gsap.utils.random(2.6, 4.4),
			ease: "sine.inOut",
			repeat: -1,
			rotation: gsap.utils.random(-22, 22),
			yoyo: true,
			yPercent: gsap.utils.random(-45, 45),
		});
	}

	const scrollOut = {
		ease: "none",
		scrollTrigger: { end: "bottom top", scrub: 0.6, start: "top top", trigger: hero },
	};
	gsap.to(copy, { ...scrollOut, autoAlpha: 0.25, yPercent: -12 });
	gsap.to(sticker, { ...scrollOut, rotation: 6, yPercent: -18 });
	for (const sparkle of sparkles) {
		const layer = sparkle.closest<HTMLElement>("[data-depth]");
		if (layer && layer !== sticker) {
			gsap.to(layer, { ...scrollOut, yPercent: -320 * Number(layer.dataset.depth ?? 1) });
		}
	}

	if (!conditions.finePointer) {
		return;
	}

	const movers = layers.map((layer) => ({
		depth: Number(layer.dataset.depth ?? 1),
		x: gsap.quickTo(layer, "x", { duration: 1.1, ease: "expo.out" }),
		y: gsap.quickTo(layer, "y", { duration: 1.1, ease: "expo.out" }),
	}));
	const onMove = (event: PointerEvent) => {
		const rect = hero.getBoundingClientRect();
		const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
		const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
		for (const mover of movers) {
			mover.x(offsetX * 22 * mover.depth);
			mover.y(offsetY * 16 * mover.depth);
		}
	};
	const onLeave = () => {
		for (const mover of movers) {
			mover.x(0);
			mover.y(0);
		}
	};
	hero.addEventListener("pointermove", onMove);
	hero.addEventListener("pointerleave", onLeave);
	return () => {
		hero.removeEventListener("pointermove", onMove);
		hero.removeEventListener("pointerleave", onLeave);
	};
}
