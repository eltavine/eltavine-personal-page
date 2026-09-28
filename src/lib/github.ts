import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";
import { Octokit } from "@octokit/rest";

export interface StarPoint {
	date: string;
	stars: number;
}

export interface RepoStats {
	repo: string;
	stars: number;
	forks: number;
	pushedAt: string | null;
	fetchedAt: string;
	history: StarPoint[];
}

export type RepoSnapshot = Record<string, RepoStats>;

export interface FetchOptions {
	token?: string;
	now?: Date;
	perPage?: number;
	maxPages?: number;
	timeoutMs?: number;
	log?: (message: string) => void;
}

const ThrottledOctokit = Octokit.plugin(retry, throttling);

export function createClient({ token, log = () => {} }: Pick<FetchOptions, "token" | "log"> = {}) {
	return new ThrottledOctokit({
		auth: token,
		log: { debug: () => {}, error: () => {}, info: () => {}, warn: log },
		retry: { doNotRetry: [400, 401, 403, 404, 422, 429] },
		throttle: {
			onRateLimit: (_retryAfter, options) => {
				log(`GitHub rate limit hit for ${options.method} ${options.url}; using the snapshot instead.`);
				return false;
			},
			onSecondaryRateLimit: (_retryAfter, options) => {
				log(`GitHub secondary rate limit hit for ${options.method} ${options.url}.`);
				return false;
			},
		},
		userAgent: "eltavine-personal-page",
	});
}

/** Page numbers to sample from the stargazer list, evenly spread and always including the first and last page. */
export function planStarPages(totalStars: number, perPage = 100, maxPages = 12): number[] {
	const pages = Math.ceil(totalStars / perPage);
	if (pages <= 0) {
		return [];
	}
	if (pages <= maxPages) {
		return Array.from({ length: pages }, (_, index) => index + 1);
	}
	const picked = new Set<number>();
	for (let index = 0; index < maxPages; index++) {
		picked.add(1 + Math.round((index * (pages - 1)) / (maxPages - 1)));
	}
	return [...picked].sort((a, b) => a - b);
}

export function buildHistory(
	samples: { page: number; starredAt: string }[],
	totalStars: number,
	now: Date,
	perPage = 100,
): StarPoint[] {
	const points = samples
		.map(({ page, starredAt }) => ({ date: starredAt, stars: (page - 1) * perPage + 1 }))
		.sort((a, b) => a.date.localeCompare(b.date));
	if (totalStars > 0) {
		points.push({ date: now.toISOString(), stars: totalStars });
	}
	return points;
}

function splitRepo(repo: string) {
	const [owner, name] = repo.split("/");
	if (!owner || !name) {
		throw new Error(`Expected "owner/name", got "${repo}"`);
	}
	return { owner, repo: name };
}

export async function fetchRepoStats(
	client: ReturnType<typeof createClient>,
	repo: string,
	{ now = new Date(), perPage = 100, maxPages = 12, timeoutMs = 10_000, log = () => {} }: FetchOptions = {},
): Promise<RepoStats> {
	const target = splitRepo(repo);
	const { data } = await client.rest.repos.get({
		...target,
		request: { signal: AbortSignal.timeout(timeoutMs) },
	});
	const samples: { page: number; starredAt: string }[] = [];

	try {
		for (const page of planStarPages(data.stargazers_count, perPage, maxPages)) {
			const response = await client.rest.activity.listStargazersForRepo({
				...target,
				headers: { accept: "application/vnd.github.star+json" },
				page,
				per_page: perPage,
				request: { signal: AbortSignal.timeout(timeoutMs) },
			});
			const first = (response.data as { starred_at?: string }[])[0];
			if (first?.starred_at) {
				samples.push({ page, starredAt: first.starred_at });
			}
		}
	} catch (error) {
		// Listing stargazers needs a token; counts still come from the public repo endpoint.
		log(`${repo}: star history unavailable (${error instanceof Error ? error.message : String(error)}).`);
		samples.length = 0;
	}

	return {
		fetchedAt: now.toISOString(),
		forks: data.forks_count,
		history: samples.length > 0 ? buildHistory(samples, data.stargazers_count, now, perPage) : [],
		pushedAt: data.pushed_at ?? null,
		repo,
		stars: data.stargazers_count,
	};
}

/** Carries an older history forward to today's total when only the counts could be refreshed. */
export function extendHistory(history: StarPoint[], stars: number, date: string): StarPoint[] {
	const last = history.at(-1);
	if (!last) {
		return [];
	}
	if (last.stars === stars) {
		return history;
	}
	return [...history, { date, stars }];
}

export async function fetchAll(repos: string[], options: FetchOptions = {}) {
	const client = createClient(options);
	const stats: RepoSnapshot = {};
	const errors: string[] = [];

	for (const repo of repos) {
		try {
			stats[repo] = await fetchRepoStats(client, repo, options);
		} catch (error) {
			errors.push(`${repo}: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	return { errors, stats };
}

/** Fresh data wins; the committed snapshot fills every repo the network could not answer for. */
export function mergeWithSnapshot(fresh: RepoSnapshot, snapshot: RepoSnapshot, repos: string[]) {
	const merged: Record<string, RepoStats & { source: "live" | "snapshot" }> = {};
	for (const repo of repos) {
		const live = fresh[repo];
		const cached = snapshot[repo];
		if (live) {
			const history =
				live.history.length > 0
					? live.history
					: extendHistory(cached?.history ?? [], live.stars, live.fetchedAt);
			merged[repo] = { ...live, history, source: "live" };
		} else if (cached) {
			merged[repo] = { ...cached, source: "snapshot" };
		}
	}
	return merged;
}
