import type { Diagram } from "../../../lib/diagram.ts";

export default {
	caption: "Fig. 05 — one-line hooks into upstream",
	description:
		"Sketch: a Telegram Desktop call site reaches the serein/hooks facade through a one-line call; a registered module such as ghost mode, message history, or filters handles it, and with no handler the facade falls back to upstream's default behavior.",
	height: 232,
	scenario: "hooks",
	width: 340,
	items: [
		{
			h: 46,
			label: "Telegram Desktop",
			step: 1,
			sub: "upstream call site",
			type: "box",
			w: 156,
			x: 12,
			y: 10,
		},
		{
			points: [
				[90, 58],
				[90, 92],
			],
			step: 2,
			type: "arrow",
		},
		{ kind: "small", step: 2, text: "one line", type: "text", x: 100, y: 80 },
		{ h: 46, label: "Hooks facade", step: 3, sub: "serein/hooks", type: "box", w: 156, x: 12, y: 94 },
		{
			dashed: true,
			points: [
				[90, 142],
				[90, 176],
			],
			step: 4,
			type: "arrow",
		},
		{ kind: "small", step: 4, text: "no handler", type: "text", x: 100, y: 164 },
		{
			h: 46,
			label: "Upstream default",
			role: "default",
			step: 5,
			sub: "same as Telegram",
			type: "box",
			w: 156,
			x: 12,
			y: 178,
		},
		{
			points: [
				[170, 117],
				[184, 122],
				[192, 164],
				[210, 172],
			],
			step: 6,
			type: "arrow",
		},
		{ dashed: true, h: 130, r: 12, step: 7, type: "frame", w: 130, x: 202, y: 94 },
		{ kind: "small", step: 7, text: "Modules", type: "text", x: 214, y: 114 },
		{ h: 28, label: "Ghost", step: 8, type: "box", w: 106, x: 214, y: 124 },
		{ h: 28, label: "History", role: "handler", step: 8, type: "box", w: 106, x: 214, y: 158 },
		{ h: 28, label: "Filters", step: 8, type: "box", w: 106, x: 214, y: 192 },
		{ kind: "hand", step: 9, text: "every module", type: "text", x: 200, y: 34 },
		{ kind: "hand", step: 9, text: "starts switched off", type: "text", x: 200, y: 58 },
		{
			accent: true,
			points: [
				[296, 66],
				[306, 78],
				[294, 90],
			],
			step: 9,
			type: "arrow",
		},
		{
			points: [
				[90, 33],
				[90, 117],
				[170, 117],
				[184, 122],
				[192, 164],
				[210, 172],
				[267, 172],
			],
			role: "packet-track",
			type: "track",
		},
		{
			points: [
				[90, 117],
				[90, 201],
			],
			role: "default-track",
			type: "track",
		},
	],
} satisfies Diagram;
