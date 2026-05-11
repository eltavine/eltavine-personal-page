import { fetchRepoOverview } from "../lib/github.js";

const numberFormatter = new Intl.NumberFormat("en", {
	compactDisplay: "short",
	notation: "compact",
});

async function loadRepoStats(panel) {
	const repo = panel.dataset.repo;
	const starsEl = panel.querySelector("[data-github-stars]");
	const forksEl = panel.querySelector("[data-github-forks]");
	const fallbackStars = panel.dataset.fallbackStars;
	const fallbackForks = panel.dataset.fallbackForks;

	if (!repo || (!starsEl && !forksEl)) {
		return;
	}

	try {
		const { stars, forks, source } = await fetchRepoOverview(repo);
		if (starsEl) {
			starsEl.textContent = numberFormatter.format(stars);
		}
		if (forksEl) {
			forksEl.textContent = numberFormatter.format(forks);
		}
		panel.dataset.source = source ?? "live";
		panel.dataset.state = "ready";
	} catch {
		if (starsEl) {
			starsEl.textContent = fallbackStars ?? "N/A";
		}
		if (forksEl) {
			forksEl.textContent = fallbackForks ?? "N/A";
		}
		panel.dataset.source = fallbackStars || fallbackForks ? "fallback" : "error";
		panel.dataset.state = fallbackStars || fallbackForks ? "fallback" : "error";
	}
}

export function initGitHubRepoStats() {
	for (const panel of document.querySelectorAll("[data-github-stats]")) {
		if (panel.dataset.bound === "true") {
			continue;
		}

		panel.dataset.bound = "true";
		void loadRepoStats(panel);
	}
}
