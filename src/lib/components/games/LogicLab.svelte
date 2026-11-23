<script lang="ts">
	import { Brain, Lightbulb, Play, RotateCcw, Sparkles } from '@lucide/svelte';
	import { getGame, logicPuzzles, shuffle } from '$lib/data/games';
	import { progress, recordGame } from '$lib/stores/progress';
	import { celebrate } from '$lib/utils';
	import { playTone } from '$lib/engine/sound';
	import GameTopBar from '$lib/components/games/GameTopBar.svelte';
	import GameResult from '$lib/components/games/GameResult.svelte';

	const game = getGame('logic-lab')!;
	let started = $state(false);
	let over = $state(false);
	let puzzles = $state<typeof logicPuzzles>([]);
	let idx = $state(0);
	let score = $state(0);
	let xp = $state(0);
	let correctCount = $state(0);
	let selected = $state('');
	let feedback = $state<'none' | 'correct' | 'wrong'>('none');
	let hint = $state(false);
	let best = $derived($progress.gameBests['logic-lab'] ?? 0);
	let current = $derived(puzzles[idx]);

	function start() {
		started = true;
		over = false;
		puzzles = shuffle(logicPuzzles);
		idx = 0;
		score = 0;
		xp = 0;
		correctCount = 0;
		selected = '';
		feedback = 'none';
		hint = false;
	}

	function choose(option: string) {
		if (!started || over || feedback !== 'none' || !current) return;
		selected = option;
		const correct = option === current.answer;
		feedback = correct ? 'correct' : 'wrong';
		if (correct) {
			const points = 150 - (hint ? 50 : 0);
			score += points;
			xp += 16;
			correctCount++;
			playTone('correct');
		} else {
			playTone('wrong');
		}
		setTimeout(() => {
			if (idx + 1 >= puzzles.length) end();
			else {
				idx++;
				selected = '';
				feedback = 'none';
				hint = false;
			}
		}, 1800);
	}

	function end() {
		over = true;
		started = false;
		recordGame('logic-lab', score, xp);
		if (correctCount >= 6) celebrate();
	}
</script>

<svelte:head><title>Logic Lab · Sabify Arcade</title></svelte:head>

<div class="space-y-3">
	<GameTopBar {game} score={score} {best} status={started ? `Puzzle ${idx + 1} of ${puzzles.length}` : 'Lab ready'} />

	<div class="overflow-hidden rounded-[2rem] border border-[#e3ddca] bg-gradient-to-br from-[#ffd166] via-[#ffb35e] to-[#ff9b8f] p-4 shadow-soft sm:p-7">
		<div class="mx-auto max-w-3xl">
			{#if !started && !over}
				<div class="rounded-[1.75rem] border border-white/60 bg-white/85 p-6 text-center backdrop-blur">
					<p class="text-5xl">🧩</p>
					<h1 class="mt-2 display text-2xl font-semibold">Find the hidden rule</h1>
					<p class="mx-auto mt-1 max-w-md text-xs leading-relaxed text-[#4a2c14]">Eight sequences. Each one follows a rule. Work it out and choose the next term. Hints are available but cost points.</p>
					<button class="btn btn-primary mt-5 w-full sm:w-auto" onclick={start}><Play size={16} fill="currentColor" /> Open the lab</button>
				</div>
			{:else if over}
				<GameResult
					title={correctCount >= 6 ? 'Logic unlocked!' : 'Your brain is warming up.'}
					subtitle={`You cracked ${correctCount} of ${puzzles.length} patterns.`}
					{score}
					{xp}
					{best}
					stats={[
						{ label: 'Correct', value: `${correctCount}/${puzzles.length}` },
						{ label: 'Accuracy', value: `${Math.round((correctCount / puzzles.length) * 100)}%` },
						{ label: 'XP', value: `+${xp}` }
					]}
					onreplay={start}
					nextHref="/app/games/money-quest"
				/>
			{:else if current}
				<div class="rounded-[1.75rem] border border-white/60 bg-white/90 p-4 backdrop-blur sm:p-6">
					<div class="flex items-center justify-between gap-2">
						<span class="pill text-[0.6rem]">{current.difficulty}</span>
						<span class="text-[0.62rem] font-bold text-slate">Puzzle {idx + 1} / {puzzles.length}</span>
					</div>
					<div class="mt-4 flex items-center justify-center gap-2">
						{#each current.sequence as term}
							<span class={`grid h-12 w-12 place-items-center rounded-2xl border text-lg font-extrabold sm:h-14 sm:w-14 sm:text-xl ${term === '?' ? 'border-dashed border-[#b7a98b] bg-[#fff8e8] text-[#a27000]' : 'border-[#e9e4d6] bg-white'}`}>{term}</span>
						{/each}
					</div>
					<h2 class="mt-4 text-center text-sm font-extrabold text-[#3d2a14]">What comes next?</h2>
					<div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
						{#each current.options as option}
							<button
								class={`rounded-2xl border-2 py-3 text-lg font-extrabold transition ${
									feedback !== 'none' && option === current.answer
										? 'border-[#0b6b45] bg-[#e9fbf1] text-[#0b6b45]'
										: feedback === 'wrong' && option === selected
											? 'border-[#b42318] bg-[#fff0ee] text-[#b42318]'
											: 'border-[#e9e4d6] bg-white hover:border-[#a27000]'
								}`}
								disabled={feedback !== 'none'}
								onclick={() => choose(option)}
							>
								{option}
							</button>
						{/each}
					</div>
					{#if feedback !== 'none'}
						<div class={`mt-3 rounded-2xl p-3 text-xs ${feedback === 'correct' ? 'bg-[#e9fbf1] text-[#0b6b45]' : 'bg-[#fff0ee] text-[#b42318]'}`}>
							<p class="font-extrabold">{feedback === 'correct' ? `Correct! +${150 - (hint ? 50 : 0)} points` : `Not quite. The answer is ${current.answer}.`}</p>
							<p class="mt-1 text-[#3f564b]">{current.rule}</p>
						</div>
					{:else}
						<div class="mt-3 flex items-center justify-between gap-2">
							<button class="btn btn-ghost btn-sm" onclick={() => (hint = true)} disabled={hint}><Lightbulb size={13} /> {hint ? 'Hint shown' : 'Hint (-50 pts)'}</button>
							{#if hint}<p class="text-[0.64rem] font-bold text-[#7a4f00]">Look at how much the sequence changes each step.</p>{/if}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<div class="flex flex-wrap items-center justify-between gap-2 px-1 text-[0.64rem] font-bold text-slate">
		<span class="flex items-center gap-1"><Brain size={12} /> Look for add, subtract, multiply, square or alternating patterns.</span>
		<span class="flex items-center gap-1"><Sparkles size={12} /> Explain the rule out loud to make it stick.</span>
	</div>
</div>
