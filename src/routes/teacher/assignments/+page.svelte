<script lang="ts">
	import { ArrowRight, CalendarDays, Check, ChevronRight, Clock, ClipboardList, Copy, Plus, Send, Sparkles, Users } from '@lucide/svelte';
	import { assignments } from '$lib/data/seed';
	import { toast } from '$lib/stores/toast';
	import Tabs from '$lib/components/Tabs.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

	let tab = $state('Active');
	let create = $state(false);
	let title = $state('');
	let subject = $state('Mathematics');
	let due = $state('');
	let instructions = $state('');
	let selected = $state<(typeof assignments)[number] | null>(null);
	let created = $state<{ title: string; subject: string; due: string; emoji: string }[]>([]);

	let tabs = [
		{ id: 'Active', label: 'Active', count: assignments.filter((a) => a.status === 'Active').length },
		{ id: 'Draft', label: 'Drafts', count: assignments.filter((a) => a.status === 'Draft').length },
		{ id: 'Closed', label: 'Closed', count: assignments.filter((a) => a.status === 'Closed').length },
		{ id: 'All', label: 'All', count: assignments.length }
	];

	let shown = $derived(tab === 'All' ? assignments : assignments.filter((a) => a.status === tab));

	function publish() {
		if (!title.trim()) return toast('Add an assignment title', 'error', '✏️');
		created = [...created, { title, subject, due: due || 'Next Friday', emoji: subject === 'English' ? '📖' : subject === 'Science' ? '🔬' : '📘' }];
		create = false;
		toast(`“${title}” published to 32 learners`, 'success', '📋');
		title = '';
		instructions = '';
		due = '';
	}
</script>

<svelte:head><title>Assignments · Sabify for teachers</title></svelte:head>

<div class="space-y-5">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">JSS 2A · Greenfield Academy</p>
			<h1 class="mt-1 display text-2xl font-semibold sm:text-3xl">Assignments</h1>
			<p class="mt-1 text-sm text-slate">Create, assign and track work in one place.</p>
		</div>
		<div class="flex gap-2">
			<a href="/teacher/studio" class="btn btn-ghost btn-sm"><Sparkles size={14} /> AI builder</a>
			<button class="btn btn-primary btn-sm" onclick={() => (create = true)}><Plus size={15} /> New assignment</button>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
		{#each [{ l: 'Active', v: '3', e: '📋' }, { l: 'Submissions', v: '51', e: '✅' }, { l: 'Awaiting review', v: '12', e: '👀' }, { l: 'Avg. completion', v: '62%', e: '📈' }] as s}
			<div class="card p-4"><span class="text-xl">{s.e}</span><p class="mt-1 display text-2xl font-semibold">{s.v}</p><p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-slate">{s.l}</p></div>
		{/each}
	</div>

	<Tabs {tabs} active={tab} onchange={(id) => (tab = id)} />

	{#if created.length && tab !== 'Closed'}
		<div class="space-y-2.5">
			{#each created as a}
				<div class="card flex items-center gap-3 border-[#c9d7b8] bg-[#fbfdf5] p-4">
					<span class="grid h-10 w-10 place-items-center rounded-xl bg-[#f2fbdf] text-lg">{a.emoji}</span>
					<div class="min-w-0 flex-1"><p class="text-[0.8rem] font-extrabold">{a.title}</p><p class="text-[0.62rem] text-slate">{a.subject} · due {a.due} · just published</p></div>
					<span class="pill pill-sky text-[0.54rem]">New</span>
				</div>
			{/each}
		</div>
	{/if}

	{#if shown.length}
		<div class="space-y-2.5">
			{#each shown as a}
				<div class="card p-4">
					<div class="flex flex-wrap items-start gap-3">
						<span class="grid h-11 w-11 place-items-center rounded-2xl bg-[#f4f8ec] text-xl">{a.emoji}</span>
						<div class="min-w-0 flex-1">
							<div class="flex flex-wrap items-center gap-1.5">
								<h3 class="text-sm font-extrabold">{a.title}</h3>
								<span class={`pill text-[0.52rem] ${a.status === 'Active' ? '' : a.status === 'Draft' ? 'pill-gold' : ''}`}>{a.status}</span>
							</div>
							<p class="mt-0.5 text-[0.66rem] text-slate">{a.course} · {a.subject} · 32 learners</p>
							<div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.64rem] font-bold text-slate">
								<span class="flex items-center gap-1"><CalendarDays size={11} /> Due {a.due}</span>
								<span class="flex items-center gap-1"><Users size={11} /> {a.submitted}/{a.total} submitted</span>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<div class="w-28">
								<ProgressBar value={Math.round((a.submitted / a.total) * 100)} showNumbers={false} />
								<p class="mt-1 text-right text-[0.58rem] font-extrabold text-slate">{Math.round((a.submitted / a.total) * 100)}%</p>
							</div>
							<button class="btn btn-ghost btn-icon" onclick={() => (selected = a)} aria-label="View details"><ChevronRight size={16} /></button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<EmptyState title="Nothing here yet" body="Create an assignment or check another tab." emoji="📋" />
	{/if}

	<div class="grid gap-3 sm:grid-cols-3">
		{#each [
			{ t: 'Exit ticket', d: '3 quick questions to close a lesson.', e: '🎟️' },
			{ t: 'Practice set', d: '10 mixed questions with instant feedback.', e: '🎯' },
			{ t: 'Project brief', d: 'A creative task with a marking rubric.', e: '🛠️' }
		] as tpl}
			<button class="card card-hover p-4 text-left" onclick={() => { create = true; title = tpl.t; }}>
				<span class="text-2xl">{tpl.e}</span>
				<p class="mt-2 text-sm font-extrabold">{tpl.t}</p>
				<p class="text-[0.66rem] text-slate">{tpl.d}</p>
				<span class="mt-2 inline-flex items-center gap-1 text-[0.62rem] font-extrabold text-forest">Use template <ArrowRight size={11} /></span>
			</button>
		{/each}
	</div>
</div>

<Modal open={create} title="New assignment" subtitle="Publish to JSS 2A · 32 learners" onclose={() => (create = false)}>
	<div class="space-y-3">
		<div><label class="label" for="t">Title</label><input id="t" class="input" bind:value={title} placeholder="e.g. Fractions exit ticket" /></div>
		<div class="grid gap-3 sm:grid-cols-2">
			<div>
				<label class="label" for="s">Subject</label>
				<select id="s" class="input" bind:value={subject}><option>Mathematics</option><option>English</option><option>Science</option><option>Coding</option><option>Money</option></select>
			</div>
			<div><label class="label" for="d">Due date</label><input id="d" class="input" type="date" bind:value={due} /></div>
		</div>
		<div><label class="label" for="i">Instructions</label><textarea id="i" class="input min-h-20" bind:value={instructions} placeholder="Explain what learners should do…"></textarea></div>
		<div class="rounded-xl bg-[#f7f5ec] p-3">
			<p class="text-[0.62rem] font-extrabold uppercase tracking-wider text-slate">Attach content</p>
			<select class="input mt-1.5 !min-h-9 text-xs"><option>Fractions on a number line · worksheet</option><option>Fraction Friends · lesson</option><option>Create new quiz</option></select>
		</div>
		<div class="flex gap-2">
			<button class="btn btn-ghost flex-1" onclick={() => (create = false)}>Cancel</button>
			<button class="btn btn-primary flex-1" onclick={publish}><Send size={15} /> Publish</button>
		</div>
	</div>
</Modal>

<Modal open={!!selected} title={selected?.title ?? ''} subtitle={selected ? `${selected.course} · ${selected.subject}` : ''} onclose={() => (selected = null)}>
	{#if selected}
		<div class="space-y-3">
			<div class="grid grid-cols-3 gap-2">
				{#each [{ l: 'Submitted', v: `${selected.submitted}/${selected.total}` }, { l: 'Due', v: selected.due }, { l: 'Status', v: selected.status }] as s}
					<div class="rounded-xl bg-[#f7f5ec] p-2.5"><p class="text-[0.56rem] font-bold uppercase text-slate">{s.l}</p><p class="text-[0.76rem] font-extrabold">{s.v}</p></div>
				{/each}
			</div>
			<div>
				<p class="text-[0.62rem] font-extrabold uppercase tracking-wider text-slate">Submission progress</p>
				<div class="mt-1.5"><ProgressBar value={Math.round((selected.submitted / selected.total) * 100)} /></div>
			</div>
			<div class="rounded-xl bg-[#fff8e8] p-3 text-[0.68rem] text-[#7a4f00]">
				12 learners have not submitted. Send a reminder 24 hours before the deadline to lift completion by ~15%.
			</div>
			<div class="grid gap-2 sm:grid-cols-2">
				<button class="btn btn-ghost" onclick={() => toast('Reminder sent to 12 learners', 'success', '🔔')}>Send reminder</button>
				<button class="btn btn-primary" onclick={() => toast('Review queue opened', 'info', '👀')}>Review submissions</button>
			</div>
		</div>
	{/if}
</Modal>
