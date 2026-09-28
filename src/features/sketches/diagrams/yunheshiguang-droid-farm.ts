import type { Diagram, DiagramItem } from "../../../lib/diagram.ts";

const fleet = [216, 254, 292].flatMap((x) => [154, 208].map((y) => ({ x, y })));

export default {
	caption: "Fig. 04 — fleet control path",
	description:
		"Sketch: a Tauri shell with a React and TypeScript UI calls Rust commands through generated Protobuf contracts, and those commands drive ADB and scrcpy across a fleet of Android devices in batches.",
	height: 272,
	scenario: "fleet",
	width: 340,
	items: [
		{ h: 46, label: "Tauri shell", step: 1, sub: "React · TypeScript UI", type: "box", w: 156, x: 12, y: 10 },
		{
			points: [
				[90, 58],
				[90, 96],
			],
			step: 2,
			type: "arrow",
		},
		{ kind: "small", step: 2, text: "generated protobuf", type: "text", x: 100, y: 81 },
		{
			h: 46,
			label: "Rust commands",
			step: 3,
			sub: "devices · groups · tasks",
			type: "box",
			w: 156,
			x: 12,
			y: 98,
		},
		{
			points: [
				[90, 146],
				[90, 182],
			],
			step: 4,
			type: "arrow",
		},
		{ h: 40, label: "ADB · scrcpy", step: 5, type: "box", w: 156, x: 12, y: 184 },
		{
			points: [
				[170, 204],
				[200, 196],
			],
			step: 6,
			type: "arrow",
		},
		{ dashed: true, h: 140, r: 12, step: 7, type: "frame", w: 130, x: 202, y: 124 },
		{ kind: "small", step: 7, text: "Fleet", type: "text", x: 214, y: 144 },
		...fleet.map(({ x, y }, index): DiagramItem => ({
			fill: index === 2,
			h: 44,
			role: "phone",
			step: 8,
			type: "phone",
			w: 26,
			x,
			y,
		})),
		{ kind: "hand", step: 9, text: "one action,", type: "text", x: 214, y: 32 },
		{ kind: "hand", step: 9, text: "the whole batch", type: "text", x: 214, y: 56 },
		{
			accent: true,
			points: [
				[282, 66],
				[294, 93],
				[280, 120],
			],
			step: 9,
			type: "arrow",
		},
		{
			points: [
				[170, 204],
				[200, 196],
				[267, 194],
			],
			role: "pulse-track",
			type: "track",
		},
	],
} satisfies Diagram;
