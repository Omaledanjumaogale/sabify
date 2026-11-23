<script lang="ts">
	import { Clock, Keyboard, Play, RotateCcw, Target, Timer, Zap } from '@lucide/svelte';
	import { getGame, typingPassages } from '$lib/data/games';
	import { progress, recordGame } from '$lib/stores/progress';
	import { celebrate } from '$lib/utils';
	import GameTopBar from '$lib/components/games/GameTopBar.svelte';
	import GameResult from '$lib/components/games/GameResult.svelte';

	const game = getGame('type-storm')!;
	let started = $state(false);
	let finished = $state(false);
	let selected = $state(0);
	let typed = $state('');
	let startedAt = 0;
	let elapsed = $state(0);
	let xp = $state(0);
	let best = $derived($progress.gameBests['type-storm'] ?? 0);
	let passage = $derived(typingPassages[selected]);
	let target = $derived(passage.text);
	let correctChars = $derived(
		typed.split('').filter((ch, i) => ch === target[i]).length
	);
	let accuracy = $derived(typed.length === 0 ? 100 : Math.round((correctChars / typed.length) * 100));
	let minutes = $derived(Math.max(elapsed, 1) / 60);
	let wpm = $derived(Math.round(correctChars / 5 / minutes));
	let progressPct = $derived(Math.min(100, (typed.length / target.length) * 100));
	let timeLeft = $derived(Math.max(0, 60 - elapsed));

	function start() {
		started = true;
		finished = false;
		typed = '';
		elapsed = 0;
		xp = 0;
		startedAt = Date.now();
	}

	function finish() {
		if (finished) return;
		finished = true;
		started = false;
		const finalWpm = wpm;
		const finalAcc = accuracy;
		score = Math.round(finalWpm * 12 + finalAcc * 4 + (typed.length / Math.max(1, target.length)) * 100);
		xp = 100 + (finalAcc >= 95 ? 35 : 0);
		recordGame('type-storm', score, xp);
		if (finalAcc >= 95) celebrate();
	}

	let score = $state(0);

	function oninput() {
		if (!started || finished) return;
		elapsed = Math.floor((Date.now() - startedAt) / 1000);
		if (typed.length >= target.length) {
			setTimeout(finish, 250);
		}
	}

	$effect(() => {
		if (!started || finished) return;
		const t = setInterval(() => {
			elapsed = Math.floor((Date.now() - startedAt) / 1000);
			if (elapsed >= 60) finish();
		}, 1000);
		return () => clearInterval(t);
	});
</script>

<svelte:head><title>Type Storm · Sabify Arcade</title></svelte:head>

<div class="space-y-3">
	<GameTopBar {game} score={score} {best} status={started ? `${wpm} WPM · ${accuracy}% accuracy` : 'Ready to type'} />

	<div class="overflow-hidden rounded-[2rem] border border-[#e3ddca] bg-gradient-to-br from-[#59c8f5] via-[#6aa9f5] to-[#7c6cf6] p-4 shadow-soft sm:p-7">
		<div class="mx-auto max-w-3xl">
			{#if !started && !finished}
				<div class="rounded-[1.75rem] border border-white/40 bg-white/85 p-5 backdrop-blur sm:p-6">
					<div class="flex items-center gap-3">
						<span class="grid h-12 w-12 place-items-center rounded-2xl bg-[#eaf8ff] text-2xl">⌨️</span>
						<div>
							<h1 class="display text-2xl font-semibold">Out-type the storm</h1>
							<p class="text-xs text-slate">Pick a passage. Type it exactly. Accuracy first, speed second.</p>
						</div>
					</div>
					<div class="mt-4 grid gap-2 sm:grid-cols-2">
						{#each typingPassages as p, i}
							<button
								class={`rounded-2xl border-2 p-3 text-left transition ${selected === i ? 'border-forest bg-[#f2fbdf]' : 'border-[#e9e4d6] bg-white hover:border-[#c9d7b8]'}`}
								onclick={() => (selected = i)}
							>
								<p class="text-[0.7rem] font-extrabold">{p.title}</p>
								<p class="mt-1 line-clamp-2 text-[0.64rem] leading-snug text-slate">{p.text}</p>
							</button>
						{/each}
					</div>
					<button class="btn btn-primary mt-4 w-full" onclick={start}><Play size={16} fill="currentColor" /> Start 60-second sprint</button>
				</div>
			{:else if finished}
				<GameResult
					title={accuracy >= 95 ? 'Storm tamed!' : 'The storm pushed back.'}
					subtitle="Typing is a skill — every attempt makes your fingers smarter."
					{score}
					{xp}
					{best}
					stats={[
						{ label: 'Words / min', value: `${wpm}` },
						{ label: 'Accuracy', value: `${accuracy}%` },
						{ label: 'Characters', value: `${typed.length}/${target.length}` }
					]}
					onreplay={start}
					nextHref="/app/games/quiz-arena"
				/>
			{:else}
				<div class="rounded-[1.75rem] border border-white/40 bg-white/90 p-4 backdrop-blur sm:p-6">
					<div class="flex flex-wrap items-center justify-between gap-2">
						<span class="pill text-[0.6rem]">{passage.title}</span>
						<div class="flex items-center gap-1.5">
							<span class="pill pill-sky text-[0.6rem]"><Timer size={11} /> {timeLeft}s</span>
							<span class="pill text-[0.6rem]"><Keyboard size={11} /> {wpm} WPM</span>
							<span class="pill pill-gold text-[0.6rem]"><Target size={11} /> {accuracy}%</span>
						</div>
					</div>
					<div class="progress-track mt-3 h-1.5"><div class="progress-fill" style={`width:${progressPct}%`}></div></div>
					<div class="mt-3 rounded-2xl bg-[#fbf8ef] p-3.5 text-[0.95rem] leading-relaxed sm:p-4">
						{#each target.split('') as ch, i}
							<span class={i < typed.length ? (typed[i] === ch ? 'text-[#0b6b45]' : 'rounded bg-[#ffe0dc] text-[#b42318] underline') : i === typed.length ? 'rounded bg-lime/60' : 'text-[#61746a]'}>{ch}</span>
						{/each}
					</div>
					<textarea
						class="input mt-3 min-h-24 font-mono text-sm"
						placeholder="Start typing here… the timer begins with your first keystroke."
						bind:value={typed}
						oninput={oninput}
						autocomplete="off"
						autocorrect="off"
						autocapitalize="off"
						spellcheck="false"
					></textarea>
					<div class="mt-2 flex items-center justify-between">
						<p class="text-[0.62rem] font-bold text-slate">{typed.length} / {target.length} characters</p>
						<button class="btn btn-primary btn-sm" onclick={finish}>Finish now</button>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="flex flex-wrap items-center justify-between gap-2 px-1 text-[0.64rem] font-bold text-slate">
		<span class="flex items-center gap-1"><Clock size={12} /> Sixty seconds. Accuracy contributes more than raw speed.</span>
		<span class="flex items-center gap-1"><Zap size={12} /> 95%+ accuracy earns bonus XP.</span>
	</div>
</div>
