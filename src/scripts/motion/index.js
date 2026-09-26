import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { initHero } from "./hero.js";
import { initProjects } from "./projects.js";
import { initEmailScramble, initSections } from "./sections.js";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, ScrambleTextPlugin);

const root = document.documentElement;

function waitForFonts(timeout = 1500) {
	if (!document.fonts?.ready) {
		return Promise.resolve();
	}

	return Promise.race([
		document.fonts.ready,
		new Promise((resolve) => window.setTimeout(resolve, timeout)),
	]);
}

export async function initMotion() {
	if (!root.classList.contains("js-motion")) {
		return;
	}

	root.dataset.motion = "ready";
	await waitForFonts();

	gsap.matchMedia().add(
		{
			desktop: "(min-width: 1080px)",
			finePointer: "(hover: hover) and (pointer: fine)",
			motion: "(prefers-reduced-motion: no-preference)",
		},
		(context) => {
			const { desktop, finePointer, motion } = context.conditions;

			if (!motion) {
				return undefined;
			}

			const cleanups = [
				initHero({ finePointer }),
				initProjects({ desktop }),
				initSections(),
				initEmailScramble(),
			];

			return () => {
				for (const cleanup of cleanups) {
					cleanup?.();
				}
			};
		},
	);
}
