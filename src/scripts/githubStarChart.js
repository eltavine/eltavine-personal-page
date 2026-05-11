import { fetchStarEvents } from "../lib/github.js";
import { renderStarChart } from "./githubStarChartRenderer.js";
import {
	readFallbackHistory,
	resolveChartColors,
	setStarSource,
	setStarSummary,
} from "./githubStarChartView.js";
import { buildFallbackStarSeries, buildMonthlyStarSeries } from "../lib/starSeries.js";

function setMessage(root, message) {
	const messageEl = root.querySelector("[data-github-star-message]");
	if (messageEl) {
		messageEl.textContent = message;
	}
}

async function loadStarSeries(root, repo) {
	try {
		const starEvents = await fetchStarEvents(repo);
		const series = buildMonthlyStarSeries(starEvents);
		series.source = starEvents.source ?? "live";
		return series;
	} catch (error) {
		const series = buildFallbackStarSeries(readFallbackHistory(root));
		series.source = error?.code === "GITHUB_RATE_LIMITED"
			? "rate-limited"
			: series.monthly.length
				? "fallback"
				: "error";
		return series;
	}
}

async function renderChart(root) {
	if (root.dataset.state === "loading" || root.dataset.state === "ready") {
		return;
	}

	const repo = root.dataset.repo;
	const canvas = root.querySelector("[data-github-star-canvas]");
	const chartTitle = root.dataset.projectTitle ?? "Project";

	if (!repo || !(canvas instanceof HTMLCanvasElement)) {
		return;
	}

	root.dataset.state = "loading";
	root.setAttribute("aria-busy", "true");
	setMessage(root, "Loading star history...");
	setStarSource(root, "loading");

	try {
		const series = await loadStarSeries(root, repo);

		if (!series.monthly.length) {
			setMessage(root, series.source === "error" ? "Star history unavailable." : "No stars yet.");
			setStarSummary(root, series);
			setStarSource(root, series.source ?? "error");
			root.dataset.state = series.source === "error" ? "error" : "empty";
			root.setAttribute("aria-busy", "false");
			return;
		}

		const colors = resolveChartColors();
		await renderStarChart(canvas, series, colors);

		setStarSummary(root, series);
		setStarSource(root, series.source ?? "live");
		setMessage(root, "");
		root.dataset.state = "ready";
		root.setAttribute("aria-busy", "false");
		root.dataset.chartLoaded = "true";
		canvas.setAttribute(
			"aria-label",
			`${chartTitle} star history line chart. ${series.totalStars} total stars across ${series.monthly.length} periods. ${series.peak ? `Peak +${series.peak.count} in ${series.peak.rangeLabel}.` : ""}`,
		);
	} catch (error) {
		setMessage(root, "Star history unavailable.");
		setStarSource(root, error?.code === "GITHUB_RATE_LIMITED" ? "rate-limited" : "error");
		root.dataset.state = "error";
		root.setAttribute("aria-busy", "false");
	}
}

function observeChart(root) {
	if (!("IntersectionObserver" in window)) {
		void renderChart(root);
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					observer.disconnect();
					void renderChart(root);
					break;
				}
			}
		},
		{ rootMargin: "140px 0px" },
	);

	observer.observe(root);
}

export function initGitHubStarCharts() {
	for (const root of document.querySelectorAll("[data-github-star-chart]")) {
		if (root.dataset.bound === "true") {
			continue;
		}

		root.dataset.bound = "true";
		observeChart(root);
	}
}
