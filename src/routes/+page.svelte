<script lang="ts">
	import {
		ArrowRight,
		BadgeCheck,
		BookOpen,
		Bot,
		Brain,
		Check,
		ChevronDown,
		Clock,
		Flame,
		Gamepad2,
		Globe2,
		LineChart,
		Play,
		Quote,
		ShieldCheck,
		Sparkles,
		Star,
		Smartphone,
		Trophy,
		Users,
		Wand2,
		WifiOff,
		Zap
	} from '@lucide/svelte';
	import LandingNav from '$lib/components/LandingNav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import HeroScene from '$lib/components/HeroScene.svelte';
	import Mascot from '$lib/components/Mascot.svelte';
	import SubjectCard from '$lib/components/SubjectCard.svelte';
	import GameCard from '$lib/components/GameCard.svelte';
	import BarChart from '$lib/components/BarChart.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import { subjects, courses, curricula } from '$lib/data/curriculum';
	import { games } from '$lib/data/games';
	import { faqs, pricingPlans, testimonials, weeklyXp, leaderboard } from '$lib/data/seed';
	import { formatNaira } from '$lib/utils';

	const featuredGames = games.filter((g) => g.featured);
	const featuredCourses = courses.filter((c) => c.featured).slice(0, 3);
	let activeFaq = $state(0);

	const why = [
		{
			icon: Brain,
			title: 'A path that adapts',
			body: 'Every answer, hint and game round feeds a mastery model. Sabify notices the exact skill that needs help and serves the next best activity — not the same worksheet for everyone.',
			tone: 'bg-[#e9fbf1] text-[#0b6b45]'
		},
		{
			icon: Gamepad2,
			title: 'Games with a job',
			body: 'Seven original learning games built around real curriculum skills. Number Nebula trains mental maths, Word Forge builds vocabulary, Type Storm improves typing — and every round earns XP.',
			tone: 'bg-[#f0edff] text-[#4b3bb5]'
		},
		{
			icon: LineChart,
			title: 'Progress you can see',
			body: 'Learners see levels, streaks and badges. Parents get a weekly report in plain English. Teachers get mastery heatmaps and risk alerts before the exam, not after.',
			tone: 'bg-[#eaf8ff] text-[#0a6486]'
		},
		{
			icon: ShieldCheck,
			title: 'Safe by design',
			body: 'No open chat with strangers. AI responses are age-filtered. Parents control screen time. We collect the minimum data needed and never sell it.',
			tone: 'bg-[#fff4d2] text-[#7a4f00]'
		}
	];

	const steps = [
		{ n: '01', title: 'Tell us about you', body: 'Pick your grade, curriculum, interests and how you like to learn. Takes two minutes.' },
		{ n: '02', title: 'Get your learning path', body: 'Sabify builds a weekly plan from your goals, strengths and the skills that need work.' },
		{ n: '03', title: 'Learn, play, repeat', body: 'Short lessons with instant feedback, then games that make the same skill stick.' },
		{ n: '04', title: 'Watch mastery grow', body: 'XP, streaks and badges keep the momentum. Reports show exactly what changed.' }
	];

	const checkItems = [
		'Unlimited lessons across 8 subjects',
		'All 7 learning games and daily quizzes',
		'AI study buddy with hints, not answers',
		'Weekly parent and teacher reports',
		'Works offline on phone, tablet and laptop'
	];
</script>

<svelte:head>
	<title>Sabify — Learn it. Play it. Own it.</title>
	<meta name="description" content="Nigeria's gamified learning universe for kids, youths and students. 8 subjects, 7 learning games, AI study buddy and real progress — from ₦5,000/month." />
</svelte:head>

<LandingNav />

<main>
	<!-- HERO -->
	<section class="mesh-hero grain relative overflow-hidden">
		<div class="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-lime/40 blur-3xl"></div>
		<div class="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-sky/25 blur-3xl"></div>
		<div class="container-page relative grid items-center gap-10 pb-16 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:pb-24 lg:pt-16">
			<div class="fade-up">
				<div class="inline-flex flex-wrap items-center gap-2">
					<span class="pill pill-gold">🇳🇬 Built for Nigeria</span>
					<span class="pill">🏫 NERDC · Common Core · Cambridge</span>
				</div>
				<h1 class="mt-5 display text-[2.7rem] font-semibold leading-[0.98] sm:text-6xl lg:text-[4.4rem]">
					School, but it<br class="hidden sm:block" />
					feels like <span class="relative inline-block">
						<span class="relative z-10">play.</span>
						<span class="absolute inset-x-0 bottom-1 z-0 h-4 -rotate-1 rounded-full bg-lime sm:h-5"></span>
					</span>
				</h1>
				<p class="mt-5 max-w-xl text-base leading-relaxed text-[#3f564b] sm:text-lg">
					Sabify turns the Nigerian curriculum into a personalised adventure. Real lessons, seven learning games, an AI study buddy and progress the whole family can see — for less than a plate of jollof a week.
				</p>
				<div class="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
					<a href="/signup" class="btn btn-primary btn-lg">
						Start learning free
						<ArrowRight size={18} />
					</a>
					<a href="#games" class="btn btn-ghost btn-lg">
						<Play size={16} fill="currentColor" />
						See the games
					</a>
				</div>
				<div class="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
					<div class="flex -space-x-2">
						{#each ['🦊', '🦁', '🐼', '🦋', '🐯'] as face}
							<span class="grid h-9 w-9 place-items-center rounded-full bg-white text-lg ring-2 ring-[#fbf8ef]">{face}</span>
						{/each}
					</div>
					<div>
						<div class="flex items-center gap-1 text-[#f5a300]">
							{#each Array(5) as _}<Star size={13} fill="currentColor" />{/each}
							<span class="ml-1 text-xs font-extrabold text-ink">4.9/5</span>
						</div>
						<p class="text-xs font-semibold text-slate">Loved by 12,480 learners across 84 schools</p>
					</div>
				</div>
				<div class="mt-7 grid max-w-lg grid-cols-3 gap-3">
					<div class="rounded-2xl border border-white/70 bg-white/55 p-3 backdrop-blur">
						<p class="display text-xl font-semibold">8</p>
						<p class="text-[0.64rem] font-bold uppercase tracking-wider text-slate">Subjects</p>
					</div>
					<div class="rounded-2xl border border-white/70 bg-white/55 p-3 backdrop-blur">
						<p class="display text-xl font-semibold">7</p>
						<p class="text-[0.64rem] font-bold uppercase tracking-wider text-slate">Learning games</p>
					</div>
					<div class="rounded-2xl border border-white/70 bg-white/55 p-3 backdrop-blur">
						<p class="display text-xl font-semibold">₦5k</p>
						<p class="text-[0.64rem] font-bold uppercase tracking-wider text-slate">Per month</p>
					</div>
				</div>
			</div>

			<div class="relative mx-auto w-full max-w-[540px]">
				<div class="relative aspect-square overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/40 shadow-lift backdrop-blur-sm sm:aspect-[1/1.02]">
					<div class="absolute inset-0 bg-gradient-to-br from-[#f6ffe9]/70 via-white/20 to-[#e8f8ff]/60"></div>
					<HeroScene />
					<div class="absolute left-4 top-4 rounded-2xl border border-white/80 bg-white/85 px-3 py-2 shadow-soft backdrop-blur">
						<p class="text-[0.58rem] font-extrabold uppercase tracking-wider text-slate">Today’s quest</p>
						<p class="display text-sm font-semibold">Place value party 🎉</p>
					</div>
					<div class="floaty absolute -left-2 bottom-24 rounded-2xl border border-white/80 bg-white/90 px-3.5 py-2.5 shadow-lift sm:-left-6">
						<div class="flex items-center gap-2">
							<span class="grid h-8 w-8 place-items-center rounded-full bg-[#fff1e6] text-[#a23c17]"><Flame size={16} /></span>
							<div>
								<p class="text-[0.58rem] font-bold uppercase tracking-wider text-slate">Streak</p>
								<p class="display text-sm font-semibold">12 days 🔥</p>
							</div>
						</div>
					</div>
					<div class="floaty-delay absolute -right-2 top-28 rounded-2xl border border-white/80 bg-white/90 px-3.5 py-2.5 shadow-lift sm:-right-5">
						<p class="text-[0.58rem] font-extrabold uppercase tracking-wider text-slate">Level up</p>
						<p class="display text-sm font-semibold">Trailblazer · Lvl 9</p>
						<div class="mt-1.5 h-1.5 w-28 overflow-hidden rounded-full bg-[#e9e6da]">
							<div class="h-full w-[72%] rounded-full bg-emerald"></div>
						</div>
					</div>
					<div class="absolute -bottom-1 right-4 rounded-2xl border border-white/80 bg-[#0b2b1f] px-3.5 py-2.5 text-white shadow-lift sm:right-8">
						<p class="text-[0.58rem] font-bold uppercase tracking-wider text-white/50">Daily XP</p>
						<p class="display text-lg font-semibold text-lime">+650 XP</p>
					</div>
				</div>
			</div>
		</div>

		<div class="relative border-y border-[#dfe7d4] bg-white/55 py-3 backdrop-blur">
			<div class="flex overflow-hidden">
				<div class="flex shrink-0 animate-[marquee_38s_linear_infinite] items-center gap-8 pr-8">
					{#each [...subjects, ...subjects] as s}
						<span class="flex shrink-0 items-center gap-2 text-xs font-extrabold text-[#3f564b]">
							<span class="text-base">{s.emoji}</span>{s.name}<span class="text-emerald">✦</span>
						</span>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- WHY -->
	<section id="why" class="section">
		<div class="container-page">
			<div class="mx-auto max-w-3xl text-center">
				<p class="eyebrow justify-center">Why Sabify</p>
				<h2 class="mt-3 display text-3xl font-semibold sm:text-5xl">The dopamine of games.<br />The rigour of a great school.</h2>
				<p class="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate sm:text-base">
					Most learning apps bolt a points counter onto a textbook. Sabify starts with how children actually learn — short bursts, instant feedback, visible progress and a reason to come back tomorrow.
				</p>
			</div>
			<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each why as item}
					{@const Icon = item.icon}
					<div class="card card-hover p-5">
						<span class={`grid h-11 w-11 place-items-center rounded-2xl ${item.tone}`}><Icon size={21} /></span>
						<h3 class="mt-4 display text-lg font-semibold leading-tight">{item.title}</h3>
						<p class="mt-2 text-[0.82rem] leading-relaxed text-slate">{item.body}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- SUBJECTS -->
	<section id="subjects" class="section bg-[#f4f1e4]">
		<div class="container-page">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div class="max-w-2xl">
					<p class="eyebrow">The learning universe</p>
					<h2 class="mt-3 display text-3xl font-semibold sm:text-4xl">Eight subjects. One connected adventure.</h2>
					<p class="mt-3 text-sm leading-relaxed text-slate">Every course is built from small, mastery-based lessons. Switch between the Nigerian curriculum and international standards without losing progress.</p>
				</div>
				<a href="/app/subjects" class="btn btn-primary btn-sm self-start">Explore all subjects <ArrowRight size={15} /></a>
			</div>
			<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each subjects as subject, i}
					<SubjectCard {subject} progress={[72, 64, 81, 48, 55, 62, 40, 58][i]} href={`/app/subjects/${subject.slug}`} />
				{/each}
			</div>

			<div class="mt-8 grid gap-4 lg:grid-cols-3">
				{#each featuredCourses as c}
					<div class="card p-5">
						<div class="flex items-start justify-between">
							<span class="text-3xl">{c.emoji}</span>
							<span class="pill pill-sky text-[0.6rem]">{c.level}</span>
						</div>
						<h3 class="mt-3 display text-lg font-semibold">{c.title}</h3>
						<p class="mt-1 text-xs leading-relaxed text-slate">{c.summary}</p>
						<div class="mt-4 flex flex-wrap gap-1.5">
							{#each c.skills.slice(0, 3) as skill}<span class="chip text-[0.64rem]">{skill}</span>{/each}
						</div>
						<a href={`/app/subjects/${c.subjectId}`} class="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-forest">Open course <ArrowRight size={13} /></a>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- GAMES -->
	<section id="games" class="section relative overflow-hidden bg-[#0b2b1f] text-white">
		<div class="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-lime/10 blur-3xl"></div>
		<div class="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl"></div>
		<div class="container-page relative">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div class="max-w-2xl">
					<p class="eyebrow !text-lime">The arcade</p>
					<h2 class="mt-3 display text-3xl font-semibold sm:text-4xl">Seven games. Zero wasted screen time.</h2>
					<p class="mt-3 text-sm leading-relaxed text-white/60">Each game is tied to a real skill and feeds your mastery map. Play for ten minutes and Sabify knows exactly what to teach next.</p>
				</div>
				<a href="/app/games" class="btn btn-lime btn-sm self-start">Enter the arcade <ArrowRight size={15} /></a>
			</div>
			<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each featuredGames as game}
					<GameCard {game} href={`/app/games/${game.slug}`} />
				{/each}
			</div>
			<div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{#each games.filter((g) => !g.featured) as game}
					<a href={`/app/games/${game.slug}`} class="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 transition hover:border-lime/40 hover:bg-white/[0.08]">
						<span class="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-xl">{game.emoji}</span>
						<div class="min-w-0 flex-1">
							<p class="text-sm font-extrabold">{game.name}</p>
							<p class="truncate text-[0.66rem] text-white/50">{game.skill}</p>
						</div>
						<ArrowRight size={15} class="text-white/35 transition group-hover:text-lime" />
					</a>
				{/each}
				<div class="flex items-center gap-3 rounded-2xl border border-dashed border-white/15 p-3.5">
					<span class="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-xl">🏆</span>
					<div><p class="text-sm font-extrabold">Weekly arena</p><p class="text-[0.66rem] text-white/50">Compete with your class</p></div>
				</div>
			</div>
		</div>
	</section>

	<!-- HOW IT WORKS / DASHBOARD PREVIEW -->
	<section class="section">
		<div class="container-page">
			<div class="mx-auto max-w-2xl text-center">
				<p class="eyebrow justify-center">How it works</p>
				<h2 class="mt-3 display text-3xl font-semibold sm:text-4xl">Two minutes to set up.<br />A habit that lasts.</h2>
			</div>
			<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each steps as step}
					<div class="card relative p-5">
						<span class="display text-3xl font-semibold text-[#dfe7d4]">{step.n}</span>
						<h3 class="mt-3 display text-base font-semibold">{step.title}</h3>
						<p class="mt-1.5 text-xs leading-relaxed text-slate">{step.body}</p>
					</div>
				{/each}
			</div>

			<div class="mt-12 overflow-hidden rounded-[2rem] border border-[#e3ddca] bg-white shadow-lift">
				<div class="flex items-center justify-between border-b border-[#eee9dc] px-4 py-3 sm:px-6">
					<div class="flex items-center gap-2">
						<span class="h-2.5 w-2.5 rounded-full bg-[#ff6b5e]"></span>
						<span class="h-2.5 w-2.5 rounded-full bg-[#ffc53d]"></span>
						<span class="h-2.5 w-2.5 rounded-full bg-[#10b981]"></span>
						<span class="ml-3 text-[0.62rem] font-bold text-slate">sabify.ng/app</span>
					</div>
					<span class="pill text-[0.58rem]">Parent preview</span>
				</div>
				<div class="grid gap-4 p-4 sm:p-6 lg:grid-cols-[1.5fr_1fr]">
					<div>
						<div class="flex flex-wrap items-center justify-between gap-3">
							<div>
								<p class="text-[0.62rem] font-extrabold uppercase tracking-wider text-slate">Monday, 24 November</p>
								<h3 class="display text-xl font-semibold">Good morning, Ada 👋</h3>
								<p class="text-xs text-slate">You’re 65 XP from today’s goal. Keep the streak alive.</p>
							</div>
							<div class="flex items-center gap-2">
								<span class="pill pill-gold text-[0.6rem]"><Flame size={12} /> 12-day streak</span>
								<span class="pill text-[0.6rem]"><Trophy size={12} /> #3 in class</span>
							</div>
						</div>
						<div class="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
							{#each [{ l: 'Total XP', v: '4,120', e: '⚡' }, { l: 'Level', v: '9', e: '🚀' }, { l: 'Accuracy', v: '87%', e: '🎯' }, { l: 'Lessons', v: '28', e: '📚' }] as s}
								<div class="rounded-2xl bg-[#f7f5ec] p-3">
									<p class="text-base">{s.e}</p>
									<p class="mt-1 display text-lg font-semibold leading-none">{s.v}</p>
									<p class="mt-0.5 text-[0.58rem] font-bold uppercase tracking-wider text-slate">{s.l}</p>
								</div>
							{/each}
						</div>
						<div class="mt-4 grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
							<div class="rounded-2xl border border-[#eee9dc] p-3.5">
								<div class="flex items-center justify-between">
									<p class="text-xs font-extrabold">This week’s XP</p>
									<span class="pill text-[0.56rem]">+18% vs last week</span>
								</div>
								<BarChart data={weeklyXp} height={120} color="#10b981" accent="#c9f26b" />
							</div>
							<div class="rounded-2xl border border-[#eee9dc] p-3.5">
								<p class="text-xs font-extrabold">Subject mastery</p>
								<div class="mt-3 space-y-2.5">
									{#each [{ s: 'Science', v: 91 }, { s: 'Maths', v: 88 }, { s: 'English', v: 84 }, { s: 'Coding', v: 76 }] as m}
										<ProgressBar label={m.s} value={m.v} />
									{/each}
								</div>
							</div>
						</div>
					</div>
					<div class="space-y-3">
						<div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#e9ffc0] to-[#bef264] p-4">
							<div class="flex items-center justify-between">
								<div>
									<p class="text-[0.58rem] font-extrabold uppercase tracking-wider text-[#3f564b]">AI study buddy</p>
									<p class="display mt-1 text-lg font-semibold leading-tight">“Why is the sky blue?”</p>
									<p class="mt-1 text-[0.68rem] leading-snug text-[#3f564b]">Let’s find out with a quick experiment…</p>
								</div>
								<span class="text-4xl">🪄</span>
							</div>
							<a href="/app/tutor" class="mt-3 inline-flex items-center gap-1 text-[0.68rem] font-extrabold text-forest">Ask Sabi <ArrowRight size={12} /></a>
						</div>
						<div class="rounded-2xl border border-[#eee9dc] p-4">
							<div class="flex items-center justify-between">
								<p class="text-xs font-extrabold">Today’s quests</p>
								<span class="pill pill-gold text-[0.55rem]">3 left</span>
							</div>
							<div class="mt-2 divide-y divide-[#f0ece0]">
								{#each [{ t: 'Complete 1 lesson', xp: 80, done: true }, { t: 'Score 80%+ in a quiz', xp: 60, done: false }, { t: 'Play Number Nebula', xp: 50, done: false }] as q}
									<div class="flex items-center gap-2 py-2.5">
										<span class={`grid h-6 w-6 place-items-center rounded-full ${q.done ? 'bg-[#e9fbf1] text-[#0b6b45]' : 'bg-[#f1eee3] text-slate'}`}>
											{#if q.done}<Check size={12} />{:else}<Zap size={11} />{/if}
										</span>
										<p class="flex-1 text-[0.72rem] font-bold">{q.t}</p>
										<span class="text-[0.6rem] font-extrabold text-slate">+{q.xp}</span>
									</div>
								{/each}
							</div>
						</div>
						<div class="rounded-2xl bg-[#0b2b1f] p-4 text-white">
							<div class="flex items-center gap-2">
								<span class="text-2xl">🏅</span>
								<div>
									<p class="text-[0.58rem] font-bold uppercase tracking-wider text-white/50">Next badge</p>
									<p class="text-xs font-extrabold">Unstoppable · 30-day streak</p>
								</div>
							</div>
							<div class="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
								<div class="h-full w-[40%] rounded-full bg-lime"></div>
							</div>
							<p class="mt-1 text-[0.58rem] text-white/45">12 / 30 days</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- AI TUTOR -->
	<section class="section bg-[#eef6df]">
		<div class="container-page grid items-center gap-10 lg:grid-cols-2">
			<div>
				<p class="eyebrow">Meet Sabi</p>
				<h2 class="mt-3 display text-3xl font-semibold sm:text-4xl">A patient tutor that never gives up on you.</h2>
				<p class="mt-4 text-sm leading-relaxed text-slate">
					Sabi asks questions, gives hints and explains ideas in three different ways until one clicks. It is not a homework answer machine — it is a thinking coach.
				</p>
				<div class="mt-6 space-y-3">
					{#each [
						{ icon: Brain, t: 'Socratic by default', d: 'Guides with hints and questions before revealing an answer.' },
						{ icon: ShieldCheck, t: 'Age-appropriate', d: 'Filtered topics and language for every age band.' },
						{ icon: Globe2, t: 'Speaks your context', d: 'Examples with Naira, Nigerian places and everyday life.' }
					] as f}
						{@const Icon = f.icon}
						<div class="flex gap-3">
							<span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#0b6b45] shadow-sm"><Icon size={17} /></span>
							<div><p class="text-sm font-extrabold">{f.t}</p><p class="text-xs text-slate">{f.d}</p></div>
						</div>
					{/each}
				</div>
				<a href="/app/tutor" class="btn btn-primary mt-7">Try the AI study buddy <ArrowRight size={16} /></a>
			</div>
			<div class="relative mx-auto w-full max-w-md">
				<div class="absolute -right-2 -top-8 hidden sm:block"><Mascot size={90} expression="wink" float /></div>
				<div class="card overflow-hidden">
					<div class="flex items-center gap-2.5 border-b border-[#eee9dc] bg-white px-4 py-3">
						<span class="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-lime to-[#83e0b0] text-lg">🪄</span>
						<div>
							<p class="text-sm font-extrabold leading-tight">Sabi</p>
							<p class="flex items-center gap-1 text-[0.62rem] font-bold text-[#0b6b45]"><span class="h-1.5 w-1.5 rounded-full bg-emerald"></span> Online · age 11 mode</p>
						</div>
					</div>
					<div class="space-y-3 bg-[#fbf8ef] p-4">
						<div class="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-forest px-3.5 py-2.5 text-xs leading-relaxed text-white">
							Why does the sky look blue but sunsets look orange?
						</div>
						<div class="w-fit max-w-[90%] rounded-2xl rounded-bl-md border border-[#e5e0d1] bg-white px-3.5 py-2.5 text-xs leading-relaxed">
							Great question! Sunlight looks white, but it is actually a mix of colours. When sunlight hits tiny air particles, blue light scatters the most — so blue reaches your eyes from every direction.
							<div class="mt-2 rounded-xl bg-[#f4f8ec] p-2.5">
								<p class="font-extrabold text-[#0b6b45]">Try this thought experiment 🧪</p>
								<p class="mt-0.5 text-[0.68rem] text-slate">At sunset, light travels through more air. The blue scatters away before it reaches you, leaving reds and oranges.</p>
							</div>
						</div>
						<div class="w-fit max-w-[90%] rounded-2xl rounded-bl-md border border-[#e5e0d1] bg-white px-3.5 py-2.5 text-xs leading-relaxed">
							Now you try: why would the sky look different on Mars?
						</div>
						<div class="flex items-center gap-1.5 pl-1">
							<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate/40"></span>
							<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate/40 [animation-delay:120ms]"></span>
							<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate/40 [animation-delay:240ms]"></span>
						</div>
					</div>
					<div class="flex items-center gap-2 border-t border-[#eee9dc] bg-white p-3">
						<div class="flex-1 rounded-full bg-[#f4f2e8] px-3 py-2 text-[0.68rem] text-slate">Ask a follow-up question…</div>
						<span class="grid h-8 w-8 place-items-center rounded-full bg-forest text-white"><ArrowRight size={14} /></span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- CURRICULUM -->
	<section id="curriculum" class="section">
		<div class="container-page">
			<div class="mx-auto max-w-2xl text-center">
				<p class="eyebrow justify-center">One learner, many curricula</p>
				<h2 class="mt-3 display text-3xl font-semibold sm:text-4xl">Rooted in Nigeria. Ready for the world.</h2>
				<p class="mt-3 text-sm leading-relaxed text-slate">Switch standards at any time. Sabify maps skills across frameworks so nothing is repeated and nothing is missed.</p>
			</div>
			<div class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{#each curricula as c}
					<div class="card flex gap-3 p-4">
						<span class="text-2xl">{c.flag}</span>
						<div>
							<p class="text-sm font-extrabold leading-tight">{c.name}</p>
							<p class="mt-0.5 text-[0.66rem] font-semibold text-slate">{c.country} · {c.subjects.length} subject maps</p>
							<p class="mt-1.5 text-[0.7rem] leading-snug text-slate">{c.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- FOR SCHOOLS -->
	<section id="schools" class="section bg-[#0b2b1f] text-white">
		<div class="container-page grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
			<div>
				<p class="eyebrow !text-lime">For schools & teachers</p>
				<h2 class="mt-3 display text-3xl font-semibold sm:text-4xl">See the whole class. Reach the learner who needs you.</h2>
				<p class="mt-4 text-sm leading-relaxed text-white/60">
					Assign work in seconds, watch mastery build in real time and get a clear early-warning list of learners who are falling behind. Content Studio lets teachers turn any topic into a quiz or game challenge.
				</p>
				<div class="mt-6 grid grid-cols-2 gap-3">
					{#each [{ v: '84', l: 'Schools onboard' }, { v: '640', l: 'Active teachers' }, { v: '32', l: 'Avg. class size' }, { v: '+23%', l: 'Mastery lift' }] as s}
						<div class="rounded-2xl border border-white/10 bg-white/[0.05] p-3.5">
							<p class="display text-2xl font-semibold text-lime">{s.v}</p>
							<p class="text-[0.64rem] font-bold uppercase tracking-wider text-white/45">{s.l}</p>
						</div>
					{/each}
				</div>
				<div class="mt-6 flex flex-col gap-2 sm:flex-row">
					<a href="/teacher" class="btn btn-lime">Open teacher demo <ArrowRight size={16} /></a>
					<a href="mailto:schools@sabify.ng" class="btn btn-white">Book a school tour</a>
				</div>
			</div>
			<div class="rounded-[2rem] border border-white/10 bg-white/[0.06] p-3.5 backdrop-blur">
				<div class="rounded-[1.5rem] bg-[#fbf8ef] p-4 text-ink">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-slate">JSS 2A · Mathematics</p>
							<h3 class="display text-lg font-semibold">Fractions checkpoint</h3>
						</div>
						<span class="pill text-[0.58rem]">Live</span>
					</div>
					<div class="mt-3 grid grid-cols-3 gap-2">
						{#each [{ l: 'Submitted', v: '24/32' }, { l: 'Class avg.', v: '78%' }, { l: 'Need help', v: '4' }] as s}
							<div class="rounded-xl bg-white p-2.5">
								<p class="text-[0.58rem] font-bold uppercase tracking-wider text-slate">{s.l}</p>
								<p class="display text-base font-semibold">{s.v}</p>
							</div>
						{/each}
					</div>
					<div class="mt-3 space-y-1.5">
						{#each [{ n: 'Amara Eze', v: 94, c: '#10b981' }, { n: 'Ada Okafor', v: 88, c: '#10b981' }, { n: 'Tunde Adeyemi', v: 71, c: '#ffc53d' }, { n: 'Ibrahim Musa', v: 42, c: '#ff6b5e' }] as r}
							<div class="flex items-center gap-2 rounded-xl bg-white px-2.5 py-2">
								<span class="w-24 truncate text-[0.68rem] font-bold">{r.n}</span>
								<div class="h-1.5 flex-1 overflow-hidden rounded-full bg-[#ece9dd]"><div class="h-full rounded-full" style={`width:${r.v}%;background:${r.c}`}></div></div>
								<span class="w-7 text-right text-[0.62rem] font-extrabold text-slate">{r.v}%</span>
							</div>
						{/each}
					</div>
					<div class="mt-3 rounded-xl bg-[#fff1ee] p-2.5 text-[0.66rem] font-semibold text-[#a83227]">
						⚠️ 2 learners have not started. Send a nudge?
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- TESTIMONIALS -->
	<section class="section">
		<div class="container-page">
			<div class="mx-auto max-w-2xl text-center">
				<p class="eyebrow justify-center">Real families. Real progress.</p>
				<h2 class="mt-3 display text-3xl font-semibold sm:text-4xl">The results speak louder than the badges.</h2>
			</div>
			<div class="mt-8 grid gap-4 lg:grid-cols-3">
				{#each testimonials as t}
					<figure class="card flex flex-col p-5">
						<Quote size={22} class="text-[#c9f26b]" />
						<blockquote class="mt-3 flex-1 text-sm leading-relaxed text-[#3f564b]">“{t.quote}”</blockquote>
						<figcaption class="mt-4 flex items-center gap-2.5 border-t border-[#eee9dc] pt-3">
							<span class="grid h-9 w-9 place-items-center rounded-full bg-[#f2f7e8] text-lg">{t.avatar}</span>
							<div class="flex-1">
								<p class="text-xs font-extrabold">{t.name}</p>
								<p class="text-[0.64rem] text-slate">{t.role}</p>
							</div>
							<span class="pill pill-gold text-[0.56rem]">{t.stat}</span>
						</figcaption>
					</figure>
				{/each}
			</div>
		</div>
	</section>

	<!-- PRICING PREVIEW -->
	<section class="section bg-[#f4f1e4]">
		<div class="container-page">
			<div class="mx-auto max-w-2xl text-center">
				<p class="eyebrow justify-center">Simple pricing</p>
				<h2 class="mt-3 display text-3xl font-semibold sm:text-4xl">Less than ₦167 a day.</h2>
				<p class="mt-3 text-sm text-slate">One subscription unlocks every subject, every game and every report. No hidden add-ons. Cancel anytime.</p>
			</div>
			<div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{#each pricingPlans as plan}
					<div class={`relative flex flex-col rounded-[1.8rem] border p-5 ${plan.highlight ? 'border-forest bg-[#0b2b1f] text-white shadow-lift lg:-translate-y-2' : 'border-[#e3ddca] bg-white'}`}>
						{#if plan.highlight}
							<span class="absolute -top-3 left-5 rounded-full bg-lime px-3 py-1 text-[0.58rem] font-extrabold uppercase tracking-wider text-ink">Most popular</span>
						{/if}
						<p class="text-[0.62rem] font-extrabold uppercase tracking-wider opacity-60">{plan.name}</p>
						<div class="mt-2 flex items-end gap-1">
							<span class="display text-3xl font-semibold">{plan.price === 0 ? 'Free' : formatNaira(plan.price)}</span>
							<span class={`pb-1 text-[0.64rem] font-bold ${plan.highlight ? 'text-white/50' : 'text-slate'}`}>{plan.price === 0 ? '' : plan.cadence}</span>
						</div>
						<p class={`mt-1 text-[0.72rem] leading-snug ${plan.highlight ? 'text-white/60' : 'text-slate'}`}>{plan.description}</p>
						<ul class="mt-4 flex-1 space-y-2">
							{#each plan.features.slice(0, 5) as f}
								<li class="flex items-start gap-1.5 text-[0.72rem] font-semibold">
									<Check size={13} class={plan.highlight ? 'mt-0.5 shrink-0 text-lime' : 'mt-0.5 shrink-0 text-emerald'} />
									<span class={plan.highlight ? 'text-white/75' : 'text-[#3f564b]'}>{f}</span>
								</li>
							{/each}
						</ul>
						<a href={plan.id === 'school' ? '/teacher' : '/signup'} class={`btn mt-5 ${plan.highlight ? 'btn-lime' : 'btn-ghost'} btn-sm`}>{plan.cta}</a>
					</div>
				{/each}
			</div>
			<p class="mt-5 text-center text-xs text-slate">All plans include the ₦5,000/month Family subscription option. School pricing is per learner, billed termly or annually.</p>
		</div>
	</section>

	<!-- FAQ -->
	<section class="section">
		<div class="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
			<div>
				<p class="eyebrow">Questions, answered</p>
				<h2 class="mt-3 display text-3xl font-semibold sm:text-4xl">Everything you might be wondering.</h2>
				<p class="mt-3 text-sm leading-relaxed text-slate">Still curious? Email <a class="font-bold text-forest underline" href="mailto:hello@sabify.ng">hello@sabify.ng</a> and a human will reply within one working day.</p>
				<div class="mt-6 flex items-center gap-2.5 rounded-2xl bg-[#eef6df] p-3.5">
					<Mascot size={54} expression="think" />
					<p class="text-xs font-semibold leading-snug text-[#3f564b]">“No question is too small. That’s literally our whole philosophy.”</p>
				</div>
			</div>
			<div class="space-y-2.5">
				{#each faqs as faq, i}
					<div class={`card overflow-hidden transition ${activeFaq === i ? 'border-[#c9d7b8]' : ''}`}>
						<button class="flex w-full items-center justify-between gap-4 px-4 py-4 text-left" onclick={() => (activeFaq = activeFaq === i ? -1 : i)} aria-expanded={activeFaq === i}>
							<span class="text-sm font-extrabold leading-snug">{faq.q}</span>
							<ChevronDown size={17} class={`shrink-0 text-slate transition ${activeFaq === i ? 'rotate-180' : ''}`} />
						</button>
						{#if activeFaq === i}
							<p class="px-4 pb-4 text-xs leading-relaxed text-slate">{faq.a}</p>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- FINAL CTA -->
	<section class="pb-16">
		<div class="container-page">
			<div class="relative overflow-hidden rounded-[2.5rem] bg-[#0b2b1f] px-6 py-12 text-white sm:px-10 lg:px-14">
				<div class="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full bg-lime/20 blur-3xl"></div>
				<div class="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-gold/15 blur-3xl"></div>
				<div class="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
					<div>
						<p class="eyebrow !text-lime">Your first quest starts now</p>
						<h2 class="mt-3 display text-3xl font-semibold leading-[1.02] sm:text-5xl">Give them a reason<br />to love learning.</h2>
						<p class="mt-4 max-w-lg text-sm leading-relaxed text-white/60">Start free, no card needed. Unlock everything for ₦5,000/month when you’re ready. Their future self will thank you.</p>
						<div class="mt-6 flex flex-col gap-2.5 sm:flex-row">
							<a href="/signup" class="btn btn-lime btn-lg">Create a free account <ArrowRight size={18} /></a>
							<a href="/app" class="btn btn-white btn-lg">Explore the demo</a>
						</div>
						<div class="mt-5 flex flex-wrap gap-4 text-[0.68rem] font-bold text-white/45">
							<span class="flex items-center gap-1"><BadgeCheck size={13} /> No card required</span>
							<span class="flex items-center gap-1"><Smartphone size={13} /> Works on any phone</span>
							<span class="flex items-center gap-1"><WifiOff size={13} /> Offline-ready</span>
						</div>
					</div>
					<div class="hidden justify-center lg:flex">
						<div class="relative">
							<Mascot size={210} expression="cheer" float />
							<span class="absolute -left-10 top-8 rounded-2xl bg-white/10 px-3 py-2 text-[0.66rem] font-extrabold backdrop-blur">+250 XP</span>
							<span class="absolute -right-8 bottom-10 rounded-2xl bg-gold px-3 py-2 text-[0.66rem] font-extrabold text-ink">Level up!</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>

<Footer />
