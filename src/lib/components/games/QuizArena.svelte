<script lang="ts">
	import { Bot, Crown, Play, Swords, Timer, Zap } from '@lucide/svelte';
	import { allQuestions } from '$lib/data/curriculum';
	import { getGame, shuffle } from '$lib/data/games';
	import { progress, recordGame } from '$lib/stores/progress';
	import { celebrate } from '$lib/utils';
	import { playTone } from '$lib/engine/sound';
	import GameTopBar from '$lib/components/games/GameTopBar.svelte';
	import GameResult from '$lib/components/games/GameResult.svelte';
	import type { Question } from '$lib/data/types';

	const game = getGame('quiz-arena')!;
	let started = $state(false);
	let over = $state(false);
	let questions = $state<Question[]>([]);
	let round = $state(0);
	let player = $state(0);
	let bot = $state(0);
	let correctCount = $state(0);
	let selected = $state('');
	let locked = $state(false);
	let timeLeft = $state(12);
	let message = $state('');
	let botAnswered = $state(false);
	let win = $state(false);
	let best = $derived($progress.gameBests['quiz-arena'] ?? 0);
	let current = $derived(questions[round]);
	let score = $derived(player);

	function start() {
		started = true;
		over = false;
		questions = shuffle(allQuestions.filter((q) => q.type === 'choice' || q.type === 'truefalse')).slice(0, 5);
		round = 0;
		player = 0;
		bot = 0;
		correctCount = 0;
		selected = '';
		locked = false;
		timeLeft = 12;
		message = '';
		botAnswered = false;
		win = false;
	}

	function resolve(option: string | null) {
		if (!current || locked || over) return;
		locked = true;
		selected = option ?? '';
		const correct = option === current.answer;
		if (correct) {
			const points = 100 + timeLeft * 6;
			player += points;
			correctCount++;
			playTone('correct');
		} else {
			playTone('wrong');
		}
		// Sabi Bot answers with a subject-appropriate probability
		setTimeout(() => {
			const botCorrect = Math.random() < 0.62;
			botAnswered = true;
			if (botCorrect) bot += 100;
			message = `${correct ? `You +${100 + timeLeft * 6}` : 'You +0'} · ${botCorrect ? 'Sabi +100' : 'Sabi missed'}`;
		}, 550);

		setTimeout(() => {
			if (round + 1 >= questions.length) {
				end();
			} else {
				round++;
				selected = '';
				locked = false;
				message = '';
				botAnswered = false;
				timeLeft = 12;
			}
		}, 1700);
	}

	function end() {
		win = player > bot;
		over = true;
		started = false;
		recordGame('quiz-arena', player, 60 + correctCount * 20);
		if (win) celebrate();
	}

	$effect(() => {
		if (!started || over) return;
		const t = setInterval(() => {
			if (locked) return;
			timeLeft -= 1;
			if (timeLeft <= 0) resolve(null);
		}, 1000);
		return () => clearInterval(t);
	});
</script>

<svelte:head><title>Quiz Arena · Sabify Arcade</title></svelte:head>

<div class="space-y-3">
	<GameTopBar {game} score={score} {best} status={started ? `Round ${round + 1} of ${questions.length}` : 'Arena ready'} />

	<div class="overflow-hidden rounded-[2rem] border border-[#e3ddca] bg-gradient-to-br from-[#7c6cf6] via-[#9b7af7] to-[#ff6b5e] p-4 text-white shadow-soft sm:p-7">
		<div class="mx-auto max-w-3xl">
			{#if !started && !over}
				<div class="rounded-[1.75rem] border border-white/25 bg-[#0b2b1f]/45 p-6 text-center backdrop-blur-xl">
					<p class="text-5xl">⚔️</p>
					<h1 class="mt-2 display text-2xl font-semibold">Face Sabi Bot</h1>
					<p class="mx-auto mt-1 max-w-md text-xs leading-relaxed text-white/65">Five questions. Twelve seconds each. Answer fast and accurately to beat Sabi Bot — it knows a lot, but it is not unbeatable.</p>
					<div class="mx-auto mt-4 flex max-w-xs items-center justify-center gap-4">
						<div class="text-center"><span class="text-3xl">🦊</span><p class="text-[0.62rem] font-extrabold">You</p></div>
						<span class="display text-xl text-white/40">VS</span>
						<div class="text-center"><span class="text-3xl">🤖</span><p class="text-[0.62rem] font-extrabold">Sabi Bot</p></div>
					</div>
					<button class="btn btn-lime mt-5 w-full sm:w-auto" onclick={start}><Play size={16} fill="currentColor" /> Enter the arena</button>
				</div>
			{:else if over}
				<GameResult
					title={win ? 'Arena champion!' : 'Sabi Bot edges ahead.'}
					subtitle={win ? 'You out-thought the bot. The crown is yours.' : 'Close battle. Review the explanations and run it back.'}
					{score}
					xp={60 + correctCount * 20}
					{best}
					stats={[
						{ label: 'Your score', value: `${player}` },
						{ label: 'Sabi Bot', value: `${bot}` },
						{ label: 'Correct', value: `${correctCount}/${questions.length}` }
					]}
					onreplay={start}
					nextHref="/app/games/logic-lab"
				/>
			{:else if current}
				<div class="rounded-[1.75rem] border border-white/25 bg-[#0b2b1f]/55 p-4 backdrop-blur-xl sm:p-5">
					<div class="flex items-center justify-between gap-2">
						<div class="flex items-center gap-2">
							<span class="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-base">🦊</span>
							<div>
								<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-white/40">You</p>
								<p class="display text-lg font-semibold text-lime">{player}</p>
							</div>
						</div>
						<div class={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold ${timeLeft <= 4 ? 'bg-coral text-white' : 'bg-white/10 text-white/70'}`}>
							<Timer size={13} /> {timeLeft}s
						</div>
						<div class="flex items-center gap-2 text-right">
							<div>
								<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-white/40">Sabi Bot</p>
								<p class="display text-lg font-semibold text-[#ffc53d]">{bot}</p>
							</div>
							<span class="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-base">🤖</span>
						</div>
					</div>
					<div class="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
						<div class="h-full rounded-full bg-lime transition-all" style={`width:${((round + (locked ? 1 : 0)) / questions.length) * 100}%`}></div>
					</div>
					<div class="mt-4 rounded-2xl bg-white p-4 text-ink">
						<div class="flex items-center justify-between gap-2">
							<span class="pill text-[0.56rem]">{current.skill}</span>
							<span class="text-[0.6rem] font-bold text-slate">Round {round + 1}/{questions.length}</span>
						</div>
						<h2 class="mt-2 display text-lg font-semibold leading-snug sm:text-xl">{current.prompt}</h2>
						<div class="mt-3 grid gap-2 sm:grid-cols-2">
							{#each current.options ?? [] as option}
								<button
									class={`rounded-xl border-2 px-3 py-2.5 text-left text-sm font-bold transition ${
										locked && option === current.answer
											? 'border-[#0b6b45] bg-[#e9fbf1] text-[#0b6b45]'
											: locked && option === selected
												? 'border-[#b42318] bg-[#fff0ee] text-[#b42318]'
												: 'border-[#e9e4d6] bg-white hover:border-[#7c6cf6]'
									}`}
									disabled={locked}
									onclick={() => resolve(option)}
								>
									{option}
								</button>
							{/each}
						</div>
						{#if message}
							<p class="mt-2 text-center text-[0.7rem] font-extrabold text-[#3f564b]">{message}</p>
						{:else if !locked}
							<p class="mt-2 text-center text-[0.62rem] font-bold text-slate">Sabi Bot is thinking… answer before the timer!</p>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="flex flex-wrap items-center justify-between gap-2 px-1 text-[0.64rem] font-bold text-slate">
		<span class="flex items-center gap-1"><Swords size={12} /> Faster correct answers earn bigger time bonuses.</span>
		<span class="flex items-center gap-1"><Crown size={12} /> Beat the bot to unlock the Arena Crown badge.</span>
	</div>
</div>
