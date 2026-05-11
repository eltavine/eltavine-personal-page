import {
	isCooldownActive,
	readCachedValue,
	writeCachedValue,
	writeCooldownUntil,
} from "./githubCache.js";

const apiCooldownKey = "api";
const cacheTtlMs = 24 * 60 * 60 * 1000;
const cooldownTtlMs = 24 * 60 * 60 * 1000;

function createGitHubError(response, data) {
	const message = typeof data?.message === "string" ? data.message : "GitHub request failed";
	const error = new Error(message);
	error.code = response.status === 403 && /rate limit/i.test(message)
		? "GITHUB_RATE_LIMITED"
		: "GITHUB_REQUEST_FAILED";
	return error;
}

function markRateLimited(error) {
	if (error?.code === "GITHUB_RATE_LIMITED") {
		writeCooldownUntil(apiCooldownKey, Date.now() + cooldownTtlMs);
	}
}

function rateLimitError() {
	const error = new Error("GitHub API rate limit cooldown is active");
	error.code = "GITHUB_RATE_LIMITED";
	return error;
}

async function requestGitHubJson(url, headers) {
	const response = await fetch(url, { headers });
	const data = await response.json().catch(() => null);

	if (!response.ok) {
		throw createGitHubError(response, data);
	}

	return data;
}

function cacheKey(kind, repo) {
	return `${kind}:${repo}`;
}

function withSource(value, source) {
	if (Array.isArray(value)) {
		const sourcedArray = [...value];
		sourcedArray.source = source;
		return sourcedArray;
	}

	return { ...value, source };
}

function readCacheOrNull(key, source = "cache") {
	const cached = readCachedValue(key);
	return cached ? withSource(cached, source) : null;
}

export async function fetchRepoOverview(repo) {
	const key = cacheKey("repo-overview", repo);
	const cached = readCacheOrNull(key);

	if (isCooldownActive(apiCooldownKey)) {
		if (cached) {
			return cached;
		}
		throw rateLimitError();
	}

	try {
		const data = await requestGitHubJson(`https://api.github.com/repos/${repo}`, {
			Accept: "application/vnd.github+json",
		});
		const result = {
			forks: data.forks_count ?? 0,
			stars: data.stargazers_count ?? 0,
		};

		writeCachedValue(key, result, cacheTtlMs);
		return withSource(result, "live");
	} catch (error) {
		markRateLimited(error);
		if (cached) {
			return cached;
		}
		throw error;
	}
}

export async function fetchStarEvents(repo) {
	const key = cacheKey("star-events", repo);
	const cached = readCacheOrNull(key);

	if (isCooldownActive(apiCooldownKey)) {
		if (cached) {
			return cached;
		}
		throw rateLimitError();
	}

	try {
		const history = [];
		const perPage = 100;
		let page = 1;

		while (true) {
			const pageItems = await requestGitHubJson(
				`https://api.github.com/repos/${repo}/stargazers?per_page=${perPage}&page=${page}`,
				{ Accept: "application/vnd.github.star+json" },
			);

			if (!Array.isArray(pageItems) || pageItems.length === 0) {
				break;
			}

			for (const item of pageItems) {
				if (item?.starred_at) {
					history.push(item.starred_at);
				}
			}

			if (pageItems.length < perPage) {
				break;
			}

			page += 1;
		}

		const sortedHistory = history.sort();
		writeCachedValue(key, sortedHistory, cacheTtlMs);
		return withSource(sortedHistory, "live");
	} catch (error) {
		markRateLimited(error);
		if (cached) {
			return cached;
		}
		throw error;
	}
}
