<script lang="ts">
	import { ArrowRight, Check, Clock, Flame, Play, RotateCcw, Target, Trophy, Zap } from '@lucide/svelte';
	import { allQuestions } from '$lib/data/curriculum';
	import { buildDailyQuiz } from '$lib/data/games';
	import { progress, recordQuiz, accuracy } from '$lib/stores/progress';
	import { celebrate } from '$lib/utils';
	import { toast } from '$lib/stores/toast';
	import QuizRunner from '$lib/components/QuizRunner.svelte';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import Mascot from '$lib/components/Mascot.svelte';
	import type { Question } from '$lib/data/types';

	let mode = $state<'intro' | 'quiz' | 'result'>('intro');
	let title = $state('Daily quiz');
	let questions = $state<Question[]>([]);
	let result = $state({ score: 0, total: 6, xp: 0 });
	let selectedPack = $state('daily');

	const packs = [
		{ id: 'maths', title: 'Maths sprint', emoji: '🧮', desc: 'Place value, addition, fractions, patterns and equations.', xp: 80, tone: 'bg-[#f2fbdf]', subjects: ['Place value', 'Addition', 'Fractions', 'Patterns', 'Expressions', 'Equations'] },
		{ id: 'english', title: 'English power', emoji: '📚', desc: 'Phonics, context clues, comprehension, story structure.', xp: 80, tone: 'bg-[#fff3ec]', subjects: ['Phonics', 'Context clues', 'Comprehension', 'Inference', 'Story structure', 'Descriptive writing'] },
		{ id: 'science', title: 'Science explorer', emoji: '🔬', desc: 'Living things, plants, forces, space, matter and water.', xp: 80, tone: 'bg-[#eef9ff]', subjects: ['Living things', 'Plants', 'Forces', 'Solar system', 'States of matter', 'Water cycle'] },
		{ id: 'money', title: 'Money sense', emoji: '🪙', desc: 'Needs, wants, saving, budgeting and smart choices.', xp: 80, tone: 'bg-[#fff9e5]', subjects: ['Needs & wants', 'Saving', 'Budgeting', 'Financial literacy'] },
		{ id: 'civics', title: 'Naija knowledge', emoji: '🇳🇬', desc: 'National symbols, rights, responsibilities and community.', xp: 80, tone: 'bg-[#e9fbf1]', subjects: ['National symbols', 'Rights', 'Responsibilities', 'Community'] },
		{ id: 'mixed', title: 'Mixed challenge', emoji: '⚡', desc: 'A little bit of everything. Perfect warm-up.', xp: 100, tone: 'bg-[#f0edff]', subjects: [] }
	];

	let packQuestions = $derived(
		selectedPack === 'mixed'
			? allQuestions.slice(0, 6)
			: allQuestions.filter((q) => (packs.find((p) => p.id === selectedPack)?.subjects ?? []).includes(q.skill)).slice(0, 6)
	);

	function startDaily() {
		questions = buildDailyQuiz();
		title = 'Daily quiz';
		selectedPack = 'daily';
		mode = 'quiz';
	}

	function startPack(id: string) {
		selectedPack = id;
		const pack = packs.find((p) => p.id === id);
		const filtered =
			id === 'mixed'
				? allQuestions.slice(0, 6)
				: allQuestions.filter((q) => (pack?.subjects ?? []).includes(q.skill)).slice(0, 6);
		questions = filtered.length >= 4 ? filtered : allQuestions.slice(0, 6);
		title = pack?.title ?? 'Quiz';
		mode = 'quiz';
	}

	function finish(r: { score: number; total: number; xp: number }) {
		result = r;
		const pct = Math.round((r.score / Math.max(1, r.total)) * 100);
		recordQuiz(title, r.score, r.total, r.xp);
		mode = 'result';
		if (pct >= 80) {
			celebrate();
			toast(`Quiz complete — ${pct}%! +${r.xp} XP`, 'xp', '🎯');
		} else {
			toast(`Quiz finished — ${pct}%. Review and retry.`, 'info', '📘');
		}
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	let resultPct = $derived(Math.round((result.score / Math.max(1, result.total)) * 100));
	let accuracyPct = $derived(Math.round($accuracy * 100));
</script>

<svelte:head><title>Daily quiz · Sabify</title></svelte:head>

<div class="space-y-5">
	{#if mode === 'intro'}
		<div class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0b2b1f] via-[#12452f] to-[#1b5e42] p-5 text-white sm:p-7">
			<div class="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl"></div>
			<div class="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
				<div class="max-w-2xl">
					<p class="eyebrow !text-lime">Daily quiz · {new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
					<h1 class="mt-2 display text-3xl font-semibold sm:text-4xl">Six questions. One sharp mind.</h1>
					<p class="mt-2 max-w-xl text-sm leading-relaxed text-white/60">A quick daily retrieval practice built from your recent lessons. Keep the streak alive and see exactly which skills are sticking.</p>
					<div class="mt-4 flex flex-wrap gap-2">
						<span class="pill pill-dark text-[0.62rem]"><Target size={12} /> 6 questions</span>
						<span class="pill pill-dark text-[0.62rem]"><Clock size={12} /> 5 minutes</span>
						<span class="pill pill-dark text-[0.62rem]"><Zap size={12} /> +80 XP</span>
						<span class="pill pill-dark text-[0.62rem]"><Flame size={12} /> {$progress.streak}-day streak</span>
					</div>
					<button class="btn btn-lime mt-5" onclick={startDaily}><Play size={16} fill="currentColor" /> Start today’s quiz</button>
				</div>
				<div class="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
					<ProgressRing value={accuracyPct} size={94} stroke={8} color="#c9f26b" track="rgba(255,255,255,0.12)" sublabel="accuracy" />
					<div>
						<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-white/40">All-time accuracy</p>
						<p class="display text-2xl font-semibold text-lime">{accuracyPct}%</p>
						<p class="text-[0.64rem] text-white/50">{$progress.questionsAnswered} questions answered</p>
					</div>
				</div>
			</div>
		</div>

		<div class="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
			<div>
				<div class="flex items-end justify-between">
					<div>
						<h2 class="display text-xl font-semibold">Quiz packs</h2>
						<p class="text-xs text-slate">Focus on one subject or mix it up.</p>
					</div>
				</div>
				<div class="mt-4 grid gap-3 sm:grid-cols-2">
					{#each packs as pack}
						<button class="card card-hover p-4 text-left" onclick={() => startPack(pack.id)}>
							<div class="flex items-start justify-between">
								<span class={`grid h-10 w-10 place-items-center rounded-2xl text-lg ${pack.tone}`}>{pack.emoji}</span>
								<span class="pill pill-gold text-[0.58rem]">+{pack.xp} XP</span>
							</div>
							<h3 class="mt-3 display text-base font-semibold">{pack.title}</h3>
							<p class="mt-1 text-[0.7rem] leading-snug text-slate">{pack.desc}</p>
							<span class="mt-3 inline-flex items-center gap-1 text-[0.66rem] font-extrabold text-forest">Start quiz <ArrowRight size={12} /></span>
						</button>
					{/each}
				</div>
			</div>

			<div class="space-y-4">
				<div class="card p-4 sm:p-5">
					<div class="flex items-center justify-between">
						<h3 class="display text-base font-semibold">Recent results</h3>
						<span class="pill text-[0.56rem]">{$progress.quizzesPlayed} total</span>
					</div>
					<div class="mt-2 divide-y divide-[#f0ece0]">
						{#each $progress.quizHistory.slice(0, 5) as q}
							<div class="flex items-center gap-2 py-2.5">
								<span class={`grid h-6 w-6 place-items-center rounded-full text-[0.58rem] font-extrabold ${q.score / q.total >= 0.8 ? 'bg-[#e9fbf1] text-[#0b6b45]' : 'bg-[#fff4d2] text-[#7a4f00]'}`}>
									{q.score}/{q.total}
								</span>
								<div class="min-w-0 flex-1">
									<p class="truncate text-[0.72rem] font-bold">{q.title}</p>
									<p class="text-[0.6rem] text-slate">{new Date(q.at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</p>
								</div>
								<span class="text-[0.62rem] font-extrabold text-slate">+{q.xp}</span>
							</div>
						{/each}
					</div>
				</div>

				<div class="relative overflow-hidden rounded-[1.75rem] bg-[#f4f1e4] p-4">
					<div class="flex items-center gap-2">
						<span class="text-2xl">🧠</span>
						<p class="text-sm font-extrabold">Retrieval beats rereading</p>
					</div>
					<p class="mt-1.5 text-[0.7rem] leading-relaxed text-slate">Trying to remember without looking is harder — and that difficulty is exactly what makes learning stick. Short daily quizzes work better than one long cram.</p>
				</div>
			</div>
		</div>
	{:else if mode === 'quiz'}
		<div class="flex items-center justify-between gap-2">
			<button class="btn btn-ghost btn-sm" onclick={() => (mode = 'intro')}>← Back to quiz packs</button>
			<span class="pill text-[0.6rem]">{title}</span>
		</div>
		<div class="card mx-auto max-w-3xl p-5 sm:p-7">
			<div class="mb-5 flex items-center gap-3 rounded-2xl bg-[#f7f5ec] p-3">
				<Mascot size={52} expression="think" />
				<div>
					<p class="text-sm font-extrabold">{title}</p>
					<p class="text-[0.68rem] text-slate">Read carefully, then choose. Explanations appear after every answer.</p>
				</div>
			</div>
			<QuizRunner {questions} onfinish={finish} />
		</div>
	{:else}
		<div class="card mx-auto max-w-2xl p-6 text-center sm:p-8">
			<Mascot size={120} expression={resultPct >= 80 ? 'cheer' : 'calm'} float />
			<p class="eyebrow justify-center">{title}</p>
			<h1 class="mt-1 display text-3xl font-semibold">{resultPct >= 80 ? 'Sharp shooter!' : resultPct >= 50 ? 'Good effort.' : 'Keep building.'}</h1>
			<p class="mt-2 text-sm text-slate">You answered {result.score} of {result.total} correctly.</p>
			<div class="mt-5 flex items-center justify-center gap-5">
				<ProgressRing value={resultPct} size={100} stroke={10} color={resultPct >= 80 ? '#10b981' : '#ffc53d'} sublabel="score" />
				<div class="text-left">
					<p class="display text-2xl font-semibold text-[#0b6b45]">+{result.xp} XP</p>
					<p class="text-[0.68rem] font-bold text-slate">+{result.score * 5} coins · results saved</p>
				</div>
			</div>
			<div class="mt-6 grid gap-2 sm:grid-cols-3">
				<a href="/app" class="btn btn-ghost">Dashboard</a>
				<a href="/app/quiz" class="btn btn-ghost">All quizzes</a>
				<button class="btn btn-primary" onclick={() => (selectedPack === 'daily' ? startDaily() : startPack(selectedPack))}><RotateCcw size={15} /> Try again</button>
			</div>
			<div class="mt-6 flex items-center justify-center gap-4 text-[0.68rem] font-bold text-slate">
				<span class="flex items-center gap-1"><Trophy size={12} /> {$progress.quizzesPlayed} quizzes taken</span>
				<span class="flex items-center gap-1"><Check size={12} /> Accuracy {accuracyPct}%</span>
			</div>
		</div>
	{/if}
</div>
