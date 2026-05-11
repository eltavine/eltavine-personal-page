const storagePrefix = "eltavine:github:";

function getStorage() {
	try {
		return window.localStorage;
	} catch {
		return null;
	}
}

function readJson(key) {
	const storage = getStorage();
	if (!storage) {
		return null;
	}

	try {
		const raw = storage.getItem(`${storagePrefix}${key}`);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

function writeJson(key, value) {
	const storage = getStorage();
	if (!storage) {
		return;
	}

	try {
		storage.setItem(`${storagePrefix}${key}`, JSON.stringify(value));
	} catch {}
}

function removeJson(key) {
	const storage = getStorage();
	if (!storage) {
		return;
	}

	try {
		storage.removeItem(`${storagePrefix}${key}`);
	} catch {}
}

export function readCachedValue(key) {
	const entry = readJson(`cache:${key}`);
	if (!entry || typeof entry !== "object") {
		return null;
	}

	if (typeof entry.expiresAt === "number" && entry.expiresAt > 0 && Date.now() > entry.expiresAt) {
		return null;
	}

	return entry.value ?? null;
}

export function writeCachedValue(key, value, ttlMs) {
	const expiresAt = Number.isFinite(ttlMs) && ttlMs > 0 ? Date.now() + ttlMs : 0;
	writeJson(`cache:${key}`, { expiresAt, value });
	return value;
}

export function readCooldownUntil(key) {
	const until = readJson(`cooldown:${key}`);
	return typeof until === "number" ? until : 0;
}

export function writeCooldownUntil(key, until) {
	if (!Number.isFinite(until) || until <= 0) {
		removeJson(`cooldown:${key}`);
		return 0;
	}

	writeJson(`cooldown:${key}`, until);
	return until;
}

export function isCooldownActive(key) {
	return readCooldownUntil(key) > Date.now();
}
