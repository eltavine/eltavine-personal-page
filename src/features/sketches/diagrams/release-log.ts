import type { Diagram, DiagramItem } from "../../../lib/diagram.ts";

const rows = [
	{ note: "health check failed", version: "v13", y: 36 },
	{ note: "active · last known good", version: "v12", y: 90 },
	{ note: "superseded", version: "v11", y: 144 },
	{ note: "superseded", version: "v10", y: 198 },
];

export default {
	caption: "Fig. 02b — release log (illustrative)",
	description:
		"Illustrative release log: snapshot v13 failed its health check and the gateway rolled back to v12, the last known good snapshot; v11 and v10 are superseded.",
	height: 222,
	roughness: 0.75,
	width: 340,
	items: [
		{
			points: [
				[26, 18],
				[26, 212],
			],
			type: "line",
		},
		...rows.flatMap(({ note, version, y }, index): DiagramItem[] => [
			index === 1 ? { cx: 26, cy: y, r: 7, type: "dot" } : { cx: 26, cy: y, h: 14, type: "ellipse", w: 14 },
			{ kind: "mono", text: `snapshot ${version}`, type: "text", x: 46, y: y + 4 },
			index === 0 || index === 1
				? { kind: "hand", text: note, type: "text", x: 150, y: y + 5 }
				: { kind: "small", text: note, type: "text", x: 150, y: y + 4 },
			{
				dashed: true,
				points: [
					[46, y + 24],
					[330, y + 24],
				],
				type: "line",
			},
		]),
		{
			accent: true,
			points: [
				[20, 30],
				[32, 42],
			],
			type: "line",
		},
		{
			accent: true,
			points: [
				[32, 30],
				[20, 42],
			],
			type: "line",
		},
		{
			accent: true,
			points: [
				[312, 44],
				[330, 64],
				[314, 84],
			],
			type: "arrow",
		},
		{ anchor: "end", kind: "hand", text: "rolled back", type: "text", x: 306, y: 70 },
	],
} satisfies Diagram;
