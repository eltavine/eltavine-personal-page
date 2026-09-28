import type { Diagram } from "../../lib/diagram.ts";

const doodle = (description: string, items: Diagram["items"]): Diagram => ({
	description,
	height: 100,
	items,
	roughness: 1.35,
	strokeWidth: 2.2,
	width: 100,
});

export const doodles: Readonly<Record<string, Diagram>> = {
	duck: doodle("A crayon duck holding a magnifying glass.", [
		{
			points: [
				[12, 88],
				[32, 84],
				[52, 90],
				[72, 84],
				[92, 88],
			],
			type: "curve",
		},
		{ cx: 50, cy: 64, h: 36, type: "ellipse", w: 60 },
		{ cx: 30, cy: 40, h: 28, type: "ellipse", w: 30 },
		{
			fill: true,
			points: [
				[16, 38],
				[3, 43],
				[16, 48],
			],
			type: "polygon",
		},
		{ cx: 26, cy: 36, r: 1.8, type: "dot" },
		{
			points: [
				[44, 60],
				[56, 54],
				[68, 62],
			],
			type: "curve",
		},
		{
			points: [
				[79, 56],
				[93, 48],
				[86, 67],
			],
			type: "polygon",
		},
		{ cx: 72, cy: 26, h: 26, type: "ellipse", w: 26 },
		{
			points: [
				[81, 36],
				[94, 50],
			],
			type: "line",
		},
	]),
	fleet: doodle("Three crayon phones under a signal arc.", [
		{ h: 36, type: "phone", w: 20, x: 12, y: 46 },
		{ fill: true, h: 42, type: "phone", w: 20, x: 40, y: 40 },
		{ h: 36, type: "phone", w: 20, x: 68, y: 46 },
		{ cx: 50, cy: 30, r: 2.2, type: "dot" },
		{
			points: [
				[38, 26],
				[50, 18],
				[62, 26],
			],
			type: "curve",
		},
		{
			points: [
				[28, 20],
				[50, 5],
				[72, 20],
			],
			type: "curve",
		},
	]),
	gateway: doodle("A crayon gateway joining three nodes into one output.", [
		{ cx: 12, cy: 22, h: 12, type: "ellipse", w: 12 },
		{ cx: 12, cy: 50, h: 12, type: "ellipse", w: 12 },
		{ cx: 12, cy: 78, h: 12, type: "ellipse", w: 12 },
		{
			points: [
				[18, 25],
				[38, 42],
			],
			type: "line",
		},
		{
			points: [
				[18, 50],
				[38, 50],
			],
			type: "line",
		},
		{
			points: [
				[18, 75],
				[38, 58],
			],
			type: "line",
		},
		{ fill: true, h: 34, type: "box", w: 26, x: 38, y: 33 },
		{
			head: 8,
			points: [
				[64, 50],
				[86, 50],
			],
			type: "arrow",
		},
		{ cx: 93, cy: 50, h: 10, type: "ellipse", w: 10 },
	]),
	layers: doodle("Three stacked crayon layers with a sparkle.", [
		{
			points: [
				[14, 72],
				[50, 58],
				[86, 72],
				[50, 86],
			],
			type: "polygon",
		},
		{
			points: [
				[14, 56],
				[50, 42],
				[86, 56],
				[50, 70],
			],
			type: "polygon",
		},
		{
			fill: true,
			points: [
				[14, 40],
				[50, 26],
				[86, 40],
				[50, 54],
			],
			type: "polygon",
		},
		{
			fill: true,
			points: [
				[86, 4],
				[88, 11],
				[95, 13],
				[88, 15],
				[86, 22],
				[84, 15],
				[77, 13],
				[84, 11],
			],
			type: "polygon",
		},
	]),
};

export function getDoodle(key: string): Diagram {
	const entry = doodles[key];
	if (!entry) {
		throw new Error(`Unknown doodle "${key}". Add it to src/features/doodles/registry.ts.`);
	}
	return entry;
}
