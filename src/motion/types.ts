import type { gsap } from "gsap";
import type { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SplitText } from "gsap/SplitText";
import type { OptionalPlugin } from "./gsap.ts";

export interface MotionContext {
	gsap: typeof gsap;
	ScrollTrigger: typeof ScrollTrigger;
	SplitText: typeof SplitText;
	conditions: { desktop: boolean; finePointer: boolean };
	/**
	 * ScrollTrigger `start` for entrances: when the trigger's top reaches `ratio` of the viewport height,
	 * but never more than a sliver above the bottom edge, so content already on screen is not left hidden.
	 */
	enterAt: (ratio: number) => () => string;
	/** Elements that opted into this module with `data-motion="<name>"`. */
	roots: HTMLElement[];
}

export type Cleanup = () => void;

export interface MotionModule {
	default: (context: MotionContext) => Cleanup | void;
	/** Lower runs first; the generic reveal runs last so it can skip anything already animated. */
	order?: number;
	plugins?: readonly OptionalPlugin[];
}
