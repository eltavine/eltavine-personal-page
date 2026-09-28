import { readFile } from "node:fs/promises";
import { join } from "node:path";
import satori from "satori";
import sharp from "sharp";
import { contact, profile, site } from "../../config/site.ts";
import { renderDiagram } from "../../lib/diagram.ts";
import { diagramToSvg, marksToSvg, svgDataUri } from "../../lib/diagram-svg.ts";
import { markPaths } from "../../lib/marks.ts";
import { fingerprintSeal } from "../../lib/seal.ts";

const SEAL_RED = "#c8382f";
const PAPER = "#fbf7ef";
const INK = "#1f1b16";

const sealDrawing = () =>
	renderDiagram(fingerprintSeal(contact.fingerprint), { multiStroke: false, seed: 7 });

/** The avatar on paper: iOS fills a transparent home-screen icon with black. */
export async function appleTouchIcon() {
	return sharp(join(process.cwd(), "public/eltavine.png"))
		.flatten({ background: PAPER })
		.resize(180, 180)
		.png({ compressionLevel: 9 })
		.toBuffer();
}

type Node = {
	type: string;
	props: { style?: Record<string, unknown>; children?: unknown; [key: string]: unknown };
};
const h = (type: string, props: Node["props"], ...children: unknown[]): Node => ({
	props: { ...props, children: children.length === 1 ? children[0] : children },
	type,
});

const fontFile = (path: string) => readFile(join(process.cwd(), "node_modules/@fontsource", path));

export async function ogImage() {
	const [regular, light, italic, hand] = await Promise.all([
		fontFile("fraunces/files/fraunces-latin-400-normal.woff"),
		fontFile("fraunces/files/fraunces-latin-300-normal.woff"),
		fontFile("fraunces/files/fraunces-latin-300-italic.woff"),
		fontFile("caveat/files/caveat-latin-600-normal.woff"),
	]);
	const sticker = await sharp(join(process.cwd(), "src/assets/eltavine-sticker.png"))
		.resize(420)
		.png()
		.toBuffer();
	const underline = marksToSvg(
		markPaths({ height: 34, kind: "underline", seed: 11, strokeWidth: 5, width: 300 }),
		300,
		34,
		"#e4574f",
	);
	const seal = diagramToSvg(sealDrawing(), { color: SEAL_RED });
	const [first = "", second = "", last = ""] = profile.headlineLines;

	const tree = h(
		"div",
		{
			style: {
				backgroundColor: PAPER,
				backgroundImage:
					"linear-gradient(rgba(31,27,22,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(31,27,22,0.07) 1px, transparent 1px)",
				backgroundSize: "28px 28px",
				color: INK,
				display: "flex",
				fontFamily: "Fraunces",
				height: 630,
				padding: "64px 72px",
				position: "relative",
				width: 1200,
			},
		},
		h(
			"div",
			{ style: { display: "flex", flexDirection: "column", width: 650 } },
			h(
				"div",
				{ style: { color: "#6e665b", fontSize: 20, letterSpacing: 5, textTransform: "uppercase" } },
				`00 — ${profile.role}`,
			),
			h(
				"div",
				{
					style: {
						display: "flex",
						flexDirection: "column",
						fontSize: 108,
						fontWeight: 300,
						letterSpacing: -4,
						lineHeight: 0.92,
						marginTop: 34,
					},
				},
				h("div", {}, first),
				h("div", {}, second),
				h(
					"div",
					{ style: { display: "flex", position: "relative" } },
					h("span", { style: { fontStyle: "italic" } }, last),
					h("img", {
						height: 34,
						src: svgDataUri(underline),
						style: { bottom: -8, left: -4, position: "absolute" },
						width: 300,
					}),
				),
			),
			h(
				"div",
				{ style: { color: "#3b352d", fontSize: 30, lineHeight: 1.35, marginTop: 40, width: 600 } },
				profile.summary,
			),
		),
		h(
			"div",
			{
				style: {
					alignItems: "center",
					display: "flex",
					flexGrow: 1,
					justifyContent: "center",
					position: "relative",
				},
			},
			h("img", { height: 400, src: `data:image/png;base64,${sticker.toString("base64")}`, width: 400 }),
			h(
				"div",
				{
					style: {
						color: "#3b352d",
						fontFamily: "Caveat",
						fontSize: 40,
						left: 0,
						position: "absolute",
						top: 18,
						transform: "rotate(-9deg)",
					},
				},
				profile.handNote.fallback,
			),
		),
		h(
			"div",
			{
				style: {
					alignItems: "center",
					bottom: 46,
					display: "flex",
					gap: 18,
					position: "absolute",
					right: 72,
				},
			},
			h("img", { height: 67, src: svgDataUri(seal), width: 116 }),
			h("div", { style: { color: "#6e665b", fontSize: 24, letterSpacing: 3 } }, new URL(site.url).host),
		),
	);

	const svg = await satori(tree as never, {
		fonts: [
			{ data: light, name: "Fraunces", style: "normal", weight: 300 },
			{ data: regular, name: "Fraunces", style: "normal", weight: 400 },
			{ data: italic, name: "Fraunces", style: "italic", weight: 300 },
			{ data: hand, name: "Caveat", style: "normal", weight: 600 },
		],
		height: 630,
		width: 1200,
	});
	return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
