<script lang="ts">
	import { ArrowRight, Bell, BookOpen, Check, ChevronRight, Clock, Flame, Mail, Plus, ShieldCheck, Sparkles, Target, TrendingUp, Users, Zap } from '@lucide/svelte';
	import { parentChildren, parentWeekly } from '$lib/data/seed';
	import { toast } from '$lib/stores/toast';
	import Avatar from '$lib/components/Avatar.svelte';
	import BarChart from '$lib/components/BarChart.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import Mascot from '$lib/components/Mascot.svelte';

	let selected = $state('c1');
	let child = $derived(parentChildren.find((c) => c.id === selected) ?? parentChildren[0]);
	let totalMinutes = $derived(parentChildren.reduce((s, c) => s + c.weeklyMinutes, 0));
</script>

<svelte:head><title>Parent overview · Sabify</title></svelte:head>

<div class="space-y-5">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="text-[0.66rem] font-extrabold uppercase tracking-[0.14em] text-slate">Family dashboard · {new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
			<h1 class="mt-1 display text-2xl font-semibold sm:text-3xl">Good morning, Mrs. Okafor 👋</h1>
			<p class="mt-1 text-sm text-slate">Here is how Ada and Chidi are doing this week.</p>
		</div>
		<div class="flex gap-2">
			<a href="/parent/reports" class="btn btn-ghost btn-sm"><BookOpen size={14} /> Weekly reports</a>
			<button class="btn btn-primary btn-sm" onclick={() => toast('Add-child flow opened', 'info', '➕')}><Plus size={15} /> Add child</button>
		</div>
	</div>

	<div class="grid gap-3 lg:grid-cols-3">
		{#each parentChildren as c}
			<button class={`card card-hover p-4 text-left ${selected === c.id ? 'border-forest ring-2 ring-[#c9f26b]' : ''}`} onclick={() => (selected = c.id)}>
				<div class="flex items-start gap-3">
					<Avatar emoji={c.avatar} size={48} ring />
					<div class="min-w-0 flex-1">
						<p class="display text-base font-semibold">{c.name}</p>
						<p class="text-[0.64rem] text-slate">{c.grade} · {c.plan}</p>
					</div>
					<ProgressRing value={c.accuracy} size={52} stroke={6} sublabel="acc." />
				</div>
				<div class="mt-3 grid grid-cols-3 gap-2">
					<div><p class="text-[0.55rem] font-bold uppercase tracking-wider text-slate">XP</p><p class="display text-sm font-semibold">{c.xp.toLocaleString()}</p></div>
					<div><p class="text-[0.55rem] font-bold uppercase tracking-wider text-slate">Streak</p><p class="display text-sm font-semibold">{c.streak} 🔥</p></div>
					<div><p class="text-[0.55rem] font-bold uppercase tracking-wider text-slate">Minutes</p><p class="display text-sm font-semibold">{c.weeklyMinutes}</p></div>
				</div>
			</button>
		{/each}
		<div class="card border-dashed p-4">
			<div class="flex h-full flex-col items-center justify-center text-center">
				<span class="grid h-10 w-10 place-items-center rounded-full bg-[#f1eee3] text-slate"><Plus size={18} /></span>
				<p class="mt-2 text-sm font-extrabold">Add another child</p>
				<p class="text-[0.62rem] text-slate">Family Plus covers up to 4 learners.</p>
				<a href="/app/subscription" class="mt-1 text-[0.62rem] font-extrabold text-forest">Upgrade plan</a>
			</div>
		</div>
	</div>

	<div class="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<div class="flex flex-wrap items-start justify-between gap-2">
					<div>
						<h2 class="display text-lg font-semibold">{child.name.split(' ')[0]}’s week</h2>
						<p class="text-[0.68rem] text-slate">Learning minutes per day, compared with sibling.</p>
					</div>
					<span class="pill text-[0.58rem]"><Clock size={11} /> {totalMinutes} family minutes</span>
				</div>
				<div class="mt-4 grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
					<div>
						<div class="flex items-end gap-3" style="height:150px">
							{#each parentWeekly as d}
								<div class="flex h-full flex-1 flex-col items-center justify-end gap-1">
									<div class="flex w-full items-end justify-center gap-1">
										<div class="w-2.5 rounded-t bg-[#0d3b2a]" style={`height:${(d.ada / 46) * 110}px`} title={`Ada: ${d.ada} min`}></div>
										<div class="w-2.5 rounded-t bg-[#c9f26b]" style={`height:${(d.chidi / 46) * 110}px`} title={`Chidi: ${d.chidi} min`}></div>
									</div>
									<span class="text-[0.56rem] font-bold text-slate">{d.label}</span>
								</div>
							{/each}
						</div>
						<div class="mt-2 flex justify-center gap-4 text-[0.6rem] font-bold text-slate">
							<span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-[#0d3b2a]"></span> Ada</span>
							<span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-[#c9f26b]"></span> Chidi</span>
						</div>
					</div>
					<div class="space-y-2">
						{#each [{ l: 'Weekly minutes', v: `${child.weeklyMinutes}`, e: '⏱️' }, { l: 'Accuracy', v: `${child.accuracy}%`, e: '🎯' }, { l: 'Top subject', v: child.topSubject, e: '⭐' }, { l: 'Needs support', v: child.needsSupport, e: '💡' }] as s}
							<div class="rounded-xl bg-[#f7f5ec] p-2.5"><p class="text-[0.56rem] font-bold uppercase tracking-wider text-slate">{s.e} {s.l}</p><p class="text-[0.78rem] font-extrabold">{s.v}</p></div>
						{/each}
					</div>
				</div>
			</div>

			<div class="grid gap-3 sm:grid-cols-2">
				<div class="card p-4">
					<div class="flex items-center gap-2"><Target size={16} class="text-[#7a4f00]" /><p class="text-sm font-extrabold">Teacher note</p></div>
					<p class="mt-1.5 text-[0.72rem] leading-relaxed text-slate">“Ada has been brilliant in science discussions. She is still building confidence with equivalent fractions — 10 minutes of practice at home will help.”</p>
					<p class="mt-2 text-[0.62rem] font-extrabold text-[#3f564b]">Mr. Emeka Obi · JSS 2A</p>
					<button class="btn btn-ghost btn-sm mt-2" onclick={() => toast('Reply sent to Mr. Obi', 'success', '✉️')}><Mail size={13} /> Reply</button>
				</div>
				<div class="card p-4">
					<div class="flex items-center gap-2"><ShieldCheck size={16} class="text-[#0b6b45]" /><p class="text-sm font-extrabold">Screen time</p></div>
					<p class="mt-1 text-[0.66rem] text-slate">Daily limit: 45 minutes · used today: 28 minutes</p>
					<div class="progress-track mt-2 h-2"><div class="progress-fill" style="width:62%"></div></div>
					<div class="mt-2 flex items-center justify-between text-[0.62rem] font-bold text-slate"><span>28 min</span><span>45 min</span></div>
					<a href="/parent/children" class="btn btn-ghost btn-sm mt-2 w-full">Adjust limits</a>
				</div>
			</div>

			<div class="card overflow-hidden">
				<div class="flex items-center justify-between border-b border-[#eee9dc] px-4 py-3">
					<h2 class="display text-base font-semibold">Recent achievements</h2>
					<a href="/app/achievements" class="text-[0.64rem] font-extrabold text-forest">See all</a>
				</div>
				<div class="divide-y divide-[#f4f1e6]">
					{#each [{ e: '🏅', t: 'Quiz Ace badge', d: 'Ada scored 100% in a fractions quiz.', time: '2 days ago' }, { e: '🔥', t: '12-day streak', d: 'Ada has learned every day for 12 days.', time: 'Today' }, { e: '🚀', t: 'Level 9 reached', d: 'Chidi unlocked Trailblazer.', time: 'Yesterday' }] as r}
						<div class="flex items-center gap-3 px-4 py-3">
							<span class="grid h-9 w-9 place-items-center rounded-xl bg-[#f4f8ec] text-lg">{r.e}</span>
							<div class="min-w-0 flex-1"><p class="text-[0.74rem] font-extrabold">{r.t}</p><p class="text-[0.62rem] text-slate">{r.d}</p></div>
							<span class="text-[0.58rem] font-bold text-slate">{r.time}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<div class="relative overflow-hidden rounded-[1.75rem] bg-[#0b2b1f] p-4 text-white">
				<div class="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-lime/15 blur-2xl"></div>
				<div class="relative flex items-center gap-2"><Sparkles size={16} class="text-lime" /><p class="text-sm font-extrabold">This week’s insight</p></div>
				<p class="relative mt-2 text-[0.74rem] leading-relaxed text-white/65">{child.name.split(' ')[0]} is strongest in <strong class="text-lime">{child.topSubject}</strong> and improving in accuracy. {child.needsSupport} is the one skill that would unlock the next level. A 10-minute lesson twice this week is enough.</p>
				<div class="relative mt-3 flex flex-wrap gap-1.5">
					<span class="pill pill-dark text-[0.56rem]">+18% XP</span>
					<span class="pill pill-dark text-[0.56rem]">{child.accuracy}% accuracy</span>
					<span class="pill pill-dark text-[0.56rem]">{child.streak}-day streak</span>
				</div>
				<a href={`/app/subjects/${child.needsSupport === 'Fractions' ? 'mathematics' : 'mathematics'}`} class="btn btn-lime btn-sm relative mt-3">Practise {child.needsSupport} <ArrowRight size={13} /></a>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><Bell size={16} class="text-forest" /><p class="text-sm font-extrabold">Family reminders</p></div>
				<div class="mt-2 space-y-2">
					{#each [{ t: 'Fractions assignment due Friday', d: 'Ada · 24/32 submitted', e: '📋' }, { t: 'Weekly report ready', d: 'Sunday summary for both children', e: '📊' }, { t: 'Renewal on 24 Dec', d: 'Family plan · ₦5,000/month', e: '💳' }] as r}
						<div class="flex items-center gap-2.5 rounded-xl bg-[#faf8f0] p-2.5">
							<span class="text-base">{r.e}</span>
							<div class="min-w-0 flex-1"><p class="truncate text-[0.7rem] font-extrabold">{r.t}</p><p class="text-[0.6rem] text-slate">{r.d}</p></div>
						</div>
					{/each}
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<p class="text-sm font-extrabold">Quick controls</p>
				<div class="mt-2 grid gap-1.5">
					{#each [{ l: 'Set screen-time limit', href: '/parent/children', e: '⏱️' }, { l: 'View full report', href: '/parent/reports', e: '📊' }, { l: 'Manage billing', href: '/parent/billing', e: '💳' }, { l: 'Message teacher', href: '/parent/reports', e: '✉️' }] as a}
						<a href={a.href} class="flex items-center gap-2.5 rounded-xl border border-[#eee9dc] px-3 py-2.5 text-[0.72rem] font-bold transition hover:border-[#c9d7b8] hover:bg-[#fafcf5]"><span>{a.e}</span>{a.l}<ChevronRight size={13} class="ml-auto text-slate" /></a>
					{/each}
				</div>
			</div>

			<div class="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#e9ffc0] to-[#c9f26b] p-4">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-extrabold text-[#3f564b]">Family Plus</p>
						<p class="mt-1 text-[0.68rem] leading-snug text-[#3f564b]/80">Add up to 4 learners, get sibling leaderboards and advanced controls.</p>
					</div>
					<Mascot size={58} expression="wink" />
				</div>
				<a href="/app/subscription" class="btn btn-primary btn-sm mt-2">Upgrade for ₦12,000/mo</a>
			</div>
		</div>
	</div>
</div>
