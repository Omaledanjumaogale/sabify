<script lang="ts">
	import { Check, ChevronRight, Lightbulb, Sparkles, X } from '@lucide/svelte';
	import type { Question } from '$lib/data/types';
	import { playTone } from '$lib/engine/sound';
	import { recordAnswer } from '$lib/stores/progress';
	import { shuffle } from '$lib/utils';

	let {
		questions,
		onfinish,
		accent = 'forest'
	}: {
		questions: Question[];
		onfinish: (result: { score: number; total: number; xp: number }) => void;
		accent?: 'forest' | 'lime' | 'gold';
	} = $props();

	let index = $state(0);
	let score = $state(0);
	let selected = $state('');
	let input = $state('');
	let feedback = $state<'none' | 'correct' | 'wrong'>('none');
	let hintOpen = $state(false);
	let orderPick = $state<string[]>([]);
	let matches = $state<Record<string, string>>({});
	let activeLeft = $state('');

	let current = $derived(questions[Math.min(index, questions.length - 1)]);
	let choiceOptions = $derived(current?.type === 'choice' ? shuffle(current.options ?? []) : current?.options ?? []);
	let orderOptions = $derived(current?.type === 'order' ? shuffle(current.options ?? []) : []);
	let matchRights = $derived(current?.type === 'match' ? shuffle((current.pairs ?? []).map((p) => p.right)) : []);
	let progress = $derived(((index + (feedback === 'none' ? 0 : 1)) / Math.max(1, questions.length)) * 100);

	let canCheck = $derived.by(() => {
		if (!current) return false;
		if (current.type === 'choice' || current.type === 'truefalse') return selected !== '';
		if (current.type === 'number') return input.trim() !== '';
		if (current.type === 'order') return orderPick.length === (current.options?.length ?? 0);
		if (current.type === 'match') return Object.keys(matches).length === (current.pairs?.length ?? 0);
		return input.trim() !== '';
	});

	function isCorrect(): boolean {
		if (!current) return false;
		if (current.type === 'choice' || current.type === 'truefalse') return selected === current.answer;
		if (current.type === 'number') return Number(input) === Number(current.answer);
		if (current.type === 'order') return orderPick.join('|') === current.answer;
		if (current.type === 'match') {
			return (current.pairs ?? []).every((p) => matches[p.left] === p.right);
		}
		return input.trim().toLowerCase() === current.answer.toLowerCase();
	}

	function check() {
		if (!current || feedback !== 'none') return;
		const correct = isCorrect();
		feedback = correct ? 'correct' : 'wrong';
		if (correct) {
			score++;
			playTone('correct');
		} else {
			playTone('wrong');
		}
		recordAnswer(correct, current.skill, current.xp);
	}

	function next() {
		if (index + 1 >= questions.length) {
			onfinish({ score, total: questions.length, xp: questions.reduce((s, q) => s + q.xp, 0) });
			return;
		}
		index++;
		selected = '';
		input = '';
		feedback = 'none';
		hintOpen = false;
		orderPick = [];
		matches = {};
		activeLeft = '';
		playTone('click');
	}

	function toggleOrder(option: string) {
		if (feedback !== 'none') return;
		orderPick = orderPick.includes(option)
			? orderPick.filter((o) => o !== option)
			: [...orderPick, option];
	}

	function chooseLeft(left: string) {
		if (feedback !== 'none') return;
		activeLeft = activeLeft === left ? '' : left;
	}

	function chooseRight(right: string) {
		if (feedback !== 'none' || !activeLeft) return;
		matches = { ...matches, [activeLeft]: right };
		activeLeft = '';
	}

	function resetMatch(left: string) {
		if (feedback !== 'none') return;
		const copy = { ...matches };
		delete copy[left];
		matches = copy;
	}
</script>

<div>
	<div class="flex items-center justify-between gap-3">
		<p class="text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-slate">Question {index + 1} of {questions.length}</p>
		<div class="flex items-center gap-2">
			<span class="pill text-[0.58rem]">{current?.skill}</span>
			<span class="pill pill-gold text-[0.58rem]">+{current?.xp} XP</span>
		</div>
	</div>
	<div class="progress-track mt-2 h-1.5"><div class="progress-fill" style={`width:${progress}%`}></div></div>

	{#if current}
		<div class="mt-5">
			<h3 class="display text-lg font-semibold leading-snug sm:text-xl">{current.prompt}</h3>

			{#if current.type === 'choice' || current.type === 'truefalse'}
				<div class="mt-4 grid gap-2">
					{#each choiceOptions as option, i}
						<button
							class={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left text-sm font-bold transition ${
								selected === option
									? 'border-forest bg-[#f2f9e7]'
									: 'border-[#e9e4d6] bg-white hover:border-[#c9d7b8]'
							}`}
							onclick={() => {
								if (feedback === 'none') selected = option;
							}}
						>
							<span class={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[0.68rem] font-extrabold ${selected === option ? 'bg-forest text-white' : 'bg-[#f1eee3] text-slate'}`}>
								{String.fromCharCode(65 + i)}
							</span>
							<span>{option}</span>
						</button>
					{/each}
				</div>
			{:else if current.type === 'number'}
				<div class="mt-4">
					<label class="label" for="answer">Your answer</label>
					<input id="answer" class="input max-w-xs text-lg font-extrabold" type="number" bind:value={input} disabled={feedback !== 'none'} placeholder="Type a number" />
				</div>
			{:else if current.type === 'order'}
				<p class="mt-2 text-xs text-slate">Tap items in the correct order.</p>
				<div class="mt-3 min-h-[52px] rounded-2xl border-2 border-dashed border-[#d8d3c2] bg-[#f7f5ec] p-2">
					{#if orderPick.length === 0}
						<p class="py-2 text-center text-xs text-slate">Your ordered steps will appear here</p>
					{:else}
						<div class="flex flex-wrap gap-1.5">
							{#each orderPick as item, i}
								<button class="chip bg-white text-[0.7rem]" onclick={() => toggleOrder(item)}>{i + 1}. {item} <X size={12} /></button>
							{/each}
						</div>
					{/if}
				</div>
				<div class="mt-2 flex flex-wrap gap-1.5">
					{#each orderOptions as option}
						<button
							class={`chip text-[0.72rem] ${orderPick.includes(option) ? 'opacity-35' : 'hover:border-[#c9d7b8]'}`}
							disabled={orderPick.includes(option) || feedback !== 'none'}
							onclick={() => toggleOrder(option)}
						>
							{option}
						</button>
					{/each}
				</div>
			{:else if current.type === 'match'}
				<p class="mt-2 text-xs text-slate">Tap a term on the left, then its match on the right.</p>
				<div class="mt-3 grid gap-2 sm:grid-cols-2">
					<div class="space-y-1.5">
						{#each current.pairs ?? [] as pair}
							<button
								class={`w-full rounded-xl border-2 px-3 py-2.5 text-left text-xs font-bold transition ${
									activeLeft === pair.left ? 'border-forest bg-[#f2f9e7]' : matches[pair.left] ? 'border-[#cfe6d6] bg-[#f4fbf6]' : 'border-[#e9e4d6] bg-white'
								}`}
								onclick={() => (matches[pair.left] ? resetMatch(pair.left) : chooseLeft(pair.left))}
							>
								{pair.left}
								{#if matches[pair.left]}<span class="mt-0.5 block text-[0.62rem] font-semibold text-[#0b6b45]">→ {matches[pair.left]}</span>{/if}
							</button>
						{/each}
					</div>
					<div class="space-y-1.5">
						{#each matchRights as right}
							<button class="w-full rounded-xl border-2 border-[#e9e4d6] bg-white px-3 py-2.5 text-left text-xs font-bold transition hover:border-[#c9d7b8]" onclick={() => chooseRight(right)}>
								{right}
							</button>
						{/each}
					</div>
				</div>
			{:else}
				<input class="input mt-4" bind:value={input} disabled={feedback !== 'none'} placeholder="Type your answer" />
			{/if}

			{#if current.hint && feedback === 'none'}
				<div class="mt-3">
					{#if hintOpen}
						<div class="flex gap-2 rounded-xl bg-[#fff8e8] p-2.5 text-xs text-[#7a4f00]"><Lightbulb size={15} class="mt-0.5 shrink-0" /> {current.hint}</div>
					{:else}
						<button class="inline-flex items-center gap-1 text-[0.68rem] font-extrabold text-[#7a4f00]" onclick={() => (hintOpen = true)}><Lightbulb size={13} /> Need a hint?</button>
					{/if}
				</div>
			{/if}

			{#if feedback !== 'none'}
				<div class={`mt-4 rounded-2xl border p-3.5 ${feedback === 'correct' ? 'border-[#bde8cc] bg-[#eefbf3]' : 'border-[#ffd0c9] bg-[#fff3f0]'}`}>
					<div class="flex items-center gap-2">
						<span class={`grid h-6 w-6 place-items-center rounded-full ${feedback === 'correct' ? 'bg-[#0b6b45] text-white' : 'bg-[#b42318] text-white'}`}>
							{#if feedback === 'correct'}<Check size={13} />{:else}<X size={13} />{/if}
						</span>
						<p class={`text-sm font-extrabold ${feedback === 'correct' ? 'text-[#0b6b45]' : 'text-[#b42318]'}`}>
							{feedback === 'correct' ? 'Correct — nicely done!' : `Not quite. The answer is ${current.answer}.`}
						</p>
					</div>
					<p class="mt-1.5 text-xs leading-relaxed text-[#3f564b]">{current.explanation}</p>
				</div>
			{/if}

			<div class="mt-5 flex items-center justify-between gap-3">
				{#if feedback === 'none'}
					<button class="btn btn-primary w-full sm:w-auto" disabled={!canCheck} onclick={check}>
						Check answer <Check size={16} />
					</button>
				{:else}
					<button class="btn btn-primary w-full sm:w-auto" onclick={next}>
						{index + 1 >= questions.length ? 'See my results' : 'Next question'} <ChevronRight size={16} />
					</button>
				{/if}
				<p class="hidden items-center gap-1 text-[0.64rem] font-bold text-slate sm:flex"><Sparkles size={12} /> Every answer updates your mastery map</p>
			</div>
		</div>
	{/if}
</div>
