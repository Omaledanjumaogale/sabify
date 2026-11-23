<script lang="ts">
	let {
		data = [],
		height = 160,
		color = '#10b981',
		accent = '#c9f26b',
		max,
		showValues = false,
		labels = true
	}: {
		data?: { label: string; value: number }[];
		height?: number;
		color?: string;
		accent?: string;
		max?: number;
		showValues?: boolean;
		labels?: boolean;
	} = $props();

	let peak = $derived(max ?? Math.max(1, ...data.map((d) => d.value)));
</script>

<div class="w-full">
	<div class="flex items-end gap-2.5" style={`height:${height}px`}>
		{#each data as d, i}
			<div class="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
				{#if showValues}
					<span class="text-[0.62rem] font-bold text-slate opacity-70 transition group-hover:opacity-100">{d.value}</span>
				{/if}
				<div
					class="w-full max-w-[42px] rounded-t-[0.65rem] transition-all duration-500 hover:opacity-85"
					style={`height:${Math.max(5, (d.value / peak) * (height - 30))}px;background:linear-gradient(180deg,${i === data.length - 1 ? accent : color},${color});`}
					title={`${d.label}: ${d.value}`}
				></div>
				{#if labels}
					<span class="text-[0.62rem] font-bold text-slate">{d.label}</span>
				{/if}
			</div>
		{/each}
	</div>
</div>
