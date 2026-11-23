<script lang="ts">
	import { ArrowRight, BookOpen, Check, ChevronRight, Clock, Flame, Gamepad2, Sparkles, Target, Trophy, Zap } from '@lucide/svelte';
	import { celebrate } from '$lib/utils';
	import { toast } from '$lib/stores/toast';
	import { session } from '$lib/stores/session';
	import { accuracy, claimQuest, level, liveQuests, progress, rankTitle, xpToNextLevel } from '$lib/stores/progress';
	import { courses, coursesForSubject, getLesson, subjects } from '$lib/data/curriculum';
	import { games } from '$lib/data/games';
	import { assignments, badges, leaderboard, weeklyXp, weeklyXp as xpData } from '$lib/data/seed';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import BarChart from '$lib/components/BarChart.svelte';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import QuestRow from '$lib/components/QuestRow.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import BadgeTile from '$lib/components/BadgeTile.svelte';
	import CourseCard from '$lib/components/CourseCard.svelte';

	let user = $derived($session.user);
	let hour = new Date().getHours();
	let greeting = $derived(hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening');
	let dateLabel = new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' });
	let completed = $derived($progress.completedLessons);
	let currentCourse = $derived(courses.find((c) => !c.modules.every((m) => m.lessons.every((l) => completed.includes(l.id)))) ?? courses[0]);
	let currentLesson = $derived(
		currentCourse.modules.flatMap((m) => m.lessons).find((l) => !completed.includes(l.id)) ??
			currentCourse.modules[0].lessons[0]
	);
	let currentModule = $derived(currentCourse.modules.find((m) => m.lessons.some((l) => l.id === currentLesson.id)));
	let courseProgress = $derived(
		Math.round((currentCourse.modules.flatMap((m) => m.lessons).filter((l) => completed.includes(l.id)).length / currentCourse.modules.flatMap((m) => m.lessons).length) * 100)
	);
	let nextBadge = $derived(badges.find((b) => !$progress.earnedBadges.includes(b.id)) ?? badges[0]);
	let dailyQuests = $derived($liveQuests.filter((q) => q.kind === 'daily'));
	let myRank = $derived(leaderboard.findIndex((l) => l.isMe) + 1);
	let recommended = $derived(
		courses
			.flatMap((c) => c.modules.flatMap((m) => m.lessons.map((l) => ({ course: c, lesson: l }))))
			.filter((x) => !completed.includes(x.lesson.id))
			.slice(0, 4)
	);
	let topBadges = $derived(badges.filter((b) => $progress.earnedBadges.includes(b.id)).slice(0, 4));
	let accuracyPct = $derived(Math.round($accuracy * 100));

	function claim(id: string, xp: number, title: string) {
		claimQuest(id, xp);
		toast(`Quest complete — +${xp} XP for “${title}”`, 'xp', '⚡');
		celebrate();
	}
</script>

<svelte:head><title>Dashboard · Sabify</title></svelte:head>

<div class="flex flex-col gap-5">
	<!-- Greeting -->
	<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="text-[0.66rem] font-extrabold uppercase tracking-[0.14em] text-slate">{dateLabel}</p>
			<h1 class="mt-1 display text-2xl font-semibold sm:text-3xl">{greeting}, {user?.firstName} 👋</h1>
			<p class="mt-1 text-sm text-slate">You’re <span class="font-extrabold text-forest">{$xpToNextLevel} XP</span> from level {$level + 1}. One lesson will do it.</p>
		</div>
		<div class="flex flex-wrap gap-2">
			<a href="/app/quiz" class="btn btn-ghost btn-sm"><Target size={15} /> Daily quiz</a>
			<a href={`/app/learn/${currentLesson.id}`} class="btn btn-primary btn-sm"><Zap size={15} /> Continue learning</a>
		</div>
	</div>

	<!-- Continue hero + stats -->
	<div class="grid gap-3.5 xl:grid-cols-[1.35fr_1fr]">
		<div class="relative overflow-hidden rounded-[2rem] bg-[#0b2b1f] p-5 text-white sm:p-6">
			<div class="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-lime/15 blur-2xl"></div>
			<div class="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-gold/10 blur-2xl"></div>
			<div class="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
				<div class="max-w-lg">
					<div class="flex flex-wrap items-center gap-2">
						<span class="pill pill-dark text-[0.58rem]">Continue where you left off</span>
						<span class="pill pill-dark text-[0.58rem]">{currentCourse.emoji} {currentCourse.title}</span>
					</div>
					<h2 class="mt-3 display text-2xl font-semibold leading-tight sm:text-3xl">{currentLesson.title}</h2>
					<p class="mt-1.5 text-sm leading-relaxed text-white/60">{currentLesson.objective}</p>
					<div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.7rem] font-bold text-white/55">
						<span class="flex items-center gap-1"><Clock size={13} /> {currentLesson.minutes} min</span>
						<span class="flex items-center gap-1"><Zap size={13} /> +{currentLesson.xp} XP</span>
						<span class="flex items-center gap-1"><BookOpen size={13} /> {currentModule?.title}</span>
					</div>
					<div class="mt-4 flex flex-wrap gap-2">
						<a href={`/app/learn/${currentLesson.id}`} class="btn btn-lime btn-sm">Resume lesson <ArrowRight size={15} /></a>
						<a href={`/app/subjects/${currentCourse.subjectId}`} class="btn btn-white btn-sm">Course overview</a>
					</div>
				</div>
				<div class="flex shrink-0 items-center gap-3 sm:flex-col sm:gap-1">
					<ProgressRing value={courseProgress} size={108} stroke={10} color="#c9f26b" track="rgba(255,255,255,0.14)" sublabel="course" />
					<p class="text-[0.62rem] font-bold text-white/45">{courseProgress}% complete</p>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-3">
			<StatCard label="Total XP" value={$progress.xp.toLocaleString()} emoji="⚡" tone="bg-[#fff4d2]" trend="+18%" sub={`${$progress.dailyXp} earned today`} />
			<StatCard label="Level" value={`${$level} · ${$rankTitle}`} emoji="🚀" tone="bg-[#e9fbf1]" trend="+1" sub="500 XP per level" />
			<StatCard label="Accuracy" value={`${accuracyPct}%`} emoji="🎯" tone="bg-[#eaf8ff]" trend="+3%" sub={`${$progress.questionsAnswered} answers`} />
			<StatCard label="Class rank" value={`#${myRank}`} emoji="🏆" tone="bg-[#fff1e6]" trend="+1" sub="of 32 learners" />
		</div>
	</div>

	<div class="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
		<div class="space-y-4">
			<!-- Chart + mastery -->
			<div class="grid gap-3.5 sm:grid-cols-[1.12fr_0.88fr]">
				<div class="card p-4 sm:p-5">
					<div class="flex items-start justify-between">
						<div>
							<h3 class="display text-base font-semibold">Learning momentum</h3>
							<p class="text-[0.68rem] text-slate">XP earned over the last 7 days</p>
						</div>
						<span class="pill text-[0.6rem]">+18% this week</span>
					</div>
					<div class="mt-4"><BarChart data={weeklyXp} height={150} color="#10b981" accent="#c9f26b" showValues /></div>
					<div class="mt-3 grid grid-cols-3 gap-2 border-t border-[#eee9dc] pt-3">
						{#each [{ l: 'Minutes', v: `${$progress.minutesLearned}` }, { l: 'Games', v: `${$progress.gamesPlayed}` }, { l: 'Quizzes', v: `${$progress.quizzesPlayed}` }] as m}
							<div><p class="display text-base font-semibold">{m.v}</p><p class="text-[0.58rem] font-bold uppercase tracking-wider text-slate">{m.l}</p></div>
						{/each}
					</div>
				</div>
				<div class="card p-4 sm:p-5">
					<div class="flex items-center justify-between">
						<h3 class="display text-base font-semibold">Skill mastery</h3>
						<a href="/app/profile" class="text-[0.64rem] font-extrabold text-forest">View all</a>
					</div>
					<div class="mt-3 space-y-2.5">
						{#each [{ label: 'Science', value: 91 }, { label: 'Maths', value: 88 }, { label: 'English', value: 84 }, { label: 'Coding', value: 76 }, { label: 'Money', value: 68 }] as item}
							<ProgressBar label={item.label} value={item.value} />
						{/each}
					</div>
					<div class="mt-3 rounded-xl bg-[#fff8e8] p-2.5">
						<p class="text-[0.66rem] font-bold text-[#7a4f00]">💡 Focus suggestion</p>
						<p class="mt-0.5 text-[0.66rem] leading-snug text-[#7a4f00]/75">Fractions is your lowest skill. Try the 10-minute Fraction Friends lesson.</p>
					</div>
				</div>
			</div>

			<!-- Recommended -->
			<div class="card p-4 sm:p-5">
				<SectionHeader eyebrow="Pick up next" title="Recommended for you" subtitle="Based on your mastery map and recent activity." cta="All subjects" href="/app/subjects" />
				<div class="grid gap-2.5 sm:grid-cols-2">
					{#each recommended as item}
						<a href={`/app/learn/${item.lesson.id}`} class="group flex items-center gap-3 rounded-2xl border border-[#eee9dc] p-3 transition hover:border-[#cfdcc0] hover:bg-[#fafcf5]">
							<span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f4f8ec] text-lg">{item.course.emoji}</span>
							<div class="min-w-0 flex-1">
								<p class="truncate text-[0.8rem] font-extrabold">{item.lesson.title}</p>
								<p class="truncate text-[0.64rem] text-slate">{item.course.title} · {item.lesson.minutes} min</p>
							</div>
							<span class="pill text-[0.56rem]">+{item.lesson.xp} XP</span>
						</a>
					{/each}
				</div>
			</div>

			<!-- Games row -->
			<div class="card p-4 sm:p-5">
				<div class="flex items-center justify-between">
					<div>
						<h3 class="display text-base font-semibold">Quick play</h3>
						<p class="text-[0.68rem] text-slate">Ten minutes. One skill stronger.</p>
					</div>
					<a href="/app/games" class="text-[0.64rem] font-extrabold text-forest">All games</a>
				</div>
				<div class="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
					{#each games.slice(0, 4) as g}
						<a href={`/app/games/${g.slug}`} class="group rounded-2xl border border-[#eee9dc] p-3 transition hover:border-[#cfdcc0]">
							<span class="text-2xl">{g.emoji}</span>
							<p class="mt-2 text-[0.74rem] font-extrabold leading-tight">{g.name}</p>
							<p class="text-[0.6rem] text-slate">{g.skill}</p>
						</a>
					{/each}
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<!-- Quests -->
			<div class="card p-4 sm:p-5">
				<div class="flex items-center justify-between">
					<div>
						<h3 class="display text-base font-semibold">Today’s quests</h3>
						<p class="text-[0.68rem] text-slate">{dailyQuests.filter((q) => q.progress >= q.target).length}/{dailyQuests.length} complete</p>
					</div>
					<a href="/app/quests" class="text-[0.64rem] font-extrabold text-forest">All quests</a>
				</div>
				<div class="mt-1 divide-y divide-[#f0ece0]">
					{#each dailyQuests as quest}
						<QuestRow {quest} claimed={quest.progress < 0} onclaim={() => claim(quest.id, quest.xp, quest.title)} />
					{/each}
				</div>
			</div>

			<!-- Leaderboard -->
			<div class="card p-4 sm:p-5">
				<div class="flex items-center justify-between">
					<h3 class="display text-base font-semibold">Class leaderboard</h3>
					<a href="/app/leaderboard" class="text-[0.64rem] font-extrabold text-forest">View all</a>
				</div>
				<div class="mt-2 space-y-1">
					{#each leaderboard.slice(0, 5) as row, i}
						<div class={`flex items-center gap-2.5 rounded-xl px-2 py-2 ${row.isMe ? 'bg-[#f2fbdf]' : ''}`}>
							<span class={`w-5 text-center text-[0.66rem] font-extrabold ${i === 0 ? 'text-[#a27000]' : 'text-slate'}`}>{i === 0 ? '🥇' : i + 1}</span>
							<Avatar emoji={row.avatar} size={28} ring={false} />
							<div class="min-w-0 flex-1">
								<p class="truncate text-[0.74rem] font-extrabold">{row.name}{row.isMe ? ' · you' : ''}</p>
								<p class="text-[0.58rem] text-slate">{row.grade}</p>
							</div>
							<span class="text-[0.66rem] font-extrabold">{row.xp.toLocaleString()}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Next badge + assignment -->
			<div class="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-1">
				<div class="card p-4">
					<div class="flex items-center justify-between">
						<h3 class="display text-sm font-semibold">Next badge</h3>
						<a href="/app/achievements" class="text-[0.62rem] font-extrabold text-forest">All</a>
					</div>
					<div class="mt-2"><BadgeTile badge={nextBadge} size="sm" /></div>
				</div>
				<div class="card p-4">
					<div class="flex items-center justify-between">
						<h3 class="display text-sm font-semibold">Due soon</h3>
						<span class="pill pill-coral text-[0.56rem]">1 active</span>
					</div>
					<div class="mt-2 rounded-xl bg-[#faf8f0] p-3">
						<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-slate">{assignments[0].subject}</p>
						<p class="mt-0.5 text-[0.8rem] font-extrabold leading-tight">{assignments[0].title}</p>
						<p class="mt-1 flex items-center gap-1 text-[0.64rem] text-slate"><Clock size={11} /> {assignments[0].due}</p>
						<a href="/app/subjects/mathematics" class="mt-2 inline-flex items-center gap-1 text-[0.66rem] font-extrabold text-forest">Start now <ChevronRight size={12} /></a>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Subjects strip -->
	<div class="card p-4 sm:p-5">
		<div class="flex items-center justify-between">
			<div>
				<h3 class="display text-base font-semibold">Your subjects</h3>
				<p class="text-[0.68rem] text-slate">Eight worlds to explore, one step at a time.</p>
			</div>
			<a href="/app/subjects" class="btn btn-ghost btn-sm">Browse all <ArrowRight size={14} /></a>
		</div>
		<div class="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto pb-1">
			{#each subjects as s, i}
				<a href={`/app/subjects/${s.slug}`} class="group flex min-w-[150px] items-center gap-2.5 rounded-2xl border border-[#eee9dc] p-3 transition hover:border-[#cfdcc0]">
					<span class={`grid h-9 w-9 place-items-center rounded-xl ${s.soft} text-lg`}>{s.emoji}</span>
					<div class="min-w-0">
						<p class="truncate text-[0.72rem] font-extrabold">{s.name}</p>
						<div class="mt-1 h-1 w-16 overflow-hidden rounded-full bg-[#ece9dd]"><div class="h-full rounded-full bg-emerald" style={`width:${[72, 64, 81, 48, 55, 62, 40, 58][i]}%`}></div></div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>
