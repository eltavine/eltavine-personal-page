import { arrowHead, shapes, toPaths, type Point, type RoughDrawable } from "./rough.ts";

export const MARK_SIZES = {
	arrow: [120, 92],
	box: [32, 32],
	caret: [28, 22],
	check: [32, 28],
	circle: [220, 96],
	highlight: [240, 40],
	scribble: [320, 44],
	strike: [120, 24],
	underline: [240, 28],
	waves: [180, 60],
} as const satisfies Record<string, readonly [number, number]>;

export type MarkKind = keyof typeof MARK_SIZES;

export interface MarkOptions {
	kind: MarkKind;
	seed: number;
	width?: number;
	height?: number;
	points?: Point[];
	roughness?: number;
	bowing?: number;
	strokeWidth?: number;
}

export interface MarkPath {
	d: string;
	strokeWidth: number;
}

function drawables({
	kind,
	seed,
	points,
	roughness = 1.25,
	bowing = 1,
	strokeWidth = 3,
	...size
}: MarkOptions) {
	const w = size.width ?? MARK_SIZES[kind][0];
	const h = size.height ?? MARK_SIZES[kind][1];
	const options = { bowing, roughness, seed, stroke: "currentColor", strokeWidth };

	switch (kind) {
		case "circle":
			return [
				shapes.ellipse(w / 2, h / 2, w - strokeWidth * 4, h - strokeWidth * 4, {
					...options,
					curveStepCount: 8,
				}),
			];
		case "scribble": {
			const loops = 7;
			const zigzag = Array.from({ length: loops * 2 + 1 }, (_, index): Point => [
				8 + ((w - 16) * index) / (loops * 2),
				index % 2 === 0 ? h * 0.74 : h * 0.26,
			]);
			return [shapes.curve(zigzag, { ...options, disableMultiStroke: true })];
		}
		case "check":
			return [
				shapes.linearPath(
					[
						[3, h * 0.55],
						[w * 0.38, h - 4],
						[w - 3, 4],
					],
					options,
				),
			];
		case "box":
			return [
				shapes.rectangle(
					strokeWidth * 1.5,
					strokeWidth * 1.5,
					w - strokeWidth * 3,
					h - strokeWidth * 3,
					options,
				),
			];
		case "arrow": {
			const path = points ?? [
				[8, 16],
				[50, 6],
				[90, 24],
				[106, 74],
			];
			return [
				shapes.curve(path, options),
				shapes.linearPath(arrowHead(path.at(-2) ?? path[0]!, path.at(-1)!, 13, 0.55), {
					...options,
					disableMultiStroke: true,
				}),
			];
		}
		case "waves":
			return Array.from({ length: 4 }, (_, row) => {
				const y = 10 + row * ((h - 20) / 3);
				const wave = Array.from({ length: 7 }, (_, index): Point => [
					4 + ((w - 8) * index) / 6,
					y + (index % 2 === 0 ? -3.5 : 3.5),
				]);
				return shapes.curve(wave, { ...options, disableMultiStroke: true, seed: seed + row });
			});
		case "highlight":
			return [
				shapes.curve(
					[
						[h * 0.3, h * 0.58],
						[w * 0.35, h * 0.5],
						[w * 0.7, h * 0.54],
						[w - h * 0.3, h * 0.46],
					],
					{ ...options, disableMultiStroke: true, roughness: roughness * 0.6, strokeWidth: h * 0.62 },
				),
			];
		case "strike":
			return [
				shapes.curve(
					[
						[3, h * 0.6],
						[w * 0.4, h * 0.46],
						[w * 0.75, h * 0.56],
						[w - 3, h * 0.42],
					],
					{ ...options, disableMultiStroke: true },
				),
			];
		case "caret":
			return [
				shapes.linearPath(
					[
						[3, h - 3],
						[w / 2, 3],
						[w - 3, h - 3],
					],
					{ ...options, disableMultiStroke: true },
				),
			];
		case "underline": {
			const path = points ?? [
				[4, h * 0.64],
				[w * 0.28, h * 0.42],
				[w * 0.55, h * 0.6],
				[w * 0.8, h * 0.4],
				[w - 4, h * 0.5],
			];
			return [shapes.curve(path, options)];
		}
	}
}

export function markSize(options: Pick<MarkOptions, "kind" | "width" | "height">): [number, number] {
	return [options.width ?? MARK_SIZES[options.kind][0], options.height ?? MARK_SIZES[options.kind][1]];
}

export function markPaths(options: MarkOptions): MarkPath[] {
	return (drawables(options) as RoughDrawable[])
		.flatMap((drawable) => toPaths(drawable))
		.map((path) => ({ d: path.d, strokeWidth: path.strokeWidth }));
}
