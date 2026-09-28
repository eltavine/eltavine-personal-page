/**
 * The "drunken bishop" walk that OpenSSH uses for `VisualHostKey`:
 * http://www.dirk-loss.de/sshvis/drunken_bishop.pdf
 */
export const RANDOMART_SYMBOLS = " .o+=*BOX@%&#/^SE";

const MAX_VALUE = RANDOMART_SYMBOLS.length - 1;
const START = MAX_VALUE - 1;
const END = MAX_VALUE;

export interface RandomartField {
	width: number;
	height: number;
	/** Visit counts indexed as `cells[y][x]`; the start and end squares hold the S and E markers. */
	cells: number[][];
	start: [number, number];
	end: [number, number];
}

export function drunkenBishop(bytes: Uint8Array, width = 17, height = 9): RandomartField {
	const cells = Array.from({ length: height }, () => Array.from({ length: width }, () => 0));
	const start: [number, number] = [Math.floor(width / 2), Math.floor(height / 2)];
	let [x, y] = start;

	for (const byte of bytes) {
		let input = byte;
		for (let move = 0; move < 4; move++) {
			x = Math.min(Math.max(x + (input & 0x1 ? 1 : -1), 0), width - 1);
			y = Math.min(Math.max(y + (input & 0x2 ? 1 : -1), 0), height - 1);
			const row = cells[y]!;
			if (row[x]! < MAX_VALUE - 2) {
				row[x]! += 1;
			}
			input >>= 2;
		}
	}

	cells[start[1]]![start[0]] = START;
	cells[y]![x] = END;
	return { cells, end: [x, y], height, start, width };
}

export function isMarker(value: number) {
	return value >= START;
}

/** Visit intensity in 0..1, with the S/E markers excluded. */
export function intensity(value: number) {
	return isMarker(value) ? 1 : value / (MAX_VALUE - 2);
}

function border(width: number, label: string) {
	const lead = Math.floor((width - label.length) / 2);
	return `+${"-".repeat(Math.max(lead, 0))}${label}${"-".repeat(Math.max(width - lead - label.length, 0))}+`;
}

export function randomartAscii(field: RandomartField, { header = "", footer = "" } = {}): string {
	const rows = field.cells.map(
		(row) => `|${row.map((value) => RANDOMART_SYMBOLS[Math.min(value, MAX_VALUE)]).join("")}|`,
	);
	return [border(field.width, header), ...rows, border(field.width, footer)].join("\n");
}

export function hexToBytes(hex: string): Uint8Array {
	const clean = hex.replace(/[^0-9a-f]/gi, "");
	if (clean.length % 2 !== 0) {
		throw new Error(`Hex string has an odd number of digits: ${hex}`);
	}
	return Uint8Array.from(clean.match(/.{2}/g) ?? [], (pair) => Number.parseInt(pair, 16));
}
