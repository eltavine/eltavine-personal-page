import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Loader } from "astro/loaders";
import { parse } from "yaml";
import { fetchAll, mergeWithSnapshot, type RepoSnapshot } from "../../lib/github.ts";

export interface GithubLoaderOptions {
	/** Directory of project YAML files; any `github: owner/name` field is picked up. */
	projectsDir: string;
	/** Committed fallback used when the API is unreachable or rate limited. */
	snapshot: string;
	/** Skip the network when the store is younger than this (dev restarts). */
	ttlMs?: number;
}

export async function readProjectRepos(projectsDir: string): Promise<string[]> {
	const files = (await readdir(projectsDir)).filter((file) => /\.ya?ml$/.test(file));
	const repos = await Promise.all(
		files.map(async (file) => {
			const data = parse(await readFile(join(projectsDir, file), "utf8")) as { github?: unknown };
			return typeof data?.github === "string" ? data.github : null;
		}),
	);
	return [...new Set(repos.filter((repo): repo is string => repo !== null))].sort();
}

export async function readSnapshot(path: string): Promise<RepoSnapshot> {
	try {
		return JSON.parse(await readFile(path, "utf8")) as RepoSnapshot;
	} catch {
		return {};
	}
}

export function githubLoader({
	projectsDir,
	snapshot,
	ttlMs = 6 * 60 * 60 * 1000,
}: GithubLoaderOptions): Loader {
	return {
		name: "github-repos",
		load: async ({ logger, meta, parseData, store }) => {
			const repos = await readProjectRepos(projectsDir);
			const lastFetch = Number(meta.get("fetchedAt") ?? 0);
			const fresh = Date.now() - lastFetch < ttlMs && store.keys().length === repos.length;
			if (fresh) {
				logger.info("Using cached GitHub stats.");
				return;
			}

			const offline = process.env.GITHUB_OFFLINE === "1";
			const { errors, stats } = offline
				? { errors: [], stats: {} }
				: await fetchAll(repos, { log: (message) => logger.warn(message), token: process.env.GITHUB_TOKEN });
			for (const error of errors) {
				logger.warn(`GitHub fetch failed, falling back to snapshot: ${error}`);
			}

			const merged = mergeWithSnapshot(stats, await readSnapshot(snapshot), repos);
			store.clear();
			for (const [id, data] of Object.entries(merged)) {
				store.set({ data: await parseData({ data: { ...data }, id }), id });
			}
			if (Object.keys(stats).length > 0) {
				meta.set("fetchedAt", String(Date.now()));
			}
			logger.info(
				`GitHub stats: ${Object.keys(stats).length} live, ${Object.keys(merged).length - Object.keys(stats).length} from snapshot.`,
			);
		},
	};
}
