<script lang="ts">
	import { ArrowLeft, HelpCircle, Trophy, Volume2, VolumeX, Zap } from '@lucide/svelte';
	import type { GameMeta } from '$lib/data/games';
	import { soundOn } from '$lib/engine/sound';
	import Modal from '../Modal.svelte';

	let {
		game,
		score = 0,
		best = 0,
		status = ''
	}: { game: GameMeta; score?: number; best?: number; status?: string } = $props();
	let help = $state(false);
</script>

<div class="flex flex-wrap items-center gap-2">
	<a href="/app/games" class="btn btn-ghost btn-icon" aria-label="Back to arcade"><ArrowLeft size={18} /></a>
	<div class="flex min-w-0 items-center gap-2">
		<span class="grid h-9 w-9 place-items-center rounded-xl bg-[#f2f7e8] text-lg">{game.emoji}</span>
		<div class="min-w-0">
			<p class="truncate text-sm font-extrabold leading-tight">{game.name}</p>
			<p class="truncate text-[0.6rem] font-bold uppercase tracking-wider text-slate">{status || game.skill}</p>
		</div>
	</div>
	<div class="ml-auto flex items-center gap-1.5">
		<span class="pill pill-gold text-[0.62rem]"><Zap size={12} /> {score.toLocaleString()}</span>
		<span class="hidden pill text-[0.62rem] sm:inline-flex"><Trophy size={12} /> Best {best.toLocaleString()}</span>
		<button class="btn btn-ghost btn-icon" onclick={() => ($soundOn = !$soundOn)} aria-label="Toggle sound">
			{#if $soundOn}<Volume2 size={17} />{:else}<VolumeX size={17} />{/if}
		</button>
		<button class="btn btn-ghost btn-icon" onclick={() => (help = true)} aria-label="How to play"><HelpCircle size={17} /></button>
	</div>
</div>

<Modal open={help} title={`How to play ${game.name}`} subtitle={game.tagline} onclose={() => (help = false)}>
	<div class="space-y-3">
		{#each game.howTo as step, i}
			<div class="flex gap-3 rounded-2xl bg-[#f7f5ec] p-3">
				<span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest text-[0.62rem] font-extrabold text-white">{i + 1}</span>
				<p class="text-xs leading-relaxed text-[#3f564b]">{step}</p>
			</div>
		{/each}
		<div class="flex flex-wrap gap-2 pt-1">
			<span class="pill text-[0.6rem]">{game.players}</span>
			<span class="pill text-[0.6rem]">≈ {game.minutes} min</span>
			<span class="pill pill-gold text-[0.6rem]">+{game.xp} XP</span>
			<span class="pill pill-sky text-[0.6rem]">{game.controls}</span>
		</div>
	</div>
</Modal>
