<script lang="ts">
	let { value = 0, label = '', sub = '', color = 'progress-forest', showNumbers = true }: { value?: number; label?: string; sub?: string; color?: string; showNumbers?: boolean } = $props();
	let clamped = $derived(Math.min(100, Math.max(0, value)));
</script>

<div>
	{#if label || showNumbers}
		<div class="mb-1.5 flex items-center justify-between gap-2">
			<span class="text-xs font-bold text-ink">{label}</span>
			{#if showNumbers}<span class="text-[0.68rem] font-extrabold text-slate">{Math.round(clamped)}%</span>{/if}
		</div>
	{/if}
	<div class={`progress-track ${color}`}>
		<div class="progress-fill" style={`width:${clamped}%`}></div>
	</div>
	{#if sub}<p class="mt-1 text-[0.68rem] text-slate">{sub}</p>{/if}
</div>
