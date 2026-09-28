import type { Diagram, DiagramItem } from "./diagram.ts";
import { drunkenBishop, hexToBytes, intensity, isMarker } from "./randomart.ts";

export interface SealOptions {
	cell?: number;
	padding?: number;
}

/**
 * A pictorial seal (肖形印) whose pattern is the drunken-bishop walk of a PGP fingerprint.
 * It is a reproducible visual hash, not something GnuPG prints.
 */
export function fingerprintSeal(fingerprint: string, { cell = 10, padding = 9 }: SealOptions = {}): Diagram {
	const field = drunkenBishop(hexToBytes(fingerprint));
	const width = field.width * cell + padding * 2;
	const height = field.height * cell + padding * 2;
	const items: DiagramItem[] = [
		{ h: height - 2, type: "frame", w: width - 2, x: 1, y: 1, r: 5 },
		{ h: height - 8, type: "frame", w: width - 8, x: 4, y: 4, r: 3 },
	];

	field.cells.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value === 0) {
				return;
			}
			const cx = padding + x * cell + cell / 2;
			const cy = padding + y * cell + cell / 2;
			if (isMarker(value)) {
				items.push({ cx, cy, h: cell * 0.8, type: "ellipse", w: cell * 0.8 });
				return;
			}
			items.push({ cx, cy, r: 1.2 + intensity(value) * (cell * 0.36), type: "dot" });
		});
	});

	return {
		description: `Seal pattern generated from PGP fingerprint ${fingerprint} with the drunken bishop walk.`,
		height,
		items,
		roughness: 0.9,
		width,
	};
}
