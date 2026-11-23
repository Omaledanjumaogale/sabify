<script lang="ts">
	import { Brain, Play, RotateCcw, Timer } from '@lucide/svelte';
	import { getGame, memoryDecks, shuffle } from '$lib/data/games';
	import { progress, recordGame } from '$lib/stores/progress';
	import { celebrate } from '$lib/utils';
	import { playTone } from '$lib/engine/sound';
	import GameTopBar from '$lib/components/games/GameTopBar.svelte';
	import GameResult from '$lib/components/games/GameResult.svelte';

	const game = getGame('memory-match')!;
	type Card = { uid: string; pairId: string; text: string; side: 'a' | 'b'; flipped: boolean; matched: boolean };

	let started = $state(false);
	let over = $state(false);
	let deckId = $state('science');
	let cards = $state<Card[]>([]);
	let first: number | null = $state(null);
	let moves = $state(0);
	let matched = $state(0);
	let elapsed = $state(0);
	let locked = $state(false);
	let score = $state(0);
	let xp = $state(0);
	let best = $derived($progress.gameBests['memory-match'] ?? 0);
	let deck = $derived(memoryDecks.find((d) => d.id === deckId) ?? memoryDecks[0]);

	function start() {
		started = true;
		over = false;
		first = null;
		moves = 0;
		matched = 0;
		elapsed = 0;
		locked = false;
		score = 0;
		xp = 0;
		const built: Card[] = [];
		for (const pair of deck.pairs) {
			const id = pair.a + '|' + pair.b;
			built.push({ uid: id + '-a', pairId: id, text: pair.a, side: 'a', flipped: false, matched: false });
			built.push({ uid: id + '-b', pairId: id, text: pair.b, side: 'b', flipped: false, matched: false });
		}
		cards = shuffle(built);
	}

	function flip(index: number) {
		if (!started || over || locked) return;
		const card = cards[index];
		if (card.flipped || card.matched) return;
		cards[index] = { ...card, flipped: true };
		playTone('click');
		if (first === null) {
			first = index;
			return;
		}
		moves++;
		const other = cards[first];
		if (other.pairId === card.pairId) {
			setTimeout(() => {
				cards = cards.map((c, i) => (i === first || i === index ? { ...c, matched: true, flipped: true } : c));
				matched++;
				first = null;
				playTone('correct');
				if (matched === deck.pairs.length) finish();
			}, 350);
		} else {
			locked = true;
			setTimeout(() => {
				cards = cards.map((c, i) => (i === first || i === index ? { ...c, flipped: false } : c));
				first = null;
				locked = false;
				playTone('wrong');
			}, 750);
		}
	}

	function finish() {
		over = true;
		started = false;
		score = Math.max(120, 1600 - moves * 35 - elapsed * 6 + deck.pairs.length * 60);
		xp = 110;
		recordGame('memory-match', score, xp);
		celebrate();
	}

	$effect(() => {
		if (!started || over) return;
		const t = setInterval(() => (elapsed += 1), 1000);
		return () => clearInterval(t);
	});
</script>

<svelte:head><title>Memory Match · Sabify Arcade</title></svelte:head>

<div class="space-y-3">
	<GameTopBar {game} score={score} {best} status={started ? `${matched}/${deck.pairs.length} pairs · ${moves} moves` : 'Pick a deck'} />

	<div class="overflow-hidden rounded-[2rem] border border-[#e3ddca] bg-gradient-to-br from-[#c9f26b] via-[#a7ed9a] to-[#83e0b0] p-4 shadow-soft sm:p-7">
		<div class="mx-auto max-w-3xl">
			{#if !started && !over}
				<div class="rounded-[1.75rem] border border-white/50 bg-white/85 p-5 backdrop-blur sm:p-6">
					<div class="flex items-center gap-3">
						<span class="grid h-12 w-12 place-items-center rounded-2xl bg-[#e9fbf1] text-2xl">🧠</span>
						<div>
							<h1 class="display text-2xl font-semibold">Pair ideas. Train your brain.</h1>
							<p class="text-xs text-slate">Choose a deck and match each term with its meaning.</p>
						</div>
					</div>
					<div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
						{#each memoryDecks as d}
							<button
								class={`rounded-2xl border-2 p-3 text-left transition ${deckId === d.id ? 'border-forest bg-[#f2fbdf]' : 'border-[#e9e4d6] bg-white hover:border-[#c9d7b8]'}`}
								onclick={() => (deckId = d.id)}
							>
								<span class="text-2xl">{d.emoji}</span>
								<p class="mt-1 text-[0.74rem] font-extrabold">{d.name}</p>
								<p class="text-[0.6rem] text-slate">{d.pairs.length} pairs</p>
							</button>
						{/each}
					</div>
					<button class="btn btn-primary mt-4 w-full" onclick={start}><Play size={16} fill="currentColor" /> Start matching</button>
				</div>
			{:else if over}
				<GameResult
					title="Memory mastered!"
					subtitle={`You matched all ${deck.pairs.length} pairs in ${moves} moves.`}
					{score}
					{xp}
					{best}
					stats={[
						{ label: 'Moves', value: `${moves}` },
						{ label: 'Time', value: `${elapsed}s` },
						{ label: 'Pairs', value: `${deck.pairs.length}` }
					]}
					onreplay={start}
					nextHref="/app/games/quiz-arena"
				/>
			{:else}
				<div class="rounded-[1.75rem] border border-white/50 bg-white/85 p-4 backdrop-blur sm:p-5">
					<div class="flex flex-wrap items-center justify-between gap-2">
						<span class="pill bg-white/80 text-[0.6rem]">{deck.emoji} {deck.name} deck</span>
						<div class="flex items-center gap-1.5">
							<span class="pill text-[0.6rem]"><Timer size={11} /> {elapsed}s</span>
							<span class="pill text-[0.6rem]">{moves} moves</span>
						</div>
					</div>
					<div class="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
						{#each cards as card, i}
							<button
								class="relative aspect-[4/3] w-full rounded-2xl p-2 text-center text-[0.62rem] font-extrabold leading-tight transition-all duration-300 sm:text-[0.7rem]"
								class:bg-white={!card.flipped && !card.matched}
								class:bg-[#0b2b1f]={!card.flipped && !card.matched}
								onclick={() => flip(i)}
								aria-label={card.flipped || card.matched ? card.text : 'Hidden card'}
							>
								{#if card.flipped || card.matched}
									<span class={`grid h-full w-full place-items-center rounded-xl border-2 p-1 ${card.matched ? 'border-[#0b6b45] bg-[#e9fbf1] text-[#0b6b45]' : card.side === 'a' ? 'border-[#e5e0d1] bg-[#fbf8ef] text-ink' : 'border-[#c4ecff] bg-[#eaf8ff] text-[#0a6486]'}`}>
										{card.text}
									</span>
								{:else}
									<span class="grid h-full w-full place-items-center rounded-xl border border-white/15 bg-[#0b2b1f] text-xl text-lime/60">✦</span>
								{/if}
							</button>
						{/each}
					</div>
					<p class="mt-3 text-center text-[0.64rem] font-bold text-slate">Fewer moves + faster time = higher score.</p>
				</div>
			{/if}
		</div>
	</div>

	<div class="flex flex-wrap items-center justify-between gap-2 px-1 text-[0.64rem] font-bold text-slate">
		<span class="flex items-center gap-1"><Brain size={12} /> Matching builds retrieval strength — one of the best ways to remember.</span>
		<span class="flex items-center gap-1"><RotateCcw size={12} /> Try each deck at least once.</span>
	</div>
</div>
