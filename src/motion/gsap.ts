// The only module that imports GSAP; everything else receives it through the motion context.
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

export const optionalPlugins = {
	MotionPath: async () => {
		const { MotionPathPlugin } = await import("gsap/MotionPathPlugin");
		gsap.registerPlugin(MotionPathPlugin);
	},
} as const;

export type OptionalPlugin = keyof typeof optionalPlugins;

export { gsap, ScrollTrigger, SplitText };
