import type { Crayon } from "../lib/crayons.ts";
import type { EmailParts } from "../lib/format.ts";
import type { TimedNote } from "../lib/hand-notes.ts";
import type { MarkKind } from "../lib/marks.ts";

export const site = {
	description:
		"Eltavine builds Android security tools, network infrastructure, and local-first workspaces with clear signals and practical reliability.",
	locale: "en_US",
	ogImage: "/og.png",
	title: "Eltavine",
	url: "https://eltavine.com",
} as const;

export const themeColors = { dark: "#15130f", light: "#fbf7ef" } as const;

export interface NavItem {
	href: `#${string}`;
	icon: string;
	label: string;
}

export const navigation: readonly NavItem[] = [
	{ href: "#projects", icon: "lucide:folder-kanban", label: "Projects" },
	{ href: "#about", icon: "lucide:notebook-pen", label: "About" },
	{ href: "#stack", icon: "lucide:layers-3", label: "Stack" },
	{ href: "#contact", icon: "lucide:mail", label: "Contact" },
];

export const profile = {
	avatar: {
		src: "/eltavine-avatar-160.webp",
		srcset: "/eltavine-avatar-80.webp 80w, /eltavine-avatar-160.webp 160w",
	},
	figureCaption: "Fig. 01 — Eltavine, crayon on paper",
	handNote: {
		fallback: "hi, that's me!",
		timed: [{ from: 0, text: "still up? me too.", to: 5 }] satisfies TimedNote[],
	},
	headlineLines: ["Android,", "Windows,", "native."],
	lead: "I build Android security tools, network infrastructure, and local-first workspaces with clear signals and practical reliability in mind.",
	name: "Eltavine",
	principles: [
		{ crayon: "sage", label: "Local checks" },
		{ crayon: "blue", label: "Native probes" },
		{ crayon: "marigold", label: "Reliable systems" },
	] satisfies { crayon: Crayon; label: string }[],
	readoutLabel: "Signals",
	role: "Software engineer",
	stickerNote: "made with crayons",
	summary: "A compact portfolio of security tools, platform work, and the technologies behind them.",
	knowsAbout: [
		"Android security",
		"Native systems",
		"Network infrastructure",
		"Cross-platform applications",
		"Device automation",
		"Backend systems",
		"Product platforms",
	],
} as const;

export const contact = {
	emailParts: { domain: "eltavine", tld: "com", user: "me" } satisfies EmailParts,
	fingerprint: "46CC2913C0B6460FF498DE6009E517BD5F0084C8",
	githubLabel: "github.com/eltavine",
	githubUrl: "https://github.com/eltavine/",
	keyId: "09E517BD5F0084C8",
	publicKeyUrl: "/eltavine-public-key.asc",
} as const;

/** Extra source for the stack cross-reference that is not a project sheet. */
export const thisSite = {
	crayon: "heart",
	id: "this-site",
	stack: ["astro", "typescript", "javascript", "vite", "pnpm", "cloudflare"],
	title: "This site",
} as const satisfies { crayon: Crayon; id: string; stack: string[]; title: string };

export interface SectionCopy {
	index: string;
	label: string;
	before?: string;
	marked: string;
	after?: string;
	mark: Extract<MarkKind, "underline" | "circle" | "highlight" | "strike">;
	/** For `strike`: the word that gets crossed out before the handwritten replacement. */
	struck?: string;
	markSeed: number;
	lead: string;
}

export const sections = {
	about: {
		after: ".",
		before: "Notes on ",
		index: "02",
		label: "About",
		lead: "The short version of who I am, plus the rules I keep coming back to.",
		mark: "highlight",
		marked: "how I work",
		markSeed: 27,
	},
	contact: {
		after: ", quiet.",
		before: "Direct, ",
		index: "04",
		label: "Contact",
		lead: "Email stays protected until intentionally revealed. PGP material is kept separate and minimal.",
		mark: "circle",
		marked: "verifiable",
		markSeed: 14,
	},
	projects: {
		after: ".",
		before: "Featured ",
		index: "01",
		label: "Projects",
		lead: "Selected work across Android security, network infrastructure, and local-first workspaces.",
		mark: "underline",
		marked: "work",
		markSeed: 5,
	},
	stack: {
		after: ".",
		before: "Tools I ",
		index: "03",
		label: "Stack",
		lead: "A short map of the languages, platforms, and services I use most. The colored dots point back to the projects that use them.",
		mark: "strike",
		marked: "reach for",
		markSeed: 8,
		struck: "use",
	},
} as const satisfies Record<string, SectionCopy>;

export const footer = {
	note: "Built with care for local signals, useful tools, and steady iteration.",
} as const;
