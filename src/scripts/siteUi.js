const storageKey = "eltavine-theme";
const themeColors = { dark: "#15130f", light: "#fbf7ef" };
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const compactNumberFormatter = new Intl.NumberFormat("en", {
	compactDisplay: "short",
	notation: "compact",
});

function currentTheme() {
	return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme, toggle) {
	const root = document.documentElement;
	root.dataset.theme = theme;
	root.style.colorScheme = theme;
	for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
		meta.setAttribute("content", themeColors[theme]);
	}
	toggle?.setAttribute(
		"aria-label",
		theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
	);
}

function switchTheme(nextTheme, toggle) {
	const commit = () => {
		try {
			window.localStorage.setItem(storageKey, nextTheme);
		} catch {}
		applyTheme(nextTheme, toggle);
	};

	if (!document.startViewTransition || reducedMotion.matches) {
		commit();
		return;
	}

	const rect = toggle.getBoundingClientRect();
	const x = rect.left + rect.width / 2;
	const y = rect.top + rect.height / 2;
	const radius = Math.hypot(
		Math.max(x, window.innerWidth - x),
		Math.max(y, window.innerHeight - y),
	);
	const transition = document.startViewTransition(commit);

	transition.ready
		.then(() => {
			document.documentElement.animate(
				{
					clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
				},
				{
					duration: 680,
					easing: "cubic-bezier(0.65, 0, 0.35, 1)",
					pseudoElement: "::view-transition-new(root)",
				},
			);
		})
		.catch(() => {});
}

export function initThemeToggle() {
	const toggle = document.querySelector("[data-theme-toggle]");

	if (!toggle || toggle.dataset.bound === "true") {
		return;
	}

	toggle.dataset.bound = "true";
	toggle.addEventListener("click", () => {
		switchTheme(currentTheme() === "dark" ? "light" : "dark", toggle);
	});

	applyTheme(currentTheme(), toggle);
}

export function initSiteHeader() {
	const header = document.querySelector("[data-site-header]");

	if (!header || header.dataset.bound === "true") {
		return;
	}

	header.dataset.bound = "true";
	let lastY = window.scrollY;
	let frame = 0;

	const update = () => {
		frame = 0;
		const y = window.scrollY;
		const delta = y - lastY;
		header.dataset.scrolled = String(y > 12);

		if (Math.abs(delta) < 6) {
			return;
		}

		header.dataset.hidden = String(delta > 0 && y > 240 && !header.contains(document.activeElement));
		lastY = y;
	};

	window.addEventListener(
		"scroll",
		() => {
			if (!frame) {
				frame = window.requestAnimationFrame(update);
			}
		},
		{ passive: true },
	);
	header.addEventListener("focusin", () => {
		header.dataset.hidden = "false";
	});
	update();
}

function observeActive(targets, onChange, rootMargin) {
	const visible = new Map();
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				visible.set(entry.target, entry.isIntersecting);
			}
			onChange(targets.find((target) => visible.get(target)) ?? null);
		},
		{ rootMargin },
	);

	for (const target of targets) {
		observer.observe(target);
	}
}

export function initScrollSpy() {
	if (!("IntersectionObserver" in window)) {
		return;
	}

	const navLinks = [...document.querySelectorAll("[data-nav-link]")];
	const sections = navLinks
		.map((link) => document.getElementById(link.hash.slice(1)))
		.filter(Boolean);

	if (sections.length > 0) {
		observeActive(
			sections,
			(active) => {
				for (const link of navLinks) {
					const isActive = active !== null && link.hash === `#${active.id}`;
					link.toggleAttribute("data-active", isActive);
					if (isActive) {
						link.setAttribute("aria-current", "location");
					} else {
						link.removeAttribute("aria-current");
					}
				}
			},
			"-45% 0px -54% 0px",
		);
	}

	const projectsSection = document.querySelector("[data-projects]");
	const sheets = [...document.querySelectorAll("[data-project-sheet]")];
	const indexLinks = [...document.querySelectorAll("[data-index-link]")];

	if (projectsSection && sheets.length > 0) {
		observeActive(
			sheets,
			(active) => {
				if (!active) {
					return;
				}

				const { crayon, projectId } = active.dataset;
				projectsSection.style.setProperty("--project-color", `var(--crayon-${crayon})`);
				projectsSection.style.setProperty("--project-ink", `var(--crayon-${crayon}-ink)`);
				for (const link of indexLinks) {
					link.toggleAttribute("data-active", link.dataset.indexLink === projectId);
				}
			},
			"-38% 0px -60% 0px",
		);
	}
}

export function initEmailReveal() {
	for (const button of document.querySelectorAll("[data-email-reveal]")) {
		if (button.dataset.bound === "true") {
			continue;
		}

		button.dataset.bound = "true";
		const label = button.querySelector("[data-email-label]");

		button.addEventListener("click", () => {
			const { emailDomain, emailTld, emailUser } = button.dataset;

			if (!emailUser || !emailDomain || !emailTld) {
				return;
			}

			if (button.dataset.state !== "primed") {
				button.dataset.state = "primed";
				if (label) {
					label.textContent = "Reveal email";
				}
				return;
			}

			const email = `${emailUser}@${emailDomain}.${emailTld}`;
			const link = document.createElement("a");
			const text = document.createElement("span");
			const icon = button.querySelector("[data-email-icon='revealed']")?.cloneNode(true);
			link.className = button.className;
			link.href = `mailto:${email}`;
			link.dataset.state = "revealed";
			link.setAttribute("aria-label", `Email ${email}`);
			text.dataset.emailLabel = "";
			text.textContent = email;
			if (icon) {
				link.append(icon);
			}
			link.append(text);
			button.replaceWith(link);
			link.focus({ preventScroll: true });
			link.dispatchEvent(new CustomEvent("eltavine:email-revealed", { bubbles: true }));
		});
	}
}

function countUp(element, target, duration = 1400) {
	const start = performance.now();

	const tick = (now) => {
		const progress = Math.min((now - start) / duration, 1);
		const eased = 1 - (1 - progress) ** 4;
		element.textContent = compactNumberFormatter.format(Math.round(target * eased));
		if (progress < 1) {
			window.requestAnimationFrame(tick);
		}
	};

	window.requestAnimationFrame(tick);
}

const statsObserver =
	"IntersectionObserver" in window
		? new IntersectionObserver(
				(entries, observer) => {
					for (const entry of entries) {
						if (!entry.isIntersecting) {
							continue;
						}
						observer.unobserve(entry.target);
						for (const element of entry.target.querySelectorAll("[data-value]")) {
							countUp(element, Number(element.dataset.value));
						}
					}
				},
				{ threshold: 0.6 },
			)
		: null;

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
		const values = [
			[starsEl, data.stargazers_count ?? 0],
			[forksEl, data.forks_count ?? 0],
		];
		link.dataset.state = "live";

		if (!statsObserver || reducedMotion.matches) {
			for (const [element, value] of values) {
				element.textContent = compactNumberFormatter.format(value);
			}
			return;
		}

		for (const [element, value] of values) {
			element.dataset.value = String(value);
		}
		statsObserver.observe(link);
	} catch {
		link.dataset.state = "error";
	}
}
