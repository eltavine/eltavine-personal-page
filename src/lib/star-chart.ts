import type { Diagram, DiagramItem } from "./diagram.ts";
import type { StarPoint } from "./github.ts";
import type { Point } from "./rough.ts";

export interface ChartBox {
	width: number;
	height: number;
	left: number;
	right: number;
	top: number;
	bottom: number;
}

const DEFAULT_BOX: ChartBox = { bottom: 30, height: 210, left: 40, right: 14, top: 26, width: 340 };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function niceStep(max: number, targetTicks = 4): number {
	const raw = Math.max(max, 1) / targetTicks;
	const magnitude = 10 ** Math.floor(Math.log10(raw));
	const step = [1, 2, 2.5, 5, 10].map((factor) => factor * magnitude).find((candidate) => candidate >= raw);
	return step ?? 10 * magnitude;
}

export function formatTick(value: number): string {
	return value >= 1000 ? `${Number((value / 1000).toFixed(1))}k` : String(value);
}

export function monthTicks(startMs: number, endMs: number, maxTicks = 5) {
	const start = new Date(startMs);
	const cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1));
	const months: Date[] = [];
	while (cursor.getTime() <= endMs) {
		months.push(new Date(cursor));
		cursor.setUTCMonth(cursor.getUTCMonth() + 1);
	}
	const every = Math.max(1, Math.ceil(months.length / maxTicks));
	const spansYears = new Date(startMs).getUTCFullYear() !== new Date(endMs).getUTCFullYear();
	return months
		.filter((_, index) => index % every === 0)
		.map((month) => ({
			label:
				spansYears && month.getUTCMonth() === 0
					? `${MONTHS[0]} '${String(month.getUTCFullYear()).slice(2)}`
					: (MONTHS[month.getUTCMonth()] ?? ""),
			time: month.getTime(),
		}));
}

export function starChartDiagram(
	history: StarPoint[],
	title: string,
	box: ChartBox = DEFAULT_BOX,
): Diagram | null {
	if (history.length < 2) {
		return null;
	}

	const times = history.map((point) => Date.parse(point.date));
	const start = Math.min(...times);
	const end = Math.max(...times);
	const maxStars = Math.max(...history.map((point) => point.stars));
	const step = niceStep(maxStars);
	const yMax = Math.ceil(maxStars / step) * step;
	const plotW = box.width - box.left - box.right;
	const plotH = box.height - box.top - box.bottom;
	const x = (time: number) => box.left + ((time - start) / Math.max(end - start, 1)) * plotW;
	const y = (stars: number) => box.top + plotH - (stars / yMax) * plotH;
	const origin: Point = [box.left, box.top + plotH];

	const items: DiagramItem[] = [
		{ points: [origin, [box.left + plotW + 4, origin[1]]], type: "line" },
		{ points: [origin, [box.left, box.top - 6]], type: "line" },
	];

	for (let value = step; value <= yMax; value += step) {
		items.push(
			{
				dashed: true,
				points: [
					[box.left, y(value)],
					[box.left + plotW, y(value)],
				],
				type: "line",
			},
			{
				anchor: "end",
				kind: "mono",
				text: formatTick(value),
				type: "text",
				x: box.left - 6,
				y: y(value) + 4,
			},
		);
	}

	for (const tick of monthTicks(start, end)) {
		items.push({
			anchor: "middle",
			kind: "mono",
			text: tick.label,
			type: "text",
			x: x(tick.time),
			y: origin[1] + 16,
		});
	}

	const line = history.map((point, index): Point => [x(times[index]!), y(point.stars)]);
	items.push(
		{ accent: true, points: line, role: "series", step: 1, type: "line" },
		{ accent: true, cx: line.at(-1)![0], cy: line.at(-1)![1], r: 2.6, role: "series", step: 1, type: "dot" },
		{ kind: "hand", text: title, type: "text", x: box.left + 8, y: box.top - 8 },
	);

	return {
		description: `Hand-drawn chart of GitHub stars over time, rising to ${maxStars}.`,
		height: box.height,
		items,
		roughness: 0.7,
		width: box.width,
	};
}
