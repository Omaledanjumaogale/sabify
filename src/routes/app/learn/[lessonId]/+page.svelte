<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ArrowLeft,
		ArrowRight,
		BookOpen,
		Check,
		ChevronLeft,
		ChevronRight,
		Clock,
		Compass,
		FlaskConical,
		Lightbulb,
		PenLine,
		Sparkles,
		Target,
		Zap
	} from '@lucide/svelte';
	import { page } from '$app/stores';
	import { getLesson, getCourseForLesson } from '$lib/data/curriculum';
	import { completeLesson, progress } from '$lib/stores/progress';
	import { toast } from '$lib/stores/toast';
	import { celebrate } from '$lib/utils';
	import { rich } from '$lib/engine/text';
	import { playTone } from '$lib/engine/sound';
	import QuizRunner from '$lib/components/QuizRunner.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import Mascot from '$lib/components/Mascot.svelte';

	let lessonId = $derived($page.params.lessonId ?? '');
	let lesson = $derived(getLesson(lessonId));
	let course = $derived(getCourseForLesson(lessonId));
	let allLessons = $derived(course?.modules.flatMap((m) => m.lessons) ?? []);
	let nextLesson = $derived(lesson ? allLessons[allLessons.findIndex((l) => l.id === lesson.id) + 1] : undefined);
	let skills = $derived([...new Set(lesson?.questions.map((q) => q.skill) ?? [])]);

	let phase = $state<'learn' | 'quiz' | 'result'>('learn');
	let cardIndex = $state(0);
	let result = $state({ score: 0, total: 1, xp: 0 });
	let note = $state('');
	let hintOpen = $state(false);
	let noteSaved = $state(false);
	let totalSteps = $derived((lesson?.cards.length ?? 0) + (lesson?.questions.length ?? 0));
	let stepLabel = $derived(phase === 'learn' ? cardIndex + 1 : phase === 'quiz' ? (lesson?.cards.length ?? 0) + 1 : totalSteps);
	let progressPct = $derived(phase === 'result' ? 100 : Math.round(((stepLabel - 1) / Math.max(1, totalSteps)) * 100));
	let card = $derived(lesson?.cards[cardIndex]);

	onMount(() => {
		if (!lesson) return;
		try {
			note = localStorage.getItem(`sabify.note.${lesson.id}`) ?? '';
		} catch {
			/* ignore */
		}
	});

	function saveNote() {
		if (!lesson) return;
		try {
			localStorage.setItem(`sabify.note.${lesson.id}`, note);
			noteSaved = true;
			setTimeout(() => (noteSaved = false), 1600);
		} catch {
			/* ignore */
		}
	}

	function nextCard() {
		if (!lesson) return;
		if (cardIndex + 1 < lesson.cards.length) {
			cardIndex++;
			playTone('click');
			window.scrollTo({ top: 0, behavior: 'smooth' });
		} else {
			phase = 'quiz';
			playTone('level');
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function prevCard() {
		if (cardIndex > 0) {
			cardIndex--;
			playTone('click');
		}
	}

	function finish(r: { score: number; total: number; xp: number }) {
		if (!lesson) return;
		result = r;
		const pct = Math.round((r.score / Math.max(1, r.total)) * 100);
		completeLesson(lesson.id, pct, lesson.xp, skills);
		phase = 'result';
		celebrate();
		toast(
			pct >= 80 ? `Lesson complete — ${pct}% mastery!` : `Lesson finished — ${pct}%. Review and try again.`,
			pct >= 80 ? 'success' : 'info',
			pct >= 80 ? '🏅' : '📘'
		);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	let resultPct = $derived(Math.round((result.score / Math.max(1, result.total)) * 100));

	const cardMeta = {
		read: { icon: BookOpen, label: 'Learn', tone: 'bg-[#eaf8ff] text-[#0a6486]' },
		tip: { icon: Lightbulb, label: 'Tip', tone: 'bg-[#fff4d2] text-[#7a4f00]' },
		example: { icon: FlaskConical, label: 'Worked example', tone: 'bg-[#e9fbf1] text-[#0b6b45]' },
		steps: { icon: Compass, label: 'Step by step', tone: 'bg-[#f0edff] text-[#4b3bb5]' },
		didyouknow: { icon: Sparkles, label: 'Did you know?', tone: 'bg-[#fff1ee] text-[#a83227]' },
		vocab: { icon: BookOpen, label: 'Word bank', tone: 'bg-[#f2fbdf] text-[#256b16]' },
		reflect: { icon: PenLine, label: 'Reflect', tone: 'bg-[#f1eee3] text-[#3f564b]' }
	};
</script>

<svelte:head><title>{lesson?.title ?? 'Lesson'} · Sabify</title></svelte:head>

{#if !lesson}
	<EmptyState title="Lesson not found" body="This lesson may have moved. Browse your subjects to pick up where you left off." cta="Browse subjects" href="/app/subjects" emoji="📘" />
{:else}
	<div class="space-y-4">
		<div class="flex flex-wrap items-center gap-1.5 text-[0.68rem] font-bold text-slate">
			<a href="/app/subjects" class="hover:text-forest">Subjects</a>
			<span>/</span>
			<a href={`/app/subjects/${course?.subjectId}`} class="hover:text-forest">{course?.title}</a>
			<span>/</span>
			<span class="text-ink">{lesson.title}</span>
		</div>

		<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<div class="flex flex-wrap items-center gap-1.5">
					<span class="pill text-[0.58rem]">{course?.emoji} {course?.title}</span>
					<span class="pill pill-sky text-[0.58rem]"><Clock size={11} /> {lesson.minutes} min</span>
					<span class="pill pill-gold text-[0.58rem]"><Zap size={11} /> +{lesson.xp} XP</span>
				</div>
				<h1 class="mt-2 display text-2xl font-semibold sm:text-3xl">{lesson.title}</h1>
				<p class="mt-1 text-sm text-slate">{lesson.objective}</p>
			</div>
			<a href={`/app/subjects/${course?.subjectId}`} class="btn btn-ghost btn-sm self-start"><ArrowLeft size={14} /> Back to course</a>
		</div>

		<div class="card overflow-hidden">
			<div class="flex items-center gap-3 border-b border-[#eee9dc] px-4 py-2.5">
				<div class="flex-1">
					<div class="flex items-center justify-between text-[0.62rem] font-extrabold text-slate">
						<span>{phase === 'learn' ? `Lesson ${cardIndex + 1} of ${lesson.cards.length}` : phase === 'quiz' ? 'Practice time' : 'Lesson complete'}</span>
						<span>{progressPct}%</span>
					</div>
					<div class="progress-track mt-1.5 h-1.5"><div class="progress-fill" style={`width:${progressPct}%`}></div></div>
				</div>
				<span class="hidden pill text-[0.56rem] sm:inline-flex">{lesson.level}</span>
			</div>

			{#if phase === 'learn' && card}
				{@const meta = cardMeta[card.kind]}
				{@const Icon = meta.icon}
				<div class="p-5 sm:p-7">
					<div class="flex items-center gap-2">
						<span class={`grid h-9 w-9 place-items-center rounded-xl ${meta.tone}`}><Icon size={17} /></span>
						<p class="text-[0.64rem] font-extrabold uppercase tracking-[0.12em] text-slate">{meta.label}</p>
					</div>
					{#if card.title}<h2 class="mt-4 display text-2xl font-semibold leading-tight">{card.title}</h2>{/if}
					<div class="mt-3 text-[0.95rem] leading-relaxed text-[#2f4a3d]">
						{@html rich(card.body)}
					</div>

					{#if card.bullets}
						<ul class="mt-4 space-y-2">
							{#each card.bullets as bullet}
								<li class="flex items-start gap-2.5 rounded-xl bg-[#f7f5ec] px-3 py-2.5 text-sm leading-snug">
									<Check size={15} class="mt-0.5 shrink-0 text-[#0b6b45]" />
									<span>{@html rich(bullet)}</span>
								</li>
							{/each}
						</ul>
					{/if}

					{#if card.kind === 'reflect'}
						<textarea class="input mt-4 min-h-28" placeholder="Write your thoughts here…" bind:value={note}></textarea>
						<div class="mt-2 flex items-center gap-2">
							<button class="btn btn-ghost btn-sm" onclick={saveNote}><PenLine size={14} /> Save note</button>
							{#if noteSaved}<span class="text-[0.68rem] font-bold text-[#0b6b45]">Saved ✓</span>{/if}
						</div>
					{/if}

					<div class="mt-7 flex items-center justify-between gap-2 border-t border-[#eee9dc] pt-4">
						<button class="btn btn-ghost btn-sm" disabled={cardIndex === 0} onclick={prevCard}><ChevronLeft size={15} /> Back</button>
						<button class="btn btn-primary" onclick={nextCard}>
							{cardIndex + 1 < lesson.cards.length ? 'Next' : 'Start practice'}
							<ChevronRight size={16} />
						</button>
					</div>
				</div>
			{:else if phase === 'quiz'}
				<div class="p-5 sm:p-7">
					<div class="mb-5 flex items-center gap-3 rounded-2xl bg-[#f7f5ec] p-3">
						<Mascot size={52} expression="think" />
						<div>
							<p class="text-sm font-extrabold">You’ve got this, {lesson.level === 'Champion' ? 'champion' : 'explorer'}.</p>
							<p class="text-[0.68rem] text-slate">Answer {lesson.questions.length} questions. Every answer updates your mastery map.</p>
						</div>
					</div>
					<QuizRunner questions={lesson.questions} onfinish={finish} />
				</div>
			{:else}
				<div class="p-5 text-center sm:p-8">
					<div class="mx-auto max-w-lg">
						<Mascot size={130} expression={resultPct >= 80 ? 'cheer' : 'calm'} float />
						<p class="eyebrow justify-center">Lesson complete</p>
						<h2 class="mt-2 display text-3xl font-semibold">{resultPct >= 80 ? 'Brilliant work!' : resultPct >= 50 ? 'Good effort — keep going.' : 'Every expert starts here.'}</h2>
						<p class="mt-2 text-sm text-slate">
							You answered {result.score} of {result.total} correctly. {resultPct >= 80 ? 'That skill just got stronger.' : 'Review the explanation and give it another go.'}
						</p>
						<div class="mt-5 flex items-center justify-center gap-5">
							<ProgressRing value={resultPct} size={104} stroke={10} color={resultPct >= 80 ? '#10b981' : '#ffc53d'} sublabel="score" />
							<div class="text-left">
								<p class="display text-2xl font-semibold text-[#0b6b45]">+{lesson.xp} XP</p>
								<p class="text-[0.68rem] font-bold text-slate">+25 coins · mastery updated</p>
								<div class="mt-2 flex flex-wrap gap-1">
									{#each skills as s}<span class="pill text-[0.56rem]">{s}</span>{/each}
								</div>
							</div>
						</div>
						<div class="mt-6 grid gap-2 sm:grid-cols-2">
							<a href="/app" class="btn btn-ghost">Back to dashboard</a>
							{#if nextLesson}
								<a href={`/app/learn/${nextLesson.id}`} class="btn btn-primary">Next lesson <ArrowRight size={16} /></a>
							{:else}
								<a href={`/app/subjects/${course?.subjectId}`} class="btn btn-primary">More in this subject <ArrowRight size={16} /></a>
							{/if}
						</div>
						<button class="mt-3 text-xs font-extrabold text-slate underline" onclick={() => { phase = 'learn'; cardIndex = 0; result = { score: 0, total: lesson.questions.length, xp: 0 }; window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Review the lesson again</button>
					</div>
				</div>
			{/if}
		</div>

		<!-- Sidebar content -->
		<div class="grid gap-4 lg:grid-cols-2">
			<div class="card p-4 sm:p-5">
				<h3 class="display text-base font-semibold">Lesson outline</h3>
				<div class="mt-2.5 space-y-1.5">
					{#each lesson.cards as c, i}
						<div class={`flex items-center gap-2 rounded-xl px-2 py-1.5 text-[0.72rem] font-bold ${phase === 'learn' && cardIndex === i ? 'bg-[#f2fbdf] text-[#256b16]' : 'text-slate'}`}>
							<span class={`grid h-5 w-5 place-items-center rounded-full text-[0.56rem] ${phase === 'learn' && cardIndex === i ? 'bg-[#256b16] text-white' : 'bg-[#f1eee3]'}`}>{i + 1}</span>
							<span class="truncate">{c.title ?? c.kind}</span>
						</div>
					{/each}
					<div class={`flex items-center gap-2 rounded-xl px-2 py-1.5 text-[0.72rem] font-bold ${phase === 'quiz' ? 'bg-[#fff4d2] text-[#7a4f00]' : 'text-slate'}`}>
						<span class={`grid h-5 w-5 place-items-center rounded-full text-[0.56rem] ${phase === 'quiz' ? 'bg-[#7a4f00] text-white' : 'bg-[#f1eee3]'}`}>✓</span>
						Practice quiz · {lesson.questions.length} questions
					</div>
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center justify-between">
					<h3 class="display text-base font-semibold">Ask Sabi for a hint</h3>
					<Sparkles size={16} class="text-[#7a4f00]" />
				</div>
				<p class="mt-1 text-[0.68rem] text-slate">Stuck? Sabi gives a nudge, not the answer.</p>
				{#if hintOpen}
					<div class="mt-3 rounded-2xl bg-[#f7f5ec] p-3 text-xs leading-relaxed text-[#3f564b]">
						{#if lesson.questions[0]?.hint}
							{lesson.questions[0].hint}
						{:else}
							Read the question twice. Underline the key numbers or words, then ask: “What is this question really asking me to find?”
						{/if}
						<p class="mt-2 text-[0.62rem] font-bold text-slate">Sabi · age-appropriate hint</p>
					</div>
				{:else}
					<button class="btn btn-ghost btn-sm mt-3" onclick={() => (hintOpen = true)}><Lightbulb size={14} /> Show me a hint</button>
				{/if}
				<a href="/app/tutor" class="mt-3 inline-flex items-center gap-1 text-[0.66rem] font-extrabold text-forest">Open full study buddy <ArrowRight size={12} /></a>
			</div>
		</div>
	</div>
{/if}
