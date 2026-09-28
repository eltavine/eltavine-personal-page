import { afterPaint, defineElement } from "../../lib/events.ts";
import { compactNumber } from "../../lib/format.ts";

const TTL = 6 * 60 * 60 * 1000;

interface Cached {
	stars: number;
	forks: number;
	at: number;
}

/**
 * Build-time numbers are the truth on the page; this only nudges them forward when the
 * public API answers, and stays silent when it does not (rate limits, offline, blocked).
 */
class RepoStats extends HTMLElement {
	connectedCallback() {
		if (!this.querySelector("[data-stars]")) {
			return;
		}
		afterPaint(() => void this.#refresh(), 4000);
	}

	get #key() {
		return `repo-stats:${this.dataset.repo}`;
	}

	#read(): Cached | null {
		try {
			const cached = JSON.parse(window.localStorage.getItem(this.#key) ?? "null") as Cached | null;
			return cached && Date.now() - cached.at < TTL ? cached : null;
		} catch {
			return null;
		}
	}

	#apply({ stars, forks }: Cached) {
		const starsEl = this.querySelector("[data-stars]");
		const forksEl = this.querySelector("[data-forks]");
		const asOf = this.querySelector("[data-asof]");
		if (starsEl) starsEl.textContent = compactNumber(stars);
		if (forksEl) forksEl.textContent = compactNumber(forks);
		if (asOf) asOf.textContent = "as of today";
	}

	async #refresh() {
		const cached = this.#read();
		if (cached) {
			this.#apply(cached);
			return;
		}
		if (!this.dataset.repo || navigator.onLine === false) {
			return;
		}
		try {
			const response = await fetch(`https://api.github.com/repos/${this.dataset.repo}`, {
				headers: { Accept: "application/vnd.github+json" },
				signal: AbortSignal.timeout(6000),
			});
			if (!response.ok) {
				return;
			}
			const data = (await response.json()) as { stargazers_count?: number; forks_count?: number };
			if (typeof data.stargazers_count !== "number" || typeof data.forks_count !== "number") {
				return;
			}
			const fresh = { at: Date.now(), forks: data.forks_count, stars: data.stargazers_count };
			this.#apply(fresh);
			window.localStorage.setItem(this.#key, JSON.stringify(fresh));
		} catch {}
	}
}

defineElement("repo-stats", RepoStats);
