import {
	initCopyButtons,
	initEmailReveal,
	initGitHubRepoStats,
	initScrollSpy,
	initSiteHeader,
	initStackFocus,
	initThemeToggle,
	initWordmarkLens,
} from "./siteUi.js";

export function initSite() {
	initThemeToggle();
	initSiteHeader();
	initScrollSpy();
	initStackFocus();
	initEmailReveal();
	initCopyButtons();
	initWordmarkLens();
	initGitHubRepoStats();
}

initSite();
