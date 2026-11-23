<script lang="ts">
	import { ArrowRight, RotateCcw, Trophy, Zap } from '@lucide/svelte';
	import Mascot from '../Mascot.svelte';

	let {
		title = 'Nice work!',
		subtitle = '',
		score = 0,
		xp = 0,
		best = 0,
		stats = [],
		onreplay,
		nextHref = '/app/games'
	}: {
		title?: string;
		subtitle?: string;
		score?: number;
		xp?: number;
		best?: number;
		stats?: { label: string; value: string }[];
		onreplay: () => void;
		nextHref?: string;
	} = $props();
</script>

<div class="relative overflow-hidden rounded-[2rem] border border-[#e3ddca] bg-white p-6 text-center shadow-soft sm:p-8">
	<div class="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-lime/25 blur-2xl"></div>
	<Mascot size={110} expression="cheer" float />
	<p class="eyebrow justify-center">Game over</p>
	<h2 class="mt-1 display text-2xl font-semibold sm:text-3xl">{title}</h2>
	{#if subtitle}<p class="mt-1 text-sm text-slate">{subtitle}</p>{/if}
	<div class="mt-5 flex items-center justify-center gap-3">
		<div class="rounded-2xl bg-[#f7f5ec] px-5 py-3">
			<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-slate">Score</p>
			<p class="display text-3xl font-semibold">{score.toLocaleString()}</p>
		</div>
		<div class="rounded-2xl bg-[#fff4d2] px-5 py-3">
			<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-[#7a4f00]">XP earned</p>
			<p class="display text-3xl font-semibold text-[#7a4f00]">+{xp}</p>
		</div>
	</div>
	{#if stats.length}
		<div class="mx-auto mt-4 grid max-w-sm grid-cols-2 gap-2">
			{#each stats as s}
				<div class="rounded-xl border border-[#eee9dc] px-3 py-2">
					<p class="text-[0.58rem] font-bold uppercase tracking-wider text-slate">{s.label}</p>
					<p class="display text-base font-semibold">{s.value}</p>
				</div>
			{/each}
		</div>
	{/if}
	<div class="mt-3 flex items-center justify-center gap-1.5 text-[0.66rem] font-bold text-slate">
		<Trophy size={13} /> Personal best: {best.toLocaleString()}
	</div>
	<div class="mt-5 grid gap-2 sm:grid-cols-3">
		<button class="btn btn-ghost btn-sm" onclick={onreplay}><RotateCcw size={14} /> Play again</button>
		<a href="/app/games" class="btn btn-ghost btn-sm">Arcade</a>
		<a href={nextHref} class="btn btn-primary btn-sm">Next game <ArrowRight size={14} /></a>
	</div>
	<p class="mt-3 flex items-center justify-center gap-1 text-[0.62rem] font-bold text-[#0b6b45]"><Zap size={11} /> Progress saved to your profile</p>
</div>
