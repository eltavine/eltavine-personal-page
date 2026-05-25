const storageKey = "eltavine-theme";

const compactNumberFormatter = new Intl.NumberFormat("en", {
	compactDisplay: "short",
	notation: "compact",
});

function applyTheme(theme, toggle) {
	const root = document.documentElement;
	root.dataset.theme = theme;
	root.style.colorScheme = theme;
	toggle?.setAttribute(
		"aria-label",
		theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
	);
}

export function initThemeToggle() {
	const toggle = document.querySelector("[data-theme-toggle]");

	if (!toggle || toggle.dataset.bound === "true") {
		return;
	}

	toggle.dataset.bound = "true";
	toggle.addEventListener("click", () => {
		const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
		const nextTheme = currentTheme === "dark" ? "light" : "dark";
		try {
			window.localStorage.setItem(storageKey, nextTheme);
		} catch {}
		applyTheme(nextTheme, toggle);
	});

	applyTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light", toggle);
}

export function initEmailReveal() {
	for (const button of document.querySelectorAll("[data-email-reveal]")) {
		if (button.dataset.bound === "true") {
			continue;
		}

		button.dataset.bound = "true";
		let isPrimed = false;
		const icon = button.querySelector("[data-icon]");
		const label = button.querySelector("span");

		button.addEventListener("click", () => {
			const { emailDomain, emailTld, emailUser } = button.dataset;

			if (!emailUser || !emailDomain || !emailTld) {
				return;
			}

			if (!isPrimed) {
				isPrimed = true;
				if (label) {
					label.textContent = "Reveal email";
				}
				icon?.setAttribute("data-icon-state", "primed");
				button.dataset.state = "primed";
				return;
			}

			const email = `${emailUser}@${emailDomain}.${emailTld}`;
			const link = document.createElement("a");
			link.className = button.className;
			link.href = `mailto:${email}`;
			link.textContent = email;
			link.dataset.state = "revealed";
			link.setAttribute("aria-label", `Email ${email}`);
			button.replaceWith(link);
			link.focus({ preventScroll: true });
		});
	}
}

export function initGitHubRepoStats() {
	for (const link of document.querySelectorAll("[data-github-repo-stats]")) {
		if (link.dataset.bound === "true") {
			continue;
		}

		link.dataset.bound = "true";
		void updateGitHubRepoStats(link);
	}
}

async function updateGitHubRepoStats(link) {
	const repo = link.dataset.repo;
	const starsEl = link.querySelector("[data-github-stars]");
	const forksEl = link.querySelector("[data-github-forks]");

	if (!repo || !starsEl || !forksEl) {
		return;
	}

	try {
		const response = await fetch(`https://api.github.com/repos/${repo}`, {
			headers: { Accept: "application/vnd.github+json" },
		});

		if (!response.ok) {
			throw new Error("GitHub stats unavailable");
		}

		const data = await response.json();
		starsEl.textContent = compactNumberFormatter.format(data.stargazers_count ?? 0);
		forksEl.textContent = compactNumberFormatter.format(data.forks_count ?? 0);
		link.dataset.state = "live";
	} catch {
		link.dataset.state = "error";
	}
}
