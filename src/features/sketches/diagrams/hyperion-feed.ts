import type { Diagram, DiagramItem } from "../../../lib/diagram.ts";

const rail = [40, 72, 104, 136].map((cy, index): DiagramItem => ({
	cx: 24,
	cy,
	fill: index === 0,
	h: 14,
	type: "ellipse",
	w: 14,
}));

const tabs = [
	{ label: "Feed", w: 50, x: 54 },
	{ label: "Follow", w: 64, x: 110 },
	{ label: "Hot", w: 42, x: 180 },
	{ label: "Daily", w: 56, x: 228 },
].map(({ label, w, x }, index): DiagramItem => ({
	fill: index === 0,
	h: 18,
	label,
	type: "box",
	w,
	x,
	y: 26,
}));

export default {
	caption: "Fig. 06b — home feed sketch (illustrative)",
	description:
		"Illustrative wireframe of the Zhihu-Hyperion home feed on a wide screen: a navigation rail, feed tabs, an answer card with an AI summary chip, a promoted post collapsed by the filter, and an article card with a thumbnail.",
	height: 220,
	roughness: 0.75,
	width: 340,
	items: [
		{ h: 212, title: "home", type: "window", w: 332, x: 4, y: 4 },
		{
			points: [
				[44, 20],
				[44, 216],
			],
			type: "line",
		},
		...rail,
		...tabs,
		{ h: 56, r: 8, type: "frame", w: 270, x: 54, y: 54 },
		{ h: 7, type: "bar", w: 150, x: 64, y: 64 },
		{ h: 5, type: "bar", w: 200, x: 64, y: 80 },
		{ h: 5, type: "bar", w: 188, x: 64, y: 92 },
		{ h: 18, label: "AI", type: "box", w: 40, x: 274, y: 60 },
		{ dashed: true, h: 24, r: 8, type: "frame", w: 270, x: 54, y: 118 },
		{ kind: "small", text: "filtered · promoted", type: "text", x: 66, y: 134 },
		{ h: 56, r: 8, type: "frame", w: 270, x: 54, y: 150 },
		{ h: 7, type: "bar", w: 128, x: 64, y: 160 },
		{ h: 5, type: "bar", w: 176, x: 64, y: 176 },
		{ h: 5, type: "bar", w: 140, x: 64, y: 188 },
		{ fill: true, h: 40, type: "box", w: 60, x: 256, y: 158 },
	],
} satisfies Diagram;
