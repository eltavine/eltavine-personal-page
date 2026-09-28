import type { RenderedDiagram } from "./diagram.ts";
import type { MarkPath } from "./marks.ts";

export interface SvgOptions {
	color?: string;
	accent?: string;
	pad?: number;
	size?: { width: number; height: number };
	background?: string;
}

/** Standalone SVG for contexts without the page's CSS (favicons, OG images). Text items are not rendered. */
export function diagramToSvg(
	rendered: RenderedDiagram,
	{ color = "#1f1b16", accent = color, pad = 4, size, background }: SvgOptions = {},
) {
	const width = rendered.width + pad * 2;
	const height = rendered.height + pad * 2;
	const body = rendered.paths
		.filter((path) => path.kind !== "track")
		.map((path) => {
			const paint = path.accent ? accent : color;
			return path.kind === "solid"
				? `<path d="${path.d}" fill="${paint}"/>`
				: `<path d="${path.d}" fill="none" stroke="${paint}" stroke-width="${path.width}" stroke-linecap="round" stroke-linejoin="round"${path.kind === "dashed" ? ' stroke-dasharray="5 4"' : ""}/>`;
		})
		.join("");
	const backdrop = background
		? `<rect x="${-pad}" y="${-pad}" width="${width}" height="${height}" rx="${Math.min(width, height) * 0.18}" fill="${background}"/>`
		: "";
	const dimensions = size ? ` width="${size.width}" height="${size.height}"` : "";
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${width} ${height}"${dimensions}>${backdrop}${body}</svg>`;
}

export function marksToSvg(paths: MarkPath[], width: number, height: number, color: string) {
	const body = paths
		.map(
			(path) =>
				`<path d="${path.d}" fill="none" stroke="${color}" stroke-width="${path.strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
		)
		.join("");
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${body}</svg>`;
}

export const svgDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
