const storageKey = "eltavine-theme";

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
