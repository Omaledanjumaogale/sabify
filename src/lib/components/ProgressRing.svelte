<script lang="ts">
	let {
		value = 0,
		size = 92,
		stroke = 9,
		color = '#10b981',
		track = '#e9e6da',
		label = '',
		sublabel = ''
	}: {
		value?: number;
		size?: number;
		stroke?: number;
		color?: string;
		track?: string;
		label?: string;
		sublabel?: string;
	} = $props();

	let radius = $derived((size - stroke) / 2);
	let circumference = $derived(2 * Math.PI * radius);
	let offset = $derived(circumference * (1 - Math.min(100, Math.max(0, value)) / 100));
</script>

<div class="relative inline-grid place-items-center" style={`width:${size}px;height:${size}px`}>
	<svg width={size} height={size} class="-rotate-90">
		<circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={track} stroke-width={stroke} />
		<circle
			cx={size / 2}
			cy={size / 2}
			r={radius}
			fill="none"
			stroke={color}
			stroke-width={stroke}
			stroke-linecap="round"
			stroke-dasharray={circumference}
			stroke-dashoffset={offset}
			style="transition: stroke-dashoffset 600ms cubic-bezier(0.22,1,0.36,1)"
		/>
	</svg>
	<div class="absolute text-center leading-tight">
		<div class="display text-lg font-semibold">{label || `${Math.round(value)}%`}</div>
		{#if sublabel}<div class="text-[0.6rem] font-bold uppercase tracking-wider text-slate">{sublabel}</div>{/if}
	</div>
</div>
