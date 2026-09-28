export interface TimedNote {
	/** Inclusive start hour in the visitor's local time, 0-23. */
	from: number;
	/** Exclusive end hour; a window may wrap past midnight (e.g. 22 → 5). */
	to: number;
	text: string;
}

export function pickNote(notes: readonly TimedNote[], fallback: string, hour: number): string {
	const match = notes.find(({ from, to }) =>
		from <= to ? hour >= from && hour < to : hour >= from || hour < to,
	);
	return match?.text ?? fallback;
}
