<script lang="ts">
	import { Lock } from '@lucide/svelte';
	import type { BadgeDef } from '$lib/data/seed';

	let { badge, size = 'md' }: { badge: BadgeDef; size?: 'sm' | 'md' } = $props();
	let pct = $derived(Math.min(100, Math.round((badge.progress / Math.max(1, badge.target)) * 100)));
</script>

<div class={`card relative overflow-hidden ${size === 'sm' ? 'p-3' : 'p-4'} ${badge.earned ? '' : 'opacity-90'}`}>
	<div class={`grid ${size === 'sm' ? 'h-10 w-10 text-lg' : 'h-12 w-12 text-2xl'} place-items-center rounded-2xl ${badge.tone} ${badge.earned ? '' : 'grayscale'}`}>
		{badge.emoji}
	</div>
	{#if !badge.earned}
		<span class="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-[#efede4] text-slate"><Lock size={12} /></span>
	{/if}
	<h4 class={`mt-2.5 display ${size === 'sm' ? 'text-xs' : 'text-sm'} font-semibold leading-tight`}>{badge.name}</h4>
	{#if size === 'md'}
		<p class="mt-1 line-clamp-2 text-[0.68rem] leading-snug text-slate">{badge.description}</p>
	{/if}
	{#if !badge.earned}
		<div class="mt-2.5">
			<div class="progress-track h-1.5"><div class="progress-fill" style={`width:${pct}%`}></div></div>
			<p class="mt-1 text-[0.6rem] font-bold text-slate">{badge.progress.toLocaleString()} / {badge.target.toLocaleString()}</p>
		</div>
	{:else}
		<p class="mt-2 text-[0.6rem] font-extrabold uppercase tracking-wider text-[#0b6b45]">Earned · +{badge.xp} XP</p>
	{/if}
</div>
