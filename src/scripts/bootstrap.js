import { initEmailReveal, initGitHubRepoStats, initThemeToggle } from "./siteUi.js";

export function initSite() {
	initThemeToggle();
	initEmailReveal();
	initGitHubRepoStats();
}

initSite();
