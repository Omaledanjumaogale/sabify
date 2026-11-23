<script lang="ts">
	import { ArrowRight, CalendarDays, Clock, Download, Mail, Star, Target, TrendingUp, Zap } from '@lucide/svelte';
	import { parentChildren, parentWeekly } from '$lib/data/seed';
	import { toast } from '$lib/stores/toast';
	import Avatar from '$lib/components/Avatar.svelte';
	import BarChart from '$lib/components/BarChart.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import Mascot from '$lib/components/Mascot.svelte';
	import LineChart from '$lib/components/LineChart.svelte';

	let childId = $state('c1');
	let week = $state('This week');
	let child = $derived(parentChildren.find((c) => c.id === childId) ?? parentChildren[0]);
	let minutes = parentWeekly.map((d) => ({ label: d.label, value: childId === 'c1' ? d.ada : d.chidi }));
	let total = $derived(minutes.reduce((s, d) => s + d.value, 0));
	let dailyAvg = $derived(Math.round(total / 7));
	let mastery = [
		{ l: 'Science', v: 91 }, { l: 'English', v: 84 }, { l: 'Maths', v: 88 }, { l: 'Coding', v: 76 }, { l: 'Money', v: 68 }
	];

	function emailReport() {
		toast(`Report emailed to okafor.family@example.com`, 'success', '✉️');
	}
</script>

<svelte:head><title>Weekly reports · Sabify for parents</title></svelte:head>

<div class="space-y-5">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">Weekly report</p>
			<h1 class="mt-1 display text-2xl font-semibold sm:text-3xl">Progress, in plain English.</h1>
			<p class="mt-1 text-sm text-slate">What your child learned, where they struggled and what to do next.</p>
		</div>
		<div class="flex flex-wrap gap-2">
			<select class="input !min-h-10 !w-auto !rounded-full !py-2 text-xs font-bold" bind:value={childId} aria-label="Select child">
				{#each parentChildren as c}<option value={c.id}>{c.name}</option>{/each}
			</select>
			<select class="input !min-h-10 !w-auto !rounded-full !py-2 text-xs font-bold" bind:value={week} aria-label="Select week">
				<option>This week</option><option>Last week</option><option>2 weeks ago</option>
			</select>
			<button class="btn btn-ghost btn-sm" onclick={emailReport}><Mail size={14} /> Email</button>
			<button class="btn btn-primary btn-sm" onclick={() => toast('PDF report downloaded', 'success', '📄')}><Download size={14} /> Download PDF</button>
		</div>
	</div>

	<div class="relative overflow-hidden rounded-[2rem] bg-[#0b2b1f] p-5 text-white sm:p-7">
		<div class="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-lime/15 blur-3xl"></div>
		<div class="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
			<div class="flex items-center gap-4">
				<Avatar emoji={child.avatar} size={68} ring ringClass="ring-gold" />
				<div>
					<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-white/40">{child.grade} · Week of 18–24 November</p>
					<h2 class="mt-1 display text-2xl font-semibold">{child.name}</h2>
					<p class="text-sm text-white/55">A strong week. {child.name.split(' ')[0]} learned for {total} minutes and kept a {child.streak}-day streak.</p>
				</div>
			</div>
			<div class="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur">
				<ProgressRing value={child.accuracy} size={80} stroke={7} color="#c9f26b" track="rgba(255,255,255,0.12)" sublabel="accuracy" />
				<div><p class="text-[0.58rem] font-bold uppercase tracking-wider text-white/40">Weekly XP</p><p class="display text-2xl font-semibold text-lime">1,055</p><p class="text-[0.6rem] text-white/45">+18% vs last week</p></div>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
		{#each [{ l: 'Learning time', v: `${total} min`, e: '⏱️', s: `${dailyAvg} min / day` }, { l: 'Lessons finished', v: '6', e: '📚', s: '2 more than last week' }, { l: 'Quiz accuracy', v: `${child.accuracy}%`, e: '🎯', s: 'Above class average' }, { l: 'Streak', v: `${child.streak} days`, e: '🔥', s: 'Best: 18 days' }] as s}
			<div class="card p-4"><span class="text-xl">{s.e}</span><p class="mt-1 display text-2xl font-semibold">{s.v}</p><p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-slate">{s.l}</p><p class="text-[0.6rem] text-slate">{s.s}</p></div>
		{/each}
	</div>

	<div class="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<h2 class="display text-lg font-semibold">Learning minutes</h2>
				<p class="text-[0.68rem] text-slate">How consistently {child.name.split(' ')[0]} showed up this week.</p>
				<div class="mt-4"><BarChart data={minutes} height={160} color="#0d3b2a" accent="#c9f26b" showValues /></div>
				<div class="mt-3 rounded-xl bg-[#f7f5ec] p-3 text-[0.68rem] leading-relaxed text-slate">Most learning happened on <strong>Thursday</strong>. The two quiet days were weekends — a short 10-minute game on Saturday would keep the streak strong.</div>
			</div>

			<div class="card p-4 sm:p-5">
				<h2 class="display text-lg font-semibold">Subject mastery</h2>
				<div class="mt-3 space-y-2.5">
					{#each mastery as m}<ProgressBar label={m.l} value={m.v} />{/each}
				</div>
				<div class="mt-3 flex items-start gap-2 rounded-xl bg-[#fff8e8] p-3">
					<Target size={15} class="mt-0.5 shrink-0 text-[#7a4f00]" />
					<p class="text-[0.68rem] leading-snug text-[#7a4f00]"><strong>Focus for next week:</strong> fractions. {child.name.split(' ')[0]} understands the concept but loses marks when denominators are different. Two 10-minute sessions should make a difference.</p>
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<h2 class="display text-lg font-semibold">Teacher’s comment</h2>
				<div class="mt-3 rounded-2xl bg-[#f7f5ec] p-4">
					<p class="text-sm leading-relaxed text-[#3f564b]">“{child.name.split(' ')[0]} contributed thoughtfully in our science discussion and helped a classmate with the plant experiment. In maths, we are working on comparing fractions. The effort is there — confidence will follow with practice.”</p>
					<div class="mt-3 flex items-center gap-2">
						<span class="grid h-8 w-8 place-items-center rounded-full bg-[#e9fbf1] text-sm">👨🏾‍🏫</span>
						<div><p class="text-[0.68rem] font-extrabold">Mr. Emeka Obi</p><p class="text-[0.6rem] text-slate">JSS 2A · Mathematics & Science</p></div>
					</div>
				</div>
				<button class="btn btn-ghost btn-sm mt-3" onclick={() => toast('Reply sent to teacher', 'success', '✉️')}><Mail size={13} /> Reply to Mr. Obi</button>
			</div>
		</div>

		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<h2 class="display text-base font-semibold">What went well</h2>
				<ul class="mt-2 space-y-2">
					{#each ['Completed the Science Sparks plant lesson with 95%', 'Improved quiz accuracy by 6 points', 'Kept a 12-day learning streak', 'Helped a classmate during group work'] as w}
						<li class="flex items-start gap-2 text-[0.7rem] leading-snug text-[#3f564b]"><span class="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#e9fbf1] text-[#0b6b45]"><Star size={9} /></span>{w}</li>
					{/each}
				</ul>
			</div>

			<div class="card p-4 sm:p-5">
				<h2 class="display text-base font-semibold">What needs support</h2>
				<ul class="mt-2 space-y-2">
					{#each ['Equivalent fractions — 2 of 4 questions missed', 'Two quiet days on the weekend', 'Rushed the last quiz by 4 minutes'] as w}
						<li class="flex items-start gap-2 text-[0.7rem] leading-snug text-[#3f564b]"><span class="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#fff4d2] text-[#7a4f00]">!</span>{w}</li>
					{/each}
				</ul>
			</div>

			<div class="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#e9ffc0] to-[#c9f26b] p-4">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-[#3f564b]">Try this together</p>
						<p class="display mt-1 text-lg font-semibold leading-tight text-ink">A 10-minute fraction game</p>
					</div>
					<Mascot size={58} expression="wink" />
				</div>
				<p class="mt-1 text-[0.68rem] leading-relaxed text-[#3f564b]/80">Play Number Nebula together and let {child.name.split(' ')[0]} explain the answers out loud. Teaching you is the best test of understanding.</p>
				<a href="/app/games/number-nebula" class="btn btn-primary btn-sm mt-2">Open the game <ArrowRight size={12} /></a>
			</div>

			<div class="card p-4">
				<div class="flex items-center gap-2"><CalendarDays size={15} class="text-forest" /><p class="text-sm font-extrabold">Report history</p></div>
				<div class="mt-2 space-y-1.5">
					{#each ['Week of 18–24 Nov', 'Week of 11–17 Nov', 'Week of 4–10 Nov'] as r}
						<button class="flex w-full items-center justify-between rounded-xl bg-[#faf8f0] px-2.5 py-2 text-[0.66rem] font-bold" onclick={() => toast('Older report opened', 'info', '📄')}>
							{r}<span class="text-slate">View</span>
						</button>
					{/each}
				</div>
			</div>

			<div class="card p-4">
				<div class="flex items-center gap-2"><TrendingUp size={15} class="text-[#0b6b45]" /><p class="text-sm font-extrabold">Family trend</p></div>
				<div class="mt-2"><LineChart data={[{ label: 'W1', value: 48 }, { label: 'W2', value: 55 }, { label: 'W3', value: 52 }, { label: 'W4', value: 61 }]} height={90} color="#10b981" /></div>
				<p class="text-[0.62rem] text-slate">Average weekly mastery has risen 13 points this month.</p>
			</div>
		</div>
	</div>
</div>
