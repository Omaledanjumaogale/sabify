<script lang="ts">
	import { ArrowRight, BookOpen, Check, ChevronRight, ClipboardList, Clock, Copy, Download, Flame, Plus, Sparkles, Target, TrendingUp, TriangleAlert, Users, Wand2, Zap } from '@lucide/svelte';
	import { teacherStudents, assignments, classPerformance, subjectMastery, badges } from '$lib/data/seed';
	import { courses } from '$lib/data/curriculum';
	import { toast } from '$lib/stores/toast';
	import StatCard from '$lib/components/StatCard.svelte';
	import BarChart from '$lib/components/BarChart.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import Modal from '$lib/components/Modal.svelte';

	let selectedClass = $state('JSS 2A');
	let newAssignment = $state(false);
	let title = $state('');
	let subject = $state('Mathematics');
	let due = $state('');

	let students = $derived(teacherStudents);
	let atRisk = $derived(students.filter((s) => s.risk !== 'On track'));
	let avgMastery = $derived(Math.round(students.reduce((sum, s) => sum + s.mastery.reduce((n, m) => n + m.value, 0) / s.mastery.length, 0) / students.length));
	let avgAccuracy = $derived(Math.round(students.reduce((sum, s) => sum + s.accuracy, 0) / students.length));
	let activeThisWeek = 28;

	function copyCode() {
		void navigator.clipboard?.writeText('SAB-JSS2A').then(() => toast('Join code copied: SAB-JSS2A', 'success', '🔗')).catch(() => toast('Join code: SAB-JSS2A', 'info'));
	}

	function createAssignment() {
		if (!title.trim()) return toast('Give the assignment a title', 'error', '✏️');
		newAssignment = false;
		toast(`Assignment “${title}” created for ${selectedClass}`, 'success', '📋');
		title = '';
		due = '';
	}
</script>

<svelte:head><title>Teacher dashboard · Sabify</title></svelte:head>

<div class="space-y-5">
	<div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
		<div>
			<p class="text-[0.66rem] font-extrabold uppercase tracking-[0.14em] text-slate">{new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })} · Greenfield Academy</p>
			<h1 class="mt-1 display text-2xl font-semibold sm:text-3xl">Good morning, Mr. Obi 👋</h1>
			<p class="mt-1 text-sm text-slate">Here is what your class needs from you today.</p>
		</div>
		<div class="flex flex-wrap gap-2">
			<select class="input !min-h-10 !w-auto !rounded-full !py-2 text-xs font-bold" bind:value={selectedClass} aria-label="Select class">
				<option>JSS 2A</option><option>JSS 2B</option><option>Primary 5B</option>
			</select>
			<button class="btn btn-ghost btn-sm" onclick={() => toast('Class report downloaded', 'success', '⬇️')}><Download size={14} /> Export</button>
			<button class="btn btn-primary btn-sm" onclick={() => (newAssignment = true)}><Plus size={15} /> New assignment</button>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
		<StatCard label="Learners" value="32" emoji="👩🏾‍🎓" tone="bg-[#e9fbf1]" trend="+2" sub="1 joined this week" />
		<StatCard label="Class mastery" value={`${avgMastery}%`} emoji="🎯" tone="bg-[#eaf8ff]" trend="+6%" sub="vs last month" />
		<StatCard label="Active this week" value={`${activeThisWeek}/32`} emoji="🔥" tone="bg-[#fff1e6]" trend="+12%" sub="6-day avg streak" />
		<StatCard label="Need support" value={`${atRisk.length}`} emoji="⚠️" tone="bg-[#fff0ee]" trend="-1" trendUp={false} sub="Flagged by mastery model" />
	</div>

	<div class="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
		<div class="space-y-4">
			<div class="grid gap-3.5 sm:grid-cols-[1.1fr_0.9fr]">
				<div class="card p-4 sm:p-5">
					<div class="flex items-start justify-between">
						<div><h2 class="display text-base font-semibold">Class engagement</h2><p class="text-[0.68rem] text-slate">Average XP earned per day</p></div>
						<span class="pill text-[0.58rem]"><TrendingUp size={11} /> +9%</span>
					</div>
					<div class="mt-4"><BarChart data={classPerformance} height={150} color="#0d3b2a" accent="#c9f26b" showValues /></div>
					<p class="mt-2 text-[0.64rem] text-slate">Peak on Friday. Saturday drop is normal — consider a light weekend quest.</p>
				</div>
				<div class="card p-4 sm:p-5">
					<div class="flex items-center justify-between">
						<h2 class="display text-base font-semibold">Subject mastery</h2>
						<ChevronRight size={16} class="text-slate" />
					</div>
					<div class="mt-3 space-y-2.5">
						{#each subjectMastery as m}<ProgressBar label={m.subject} value={m.value} />{/each}
					</div>
				</div>
			</div>

			<div class="card overflow-hidden">
				<div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#eee9dc] px-4 py-3">
					<div>
						<h2 class="display text-base font-semibold">Learners who need you</h2>
						<p class="text-[0.66rem] text-slate">Ranked by risk: low accuracy, low mastery or inactivity.</p>
					</div>
					<a href="/teacher/students" class="text-[0.64rem] font-extrabold text-forest">All learners</a>
				</div>
				<div class="divide-y divide-[#f4f1e6]">
					{#each atRisk as s}
						<div class="flex flex-wrap items-center gap-2.5 px-4 py-3">
							<Avatar emoji={s.avatar} size={34} ring={false} />
							<div class="min-w-0 flex-1">
								<p class="truncate text-[0.8rem] font-extrabold">{s.name}</p>
								<p class="text-[0.62rem] text-slate">Last active {s.lastActive} · {s.accuracy}% accuracy</p>
							</div>
							<div class="hidden w-28 sm:block">
								<div class="flex justify-between text-[0.56rem] font-bold text-slate"><span>Mastery</span><span>{Math.round(s.mastery.reduce((a, m) => a + m.value, 0) / s.mastery.length)}%</span></div>
								<div class="progress-track mt-1 h-1.5"><div class="progress-fill" style={`width:${Math.round(s.mastery.reduce((a, m) => a + m.value, 0) / s.mastery.length)}%`}></div></div>
							</div>
							<span class={`pill text-[0.54rem] ${s.risk === 'Needs help' ? 'pill-coral' : 'pill-gold'}`}>{s.risk}</span>
							<button class="btn btn-ghost btn-sm" onclick={() => toast(`Nudge sent to ${s.name.split(' ')[0]}’s guardian`, 'success', '✉️')}>Nudge</button>
							<a href="/teacher/students" class="btn btn-ghost btn-icon" aria-label={`View ${s.name}`}><ChevronRight size={15} /></a>
						</div>
					{/each}
				</div>
			</div>

			<div class="card overflow-hidden">
				<div class="flex items-center justify-between border-b border-[#eee9dc] px-4 py-3">
					<h2 class="display text-base font-semibold">Active assignments</h2>
					<a href="/teacher/assignments" class="text-[0.64rem] font-extrabold text-forest">Manage</a>
				</div>
				<div class="divide-y divide-[#f4f1e6]">
					{#each assignments.filter((a) => a.status === 'Active') as a}
						<div class="flex flex-wrap items-center gap-2.5 px-4 py-3">
							<span class="grid h-9 w-9 place-items-center rounded-xl bg-[#f4f8ec] text-lg">{a.emoji}</span>
							<div class="min-w-0 flex-1"><p class="truncate text-[0.78rem] font-extrabold">{a.title}</p><p class="text-[0.62rem] text-slate">{a.subject} · due {a.due}</p></div>
							<div class="w-24">
								<div class="flex justify-between text-[0.56rem] font-bold text-slate"><span>{a.submitted}/{a.total}</span><span>{Math.round((a.submitted / a.total) * 100)}%</span></div>
								<div class="progress-track mt-1 h-1.5"><div class="progress-fill" style={`width:${(a.submitted / a.total) * 100}%`}></div></div>
							</div>
							<button class="btn btn-ghost btn-icon" aria-label="Open assignment" onclick={() => toast('Assignment opened', 'info', '📋')}><ChevronRight size={15} /></button>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<div class="relative overflow-hidden rounded-[1.75rem] bg-[#0b2b1f] p-4 text-white">
				<div class="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-lime/15 blur-2xl"></div>
				<div class="relative flex items-center gap-2"><Sparkles size={16} class="text-lime" /><p class="text-sm font-extrabold">Sabify insight</p></div>
				<p class="relative mt-2 text-[0.74rem] leading-relaxed text-white/65">
					<strong class="text-white">6 learners</strong> are struggling with fractions — mostly equivalent fractions and comparing unlike denominators. A 15-minute worked example on Friday could lift the class average by an estimated <strong class="text-lime">4–6%</strong>.
				</p>
				<div class="relative mt-3 flex flex-wrap gap-1.5">
					<span class="pill pill-dark text-[0.56rem]">Fractions</span>
					<span class="pill pill-dark text-[0.56rem]">6 learners</span>
					<span class="pill pill-dark text-[0.56rem]">High confidence</span>
				</div>
				<button class="btn btn-lime btn-sm relative mt-3" onclick={() => toast('Intervention lesson added to your plan', 'success', '📘')}>Create intervention <ArrowRight size={13} /></button>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2"><Users size={16} class="text-forest" /><p class="text-sm font-extrabold">Class join code</p></div>
					<button class="text-slate" onclick={copyCode} aria-label="Copy code"><Copy size={15} /></button>
				</div>
				<div class="mt-3 rounded-2xl border-2 border-dashed border-[#c9d7b8] bg-[#f2fbdf] p-3 text-center">
					<p class="display text-2xl font-semibold tracking-[0.18em] text-forest">SAB-JSS2A</p>
					<p class="text-[0.62rem] text-slate">Share with learners to join this class</p>
				</div>
				<div class="mt-3 grid grid-cols-2 gap-2">
					<button class="btn btn-ghost btn-sm" onclick={() => toast('Invite link copied', 'success', '🔗')}>Copy link</button>
					<button class="btn btn-ghost btn-sm" onclick={() => toast('QR code generated', 'success', '📱')}>Show QR</button>
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<p class="text-sm font-extrabold">Quick actions</p>
				<div class="mt-2 grid gap-1.5">
					{#each [
						{ icon: Plus, label: 'Create an assignment', href: '/teacher/assignments' },
						{ icon: Wand2, label: 'Build a quiz with AI', href: '/teacher/studio' },
						{ icon: Target, label: 'Set a class challenge', href: '/teacher/analytics' },
						{ icon: BookOpen, label: 'Browse curriculum', href: '/app/subjects' }
					] as a}
						{@const Icon = a.icon}
						<a href={a.href} class="flex items-center gap-2.5 rounded-xl border border-[#eee9dc] px-3 py-2.5 text-[0.72rem] font-bold transition hover:border-[#c9d7b8] hover:bg-[#fafcf5]"><Icon size={14} class="text-forest" /> {a.label} <ChevronRight size={13} class="ml-auto text-slate" /></a>
					{/each}
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<p class="text-sm font-extrabold">Top learners this week</p>
				<div class="mt-2 space-y-1.5">
					{#each students.slice().sort((a, b) => b.xp - a.xp).slice(0, 4) as s, i}
						<div class="flex items-center gap-2 rounded-xl bg-[#faf8f0] px-2.5 py-2">
							<span class="w-4 text-center text-[0.62rem] font-extrabold text-slate">{i + 1}</span>
							<Avatar emoji={s.avatar} size={26} ring={false} />
							<p class="min-w-0 flex-1 truncate text-[0.7rem] font-bold">{s.name}</p>
							<span class="text-[0.62rem] font-extrabold">{s.xp.toLocaleString()} XP</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="card p-4">
				<div class="flex items-center gap-2"><ClipboardList size={16} class="text-forest" /><p class="text-sm font-extrabold">Due this week</p></div>
				<p class="mt-1 text-[0.68rem] text-slate">{assignments.filter((a) => a.status === 'Active').length} active assignments · 51 submissions so far</p>
				<a href="/teacher/assignments" class="btn btn-primary btn-sm mt-3 w-full">Review submissions</a>
			</div>
		</div>
	</div>
</div>

<Modal open={newAssignment} title="Create an assignment" subtitle={`Assign to ${selectedClass} · learners get a notification instantly.`} onclose={() => (newAssignment = false)}>
	<div class="space-y-3">
		<div><label class="label" for="atitle">Assignment title</label><input id="atitle" class="input" bind:value={title} placeholder="e.g. Fractions exit ticket" /></div>
		<div class="grid gap-3 sm:grid-cols-2">
			<div>
				<label class="label" for="asubject">Subject</label>
				<select id="asubject" class="input" bind:value={subject}>
					<option>Mathematics</option><option>English</option><option>Science</option><option>Coding</option><option>Money</option><option>Civics</option>
				</select>
			</div>
			<div><label class="label" for="adue">Due date</label><input id="adue" class="input" type="date" bind:value={due} /></div>
		</div>
		<div>
			<label class="label" for="acontent">Attach content</label>
			<select id="acontent" class="input">
				{#each courses.filter((c) => c.subjectId === 'mathematics').slice(0, 3) as c}<option>{c.title} · {c.modules[0].lessons[0].title}</option>{/each}
				<option>Create new quiz in Content Studio</option>
			</select>
		</div>
		<div class="rounded-xl bg-[#f2fbdf] p-3 text-[0.68rem] font-semibold text-[#256b16]">32 learners will receive this. Estimated time: 12 minutes.</div>
		<div class="flex gap-2">
			<button class="btn btn-ghost flex-1" onclick={() => (newAssignment = false)}>Cancel</button>
			<button class="btn btn-primary flex-1" onclick={createAssignment}><Check size={15} /> Assign now</button>
		</div>
	</div>
</Modal>
