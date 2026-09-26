import {
	initEmailReveal,
	initGitHubRepoStats,
	initScrollSpy,
	initSiteHeader,
	initThemeToggle,
} from "./siteUi.js";

export function initSite() {
	initThemeToggle();
	initSiteHeader();
	initScrollSpy();
	initEmailReveal();
	initGitHubRepoStats();
}

initSite();
