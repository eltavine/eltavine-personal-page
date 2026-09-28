import { describe, expect, it } from "vitest";
import { drunkenBishop, hexToBytes, intensity, isMarker, randomartAscii } from "../../src/lib/randomart.ts";

describe("drunken bishop", () => {
	it("matches the OpenSSH randomart for a known ED25519 fingerprint", () => {
		const digest = new Uint8Array(Buffer.from("UCUiLr7Pjs9wFFJMDByLgc3NrtdU344OgUM45wZPcIQ", "base64"));
		const art = randomartAscii(drunkenBishop(digest), { footer: "[SHA256]", header: "[ED25519 256]" });

		expect(art).toBe(
			[
				"+--[ED25519 256]--+",
				"|o+oO==+ o..      |",
				"|.o++Eo+o..       |",
				"|. +.oO.o . .     |",
				"| . o..B.. . .    |",
				"|  ...+ .S. o     |",
				"|  .o. . . . .    |",
				"|  o..    o       |",
				"|   B      .      |",
				"|  .o*            |",
				"+----[SHA256]-----+",
			].join("\n"),
		);
	});

	it("marks the start in the centre and keeps the walk inside the field", () => {
		const field = drunkenBishop(hexToBytes("46CC2913C0B6460FF498DE6009E517BD5F0084C8"));
		expect(field.start).toEqual([8, 4]);
		expect(isMarker(field.cells[4]![8]!)).toBe(true);
		for (const row of field.cells) {
			expect(row).toHaveLength(17);
			for (const value of row) {
				expect(intensity(value)).toBeGreaterThanOrEqual(0);
				expect(intensity(value)).toBeLessThanOrEqual(1);
			}
		}
	});

	it("rejects malformed hex", () => {
		expect(() => hexToBytes("abc")).toThrow(/odd number/);
		expect(Array.from(hexToBytes("0a ff"))).toEqual([10, 255]);
	});
});
