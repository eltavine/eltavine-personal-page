const compact = new Intl.NumberFormat("en", { compactDisplay: "short", notation: "compact" });
const monthYear = new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC", year: "numeric" });

export const pad2 = (value: number) => String(value).padStart(2, "0");

export const compactNumber = (value: number) => compact.format(value);

export const formatMonthYear = (iso: string) => monthYear.format(new Date(iso));

export function groupFingerprint(fingerprint: string, size = 4): string[] {
	return fingerprint.replace(/\s+/g, "").match(new RegExp(`.{1,${size}}`, "g")) ?? [];
}

export function listNames(names: string[]): string {
	if (names.length <= 1) {
		return names[0] ?? "";
	}
	return `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}

export interface EmailParts {
	user: string;
	domain: string;
	tld: string;
}

export const assembleEmail = ({ user, domain, tld }: EmailParts) => `${user}@${domain}.${tld}`;
