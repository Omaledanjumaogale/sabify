<script lang="ts">
	import { Check, ChevronRight, Zap } from '@lucide/svelte';
	import type { Quest } from '$lib/data/seed';

	let { quest, claimed = false, onclaim }: { quest: Quest; claimed?: boolean; onclaim?: () => void } = $props();
	let pct = $derived(Math.min(100, Math.round((quest.progress / Math.max(1, quest.target)) * 100)));
	let done = $derived(quest.progress >= quest.target || claimed);
</script>

<div class="flex items-center gap-3 py-3">
	<span class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#f4f8ec] text-lg">{quest.emoji}</span>
	<div class="min-w-0 flex-1">
		<div class="flex items-center justify-between gap-2">
			<p class="truncate text-[0.82rem] font-extrabold leading-tight">{quest.title}</p>
			<span class="pill pill-gold shrink-0 text-[0.58rem]">+{quest.xp} XP</span>
		</div>
		<p class="truncate text-[0.68rem] text-slate">{quest.description}</p>
		<div class="mt-1.5 flex items-center gap-2">
			<div class="progress-track h-1.5 flex-1"><div class="progress-fill" style={`width:${pct}%`}></div></div>
			<span class="text-[0.6rem] font-extrabold text-slate">{Math.min(quest.progress, quest.target)}/{quest.target}</span>
		</div>
	</div>
	{#if done}
		{#if claimed}
			<span class="grid h-8 w-8 place-items-center rounded-full bg-[#e9fbf1] text-[#0b6b45]"><Check size={15} /></span>
		{:else}
			<button class="btn btn-lime btn-sm shrink-0" onclick={onclaim}><Zap size={13} /> Claim</button>
		{/if}
	{:else}
		<a href={quest.link} class="btn btn-ghost btn-icon shrink-0" aria-label={`Go to ${quest.title}`}><ChevronRight size={17} /></a>
	{/if}
</div>
