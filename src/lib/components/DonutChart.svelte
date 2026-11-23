<script lang="ts">
	let {
		data = [],
		size = 150,
		thickness = 22,
		centerLabel = '',
		centerSub = ''
	}: {
		data?: { label: string; value: number; color: string }[];
		size?: number;
		thickness?: number;
		centerLabel?: string;
		centerSub?: string;
	} = $props();

	let radius = $derived((size - thickness) / 2);
	let circumference = $derived(2 * Math.PI * radius);
	let total = $derived(Math.max(1, data.reduce((s, d) => s + d.value, 0)));
</script>

<div class="relative inline-grid place-items-center" style={`width:${size}px;height:${size}px`}>
	<svg width={size} height={size} class="-rotate-90">
		<circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eeeade" stroke-width={thickness} />
		{#each data as d, i}
			{@const before = data.slice(0, i).reduce((sum, item) => sum + item.value, 0)}
			{@const dash = (d.value / total) * circumference}
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="none"
				stroke={d.color}
				stroke-width={thickness}
				stroke-dasharray={`${dash} ${circumference - dash}`}
				stroke-dashoffset={-(before / total) * circumference}
				stroke-linecap="butt"
			/>
		{/each}
	</svg>
	<div class="absolute text-center">
		<div class="display text-2xl font-semibold">{centerLabel}</div>
		<div class="text-[0.6rem] font-bold uppercase tracking-wider text-slate">{centerSub}</div>
	</div>
</div>
