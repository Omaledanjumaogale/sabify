<script lang="ts">
	import { ArrowDown, ArrowRight, ArrowUp, BarChart3, Download, TrendingUp, TriangleAlert, Users, Target, Zap } from '@lucide/svelte';
	import { teacherStudents, subjectMastery, classPerformance, weeklyXp } from '$lib/data/seed';
	import BarChart from '$lib/components/BarChart.svelte';
	import LineChart from '$lib/components/LineChart.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import DonutChart from '$lib/components/DonutChart.svelte';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import { toast } from '$lib/stores/toast';

	let range = $state('This month');
	let sorted = $derived([...teacherStudents].sort((a, b) => b.xp - a.xp));
	let gaps = [
		{ skill: 'Equivalent fractions', subject: 'Maths', affected: 6, severity: 'High', trend: -12 },
		{ skill: 'Inference', subject: 'English', affected: 4, severity: 'Medium', trend: 3 },
		{ skill: 'Forces & friction', subject: 'Science', affected: 3, severity: 'Medium', trend: 5 },
		{ skill: 'Variables', subject: 'Coding', affected: 2, severity: 'Low', trend: 8 },
		{ skill: 'Budgeting', subject: 'Money', affected: 2, severity: 'Low', trend: 4 }
	];
	let severityTone: Record<string, string> = { High: 'pill-coral', Medium: 'pill-gold', Low: 'pill-sky' };
	let engagement = [
		{ label: 'W1', value: 64 }, { label: 'W2', value: 72 }, { label: 'W3', value: 69 }, { label: 'W4', value: 81 }, { label: 'W5', value: 86 }
	];
</script>

<svelte:head><title>Analytics · Sabify for teachers</title></svelte:head>

<div class="space-y-5">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">JSS 2A · Greenfield Academy</p>
			<h1 class="mt-1 display text-2xl font-semibold sm:text-3xl">Class analytics</h1>
			<p class="mt-1 text-sm text-slate">Evidence you can act on — not just pretty charts.</p>
		</div>
		<div class="flex gap-2">
			<select class="input !min-h-10 !w-auto !rounded-full !py-2 text-xs font-bold" bind:value={range} aria-label="Date range">
				<option>This week</option><option>This month</option><option>This term</option>
			</select>
			<button class="btn btn-ghost btn-sm" onclick={() => toast('Analytics report exported', 'success', '⬇️')}><Download size={14} /> Export</button>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
		<StatCard label="Avg. mastery" value="74%" emoji="🎯" tone="bg-[#e9fbf1]" trend="+6%" sub="vs last month" />
		<StatCard label="Weekly active" value="88%" emoji="🔥" tone="bg-[#fff1e6]" trend="+4%" sub="28 of 32 learners" />
		<StatCard label="Assignment completion" value="62%" emoji="📋" tone="bg-[#eaf8ff]" trend="+9%" sub="51 submissions" />
		<StatCard label="At-risk learners" value="4" emoji="⚠️" tone="bg-[#fff0ee]" trend="-1" trendUp={false} sub="Down from 5 last week" />
	</div>

	<div class="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<div class="flex flex-wrap items-start justify-between gap-2">
					<div><h2 class="display text-base font-semibold">Engagement trend</h2><p class="text-[0.68rem] text-slate">Average weekly active learners, last 5 weeks</p></div>
					<span class="pill text-[0.58rem]"><TrendingUp size={11} /> +22% since W1</span>
				</div>
				<div class="mt-4"><LineChart data={engagement} height={160} color="#0d3b2a" /></div>
				<div class="mt-3 grid grid-cols-3 gap-2 border-t border-[#eee9dc] pt-3">
					{#each [{ l: 'Peak day', v: 'Friday' }, { l: 'Avg. session', v: '18 min' }, { l: 'Completion', v: '62%' }] as s}
						<div><p class="text-[0.56rem] font-bold uppercase tracking-wider text-slate">{s.l}</p><p class="display text-base font-semibold">{s.v}</p></div>
					{/each}
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center justify-between">
					<div><h2 class="display text-base font-semibold">Skill gaps</h2><p class="text-[0.68rem] text-slate">Where the class needs direct teaching.</p></div>
					<span class="pill pill-coral text-[0.56rem]">{gaps.filter((g) => g.severity === 'High').length} high priority</span>
				</div>
				<div class="mt-3 overflow-x-auto">
					<table class="w-full min-w-[420px] text-left">
						<thead><tr class="text-[0.56rem] uppercase tracking-wider text-slate"><th class="pb-2 font-extrabold">Skill</th><th class="pb-2 font-extrabold">Subject</th><th class="pb-2 font-extrabold">Learners</th><th class="pb-2 font-extrabold">Priority</th><th class="pb-2 text-right font-extrabold">Trend</th></tr></thead>
						<tbody>
							{#each gaps as g}
								<tr class="border-t border-[#f4f1e6]">
									<td class="py-2 text-[0.72rem] font-extrabold">{g.skill}</td>
									<td class="py-2 text-[0.66rem] text-slate">{g.subject}</td>
									<td class="py-2 text-[0.68rem] font-bold">{g.affected}</td>
									<td class="py-2"><span class={`pill text-[0.52rem] ${severityTone[g.severity]}`}>{g.severity}</span></td>
									<td class={`py-2 text-right text-[0.62rem] font-extrabold ${g.trend > 0 ? 'text-[#0b6b45]' : 'text-[#b42318]'}`}>{#if g.trend > 0}<ArrowUp size={11} class="inline" />{:else}<ArrowDown size={11} class="inline" />{/if} {Math.abs(g.trend)}%</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center justify-between">
					<div><h2 class="display text-base font-semibold">Subject mastery</h2><p class="text-[0.68rem] text-slate">Class average by subject</p></div>
					<span class="pill text-[0.56rem]">6 subjects</span>
				</div>
				<div class="mt-3 grid gap-3 sm:grid-cols-2">
					{#each subjectMastery as m}
						<div>
							<ProgressBar label={m.subject} value={m.value} />
						</div>
					{/each}
				</div>
			</div>

			<div class="card overflow-hidden">
				<div class="flex items-center justify-between border-b border-[#eee9dc] px-4 py-3">
					<h2 class="display text-base font-semibold">Learner ranking</h2>
					<a href="/teacher/students" class="text-[0.64rem] font-extrabold text-forest">All learners</a>
				</div>
				<div class="divide-y divide-[#f4f1e6]">
					{#each sorted as s, i}
						<div class="flex items-center gap-2.5 px-4 py-2.5">
							<span class="w-4 text-center text-[0.62rem] font-extrabold text-slate">{i + 1}</span>
							<Avatar emoji={s.avatar} size={28} ring={false} />
							<p class="min-w-0 flex-1 truncate text-[0.74rem] font-extrabold">{s.name}</p>
							<span class="hidden w-20 sm:block"><ProgressBar value={Math.round(s.mastery.reduce((a, m) => a + m.value, 0) / s.mastery.length)} showNumbers={false} /></span>
							<span class="w-14 text-right text-[0.64rem] font-extrabold">{s.xp.toLocaleString()}</span>
							<span class={`pill text-[0.5rem] ${s.risk === 'On track' ? '' : s.risk === 'Watch' ? 'pill-gold' : 'pill-coral'}`}>{s.risk}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<h2 class="display text-base font-semibold">Mastery distribution</h2>
				<div class="mt-4 flex items-center justify-center gap-5">
					<DonutChart data={[
						{ label: 'Exceeding', value: 6, color: '#0b6b45' },
						{ label: 'Meeting', value: 14, color: '#10b981' },
						{ label: 'Approaching', value: 8, color: '#ffc53d' },
						{ label: 'Below', value: 4, color: '#ff6b5e' }
					]} size={130} thickness={18} centerLabel="32" centerSub="learners" />
					<div class="space-y-1.5">
						{#each [{ l: 'Exceeding', c: '#0b6b45', v: 6 }, { l: 'Meeting', c: '#10b981', v: 14 }, { l: 'Approaching', c: '#ffc53d', v: 8 }, { l: 'Below', c: '#ff6b5e', v: 4 }] as d}
							<div class="flex items-center gap-1.5 text-[0.64rem] font-bold"><span class="h-2 w-2 rounded-full" style={`background:${d.c}`}></span>{d.l} <span class="text-slate">{d.v}</span></div>
						{/each}
					</div>
				</div>
			</div>

			<div class="relative overflow-hidden rounded-[1.75rem] bg-[#0b2b1f] p-4 text-white">
				<div class="flex items-center gap-2"><Zap size={16} class="text-lime" /><p class="text-sm font-extrabold">Recommended action</p></div>
				<p class="mt-1.5 text-[0.72rem] leading-relaxed text-white/65">Run a 15-minute worked example on equivalent fractions. Target the 6 high-priority learners first, then pair them with peers for practice.</p>
				<button class="btn btn-lime btn-sm mt-3" onclick={() => toast('Intervention plan created', 'success', '🎯')}>Create intervention plan <ArrowRight size={13} /></button>
			</div>

			<div class="card p-4 sm:p-5">
				<h2 class="display text-base font-semibold">Cohort comparison</h2>
				<div class="mt-2 space-y-2">
					{#each [{ c: 'JSS 2A (you)', v: 74, you: true }, { c: 'JSS 2B', v: 69 }, { c: 'School avg.', v: 66 }, { c: 'National avg.', v: 58 }] as row}
						<div>
							<div class="flex justify-between text-[0.64rem] font-bold"><span class={row.you ? 'text-forest' : ''}>{row.c}</span><span class="text-slate">{row.v}%</span></div>
							<div class="progress-track mt-1 h-2"><div class={`h-full rounded-full ${row.you ? 'bg-forest' : 'bg-[#9fc7af]'}`} style={`width:${row.v}%`}></div></div>
						</div>
					{/each}
				</div>
				<p class="mt-2 text-[0.62rem] text-slate">Your class is 5 points above the school average.</p>
			</div>

			<div class="card p-4 sm:p-5">
				<h2 class="display text-base font-semibold">Engagement by day</h2>
				<div class="mt-3"><BarChart data={classPerformance} height={120} color="#0d3b2a" accent="#c9f26b" /></div>
				<p class="mt-2 text-[0.62rem] text-slate">Friday is the strongest day. Consider moving new concepts earlier in the week.</p>
			</div>

			<div class="card p-4">
				<p class="text-sm font-extrabold">Export & share</p>
				<p class="mt-1 text-[0.66rem] text-slate">Download a PDF summary for parents, or share a live link with school leaders.</p>
				<button class="btn btn-ghost btn-sm mt-2 w-full" onclick={() => toast('PDF report downloaded', 'success', '📄')}><Download size={13} /> Download PDF</button>
				<button class="btn btn-ghost btn-sm mt-1.5 w-full" onclick={() => toast('Share link copied', 'success', '🔗')}>Copy share link</button>
			</div>
		</div>
	</div>
</div>
