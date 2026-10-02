import { EVENTS, type SketchPlayDetail } from "../../lib/events.ts";
import type { MotionContext } from "../../motion/types.ts";

export const plugins = ["MotionPath"] as const;

type Gsap = MotionContext["gsap"];
type Timeline = ReturnType<Gsap["timeline"]>;

const SVG_NS = "http://www.w3.org/2000/svg";
const DRAWN = ".diagram-stroke, .diagram-fill";

function light(elements: Iterable<Element>, className = "is-lit", on = true) {
	for (const element of elements) {
		element.classList.toggle(className, on);
	}
}

function createPlayer(gsap: Gsap, svg: SVGSVGElement) {
	const scenario = svg.dataset.scenario ?? "";
	const byStep = new Map<number, Element[]>();
	for (const element of svg.querySelectorAll<SVGElement>("[data-step]")) {
		const step = Number(element.dataset.step);
		byStep.set(step, [...(byStep.get(step) ?? []), element]);
	}
	const steps = [...byStep.keys()].sort((a, b) => a - b);
	const all = [...byStep.values()].flat();
	const role = (name: string) => [...svg.querySelectorAll(`[data-role="${name}"]`)];
	const track = (name: string) => svg.querySelector<SVGPathElement>(`[data-role="${name}"]`);

	let packet: SVGCircleElement | null = null;
	if (track("packet-track") || track("pulse-track")) {
		packet = document.createElementNS(SVG_NS, "circle");
		packet.setAttribute("r", "5");
		packet.setAttribute("class", "sketch-packet");
		packet.style.opacity = "0";
		svg.append(packet);
	}

	const draw = (timeline: Timeline) => {
		steps.forEach((step, index) => {
			const elements = byStep.get(step) ?? [];
			const strokes = elements.filter((element) => element.matches(DRAWN));
			const fades = elements.filter((element) => !element.matches(DRAWN));
			const at = index * (scenario === "inspect" && step <= 6 ? 0.16 : 0.26);
			if (strokes.length > 0) {
				timeline.to(strokes, { duration: 0.5, ease: "power2.inOut", stagger: 0.02, strokeDashoffset: 0 }, at);
			}
			if (fades.length > 0) {
				timeline.to(fades, { autoAlpha: 1, duration: 0.35 }, at + 0.12);
			}
		});
	};

	const travel = (timeline: Timeline, name: string, duration: number) => {
		const path = track(name);
		if (!packet || !path) {
			return;
		}
		timeline
			.set(packet, { autoAlpha: 1 })
			.to(packet, {
				duration,
				ease: "power1.inOut",
				motionPath: { align: path, alignOrigin: [0.5, 0.5], path },
			})
			.to(packet, { autoAlpha: 0, duration: 0.2 });
	};

	const flourish = (timeline: Timeline, segment: string) => {
		if (scenario === "inspect") {
			const signals = role("signal");
			timeline.call(() => light(signals, "is-lit", false));
			signals.forEach((element, index) =>
				timeline.call(() => light([element]), [], `>+${index === 0 ? 0 : 0.03}`),
			);
			timeline
				.call(() => light(role("report")), [], ">+0.2")
				.call(() => light(signals.concat(role("report")), "is-lit", false), [], ">+1.4");
		}
		if (scenario === "pipeline" && segment !== "rollback") {
			travel(timeline, "packet-track", 2.4);
		}
		if (scenario === "pipeline" && (segment === "rollback" || segment === "all")) {
			const plane = role("data-plane");
			timeline
				.call(() => light(plane, "is-failing"))
				.call(() => light(role("lkg").concat(role("rollback"))), [], ">+0.6");
			travel(timeline, "rollback-track", 1.3);
			timeline
				.call(() => light(plane, "is-failing", false))
				.call(() => light(plane))
				.call(() => light(plane.concat(role("lkg"), role("rollback")), "is-lit", false), [], ">+1.2");
		}
		if (scenario === "layers") {
			const ui = svg.querySelector('[data-group="ui"]');
			const runtime = svg.querySelector('[data-group="runtime"]');
			if (ui && runtime) {
				timeline
					.to(ui, { duration: 0.6, ease: "back.out(2)", y: -14 }, ">")
					.to(runtime, { duration: 0.6, ease: "back.out(2)", y: 14 }, "<")
					.to([ui, runtime], { delay: 0.9, duration: 0.8, ease: "power2.inOut", y: 0 });
			}
		}
		if (scenario === "fleet") {
			travel(timeline, "pulse-track", 0.9);
			const phones = role("phone");
			phones.forEach((phone, index) => timeline.call(() => light([phone]), [], index === 0 ? ">" : ">+0.1"));
			timeline.call(() => light(phones, "is-lit", false), [], ">+1");
		}
		if (scenario === "hooks") {
			travel(timeline, "packet-track", 1.8);
			timeline
				.call(() => light(role("handler")))
				.call(() => light(role("handler"), "is-lit", false), [], ">+0.9");
			travel(timeline, "default-track", 0.9);
			timeline
				.call(() => light(role("default")))
				.call(() => light(role("default"), "is-lit", false), [], ">+1.2");
		}
	};

	let drawn = false;
	let current: Timeline | null = null;

	return {
		play(segment = "all", { replay = false } = {}) {
			current?.progress(1).kill();
			const timeline = gsap.timeline();
			if (replay) {
				gsap.set(
					all.filter((element) => element.matches(DRAWN)),
					{ strokeDashoffset: 1.01 },
				);
				gsap.set(
					all.filter((element) => !element.matches(DRAWN)),
					{ autoAlpha: 0 },
				);
				drawn = false;
			}
			if (!drawn) {
				draw(timeline);
				drawn = true;
			}
			flourish(timeline, segment);
			current = timeline;
		},
	};
}

export default function sketches({ enterAt, gsap, ScrollTrigger, roots }: MotionContext) {
	const players = new Map<string, ReturnType<typeof createPlayer>>();
	const triggers: ScrollTrigger[] = [];

	for (const figure of roots) {
		const svg = figure.querySelector<SVGSVGElement>("svg[data-live-sketch]");
		const project = figure.dataset.sketch;
		if (!svg || !project) {
			continue;
		}
		const player = createPlayer(gsap, svg);
		players.set(project, player);
		triggers.push(
			ScrollTrigger.create({
				once: true,
				onEnter: () => player.play("all"),
				start: enterAt(0.85),
				trigger: figure,
			}),
		);

		const button = figure.querySelector<HTMLButtonElement>("[data-sketch-play]");
		if (button) {
			button.hidden = false;
			button.addEventListener("click", () => player.play("all", { replay: true }));
		}
	}

	const onPlay = (event: Event) => {
		const { project, segment } = (event as CustomEvent<SketchPlayDetail>).detail;
		players.get(project)?.play(segment);
	};
	document.addEventListener(EVENTS.sketchPlay, onPlay);

	return () => {
		document.removeEventListener(EVENTS.sketchPlay, onPlay);
		for (const trigger of triggers) {
			trigger.kill();
		}
	};
}
