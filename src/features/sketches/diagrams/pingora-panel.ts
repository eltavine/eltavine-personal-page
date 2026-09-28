import type { Diagram } from "../../../lib/diagram.ts";

export default {
	caption: "Fig. 02 — config pipeline and release safety",
	description:
		"Sketch: a versioned DSL goes through the compiler to an engine-neutral IR and ports and adapters, then through CAS activation with atomic snapshots into the Pingora data plane, with a Last Known Good snapshot as the rollback path.",
	height: 300,
	scenario: "pipeline",
	width: 340,
	items: [
		{ h: 34, label: "Versioned DSL", step: 1, type: "box", w: 156, x: 12, y: 10 },
		{
			points: [
				[90, 46],
				[90, 64],
			],
			step: 2,
			type: "arrow",
		},
		{ h: 34, label: "Compiler", step: 3, type: "box", w: 156, x: 12, y: 66 },
		{
			points: [
				[90, 102],
				[90, 120],
			],
			step: 4,
			type: "arrow",
		},
		{ h: 34, label: "Engine-neutral IR", step: 5, type: "box", w: 156, x: 12, y: 122 },
		{
			points: [
				[90, 158],
				[90, 176],
			],
			step: 6,
			type: "arrow",
		},
		{ h: 34, label: "Ports & adapters", step: 7, type: "box", w: 156, x: 12, y: 178 },
		{
			points: [
				[170, 195],
				[194, 195],
			],
			step: 8,
			type: "arrow",
		},
		{
			h: 46,
			label: "Activation",
			step: 9,
			sub: "CAS · atomic snapshots",
			type: "box",
			w: 136,
			x: 196,
			y: 172,
		},
		{
			points: [
				[264, 220],
				[264, 246],
			],
			step: 10,
			type: "arrow",
		},
		{
			fill: true,
			h: 46,
			label: "Pingora",
			role: "data-plane",
			step: 11,
			sub: "data plane",
			type: "box",
			w: 136,
			x: 196,
			y: 248,
		},
		{
			h: 46,
			label: "Last known good",
			role: "lkg",
			step: 12,
			sub: "rollback snapshot",
			type: "box",
			w: 156,
			x: 12,
			y: 248,
		},
		{
			dashed: true,
			points: [
				[170, 271],
				[194, 271],
			],
			role: "rollback",
			step: 13,
			type: "arrow",
		},
		{ kind: "hand", step: 14, text: "drains gracefully,", type: "text", x: 204, y: 62 },
		{ kind: "hand", step: 14, text: "fails closed", type: "text", x: 204, y: 86 },
		{
			accent: true,
			points: [
				[284, 94],
				[294, 128],
				[278, 166],
			],
			step: 14,
			type: "arrow",
		},
		{
			points: [
				[90, 27],
				[90, 83],
				[90, 139],
				[90, 195],
				[182, 195],
				[264, 195],
				[264, 271],
			],
			role: "packet-track",
			type: "track",
		},
		{
			points: [
				[90, 271],
				[182, 271],
				[264, 271],
			],
			role: "rollback-track",
			type: "track",
		},
	],
} satisfies Diagram;
