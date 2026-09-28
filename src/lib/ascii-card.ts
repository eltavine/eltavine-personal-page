import { groupFingerprint } from "./format.ts";
import { drunkenBishop, hexToBytes, randomartAscii } from "./randomart.ts";

export interface AsciiCardInput {
	name: string;
	role: string;
	lead: string;
	url: string;
	githubUrl: string;
	publicKeyUrl: string;
	fingerprint: string;
	projects: { title: string; summary: string }[];
}

const WIDTH = 64;

export function wrap(text: string, width: number): string[] {
	const lines: string[] = [];
	let line = "";
	for (const word of text.split(/\s+/).filter(Boolean)) {
		if (line && line.length + word.length + 1 > width) {
			lines.push(line);
			line = word;
		} else {
			line = line ? `${line} ${word}` : word;
		}
	}
	if (line) {
		lines.push(line);
	}
	return lines;
}

const row = (content = "") => `| ${content.padEnd(WIDTH - 4)} |`;
const rule = (char = "-") => `+${char.repeat(WIDTH - 2)}+`;

export function renderAsciiCard(input: AsciiCardInput): string {
	const art = randomartAscii(drunkenBishop(hexToBytes(input.fingerprint)), {
		footer: "[drunken bishop]",
		header: "[PGP]",
	}).split("\n");
	const fingerprint = groupFingerprint(input.fingerprint);
	const identity = [
		input.name.toUpperCase(),
		input.role,
		"",
		...wrap(input.lead, WIDTH - 4 - art[0]!.length - 3),
	];
	const height = Math.max(identity.length, art.length);
	const top = Array.from({ length: height }, (_, index) => {
		const left = (identity[index] ?? "").padEnd(WIDTH - 4 - art[0]!.length - 1);
		return row(`${left} ${art[index] ?? ""}`);
	});

	return [
		rule("="),
		...top,
		rule(),
		row("PROJECTS"),
		...input.projects.flatMap((project) => [
			row(),
			row(`* ${project.title}`),
			...wrap(project.summary, WIDTH - 8).map((line) => row(`  ${line}`)),
		]),
		rule(),
		row(`web     ${input.url}`),
		row(`github  ${input.githubUrl}`),
		row(`pgp     ${new URL(input.publicKeyUrl, input.url).toString()}`),
		row(`        ${fingerprint.slice(0, 5).join(" ")}`),
		row(`        ${fingerprint.slice(5).join(" ")}`),
		rule("="),
		"",
	].join("\n");
}
