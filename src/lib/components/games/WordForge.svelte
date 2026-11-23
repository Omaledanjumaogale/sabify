<script lang="ts">
	import { Lightbulb, RotateCcw, Send, Shuffle, Timer, Zap } from '@lucide/svelte';
	import { getGame, shuffle, vocabWords } from '$lib/data/games';
	import { progress, recordGame } from '$lib/stores/progress';
	import { celebrate } from '$lib/utils';
	import { playTone } from '$lib/engine/sound';
	import GameTopBar from '$lib/components/games/GameTopBar.svelte';
	import GameResult from '$lib/components/games/GameResult.svelte';

	const game = getGame('word-forge')!;
	let started = $state(false);
	let over = $state(false);
	let idx = $state(0);
	let score = $state(0);
	let xp = $state(0);
	let correctCount = $state(0);
	let typed = $state('');
	let feedback = $state<'none' | 'correct' | 'wrong'>('none');
	let hintUsed = $state(false);
	let timeLeft = $state(30);
	let best = $derived($progress.gameBests['word-forge'] ?? 0);
	let words = $state(shuffle(vocabWords).slice(0, 8));
	let current = $derived(words[idx]);
	let letters = $derived(current ? scramble(current.word) : []);

	function scramble(word: string): string[] {
		let arr = shuffle(word.split(''));
		if (arr.join('') === word && word.length > 2) arr = [...arr.slice(1), arr[0]];
		return arr;
	}

	function start() {
		started = true;
		over = false;
		idx = 0;
		score = 0;
		xp = 0;
		correctCount = 0;
		typed = '';
		feedback = 'none';
		hintUsed = false;
		timeLeft = 30;
		words = shuffle(vocabWords).slice(0, 8);
	}

	function submit() {
		if (!started || over || feedback === 'correct' || !current) return;
		if (typed.trim().toLowerCase() === current.word.toLowerCase()) {
			const points = 100 + timeLeft * 5 - (hintUsed ? 25 : 0);
			score += Math.max(30, points);
			xp += 15;
			correctCount++;
			feedback = 'correct';
			playTone('correct');
			setTimeout(next, 850);
		} else {
			feedback = 'wrong';
			playTone('wrong');
		}
	}

	function next() {
		if (idx + 1 >= words.length) {
			end();
			return;
		}
		idx++;
		typed = '';
		feedback = 'none';
		hintUsed = false;
		timeLeft = 30;
	}

	function skip() {
		if (!started || over) return;
		feedback = 'none';
		next();
	}

	function end() {
		if (over) return;
		over = true;
		started = false;
		recordGame('word-forge', score, xp);
		if (score > best) celebrate();
	}

	$effect(() => {
		if (!started || over) return;
		const t = setInterval(() => {
			if (feedback === 'correct') return;
			timeLeft -= 1;
			if (timeLeft <= 0) {
				next();
			}
		}, 1000);
		return () => clearInterval(t);
	});
</script>

<svelte:head><title>Word Forge · Sabify Arcade</title></svelte:head>

<div class="space-y-3">
	<GameTopBar {game} score={score} {best} status={started ? `Word ${idx + 1} of ${words.length}` : 'Forge ready'} />

	<div class="relative overflow-hidden rounded-[2rem] border border-[#e3ddca] bg-gradient-to-br from-[#ff8f7a] via-[#ffb35e] to-[#ffc53d] p-4 shadow-soft sm:p-7">
		<div class="absolute inset-0 dot-bg opacity-20"></div>
		<div class="relative mx-auto max-w-3xl">
			{#if !started && !over}
				<div class="rounded-[1.75rem] border border-white/50 bg-white/80 p-6 text-center backdrop-blur">
					<p class="text-5xl">🔨</p>
					<h1 class="mt-2 display text-2xl font-semibold">Forge eight words</h1>
					<p class="mx-auto mt-1 max-w-md text-xs leading-relaxed text-[#5c3a1a]">Unscramble letters, use the clue and beat the 30-second timer. The faster you forge, the more points you earn.</p>
					<div class="mt-4 flex flex-wrap justify-center gap-2">
						<span class="chip bg-white/70 text-[0.66rem]">📚 Vocabulary</span>
						<span class="chip bg-white/70 text-[0.66rem]">⏱️ 30s per word</span>
						<span class="chip bg-white/70 text-[0.66rem]">⚡ +15 XP each</span>
					</div>
					<button class="btn btn-primary mt-5 w-full sm:w-auto" onclick={start}>Start forging</button>
				</div>
			{:else if over}
				<GameResult
					title={correctCount >= 6 ? 'Silver-tongued forger!' : 'Words are warming up.'}
					subtitle={`You forged ${correctCount} of ${words.length} words.`}
					{score}
					{xp}
					{best}
					stats={[
						{ label: 'Words forged', value: `${correctCount}/${words.length}` },
						{ label: 'Accuracy', value: `${Math.round((correctCount / words.length) * 100)}%` },
						{ label: 'XP earned', value: `+${xp}` }
					]}
					onreplay={start}
					nextHref="/app/games/type-storm"
				/>
			{:else if current}
				<div class="rounded-[1.75rem] border border-white/50 bg-white/85 p-4 backdrop-blur sm:p-6">
					<div class="flex items-center justify-between">
						<span class="pill bg-white/80 text-[0.6rem]">Word {idx + 1} / {words.length}</span>
						<div class={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold ${timeLeft <= 8 ? 'bg-[#fff0ee] text-[#b42318]' : 'bg-white/80 text-[#5c3a1a]'}`}>
							<Timer size={13} /> {timeLeft}s
						</div>
					</div>
					<div class="mt-3 flex justify-center gap-1.5">
						{#each letters as letter, i}
							<span class="grid h-10 w-9 place-items-center rounded-xl border border-[#e8d3b8] bg-white text-lg font-extrabold shadow-sm sm:h-12 sm:w-11" style={`transform:rotate(${(i % 3) - 1}deg)`}>{letter}</span>
						{/each}
					</div>
					<p class="mt-4 text-center text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-[#8a5a28]">Clue</p>
					<p class="mt-0.5 text-center text-sm font-bold text-[#3d2a14]">{current.clue}</p>

					<form class="mt-4 flex flex-col gap-2 sm:flex-row" onsubmit={(e) => { e.preventDefault(); submit(); }}>
						<input
							class="input flex-1 text-center text-lg font-extrabold tracking-wide"
							placeholder="Type the word…"
							bind:value={typed}
							disabled={feedback === 'correct'}
							autocomplete="off"
							autocapitalize="off"
							spellcheck="false"
						/>
						<button class="btn btn-primary" type="submit" disabled={!typed.trim() || feedback === 'correct'}><Send size={15} /> Forge</button>
					</form>

					{#if feedback === 'wrong'}
						<p class="mt-2 text-center text-xs font-extrabold text-[#b42318]">Not quite — try again. The clue is your friend.</p>
					{:else if feedback === 'correct'}
						<p class="mt-2 text-center text-xs font-extrabold text-[#0b6b45]">Forged! {typed} → +{Math.max(30, 100 + timeLeft * 5 - (hintUsed ? 25 : 0))} points</p>
					{/if}

					<div class="mt-3 flex flex-wrap items-center justify-between gap-2">
						<div class="flex gap-2">
							<button class="btn btn-ghost btn-sm" onclick={() => (hintUsed = true)} disabled={hintUsed || feedback === 'correct'}>
								<Lightbulb size={13} /> {hintUsed ? `${current.word[0]}… (hint used)` : 'Reveal first letter'}
							</button>
							<button class="btn btn-ghost btn-sm" onclick={skip}><Shuffle size={13} /> Skip</button>
						</div>
						<span class="flex items-center gap-1 text-[0.62rem] font-bold text-[#8a5a28]"><Zap size={11} /> {score} points</span>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="flex flex-wrap items-center justify-between gap-2 px-1 text-[0.64rem] font-bold text-slate">
		<span class="flex items-center gap-1"><Lightbulb size={12} /> Hints cost 25 points but keep the learning moving.</span>
		<span class="flex items-center gap-1"><RotateCcw size={12} /> Every word appears in your vocabulary review.</span>
	</div>
</div>
