<script lang="ts">
	import { Activity, ArrowRight, ArrowUp, BookOpen, CheckCircle2, ChevronRight, CreditCard, Globe2, GraduationCap, Server, ShieldCheck, Sparkles, TrendingUp, Users, Zap } from '@lucide/svelte';
	import { adminMetrics } from '$lib/data/seed';
	import { courses, subjects } from '$lib/data/curriculum';
	import { formatNaira } from '$lib/utils';
	import { toast } from '$lib/stores/toast';
	import BarChart from '$lib/components/BarChart.svelte';
	import DonutChart from '$lib/components/DonutChart.svelte';
	import LineChart from '$lib/components/LineChart.svelte';
	import StatCard from '$lib/components/StatCard.svelte';

	let revenue = [
		{ label: 'Jun', value: 11.2 }, { label: 'Jul', value: 12.8 }, { label: 'Aug', value: 14.1 }, { label: 'Sep', value: 15.6 }, { label: 'Oct', value: 17.2 }, { label: 'Nov', value: 18.45 }
	];
	let moderation = [
		{ t: 'Fractions exit ticket', by: 'Mr. Emeka Obi', type: 'Quiz', flag: 'Auto-checked', e: '📘' },
		{ t: 'Photosynthesis card sort', by: 'Ms. Bisi Ade', type: 'Game', flag: 'Needs review', e: '🎮' },
		{ t: 'Market story comprehension', by: 'Mrs. Halima Sani', type: 'Lesson', flag: 'Auto-checked', e: '📖' }
	];
	let system = [
		{ l: 'API', v: 'Operational', ok: true }, { l: 'Convex realtime', v: 'Operational', ok: true }, { l: 'Payments', v: 'Operational', ok: true }, { l: 'AI tutor', v: 'Degraded', ok: false }
	];
</script>

<svelte:head><title>Admin overview · Sabify</title></svelte:head>

<div class="space-y-5">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">Operations console</p>
			<h1 class="mt-1 display text-2xl font-semibold sm:text-3xl">Platform overview</h1>
			<p class="mt-1 text-sm text-slate">Live metrics across learners, schools and revenue.</p>
		</div>
		<div class="flex flex-wrap gap-2">
			<span class="pill pill-sky text-[0.58rem]">● Production</span>
			<span class="pill text-[0.58rem]">{new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
			<button class="btn btn-ghost btn-sm" onclick={() => toast('Operations report exported', 'success', '⬇️')}>Export report</button>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-3 lg:grid-cols-5">
		<StatCard label="MRR" value={formatNaira(adminMetrics.mrr, true)} emoji="💳" tone="bg-[#e9fbf1]" trend="+8.4%" sub="₦18.45m monthly" />
		<StatCard label="Learners" value={adminMetrics.learners.toLocaleString()} emoji="👩🏾‍🎓" tone="bg-[#eaf8ff]" trend="+6.2%" sub="12,480 total" />
		<StatCard label="Teachers" value={adminMetrics.teachers.toString()} emoji="👨🏾‍🏫" tone="bg-[#f0edff]" trend="+4.1%" sub="640 active" />
		<StatCard label="Schools" value={adminMetrics.schools.toString()} emoji="🏫" tone="bg-[#fff4d2]" trend="+9" sub="84 partners" />
		<StatCard label="Churn" value={`${adminMetrics.churn}%`} emoji="📉" tone="bg-[#fff1ee]" trend="-0.4%" trendUp={false} sub="Lowest in 6 months" />
	</div>

	<div class="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<div class="flex flex-wrap items-start justify-between gap-2">
					<div><h2 class="display text-base font-semibold">Revenue growth</h2><p class="text-[0.68rem] text-slate">Monthly recurring revenue, millions of Naira</p></div>
					<span class="pill text-[0.58rem]"><TrendingUp size={11} /> +64% YoY</span>
				</div>
				<div class="mt-4"><BarChart data={revenue} height={170} color="#0d3b2a" accent="#c9f26b" showValues /></div>
				<div class="mt-3 grid grid-cols-3 gap-2 border-t border-[#eee9dc] pt-3">
					{#each [{ l: 'ARPU', v: '₦1,478' }, { l: 'Conversion', v: `${adminMetrics.conversion}%` }, { l: 'LTV', v: '₦24,600' }] as s}
						<div><p class="text-[0.56rem] font-bold uppercase tracking-wider text-slate">{s.l}</p><p class="display text-base font-semibold">{s.v}</p></div>
					{/each}
				</div>
			</div>

			<div class="grid gap-3.5 sm:grid-cols-2">
				<div class="card p-4 sm:p-5">
					<h2 class="display text-base font-semibold">Plan mix</h2>
					<div class="mt-3 flex items-center gap-4">
						<DonutChart data={adminMetrics.planSplit} size={120} thickness={17} centerLabel="18.4m" centerSub="MRR" />
						<div class="space-y-1.5">
							{#each adminMetrics.planSplit as p}
								<div class="flex items-center gap-1.5 text-[0.64rem] font-bold"><span class="h-2 w-2 rounded-full" style={`background:${p.color}`}></span>{p.label} <span class="text-slate">{p.value}%</span></div>
							{/each}
						</div>
					</div>
				</div>
				<div class="card p-4 sm:p-5">
					<h2 class="display text-base font-semibold">Weekly revenue</h2>
					<div class="mt-3"><LineChart data={adminMetrics.weeklyRevenue.map((w) => ({ label: w.label, value: w.value }))} height={110} color="#10b981" /></div>
					<p class="mt-1 text-[0.62rem] text-slate">₦5.1m this week · +6.2% WoW</p>
				</div>
			</div>

			<div class="card overflow-hidden">
				<div class="flex items-center justify-between border-b border-[#eee9dc] px-4 py-3">
					<div><h2 class="display text-base font-semibold">Recent signups</h2><p class="text-[0.66rem] text-slate">Live feed · last 24 hours</p></div>
					<a href="/admin/users" class="text-[0.64rem] font-extrabold text-forest">All users</a>
				</div>
				<div class="divide-y divide-[#f4f1e6]">
					{#each adminMetrics.recentSignups as s}
						<div class="flex items-center gap-2.5 px-4 py-3">
							<span class="grid h-8 w-8 place-items-center rounded-full bg-[#f4f8ec] text-base">{s.emoji}</span>
							<div class="min-w-0 flex-1"><p class="truncate text-[0.74rem] font-extrabold">{s.name}</p><p class="text-[0.6rem] text-slate">{s.role} · {s.plan}</p></div>
							<span class="text-[0.58rem] font-bold text-slate">{s.time}</span>
							<span class="pill text-[0.5rem]">New</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center justify-between"><h2 class="display text-base font-semibold">Content catalogue</h2><a href="/admin/content" class="text-[0.64rem] font-extrabold text-forest">Manage content</a></div>
				<div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
					{#each [{ l: 'Courses', v: courses.length.toString(), e: '📚' }, { l: 'Lessons', v: '33', e: '📖' }, { l: 'Games', v: '7', e: '🎮' }, { l: 'Subjects', v: subjects.length.toString(), e: '🌍' }] as s}
						<div class="rounded-xl bg-[#f7f5ec] p-2.5"><span class="text-base">{s.e}</span><p class="display text-lg font-semibold">{s.v}</p><p class="text-[0.54rem] font-bold uppercase tracking-wider text-slate">{s.l}</p></div>
					{/each}
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><Server size={16} class="text-forest" /><p class="text-sm font-extrabold">System status</p></div>
				<div class="mt-2 space-y-1.5">
					{#each system as s}
						<div class="flex items-center gap-2 rounded-xl bg-[#faf8f0] px-2.5 py-2">
							<span class={`h-2 w-2 rounded-full ${s.ok ? 'bg-emerald' : 'bg-gold'}`}></span>
							<p class="flex-1 text-[0.68rem] font-bold">{s.l}</p>
							<span class={`text-[0.58rem] font-extrabold ${s.ok ? 'text-[#0b6b45]' : 'text-[#7a4f00]'}`}>{s.v}</span>
						</div>
					{/each}
				</div>
				<p class="mt-2 text-[0.6rem] text-slate">AI tutor latency is elevated in EU-West. Incident #1842 open.</p>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2"><ShieldCheck size={16} class="text-forest" /><p class="text-sm font-extrabold">Moderation queue</p></div>
					<span class="pill pill-gold text-[0.54rem]">{moderation.filter((m) => m.flag === 'Needs review').length} pending</span>
				</div>
				<div class="mt-2 space-y-1.5">
					{#each moderation as m}
						<div class="flex items-center gap-2 rounded-xl border border-[#eee9dc] px-2.5 py-2">
							<span class="text-base">{m.e}</span>
							<div class="min-w-0 flex-1"><p class="truncate text-[0.68rem] font-bold">{m.t}</p><p class="text-[0.58rem] text-slate">{m.by} · {m.type}</p></div>
							<span class={`pill text-[0.48rem] ${m.flag === 'Needs review' ? 'pill-gold' : ''}`}>{m.flag}</span>
						</div>
					{/each}
				</div>
				<a href="/admin/content" class="btn btn-ghost btn-sm mt-2 w-full">Open moderation queue</a>
			</div>

			<div class="relative overflow-hidden rounded-[1.75rem] bg-[#0b2b1f] p-4 text-white">
				<div class="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-lime/15 blur-2xl"></div>
				<div class="relative flex items-center gap-2"><Sparkles size={16} class="text-lime" /><p class="text-sm font-extrabold">Growth insight</p></div>
				<p class="relative mt-1.5 text-[0.72rem] leading-relaxed text-white/65">Schools in the South-East convert 2.3× better when onboarding includes a parent webinar. The next cohort starts 2 December — 14 schools are invited.</p>
				<button class="btn btn-lime btn-sm relative mt-3" onclick={() => toast('Webinar campaign scheduled', 'success', '📅')}>Schedule campaign <ArrowRight size={13} /></button>
			</div>

			<div class="card p-4">
				<div class="flex items-center gap-2"><GraduationCap size={16} class="text-forest" /><p class="text-sm font-extrabold">School pipeline</p></div>
				<div class="mt-2 space-y-1.5">
					{#each [{ n: 'Crescent International', v: 240, stage: 'Contract sent' }, { n: 'Unity College', v: 180, stage: 'Demo booked' }, { n: 'Bright Future Academy', v: 120, stage: 'Trial' }] as s}
						<div class="flex items-center gap-2 rounded-xl bg-[#faf8f0] px-2.5 py-2">
							<div class="min-w-0 flex-1"><p class="truncate text-[0.68rem] font-bold">{s.n}</p><p class="text-[0.58rem] text-slate">{s.v} seats · {s.stage}</p></div>
							<ChevronRight size={13} class="text-slate" />
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
