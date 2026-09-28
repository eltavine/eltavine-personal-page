import {
	arrowHead,
	roundedRectPath,
	shapes,
	toPaths,
	type Point,
	type RoughDrawable,
	type RoughOptions,
} from "./rough.ts";

export type TextKind = "label" | "sub" | "small" | "mono" | "hand";
export type TextAnchor = "start" | "middle" | "end";

interface ItemMeta {
	/** Draw order for live sketches; items without a step are part of the base drawing. */
	step?: number;
	/** Semantic hook for scenario motion, e.g. "packet", "phone", "rollback". */
	role?: string;
	/** Items sharing a group are wrapped together so they can move as one layer. */
	group?: string;
	accent?: boolean;
}

export type DiagramItem = ItemMeta &
	(
		| {
				type: "box";
				x: number;
				y: number;
				w: number;
				h: number;
				label?: string;
				sub?: string;
				fill?: boolean;
				dashed?: boolean;
		  }
		| { type: "frame"; x: number; y: number; w: number; h: number; r?: number; dashed?: boolean }
		| { type: "window"; x: number; y: number; w: number; h: number; title?: string }
		| { type: "phone"; x: number; y: number; w: number; h: number; fill?: boolean }
		| { type: "check"; x: number; y: number }
		| { type: "brace"; x: number; y1: number; y2: number }
		| { type: "line"; points: Point[]; dashed?: boolean }
		| { type: "curve"; points: Point[]; dashed?: boolean }
		| { type: "arrow"; points: Point[]; dashed?: boolean; head?: number }
		| { type: "ellipse"; cx: number; cy: number; w: number; h: number; fill?: boolean }
		| { type: "polygon"; points: Point[]; fill?: boolean }
		| { type: "bar"; x: number; y: number; w: number; h: number }
		| { type: "dot"; cx: number; cy: number; r: number }
		| { type: "track"; points: Point[] }
		| { type: "text"; x: number; y: number; text: string; kind: TextKind; anchor?: TextAnchor }
	);

export interface Diagram {
	width: number;
	height: number;
	description: string;
	caption?: string;
	/** Name of the live-sketch scenario that animates this diagram. */
	scenario?: string;
	items: DiagramItem[];
	roughness?: number;
	strokeWidth?: number;
}

export type PathKind = "stroke" | "fill" | "dashed" | "solid" | "track";

export interface DiagramPath {
	d: string;
	kind: PathKind;
	width: number;
	accent: boolean;
	step?: number;
	role?: string;
	group?: string;
}

export interface DiagramText {
	x: number;
	y: number;
	text: string;
	kind: TextKind;
	anchor: TextAnchor;
	onFill: boolean;
	step?: number;
	role?: string;
	group?: string;
}

export interface RenderedDiagram {
	width: number;
	height: number;
	paths: DiagramPath[];
	texts: DiagramText[];
}

export interface RenderOptions {
	seed?: number;
	/** Hand-drawn double strokes look richer but roughly double the path data. */
	multiStroke?: boolean;
}

const OUTLINE = "#010101";
const HATCH = "#020202";
const SOLID = "#030303";

export function renderDiagram(
	diagram: Diagram,
	{ seed = 1, multiStroke = true }: RenderOptions = {},
): RenderedDiagram {
	const paths: DiagramPath[] = [];
	const texts: DiagramText[] = [];
	const base: RoughOptions = {
		bowing: 0.7,
		disableMultiStroke: !multiStroke,
		roughness: diagram.roughness ?? 0.85,
		stroke: OUTLINE,
		strokeWidth: diagram.strokeWidth ?? 1.25,
	};
	const hatch: RoughOptions = {
		fill: HATCH,
		fillStyle: "hachure",
		fillWeight: (diagram.strokeWidth ?? 1.25) * 1.04,
		hachureAngle: -41,
		hachureGap: 5,
	};
	const solid: RoughOptions = { fill: SOLID, fillStyle: "solid", stroke: "none" };

	let seedCounter = seed * 100;
	const nextSeed = () => ++seedCounter;

	const add = (drawable: RoughDrawable, meta: ItemMeta, { dashed = false } = {}) => {
		for (const info of toPaths(drawable)) {
			// Solid fills come with an unpainted outline; drawing it would double every dot and bar.
			if (info.stroke === "none" && info.fill !== SOLID) {
				continue;
			}
			const isHatch = info.stroke === HATCH;
			const isSolid = info.fill === SOLID;
			paths.push({
				accent: Boolean(meta.accent) || isHatch,
				d: info.d,
				group: meta.group,
				kind: isSolid ? "solid" : isHatch ? "fill" : dashed ? "dashed" : "stroke",
				role: meta.role,
				step: meta.step,
				width: info.strokeWidth,
			});
		}
	};

	const text = (entry: Omit<DiagramText, "onFill" | "anchor"> & { anchor?: TextAnchor; onFill?: boolean }) =>
		texts.push({ anchor: "start", onFill: false, ...entry });

	for (const item of diagram.items) {
		const meta: ItemMeta = { accent: item.accent, group: item.group, role: item.role, step: item.step };

		switch (item.type) {
			case "box": {
				add(
					shapes.rectangle(item.x, item.y, item.w, item.h, {
						...base,
						...(item.fill ? hatch : {}),
						disableMultiStroke: Boolean(item.dashed) || base.disableMultiStroke,
						seed: nextSeed(),
					}),
					meta,
					{ dashed: item.dashed },
				);
				const cx = item.x + item.w / 2;
				const cy = item.y + item.h / 2;
				const onFill = Boolean(item.fill);
				if (item.label && item.sub) {
					text({ ...meta, anchor: "middle", kind: "label", onFill, text: item.label, x: cx, y: cy - 2 });
					text({ ...meta, anchor: "middle", kind: "sub", onFill, text: item.sub, x: cx, y: cy + 13 });
				} else if (item.label) {
					text({ ...meta, anchor: "middle", kind: "label", onFill, text: item.label, x: cx, y: cy + 4.5 });
				}
				break;
			}
			case "frame":
				add(
					shapes.path(roundedRectPath(item.x, item.y, item.w, item.h, item.r ?? 12), {
						...base,
						disableMultiStroke: Boolean(item.dashed) || base.disableMultiStroke,
						seed: nextSeed(),
					}),
					meta,
					{ dashed: item.dashed },
				);
				break;
			case "window": {
				add(
					shapes.path(roundedRectPath(item.x, item.y, item.w, item.h, 6), { ...base, seed: nextSeed() }),
					meta,
				);
				add(
					shapes.line([item.x, item.y + 16], [item.x + item.w, item.y + 16], {
						...base,
						disableMultiStroke: true,
						seed: nextSeed(),
					}),
					meta,
				);
				for (const offset of [9, 17, 25]) {
					add(
						shapes.circle(item.x + offset, item.y + 8, 4, {
							...base,
							disableMultiStroke: true,
							seed: nextSeed(),
						}),
						meta,
					);
				}
				if (item.title) {
					text({
						...meta,
						anchor: "middle",
						kind: "small",
						text: item.title.toUpperCase(),
						x: item.x + item.w / 2,
						y: item.y + 12,
					});
				}
				break;
			}
			case "phone":
				add(
					shapes.path(roundedRectPath(item.x, item.y, item.w, item.h, 4), {
						...base,
						...(item.fill ? hatch : {}),
						seed: nextSeed(),
					}),
					meta,
				);
				add(
					shapes.line([item.x + item.w * 0.36, item.y + 5], [item.x + item.w * 0.64, item.y + 5], {
						...base,
						disableMultiStroke: true,
						seed: nextSeed(),
					}),
					meta,
				);
				break;
			case "check":
				add(shapes.rectangle(item.x, item.y, 9, 9, { ...base, roughness: 0.6, seed: nextSeed() }), meta);
				add(
					shapes.linearPath(
						[
							[item.x + 1.5, item.y + 4],
							[item.x + 4, item.y + 8],
							[item.x + 11, item.y - 2],
						],
						{ ...base, disableMultiStroke: true, seed: nextSeed(), strokeWidth: 1.5 },
					),
					{ ...meta, accent: true },
				);
				break;
			case "brace": {
				const mid = (item.y1 + item.y2) / 2;
				const { x } = item;
				add(
					shapes.path(
						`M${x} ${item.y1}Q${x + 5} ${item.y1} ${x + 5} ${item.y1 + 8}V${mid - 8}Q${x + 5} ${mid} ${x + 10} ${mid}Q${x + 5} ${mid} ${x + 5} ${mid + 8}V${item.y2 - 8}Q${x + 5} ${item.y2} ${x} ${item.y2}`,
						{ ...base, disableMultiStroke: true, roughness: 0.6, seed: nextSeed() },
					),
					meta,
				);
				break;
			}
			case "line":
				add(
					shapes.linearPath(item.points, {
						...base,
						disableMultiStroke: Boolean(item.dashed) || base.disableMultiStroke,
						seed: nextSeed(),
					}),
					meta,
					{ dashed: item.dashed },
				);
				break;
			case "curve":
				add(
					shapes.curve(item.points, {
						...base,
						disableMultiStroke: Boolean(item.dashed) || base.disableMultiStroke,
						seed: nextSeed(),
					}),
					meta,
					{ dashed: item.dashed },
				);
				break;
			case "arrow": {
				const { points } = item;
				const options = { ...base, disableMultiStroke: true, seed: nextSeed() };
				add(points.length > 2 ? shapes.curve(points, options) : shapes.linearPath(points, options), meta, {
					dashed: item.dashed,
				});
				const tail = points.at(-2);
				const tip = points.at(-1);
				if (tail && tip) {
					add(
						shapes.linearPath(arrowHead(tail, tip, item.head ?? 7), { ...options, seed: nextSeed() }),
						meta,
					);
				}
				break;
			}
			case "ellipse":
				add(
					shapes.ellipse(item.cx, item.cy, item.w, item.h, {
						...base,
						...(item.fill ? hatch : {}),
						seed: nextSeed(),
					}),
					meta,
				);
				break;
			case "polygon":
				add(shapes.polygon(item.points, { ...base, ...(item.fill ? hatch : {}), seed: nextSeed() }), meta);
				break;
			case "bar":
				add(
					shapes.rectangle(item.x, item.y, item.w, item.h, {
						...base,
						...solid,
						roughness: 0.9,
						seed: nextSeed(),
					}),
					meta,
				);
				break;
			case "dot": {
				// Exact arcs: dots are tiny and plentiful (seals), so a rough outline costs bytes and adds nothing.
				const r = Math.round(item.r * 10) / 10;
				paths.push({
					accent: Boolean(meta.accent),
					d: `M${item.cx - r} ${item.cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`,
					group: meta.group,
					kind: "solid",
					role: meta.role,
					step: meta.step,
					width: 0,
				});
				break;
			}
			case "track":
				paths.push({
					accent: true,
					d: item.points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x} ${y}`).join(""),
					group: item.group,
					kind: "track",
					role: item.role ?? "track",
					step: item.step,
					width: 0,
				});
				break;
			case "text":
				text({
					...meta,
					anchor: item.anchor ?? "start",
					kind: item.kind,
					text: item.kind === "small" ? item.text.toUpperCase() : item.text,
					x: item.x,
					y: item.y,
				});
				break;
		}
	}

	return { height: diagram.height, paths, texts, width: diagram.width };
}

/** Groups rendered output in first-seen order so a component can wrap each layer in one `<g>`. */
export function layersOf(rendered: RenderedDiagram) {
	const order: (string | undefined)[] = [];
	for (const entry of [...rendered.paths, ...rendered.texts]) {
		if (!order.includes(entry.group)) {
			order.push(entry.group);
		}
	}
	return order.map((group) => ({
		group,
		paths: rendered.paths.filter((path) => path.group === group),
		texts: rendered.texts.filter((entry) => entry.group === group),
	}));
}
