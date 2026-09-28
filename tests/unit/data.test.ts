import { describe, expect, it } from "vitest";
import { contact, navigation, profile, sections, thisSite } from "../../src/config/site.ts";
import { renderAsciiCard, wrap } from "../../src/lib/ascii-card.ts";
import {
	assembleEmail,
	compactNumber,
	formatMonthYear,
	groupFingerprint,
	listNames,
	pad2,
} from "../../src/lib/format.ts";
import {
	buildHistory,
	extendHistory,
	fetchRepoStats,
	mergeWithSnapshot,
	planStarPages,
	type RepoStats,
} from "../../src/lib/github.ts";
import { pickNote } from "../../src/lib/hand-notes.ts";
import { formatTick, monthTicks, niceStep, starChartDiagram } from "../../src/lib/star-chart.ts";

describe("format helpers", () => {
	it("formats the small things", () => {
		expect(pad2(3)).toBe("03");
		expect(compactNumber(1234)).toBe("1.2K");
		expect(formatMonthYear("2026-09-27T12:00:00Z")).toBe("Sep 2026");
		expect(groupFingerprint("46CC2913C0B6")).toEqual(["46CC", "2913", "C0B6"]);
		expect(listNames(["a"])).toBe("a");
		expect(listNames(["a", "b", "c"])).toBe("a, b and c");
		expect(assembleEmail({ domain: "example", tld: "com", user: "me" })).toBe("me@example.com");
	});
});

describe("hand notes", () => {
	const notes = [
		{ from: 0, text: "night", to: 5 },
		{ from: 22, text: "late", to: 2 },
	];
	it("picks by local hour, including windows that wrap midnight", () => {
		expect(pickNote(notes, "day", 3)).toBe("night");
		expect(pickNote(notes, "day", 23)).toBe("late");
		expect(pickNote(notes, "day", 12)).toBe("day");
	});
});

describe("github sampling", () => {
	it("plans stargazer pages evenly", () => {
		expect(planStarPages(0)).toEqual([]);
		expect(planStarPages(250)).toEqual([1, 2, 3]);
		const many = planStarPages(5_000, 100, 12);
		expect(many[0]).toBe(1);
		expect(many.at(-1)).toBe(50);
		expect(many.length).toBeLessThanOrEqual(12);
		expect([...many].sort((a, b) => a - b)).toEqual(many);
	});

	it("builds an ordered history that ends at the current total", () => {
		const now = new Date("2026-09-28T00:00:00Z");
		const history = buildHistory(
			[
				{ page: 2, starredAt: "2026-06-01T00:00:00Z" },
				{ page: 1, starredAt: "2026-04-01T00:00:00Z" },
			],
			180,
			now,
		);
		expect(history.map((point) => point.stars)).toEqual([1, 101, 180]);
		expect(history.at(-1)?.date).toBe(now.toISOString());
	});

	it("fetches repo stats through an Octokit-shaped client", async () => {
		const client = {
			rest: {
				activity: {
					listStargazersForRepo: async ({ page }: { page: number }) => ({
						data: [{ starred_at: `2026-0${page + 3}-01T00:00:00Z` }],
					}),
				},
				repos: {
					get: async () => ({
						data: { forks_count: 4, pushed_at: "2026-09-01T00:00:00Z", stargazers_count: 150 },
					}),
				},
			},
		};
		const stats = await fetchRepoStats(client as never, "owner/repo", {
			now: new Date("2026-09-28T00:00:00Z"),
		});
		expect(stats).toMatchObject({ forks: 4, repo: "owner/repo", stars: 150 });
		expect(stats.history.map((point) => point.stars)).toEqual([1, 101, 150]);
	});

	it("keeps counts when the stargazer list needs a token", async () => {
		const client = {
			rest: {
				activity: {
					listStargazersForRepo: async () => {
						throw new Error("Requires authentication");
					},
				},
				repos: { get: async () => ({ data: { forks_count: 1, pushed_at: null, stargazers_count: 42 } }) },
			},
		};
		const logs: string[] = [];
		const stats = await fetchRepoStats(client as never, "owner/repo", { log: (line) => logs.push(line) });
		expect(stats).toMatchObject({ history: [], stars: 42 });
		expect(logs[0]).toMatch(/star history unavailable/);
	});

	it("carries snapshot history forward to the fresh total", () => {
		const history = [
			{ date: "2026-03-01T00:00:00Z", stars: 1 },
			{ date: "2026-08-01T00:00:00Z", stars: 90 },
		];
		expect(extendHistory(history, 90, "2026-09-28T00:00:00Z")).toBe(history);
		expect(extendHistory(history, 120, "2026-09-28T00:00:00Z").at(-1)).toEqual({
			date: "2026-09-28T00:00:00Z",
			stars: 120,
		});
		expect(extendHistory([], 5, "2026-09-28T00:00:00Z")).toEqual([]);
		const merged = mergeWithSnapshot(
			{
				"a/b": {
					fetchedAt: "2026-09-28T00:00:00Z",
					forks: 0,
					history: [],
					pushedAt: null,
					repo: "a/b",
					stars: 120,
				},
			},
			{
				"a/b": {
					fetchedAt: "2026-08-01T00:00:00Z",
					forks: 0,
					history,
					pushedAt: null,
					repo: "a/b",
					stars: 90,
				},
			},
			["a/b"],
		);
		expect(merged["a/b"]?.history).toHaveLength(3);
	});

	it("prefers fresh data and falls back to the snapshot", () => {
		const entry = (repo: string, stars: number): RepoStats => ({
			fetchedAt: "2026-01-01T00:00:00Z",
			forks: 0,
			history: [],
			pushedAt: null,
			repo,
			stars,
		});
		const merged = mergeWithSnapshot(
			{ "a/b": entry("a/b", 9) },
			{ "a/b": entry("a/b", 1), "c/d": entry("c/d", 2) },
			["a/b", "c/d", "e/f"],
		);
		expect(merged["a/b"]).toMatchObject({ source: "live", stars: 9 });
		expect(merged["c/d"]).toMatchObject({ source: "snapshot", stars: 2 });
		expect(merged["e/f"]).toBeUndefined();
	});
});

describe("star chart", () => {
	it("picks readable ticks", () => {
		expect(niceStep(1000)).toBe(250);
		expect(niceStep(7)).toBe(2);
		expect(formatTick(1500)).toBe("1.5k");
		expect(monthTicks(Date.parse("2026-03-15"), Date.parse("2026-09-20")).map((tick) => tick.label)).toEqual([
			"Apr",
			"Jun",
			"Aug",
		]);
	});

	it("needs at least two points", () => {
		expect(starChartDiagram([{ date: "2026-01-01", stars: 1 }], "stars")).toBeNull();
		const chart = starChartDiagram(
			[
				{ date: "2026-03-01", stars: 1 },
				{ date: "2026-09-01", stars: 900 },
			],
			"stars",
		);
		expect(chart?.items.some((item) => item.role === "series")).toBe(true);
	});
});

describe("ascii card", () => {
	it("wraps text on word boundaries", () => {
		expect(wrap("one two three four", 9)).toEqual(["one two", "three", "four"]);
	});

	it("renders a fixed-width card with the fingerprint and randomart", () => {
		const card = renderAsciiCard({
			fingerprint: contact.fingerprint,
			githubUrl: contact.githubUrl,
			lead: profile.lead,
			name: profile.name,
			projects: [
				{ summary: "A project summary that is long enough to wrap onto a second line.", title: "Demo" },
			],
			publicKeyUrl: contact.publicKeyUrl,
			role: profile.role,
			url: "https://eltavine.com/",
		});
		const lines = card.trimEnd().split("\n");
		expect(new Set(lines.map((line) => line.length))).toEqual(new Set([64]));
		expect(card).toContain("46CC 2913 C0B6 460F F498");
		expect(card).toContain("[drunken bishop]");
	});
});

describe("site config invariants", () => {
	it("keeps identifiers consistent", () => {
		expect(contact.fingerprint).toMatch(/^[0-9A-F]{40}$/);
		expect(contact.fingerprint.endsWith(contact.keyId)).toBe(true);
		expect(new Set(navigation.map((item) => item.href)).size).toBe(navigation.length);
		expect(navigation.map((item) => item.href.slice(1)).sort()).toEqual(Object.keys(sections).sort());
		expect(thisSite.stack.length).toBeGreaterThan(0);
	});
});
