let chartModulePromise;
let chartModuleRegistered = false;

function hexToRgba(color, alpha) {
	const value = color.trim();
	if (!value.startsWith("#")) {
		return value;
	}

	const hex = value.slice(1);
	const normalized =
		hex.length === 3 ? hex.split("").map((char) => char + char).join("") : hex;

	if (normalized.length !== 6) {
		return value;
	}

	const numeric = Number.parseInt(normalized, 16);
	const red = (numeric >> 16) & 255;
	const green = (numeric >> 8) & 255;
	const blue = numeric & 255;

	return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function createChartFill(chart, accent) {
	const { chartArea, ctx } = chart;

	if (!chartArea) {
		return hexToRgba(accent, 0.08);
	}

	const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
	gradient.addColorStop(0, hexToRgba(accent, 0.24));
	gradient.addColorStop(1, hexToRgba(accent, 0));
	return gradient;
}

async function loadChartModule() {
	chartModulePromise ??= import("chart.js");
	const chartModule = await chartModulePromise;

	if (!chartModuleRegistered) {
		chartModule.Chart.register(
			chartModule.CategoryScale,
			chartModule.Filler,
			chartModule.LineController,
			chartModule.LineElement,
			chartModule.LinearScale,
			chartModule.PointElement,
			chartModule.Tooltip,
		);
		chartModuleRegistered = true;
	}

	return chartModule.Chart;
}

function buildChartData(series, colors) {
	return {
		labels: series.labels,
		datasets: [
			{
				backgroundColor(context) {
					return createChartFill(context.chart, colors.accent);
				},
				borderColor: colors.accent,
				borderCapStyle: "round",
				borderJoinStyle: "round",
				borderWidth: 2.5,
				data: series.monthly.map((point) => point.cumulative),
				fill: true,
				pointBackgroundColor: colors.accent,
				pointBorderColor: colors.surfaceStrong,
				pointBorderWidth: 1.5,
				pointHoverBorderWidth: 1.5,
				pointHoverRadius: 4.5,
				pointHitRadius: 12,
				pointRadius: 2.5,
				spanGaps: true,
				tension: 0.38,
			},
		],
	};
}

function buildChartOptions(series, colors) {
	const yMax = Math.max(10, Math.ceil((series.totalStars * 1.12) / 25) * 25);

	return {
		interaction: {
			intersect: false,
			mode: "index",
		},
		animation: {
			duration: 700,
			easing: "easeOutQuart",
		},
		layout: {
			padding: {
				bottom: 4,
				left: 2,
				right: 6,
				top: 8,
			},
		},
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				backgroundColor: colors.surfaceStrong,
				bodyColor: colors.muted,
				bodyFont: {
					family: colors.mono,
					size: 11,
				},
				borderColor: colors.line,
				borderWidth: 1,
				cornerRadius: 8,
				displayColors: false,
				padding: 10,
				titleColor: colors.text,
				titleFont: {
					family: colors.mono,
					size: 11,
					weight: "600",
				},
				callbacks: {
					label(context) {
						const point = series.monthly[context.dataIndex];
						return `${point.cumulative} total stars, +${point.count} in ${point.rangeLabel}`;
					},
					title(items) {
						const point = series.monthly[items[0].dataIndex];
						return point.rangeLabel;
					},
				},
			},
		},
		scales: {
			x: {
				border: {
					display: false,
				},
				grid: {
					display: false,
				},
				ticks: {
					color: colors.muted,
					font: {
						family: colors.mono,
						size: 10,
					},
					maxRotation: 0,
					minRotation: 0,
					padding: 8,
				},
			},
			y: {
				beginAtZero: true,
				border: {
					display: false,
				},
				grid: {
					color: colors.line,
					drawTicks: false,
				},
				suggestedMax: yMax,
				ticks: {
					color: colors.muted,
					maxTicksLimit: 4,
					padding: 6,
					precision: 0,
					font: {
						family: colors.mono,
						size: 10,
					},
				},
			},
		},
	};
}

export async function renderStarChart(canvas, series, colors) {
	const Chart = await loadChartModule();
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw new Error("Chart canvas context unavailable");
	}

	return new Chart(ctx, {
		type: "line",
		data: buildChartData(series, colors),
		options: buildChartOptions(series, colors),
	});
}
