export function formatLatestLabel(date) {
	return date.toLocaleDateString("en", {
		month: "short",
		timeZone: "UTC",
		year: "numeric",
	});
}

export function resolveChartColors() {
	const rootStyles = getComputedStyle(document.documentElement);
	return {
		accent: rootStyles.getPropertyValue("--accent").trim() || "#254c64",
		line: rootStyles.getPropertyValue("--line").trim() || "rgba(17, 17, 17, 0.14)",
		muted: rootStyles.getPropertyValue("--muted").trim() || "#6c6c66",
		mono: rootStyles.getPropertyValue("--font-mono").trim() || "monospace",
		surface: rootStyles.getPropertyValue("--surface").trim() || "#fff",
		surfaceStrong: rootStyles.getPropertyValue("--surface-strong").trim() || "#fff",
		text: rootStyles.getPropertyValue("--text").trim() || "#111111",
	};
}

export function readFallbackHistory(root) {
	try {
		return JSON.parse(root.dataset.fallbackHistory ?? "[]");
	} catch {
		return [];
	}
}

export function setStarSummary(root, series) {
	const totalEl = root.querySelector("[data-github-star-total]");
	const latestEl = root.querySelector("[data-github-star-latest]");
	const rangeEl = root.querySelector("[data-github-star-range]");
	const peakEl = root.querySelector("[data-github-star-peak]");

	if (totalEl) {
		totalEl.textContent = String(series.totalStars);
	}
	if (latestEl) {
		latestEl.textContent = series.dates.length ? formatLatestLabel(series.dates[series.dates.length - 1]) : "--";
	}
	if (rangeEl) {
		rangeEl.textContent = series.rangeLabel;
	}
	if (peakEl) {
		peakEl.textContent = series.peak
			? `Peak +${series.peak.count} in ${series.peak.rangeLabel}`
			: "Peak unavailable";
	}
}

const sourceLabels = {
	error: "Star history unavailable",
	cache: "Cached GitHub data",
	fallback: "Cached fallback",
	live: "Live GitHub data",
	"rate-limited": "GitHub rate limited",
	loading: "Loading GitHub data...",
};

export function setStarSource(root, source) {
	const sourceEl = root.querySelector("[data-github-star-source]");

	if (sourceEl) {
		sourceEl.textContent = sourceLabels[source] ?? sourceLabels.loading;
	}

	root.dataset.source = source;
}
