import type { Diagram, DiagramItem } from "../../../lib/diagram.ts";

const signals = ["bootloader", "root", "hook", "mount", "virtualization", "attestation"];

export default {
	caption: "Fig. 01 — local inspection flow",
	description:
		"Sketch: bootloader, root, hook, mount, virtualization, and attestation signals feed Kotlin checks and native C++ and ASM probes, which produce a local report on the device.",
	height: 262,
	scenario: "inspect",
	width: 340,
	items: [
		{ dashed: true, h: 196, r: 16, type: "frame", w: 332, x: 4, y: 14 },
		{ kind: "small", text: "On device", type: "text", x: 18, y: 36 },
		...signals.flatMap((signal, index): DiagramItem[] => [
			{ role: "signal", step: index + 1, type: "check", x: 18, y: 52 + index * 23 },
			{ kind: "mono", step: index + 1, text: signal, type: "text", x: 34, y: 60 + index * 23 },
		]),
		{ step: 7, type: "brace", x: 134, y1: 48, y2: 180 },
		{
			points: [
				[147, 114],
				[154, 96],
				[162, 86],
			],
			step: 7,
			type: "arrow",
		},
		{
			points: [
				[147, 114],
				[154, 132],
				[162, 144],
			],
			step: 7,
			type: "arrow",
		},
		{ h: 46, label: "Kotlin", step: 8, sub: "checks · Compose", type: "box", w: 104, x: 164, y: 60 },
		{ h: 46, label: "Native", step: 8, sub: "C++ · ASM probes", type: "box", w: 104, x: 164, y: 124 },
		{
			points: [
				[269, 83],
				[278, 102],
			],
			step: 9,
			type: "arrow",
		},
		{
			points: [
				[269, 147],
				[278, 128],
			],
			step: 9,
			type: "arrow",
		},
		{
			fill: true,
			h: 56,
			label: "Local",
			role: "report",
			step: 10,
			sub: "report",
			type: "box",
			w: 52,
			x: 279,
			y: 86,
		},
		{
			anchor: "end",
			kind: "hand",
			step: 11,
			text: "analysis stays on the device",
			type: "text",
			x: 336,
			y: 246,
		},
		{
			accent: true,
			points: [
				[160, 239],
				[138, 232],
				[126, 214],
			],
			step: 11,
			type: "arrow",
		},
	],
} satisfies Diagram;
