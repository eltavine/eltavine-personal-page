import type { Diagram, DiagramItem } from "../../../lib/diagram.ts";

const chats = [44, 76, 108, 140].flatMap((y, index): DiagramItem[] => [
	{ cx: 20, cy: y + 8, h: 14, type: "ellipse", w: 14 },
	{ h: 6, type: "bar", w: 46 - index * 4, x: 33, y: y + 1 },
	{ h: 5, type: "bar", w: 54 - index * 5, x: 33, y: y + 11 },
]);

export default {
	caption: "Fig. 05b — chat window sketch (illustrative)",
	description:
		"Illustrative wireframe of a SereinGram chat: a chat list, a ghost mode chip in the header, a deleted message kept in place with a mark, an edited message, and the message input.",
	height: 220,
	roughness: 0.75,
	width: 340,
	items: [
		{ h: 212, title: "chat", type: "window", w: 332, x: 4, y: 4 },
		{
			points: [
				[96, 20],
				[96, 216],
			],
			type: "line",
		},
		{ kind: "small", text: "Chats", type: "text", x: 12, y: 36 },
		...chats,
		{ h: 28, r: 6, type: "frame", w: 84, x: 8, y: 70 },
		{ h: 7, type: "bar", w: 74, x: 110, y: 30 },
		{ fill: true, h: 18, label: "Ghost", type: "box", w: 62, x: 262, y: 25 },
		{ h: 30, r: 8, type: "frame", w: 150, x: 110, y: 52 },
		{ h: 6, type: "bar", w: 124, x: 118, y: 60 },
		{ h: 6, type: "bar", w: 82, x: 118, y: 70 },
		{ dashed: true, h: 40, r: 8, type: "frame", w: 168, x: 110, y: 92 },
		{ h: 6, type: "bar", w: 140, x: 118, y: 101 },
		{ h: 6, type: "bar", w: 92, x: 118, y: 111 },
		{ anchor: "end", kind: "small", text: "deleted", type: "text", x: 270, y: 127 },
		{ h: 30, r: 8, type: "frame", w: 174, x: 150, y: 142 },
		{ h: 6, type: "bar", w: 100, x: 158, y: 150 },
		{ h: 6, type: "bar", w: 70, x: 158, y: 160 },
		{ anchor: "end", kind: "small", text: "edited", type: "text", x: 316, y: 165 },
		{ h: 24, r: 8, type: "frame", w: 214, x: 110, y: 184 },
		{ h: 5, type: "bar", w: 96, x: 120, y: 194 },
		{
			points: [
				[298, 196],
				[314, 196],
			],
			type: "arrow",
		},
	],
} satisfies Diagram;
