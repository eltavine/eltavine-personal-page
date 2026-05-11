const monthShortFormatter = new Intl.DateTimeFormat("en", {
	month: "short",
	timeZone: "UTC",
});

const monthYearFormatter = new Intl.DateTimeFormat("en", {
	month: "short",
	timeZone: "UTC",
	year: "numeric",
});

function startOfMonthUtc(date) {
	return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function addMonthsUtc(date, months) {
	const next = new Date(date.getTime());
	next.setUTCMonth(next.getUTCMonth() + months);
	return next;
}

function formatMonthShort(date) {
	return monthShortFormatter.format(date);
}

function formatMonthYear(date) {
	return monthYearFormatter.format(date);
}

function emptyStarSeries() {
	return {
		dates: [],
		labels: [],
		monthly: [],
		peak: null,
		rangeLabel: "No monthly data",
		totalStars: 0,
	};
}

function finalizeStarSeries(monthly, dates, totalStars = dates.length) {
	if (!monthly.length) {
		return emptyStarSeries();
	}

	const peak = monthly.reduce((best, point) => (point.count > best.count ? point : best), monthly[0]);
	return {
		dates,
		labels: monthly.map((point) => point.label),
		monthly,
		peak,
		rangeLabel: monthly.length === 1
			? formatMonthYear(monthly[0].date)
			: `${formatMonthYear(monthly[0].date)} to ${formatMonthYear(monthly[monthly.length - 1].date)}`,
		totalStars,
	};
}

export function buildMonthlyStarSeries(starredAtList) {
	const dates = starredAtList
		.map((starredAt) => new Date(starredAt))
		.filter((date) => !Number.isNaN(date.getTime()))
		.sort((left, right) => left.getTime() - right.getTime());

	if (!dates.length) {
		return emptyStarSeries();
	}

	const countsByMonth = new Map();
	for (const date of dates) {
		const monthKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
		countsByMonth.set(monthKey, (countsByMonth.get(monthKey) ?? 0) + 1);
	}

	const firstMonth = startOfMonthUtc(dates[0]);
	const currentMonth = startOfMonthUtc(new Date());
	const monthly = [];
	let cumulative = 0;

	for (let cursor = new Date(firstMonth.getTime()); cursor <= currentMonth; cursor = addMonthsUtc(cursor, 1)) {
		const monthKey = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, "0")}`;
		const count = countsByMonth.get(monthKey) ?? 0;
		cumulative += count;
		monthly.push({
			count,
			cumulative,
			date: new Date(cursor.getTime()),
			label: formatMonthShort(cursor),
			rangeLabel: formatMonthYear(cursor),
		});
	}

	return finalizeStarSeries(monthly, dates);
}

export function buildFallbackStarSeries(starMonths) {
	const monthly = [];
	const dates = [];
	let cumulative = 0;

	for (const item of starMonths ?? []) {
		const monthValue = String(item?.month ?? "");
		const [yearText, monthText] = monthValue.split("-");
		const year = Number(yearText);
		const month = Number(monthText);
		const count = Number(item?.count ?? 0);

		if (!year || !month || !Number.isFinite(count) || count < 0) {
			continue;
		}

		const date = new Date(Date.UTC(year, month - 1, 1));
		cumulative += count;
		dates.push(date);
		monthly.push({
			count,
			cumulative,
			date,
			label: formatMonthShort(date),
			rangeLabel: formatMonthYear(date),
		});
	}

	return finalizeStarSeries(monthly, dates, cumulative);
}
