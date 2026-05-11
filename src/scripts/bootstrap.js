import { initEmailReveal, initThemeToggle } from "./siteUi.js";
import { initGitHubRepoStats } from "./githubStats.js";
import { initGitHubStarCharts } from "./githubStarChart.js";

export function initSite() {
	initThemeToggle();
	initEmailReveal();
	initGitHubRepoStats();
	initGitHubStarCharts();
}

initSite();
