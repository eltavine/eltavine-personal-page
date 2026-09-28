import rough from "roughjs";
import type { Drawable, Options } from "roughjs/bin/core";

export type Point = [number, number];
export type RoughOptions = Options;
export type RoughDrawable = Drawable;

export interface RoughPath {
	d: string;
	stroke: string;
	strokeWidth: number;
	fill?: string;
}

const generator = rough.generator();
const DECIMAL = /-?\d*\.\d+/g;

export function roundPath(d: string): string {
	return d.replace(DECIMAL, (value) => String(Math.round(Number(value))));
}

export function toPaths(drawable: Drawable): RoughPath[] {
	return generator.toPaths(drawable).map((info) => ({
		d: roundPath(info.d),
		fill: info.fill,
		stroke: info.stroke,
		strokeWidth: info.strokeWidth,
	}));
}

export const shapes = {
	circle: (cx: number, cy: number, diameter: number, options?: Options) =>
		generator.circle(cx, cy, diameter, options),
	curve: (points: Point[], options?: Options) => generator.curve(points, options),
	ellipse: (cx: number, cy: number, width: number, height: number, options?: Options) =>
		generator.ellipse(cx, cy, width, height, options),
	line: ([x1, y1]: Point, [x2, y2]: Point, options?: Options) => generator.line(x1, y1, x2, y2, options),
	linearPath: (points: Point[], options?: Options) => generator.linearPath(points, options),
	path: (d: string, options?: Options) => generator.path(d, options),
	polygon: (points: Point[], options?: Options) => generator.polygon(points, options),
	rectangle: (x: number, y: number, width: number, height: number, options?: Options) =>
		generator.rectangle(x, y, width, height, options),
};

export function arrowHead([px, py]: Point, [ex, ey]: Point, size = 7, spread = 0.5): Point[] {
	const angle = Math.atan2(ey - py, ex - px);
	return [
		[ex - size * Math.cos(angle - spread), ey - size * Math.sin(angle - spread)],
		[ex, ey],
		[ex - size * Math.cos(angle + spread), ey - size * Math.sin(angle + spread)],
	];
}

export function roundedRectPath(x: number, y: number, w: number, h: number, r: number): string {
	return `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
}
