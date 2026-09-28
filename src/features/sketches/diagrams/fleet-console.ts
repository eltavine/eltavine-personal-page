import type { Diagram, DiagramItem } from "../../../lib/diagram.ts";

const selected = new Set([0, 1, 3, 5, 6, 8]);
const phones = [56, 104].flatMap((y, row) =>
	[0, 1, 2, 3, 4].map((column): DiagramItem => ({
		fill: selected.has(row * 5 + column),
		h: 38,
		type: "phone",
		w: 22,
		x: 14 + column * 34,
		y,
	})),
);

export default {
	caption: "Fig. 04b — operations desk sketch (illustrative) · details redacted",
	description:
		"Illustrative wireframe of the yunheshiguang operations desk: batch actions, a grid of connected Android devices with a selection, a redacted task log, and a batch progress bar.",
	height: 220,
	roughness: 0.75,
	width: 340,
	items: [
		{ h: 212, title: "operations desk", type: "window", w: 332, x: 4, y: 4 },
		{ h: 18, label: "Select", type: "box", w: 62, x: 12, y: 26 },
		{ h: 18, label: "Shot", type: "box", w: 50, x: 80, y: 26 },
		{ h: 18, label: "Install", type: "box", w: 70, x: 136, y: 26 },
		{ kind: "small", text: "6 selected", type: "text", x: 214, y: 39 },
		...phones,
		{ h: 122, r: 8, type: "frame", w: 136, x: 192, y: 52 },
		{ kind: "small", text: "Task log", type: "text", x: 202, y: 68 },
		...[0, 1, 2, 3, 4].map((line): DiagramItem => ({
			h: 6,
			type: "bar",
			w: 110 - line * 14,
			x: 202,
			y: 80 + line * 17,
		})),
		{ h: 14, r: 6, type: "frame", w: 316, x: 12, y: 190 },
		{ fill: true, h: 14, type: "box", w: 196, x: 12, y: 190 },
	],
} satisfies Diagram;
