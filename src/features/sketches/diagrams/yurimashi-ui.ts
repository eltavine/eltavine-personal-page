import type { Diagram, DiagramItem } from "../../../lib/diagram.ts";

const agents = [46, 64, 82, 100].flatMap((y, index): DiagramItem[] => [
	{ cx: 17, cy: y + 3.5, r: 2.6, type: "dot" },
	{ h: 7, type: "bar", w: 58 - index * 6, x: 26, y },
]);

export default {
	caption: "Fig. 03b — workspace UI sketch (illustrative) · details redacted",
	description:
		"Illustrative wireframe of the Yurimashi workspace: an agent list in a sidebar, a conversation with redacted messages, provider chips for AI and TTS, and a message input.",
	height: 220,
	roughness: 0.75,
	width: 340,
	items: [
		{ h: 212, title: "workspace", type: "window", w: 332, x: 4, y: 4 },
		{
			points: [
				[96, 20],
				[96, 216],
			],
			type: "line",
		},
		{ kind: "small", text: "Agents", type: "text", x: 12, y: 36 },
		...agents,
		{ h: 34, r: 8, type: "frame", w: 150, x: 110, y: 30 },
		{ h: 6, type: "bar", w: 124, x: 118, y: 40 },
		{ h: 6, type: "bar", w: 88, x: 118, y: 52 },
		{ fill: true, h: 26, type: "box", w: 126, x: 198, y: 74 },
		{ h: 40, r: 8, type: "frame", w: 176, x: 110, y: 110 },
		{ h: 6, type: "bar", w: 150, x: 118, y: 120 },
		{ h: 6, type: "bar", w: 132, x: 118, y: 131 },
		{ h: 6, type: "bar", w: 70, x: 118, y: 142 },
		{ h: 18, label: "AI", type: "box", w: 40, x: 110, y: 160 },
		{ h: 18, label: "TTS", type: "box", w: 48, x: 156, y: 160 },
		{ h: 22, r: 8, type: "frame", w: 214, x: 110, y: 188 },
		{ h: 5, type: "bar", w: 96, x: 120, y: 197 },
		{
			points: [
				[298, 199],
				[314, 199],
			],
			type: "arrow",
		},
	],
} satisfies Diagram;
