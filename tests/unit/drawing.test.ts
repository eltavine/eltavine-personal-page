import { describe, expect, it } from "vitest";
import { layersOf, renderDiagram, type Diagram } from "../../src/lib/diagram.ts";
import { MARK_SIZES, markPaths, type MarkKind } from "../../src/lib/marks.ts";
import { roundPath } from "../../src/lib/rough.ts";
import { fingerprintSeal } from "../../src/lib/seal.ts";

const sample: Diagram = {
	description: "sample",
	height: 120,
	items: [
		{ h: 30, label: "A", type: "box", w: 60, x: 10, y: 10 },
		{
			points: [
				[70, 25],
				[110, 25],
			],
			step: 2,
			type: "arrow",
		},
		{ fill: true, group: "layer", h: 30, label: "B", step: 3, sub: "sub", type: "box", w: 60, x: 110, y: 10 },
		{
			points: [
				[10, 90],
				[150, 90],
			],
			role: "packet",
			type: "track",
		},
		{ h: 8, type: "bar", w: 40, x: 10, y: 60 },
		{ kind: "small", text: "note", type: "text", x: 5, y: 110 },
	],
	width: 180,
};

describe("rough adapter", () => {
	it("rounds decimals and keeps integers", () => {
		expect(roundPath("M1.4 2.6L10 -3.5")).toBe("M1 3L10 -3");
	});
});

describe("marks", () => {
	it.each(Object.keys(MARK_SIZES) as MarkKind[])("draws %s deterministically", (kind) => {
		const first = markPaths({ kind, seed: 7 });
		expect(first.length).toBeGreaterThan(0);
		expect(markPaths({ kind, seed: 7 })).toEqual(first);
	});
});

describe("diagram renderer", () => {
	it("is deterministic for a seed and changes with it", () => {
		expect(renderDiagram(sample, { seed: 3 })).toEqual(renderDiagram(sample, { seed: 3 }));
		expect(renderDiagram(sample, { seed: 3 })).not.toEqual(renderDiagram(sample, { seed: 4 }));
	});

	it("carries steps, roles, groups and path kinds through", () => {
		const rendered = renderDiagram(sample);
		expect(rendered.paths.some((path) => path.step === 2)).toBe(true);
		expect(rendered.paths.find((path) => path.kind === "track")).toMatchObject({
			role: "packet",
			d: "M10 90L150 90",
		});
		expect(rendered.paths.some((path) => path.kind === "fill" && path.group === "layer")).toBe(true);
		expect(rendered.paths.some((path) => path.kind === "solid")).toBe(true);
		expect(rendered.texts.find((entry) => entry.kind === "small")?.text).toBe("NOTE");
		expect(rendered.texts.filter((entry) => entry.onFill).map((entry) => entry.text)).toEqual(["B", "sub"]);
	});

	it("draws lighter output without multi-stroke", () => {
		const size = (multiStroke: boolean) =>
			renderDiagram(sample, { multiStroke }).paths.reduce((total, path) => total + path.d.length, 0);
		expect(size(false)).toBeLessThan(size(true));
	});

	it("groups layers in first-seen order", () => {
		expect(layersOf(renderDiagram(sample)).map((layer) => layer.group)).toEqual([undefined, "layer"]);
	});
});

describe("fingerprint seal", () => {
	it("fits the 17 × 9 walk inside a double frame", () => {
		const seal = fingerprintSeal("46CC2913C0B6460FF498DE6009E517BD5F0084C8");
		expect(seal.width).toBe(17 * 10 + 18);
		expect(seal.height).toBe(9 * 10 + 18);
		expect(seal.items.filter((item) => item.type === "frame")).toHaveLength(2);
		expect(seal.items.filter((item) => item.type === "ellipse")).toHaveLength(2);
	});
});
