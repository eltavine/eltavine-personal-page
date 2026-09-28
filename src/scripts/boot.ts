import { afterPaint } from "../lib/events.ts";

const root = document.documentElement;

afterPaint(() => {
	if (!root.classList.contains("js-motion")) {
		return;
	}
	import("../motion/runtime.ts")
		.then(({ startMotion }) => startMotion())
		.catch(() => root.classList.remove("js-motion"));
});
