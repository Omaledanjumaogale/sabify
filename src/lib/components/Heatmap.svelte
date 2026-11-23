<script lang="ts">
	let { days = [], label = 'Learning activity' }: { days?: { day: number; value: number }[]; label?: string } = $props();
	const shades = ['bg-[#ece9dd]', 'bg-[#c9f2d9]', 'bg-[#7ed9a4]', 'bg-[#159a5c]'];
</script>

<div>
	<div class="mb-2 flex items-center justify-between">
		<span class="text-xs font-bold text-slate">{label}</span>
		<span class="text-[0.62rem] font-semibold text-slate">Last 12 weeks</span>
	</div>
	<div class="grid grid-flow-col grid-rows-7 gap-1">
		{#each days as d}
			<div
				class={`aspect-square w-full rounded-[3px] ${shades[d.value] ?? shades[0]}`}
				title={`Day ${d.day + 1}: ${d.value} lessons`}
			></div>
		{/each}
	</div>
	<div class="mt-2 flex items-center justify-end gap-1.5 text-[0.6rem] font-semibold text-slate">
		Less
		{#each shades as s}<span class={`h-2.5 w-2.5 rounded-[2px] ${s}`}></span>{/each}
		More
	</div>
</div>
