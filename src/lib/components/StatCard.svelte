<script lang="ts">
	let {
		label = '',
		value = '',
		sub = '',
		emoji = '✨',
		tone = 'bg-[#e9fbf1]',
		trend = '',
		trendUp = true
	}: {
		label?: string;
		value?: string;
		sub?: string;
		emoji?: string;
		tone?: string;
		trend?: string;
		trendUp?: boolean;
	} = $props();
</script>

<div class="card p-4 sm:p-5">
	<div class="flex items-start justify-between gap-3">
		<span class={`grid h-10 w-10 place-items-center rounded-2xl text-lg ${tone}`}>{emoji}</span>
		{#if trend}
			<span class={`pill ${trendUp ? '' : 'pill-coral'} text-[0.64rem]`}>{trendUp ? '▲' : '▼'} {trend}</span>
		{/if}
	</div>
	<p class="mt-4 display text-[1.7rem] font-semibold leading-none">{value}</p>
	<p class="mt-1 text-xs font-bold uppercase tracking-wider text-slate">{label}</p>
	{#if sub}<p class="mt-1 text-xs text-slate">{sub}</p>{/if}
</div>
