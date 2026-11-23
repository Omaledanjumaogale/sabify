<script lang="ts">
	import { ArrowRight, BookOpen, Check, Clock, Gamepad2, Sparkles, Target, Zap } from '@lucide/svelte';
	import { page } from '$app/stores';
	import { getSubject, coursesForSubject, getLesson } from '$lib/data/curriculum';
	import { games } from '$lib/data/games';
	import { progress } from '$lib/stores/progress';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import GameCard from '$lib/components/GameCard.svelte';

	let slug = $derived($page.params.slug ?? '');
	let subject = $derived(getSubject(slug));
	let courses = $derived(subject ? coursesForSubject(subject.id) : []);
	let lessons = $derived(courses.flatMap((c) => c.modules.flatMap((m) => m.lessons)));
	let completed = $derived(lessons.filter((l) => $progress.completedLessons.includes(l.id)));
	let pct = $derived(lessons.length ? Math.round((completed.length / lessons.length) * 100) : 0);
	let next = $derived(lessons.find((l) => !$progress.completedLessons.includes(l.id)) ?? lessons[0]);

	const gameMap: Record<string, string[]> = {
		mathematics: ['number-nebula', 'logic-lab'],
		english: ['word-forge', 'type-storm'],
		science: ['memory-match', 'quiz-arena'],
		coding: ['quiz-arena', 'logic-lab'],
		digital: ['memory-match', 'quiz-arena'],
		money: ['money-quest', 'logic-lab'],
		civics: ['memory-match', 'quiz-arena'],
		arts: ['memory-match', 'word-forge']
	};
	let relatedGames = $derived(games.filter((g) => (gameMap[subject?.id ?? ''] ?? []).includes(g.slug)));

	function coursePct(courseId: string) {
		const c = courses.find((x) => x.id === courseId);
		if (!c) return 0;
		const list = c.modules.flatMap((m) => m.lessons);
		return Math.round((list.filter((l) => $progress.completedLessons.includes(l.id)).length / Math.max(1, list.length)) * 100);
	}
</script>

<svelte:head><title>{subject?.name ?? 'Subject'} · Sabify</title></svelte:head>

{#if !subject}
	<EmptyState title="Subject not found" body="That subject may have moved. Browse all subjects to find your next adventure." cta="Browse subjects" href="/app/subjects" emoji="🧭" />
{:else}
	<div class="space-y-5">
		<div class="flex items-center gap-1.5 text-[0.68rem] font-bold text-slate">
			<a href="/app/subjects" class="hover:text-forest">Subjects</a>
			<span>/</span>
			<span class="text-ink">{subject.name}</span>
		</div>

		<div class={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${subject.tint} p-5 sm:p-7`}>
			<div class="absolute inset-0 dot-bg opacity-20"></div>
			<div class="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
				<div class="max-w-2xl">
					<div class="flex items-center gap-3">
						<span class="grid h-14 w-14 place-items-center rounded-2xl bg-white/70 text-3xl backdrop-blur">{subject.emoji}</span>
						<div>
							<p class="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-ink/55">{courses.length} course{courses.length === 1 ? '' : 's'} · {lessons.length} lessons</p>
							<h1 class="display text-3xl font-semibold leading-none sm:text-4xl">{subject.name}</h1>
						</div>
					</div>
					<p class="mt-3 max-w-xl text-sm leading-relaxed text-ink/70">{subject.description}</p>
					<div class="mt-4 flex flex-wrap gap-1.5">
						{#each subject.curricula as c}<span class="pill bg-white/60 text-[0.6rem] text-ink">{c}</span>{/each}
					</div>
					<div class="mt-5 flex flex-wrap gap-2">
						{#if next}
							<a href={`/app/learn/${next.id}`} class="btn btn-primary btn-sm">{pct > 0 ? 'Continue course' : 'Start learning'} <ArrowRight size={15} /></a>
						{/if}
						<a href={`/app/games/${relatedGames[0]?.slug ?? 'quiz-arena'}`} class="btn btn-white btn-sm"><Gamepad2 size={15} /> Practise with a game</a>
					</div>
				</div>
				<div class="flex items-center gap-4 rounded-2xl bg-white/55 p-4 backdrop-blur">
					<ProgressRing value={pct} size={104} stroke={9} color="#0d3b2a" track="rgba(255,255,255,0.7)" sublabel="mastery" />
					<div>
						<p class="text-[0.62rem] font-extrabold uppercase tracking-wider text-ink/50">Your progress</p>
						<p class="mt-1 display text-2xl font-semibold">{completed.length}/{lessons.length}</p>
						<p class="text-[0.66rem] text-ink/60">lessons complete</p>
					</div>
				</div>
			</div>
		</div>

		<div class="grid gap-4 xl:grid-cols-[1.45fr_0.85fr]">
			<div class="space-y-4">
				{#each courses as course}
					<div class="card overflow-hidden">
						<div class={`flex flex-col gap-3 bg-gradient-to-r ${course.gradient} px-4 py-4 sm:flex-row sm:items-center sm:justify-between`}>
							<div class="flex items-center gap-3">
								<span class="text-3xl">{course.emoji}</span>
								<div>
									<h2 class="display text-lg font-semibold leading-tight">{course.title}</h2>
									<p class="text-[0.68rem] font-semibold text-ink/60">Age {course.ages} · {course.hours}h · {course.xp} XP</p>
								</div>
							</div>
							<div class="flex items-center gap-2">
								<div class="w-24"><ProgressBar value={coursePct(course.id)} showNumbers={false} color="progress-forest" /></div>
								<span class="text-[0.68rem] font-extrabold">{coursePct(course.id)}%</span>
							</div>
						</div>
						<p class="px-4 pt-3 text-xs leading-relaxed text-slate">{course.description}</p>
						<div class="p-4 pt-3">
							{#each course.modules as module}
								<div class="mb-3">
									<div class="flex items-center gap-2">
										<span class="text-base">{module.emoji}</span>
										<h3 class="text-[0.8rem] font-extrabold">{module.title}</h3>
										<span class="text-[0.62rem] font-bold text-slate">· {module.lessons.length} lessons</span>
									</div>
									<div class="mt-2 space-y-1.5">
										{#each module.lessons as lesson}
											{@const done = $progress.completedLessons.includes(lesson.id)}
											<a href={`/app/learn/${lesson.id}`} class="group flex items-center gap-2.5 rounded-xl border border-transparent px-2 py-2 transition hover:border-[#e5e0d1] hover:bg-[#fafcf5]">
												<span class={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.62rem] font-extrabold ${done ? 'bg-[#e9fbf1] text-[#0b6b45]' : 'bg-[#f1eee3] text-slate'}`}>
													{#if done}<Check size={13} />{:else}<BookOpen size={12} />{/if}
												</span>
												<div class="min-w-0 flex-1">
													<p class="truncate text-[0.78rem] font-bold">{lesson.title}</p>
													<p class="truncate text-[0.62rem] text-slate">{lesson.summary}</p>
												</div>
												<span class="hidden items-center gap-1 text-[0.6rem] font-bold text-slate sm:flex"><Clock size={11} /> {lesson.minutes} min</span>
												<span class="pill text-[0.54rem]">+{lesson.xp} XP</span>
												<ArrowRight size={13} class="text-slate/40 transition group-hover:text-forest" />
											</a>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>

			<div class="space-y-4">
				<div class="card p-4 sm:p-5">
					<h3 class="display text-base font-semibold">Skills you will build</h3>
					<div class="mt-2.5 flex flex-wrap gap-1.5">
						{#each subject.skills as skill}<span class="chip text-[0.68rem]"><Target size={12} /> {skill}</span>{/each}
					</div>
					<div class="mt-4 space-y-2.5">
						{#each subject.skills.slice(0, 5) as skill}
							<ProgressBar label={skill} value={$progress.skillMastery[skill] ?? 35} />
						{/each}
					</div>
				</div>

				<div class="card p-4 sm:p-5">
					<div class="flex items-center gap-2">
						<Gamepad2 size={17} class="text-forest" />
						<h3 class="display text-base font-semibold">Practise by playing</h3>
					</div>
					<p class="mt-1 text-[0.68rem] text-slate">Games that reinforce this subject.</p>
					<div class="mt-3 grid gap-2.5">
						{#each relatedGames as g}
							<GameCard game={g} href={`/app/games/${g.slug}`} />
						{/each}
					</div>
				</div>

				<div class="card p-4 sm:p-5">
					<h3 class="display text-base font-semibold">Curriculum alignment</h3>
					<div class="mt-2 space-y-2">
						{#each subject.curricula as c}
							<div class="flex items-center gap-2 rounded-xl bg-[#f7f5ec] px-3 py-2">
								<Sparkles size={13} class="text-[#7a4f00]" />
								<p class="text-[0.72rem] font-bold">{c}</p>
								<Check size={13} class="ml-auto text-[#0b6b45]" />
							</div>
						{/each}
					</div>
					<a href="/app/profile" class="mt-3 inline-flex items-center gap-1 text-[0.66rem] font-extrabold text-forest">Change curriculum <ArrowRight size={12} /></a>
				</div>

				<div class="relative overflow-hidden rounded-[1.75rem] bg-[#0b2b1f] p-5 text-white">
					<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-white/40">Study tip</p>
					<p class="mt-1.5 display text-lg font-semibold leading-tight">Short and often beats long and once.</p>
					<p class="mt-1 text-xs leading-relaxed text-white/60">Try a 10-minute lesson, then a 3-minute game. Your brain remembers more when practice is spaced out.</p>
					<a href="/app/quiz" class="btn btn-lime btn-sm mt-3"><Zap size={14} /> Try a quick quiz</a>
				</div>
			</div>
		</div>
	</div>
{/if}
