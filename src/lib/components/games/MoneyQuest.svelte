<script lang="ts">
	import { ArrowRight, Banknote, Check, Coins, PiggyBank, Play, Target, Wallet } from '@lucide/svelte';
	import { getGame, moneyScenes } from '$lib/data/games';
	import { progress, recordGame } from '$lib/stores/progress';
	import { celebrate } from '$lib/utils';
	import { playTone } from '$lib/engine/sound';
	import { formatNaira } from '$lib/utils';
	import GameTopBar from '$lib/components/games/GameTopBar.svelte';
	import GameResult from '$lib/components/games/GameResult.svelte';

	const game = getGame('money-quest')!;
	let started = $state(false);
	let over = $state(false);
	let idx = $state(0);
	let cash = $state(5000);
	let savings = $state(0);
	let futureScore = $state(0);
	let score = $state(0);
	let xp = $state(0);
	let chosen = $state<number | null>(null);
	let history = $state<string[]>([]);
	let best = $derived($progress.gameBests['money-quest'] ?? 0);
	let scene = $derived(moneyScenes[idx]);

	function start() {
		started = true;
		over = false;
		idx = 0;
		cash = 5000;
		savings = 0;
		futureScore = 0;
		score = 0;
		xp = 0;
		chosen = null;
		history = [];
	}

	function pick(i: number) {
		if (!started || over || chosen !== null || !scene) return;
		const option = scene.options[i];
		chosen = i;
		cash += option.balance - option.savings;
		savings += option.savings;
		futureScore += option.score;
		xp += Math.max(5, option.score > 0 ? 18 : 8);
		history = [...history, `${scene.title}: ${option.label}`];
		playTone(option.score > 0 ? 'correct' : 'wrong');
		setTimeout(() => {
			if (idx + 1 >= moneyScenes.length) end();
			else {
				idx++;
				chosen = null;
			}
		}, 1800);
	}

	function end() {
		over = true;
		started = false;
		score = Math.max(0, futureScore * 12 + savings / 5 + cash / 10);
		recordGame('money-quest', Math.round(score), xp);
		if (futureScore >= 80) celebrate();
	}

	let summary = $derived({
		cash,
		savings,
		futureScore,
		net: cash + savings
	});
</script>

<svelte:head><title>Money Quest · Sabify Arcade</title></svelte:head>

<div class="space-y-3">
	<GameTopBar {game} score={Math.round(score)} {best} status={started ? `${scene.month} · choice ${idx + 1} of ${moneyScenes.length}` : 'Quest ready'} />

	<div class="overflow-hidden rounded-[2rem] border border-[#e3ddca] bg-gradient-to-br from-[#ffc53d] via-[#ffe07a] to-[#c9f26b] p-4 shadow-soft sm:p-7">
		<div class="mx-auto max-w-3xl">
			{#if !started && !over}
				<div class="rounded-[1.75rem] border border-white/60 bg-white/85 p-6 text-center backdrop-blur">
					<p class="text-5xl">💰</p>
					<h1 class="mt-2 display text-2xl font-semibold">Grow ₦5,000 for a month</h1>
					<p class="mx-auto mt-1 max-w-md text-xs leading-relaxed text-[#4a3500]">Five real-life money choices. Save, spend and handle surprises. There is no perfect run — but your future self is watching.</p>
					<div class="mx-auto mt-4 grid max-w-sm grid-cols-3 gap-2">
						<div class="rounded-xl bg-white/70 p-2"><p class="text-[0.56rem] font-bold uppercase text-slate">Start cash</p><p class="display text-sm font-semibold">₦5,000</p></div>
						<div class="rounded-xl bg-white/70 p-2"><p class="text-[0.56rem] font-bold uppercase text-slate">Goal</p><p class="display text-sm font-semibold">Save ₦1k</p></div>
						<div class="rounded-xl bg-white/70 p-2"><p class="text-[0.56rem] font-bold uppercase text-slate">Scenes</p><p class="display text-sm font-semibold">5</p></div>
					</div>
					<button class="btn btn-primary mt-5 w-full sm:w-auto" onclick={start}><Play size={16} fill="currentColor" /> Start the month</button>
				</div>
			{:else if over}
				<GameResult
					title={summary.savings >= 1000 ? 'Future secured!' : 'A month of lessons.'}
					subtitle={summary.savings >= 1000 ? 'You hit your savings goal and kept cash for emergencies.' : 'You made choices. Now you know where the leaks were.'}
					score={Math.round(score)}
					{xp}
					{best}
					stats={[
						{ label: 'Cash left', value: formatNaira(Math.max(0, summary.cash)) },
						{ label: 'Saved', value: formatNaira(summary.savings) },
						{ label: 'Future score', value: `${summary.futureScore}` }
					]}
					onreplay={start}
					nextHref="/app/games/number-nebula"
				>
				</GameResult>
			{:else if scene}
				<div class="rounded-[1.75rem] border border-white/60 bg-white/90 p-4 backdrop-blur sm:p-6">
					<div class="flex flex-wrap items-center justify-between gap-2">
						<span class="pill text-[0.6rem]">{scene.month}</span>
						<div class="flex items-center gap-1.5">
							<span class="pill bg-white text-[0.6rem]"><Wallet size={11} /> {formatNaira(cash)}</span>
							<span class="pill text-[0.6rem]"><PiggyBank size={11} /> {formatNaira(savings)}</span>
						</div>
					</div>
					<h2 class="mt-3 display text-xl font-semibold leading-tight">{scene.title}</h2>
					<p class="mt-1 text-sm leading-relaxed text-[#3f564b]">{scene.story}</p>
					<div class="mt-3 grid gap-2">
						{#each scene.options as option, i}
							<button
								class={`rounded-2xl border-2 p-3 text-left transition ${
									chosen === i
										? option.score > 0
											? 'border-[#0b6b45] bg-[#e9fbf1]'
											: 'border-[#b42318] bg-[#fff0ee]'
										: chosen !== null
											? 'border-[#eee9dc] bg-white opacity-50'
											: 'border-[#e9e4d6] bg-white hover:border-[#a27000]'
								}`}
								disabled={chosen !== null}
								onclick={() => pick(i)}
							>
								<div class="flex items-center gap-2">
									<span class={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.6rem] font-extrabold ${chosen === i ? 'bg-forest text-white' : 'bg-[#f1eee3] text-slate'}`}>
										{#if chosen === i}<Check size={12} />{:else}{i + 1}{/if}
									</span>
									<p class="flex-1 text-xs font-extrabold">{option.label}</p>
									<span class={`pill text-[0.54rem] ${option.score > 0 ? 'pill-gold' : 'pill-coral'}`}>{option.score > 0 ? '+' : ''}{option.score}</span>
								</div>
								{#if chosen === i}
									<p class="mt-2 pl-8 text-[0.68rem] leading-snug text-[#3f564b]">{option.feedback}</p>
								{/if}
							</button>
						{/each}
					</div>
					{#if chosen !== null}
						<div class="mt-3 flex items-center justify-between gap-2 text-[0.64rem] font-bold text-slate">
							<span>Balance: {formatNaira(cash + savings)}</span>
							<span class="flex items-center gap-1">Next scene <ArrowRight size={12} /></span>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<div class="flex flex-wrap items-center justify-between gap-2 px-1 text-[0.64rem] font-bold text-slate">
		<span class="flex items-center gap-1"><Banknote size={12} /> Needs first, then savings, then wants.</span>
		<span class="flex items-center gap-1"><Target size={12} /> Save at least ₦1,000 to earn the Money Mover badge.</span>
	</div>
</div>
