<script lang="ts">
	let {
		data = [],
		height = 120,
		color = '#10b981',
		fill = 'rgba(16,185,129,0.14)',
		strokeWidth = 3
	}: {
		data?: { label: string; value: number }[];
		height?: number;
		color?: string;
		fill?: string;
		strokeWidth?: number;
	} = $props();

	let width = 320;
	let max = $derived(Math.max(1, ...data.map((d) => d.value)));
	let min = $derived(Math.min(...data.map((d) => d.value), 0));
	let points = $derived(
		data
			.map((d, i) => {
				const x = data.length <= 1 ? width / 2 : (i / (data.length - 1)) * width;
				const y = height - 12 - ((d.value - min) / Math.max(1, max - min)) * (height - 24);
				return `${x.toFixed(1)},${y.toFixed(1)}`;
			})
			.join(' ')
	);
	let area = $derived(`0,${height} ${points} ${width},${height}`);
</script>

<svg viewBox={`0 0 ${width} ${height}`} class="w-full" style={`height:${height}px`} preserveAspectRatio="none" aria-label="Trend chart">
	<defs>
		<linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color={color} stop-opacity="0.3" />
			<stop offset="100%" stop-color={color} stop-opacity="0" />
		</linearGradient>
	</defs>
	<polygon points={area} fill="url(#chartFill)" />
	<polyline points={points} fill="none" stroke={color} stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round" />
	{#if data.length}
		<circle cx={points.split(' ').at(-1)?.split(',')[0]} cy={points.split(' ').at(-1)?.split(',')[1]} r="4.5" fill={color} stroke="#fff" stroke-width="2" />
	{/if}
</svg>
