import type { Diagram, DiagramItem } from "../../../lib/diagram.ts";

const feed = [
	{ kept: true, text: "answer" },
	{ kept: false, text: "ad" },
	{ kept: true, text: "article" },
	{ kept: false, text: "promoted" },
	{ kept: false, text: "paywalled" },
	{ kept: true, text: "video" },
];

export default {
	caption: "Fig. 06 — feed filtered on the device",
	description:
		"Sketch: answers, articles, and videos from the Zhihu feed pass through on-device filters for rules, quality, and an optional ONNX semantic model, while ads, promoted posts, and paywalled columns are struck out before the feed reaches the screen.",
	height: 286,
	scenario: "inspect",
	width: 340,
	items: [
		{ kind: "small", text: "Zhihu feed", type: "text", x: 12, y: 24 },
		...feed.flatMap(({ kept, text }, index): DiagramItem[] => {
			const x = 12 + (index % 3) * 108;
			const y = 34 + Math.floor(index / 3) * 30;
			const role = kept ? "signal" : undefined;
			const card: DiagramItem[] = [
				{ dashed: !kept, h: 22, r: 6, role, step: index + 1, type: "frame", w: 100, x, y },
				{ anchor: "middle", kind: "mono", role, step: index + 1, text, type: "text", x: x + 50, y: y + 15 },
			];
			const strike: DiagramItem = {
				accent: true,
				points: [
					[x + 8, y + 11],
					[x + 92, y + 11],
				],
				step: 7,
				type: "line",
			};
			return kept ? card : [...card, strike];
		}),
		{
			points: [
				[12, 102],
				[328, 102],
				[222, 156],
				[118, 156],
			],
			step: 8,
			type: "polygon",
		},
		{ anchor: "middle", kind: "label", step: 8, text: "Filters", type: "text", x: 170, y: 124 },
		{ anchor: "middle", kind: "sub", step: 8, text: "rules · quality · ONNX", type: "text", x: 170, y: 142 },
		{
			points: [
				[170, 158],
				[170, 184],
			],
			step: 9,
			type: "arrow",
		},
		{ h: 78, role: "report", step: 10, type: "phone", w: 56, x: 142, y: 186 },
		...[204, 218, 232].map((y): DiagramItem => ({
			h: 8,
			role: "report",
			step: 10,
			type: "bar",
			w: 38,
			x: 151,
			y,
		})),
		{ anchor: "middle", kind: "small", role: "report", step: 10, text: "Feed", type: "text", x: 170, y: 280 },
		{ kind: "hand", step: 11, text: "filtered on", type: "text", x: 218, y: 206 },
		{ kind: "hand", step: 11, text: "the device,", type: "text", x: 218, y: 230 },
		{ kind: "hand", step: 11, text: "no telemetry", type: "text", x: 218, y: 254 },
		{
			accent: true,
			points: [
				[214, 238],
				[206, 230],
				[200, 220],
			],
			step: 11,
			type: "arrow",
		},
	],
} satisfies Diagram;
