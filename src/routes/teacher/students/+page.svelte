<script lang="ts">
	import { ArrowRight, ChevronRight, Filter, Mail, Plus, Search, UserPlus, Users, X } from '@lucide/svelte';
	import { teacherStudents } from '$lib/data/seed';
	import { toast } from '$lib/stores/toast';
	import Avatar from '$lib/components/Avatar.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import ProgressRing from '$lib/components/ProgressRing.svelte';

	type Student = (typeof teacherStudents)[number];
	let query = $state('');
	let risk = $state('all');
	let selected = $state<Student | null>(null);
	let invite = $state(false);
	let inviteEmail = $state('');

	let filtered = $derived(
		teacherStudents.filter((s) => {
			const matchesQuery = !query || s.name.toLowerCase().includes(query.toLowerCase());
			const matchesRisk = risk === 'all' || s.risk === risk;
			return matchesQuery && matchesRisk;
		})
	);

	function avgMastery(s: Student) {
		return Math.round(s.mastery.reduce((a, m) => a + m.value, 0) / s.mastery.length);
	}

	function sendInvite() {
		if (!inviteEmail.includes('@')) {
			toast('Enter a valid email address', 'error', '✉️');
			return;
		}
		invite = false;
		toast(`Invite sent to ${inviteEmail}`, 'success', '📨');
		inviteEmail = '';
	}
</script>

<svelte:head><title>My learners · Sabify for teachers</title></svelte:head>

<div class="space-y-5">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">JSS 2A · Greenfield Academy</p>
			<h1 class="mt-1 display text-2xl font-semibold sm:text-3xl">My learners</h1>
			<p class="mt-1 text-sm text-slate">32 learners · 28 active this week · 4 need support</p>
		</div>
		<div class="flex gap-2">
			<button class="btn btn-ghost btn-sm" onclick={() => toast('Class list exported as CSV', 'success', '⬇️')}>Export CSV</button>
			<button class="btn btn-primary btn-sm" onclick={() => (invite = true)}><UserPlus size={15} /> Invite learner</button>
		</div>
	</div>

	<div class="card flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
		<div class="flex flex-1 items-center gap-2 rounded-xl border border-[#e5e0d1] bg-[#fbf8ef] px-3 py-2">
			<Search size={16} class="text-slate" />
			<input class="w-full bg-transparent text-sm outline-none placeholder:text-slate/70" placeholder="Search learners…" bind:value={query} />
		</div>
		<select class="input !min-h-10 !rounded-xl !py-2 text-xs sm:w-44" bind:value={risk} aria-label="Filter by risk">
			<option value="all">All learners</option><option value="On track">On track</option><option value="Watch">Watch</option><option value="Needs help">Needs help</option>
		</select>
	</div>

	<div class="card overflow-hidden">
		<div class="hidden grid-cols-[1.6fr_0.8fr_0.8fr_1fr_0.8fr_0.6fr] gap-3 border-b border-[#eee9dc] px-4 py-2.5 text-[0.58rem] font-extrabold uppercase tracking-wider text-slate md:grid">
			<span>Learner</span><span>Mastery</span><span>Accuracy</span><span>Streak</span><span>Status</span><span></span>
		</div>
		<div class="divide-y divide-[#f4f1e6]">
			{#each filtered as s}
				<button class="grid w-full grid-cols-1 gap-2 px-4 py-3 text-left transition hover:bg-[#fafcf5] md:grid-cols-[1.6fr_0.8fr_0.8fr_1fr_0.8fr_0.6fr] md:items-center md:gap-3" onclick={() => (selected = s)}>
					<div class="flex items-center gap-2.5">
						<Avatar emoji={s.avatar} size={34} ring={false} />
						<div class="min-w-0"><p class="truncate text-[0.8rem] font-extrabold">{s.name}</p><p class="text-[0.62rem] text-slate">{s.grade} · {s.xp.toLocaleString()} XP</p></div>
					</div>
					<div class="hidden md:block">
						<div class="flex items-center gap-2"><div class="progress-track h-1.5 flex-1"><div class="progress-fill" style={`width:${avgMastery(s)}%`}></div></div><span class="text-[0.62rem] font-extrabold">{avgMastery(s)}%</span></div>
					</div>
					<span class="hidden text-[0.72rem] font-bold md:block">{s.accuracy}%</span>
					<span class="hidden items-center gap-1 text-[0.7rem] font-bold text-[#a23c17] md:flex">🔥 {s.streak}</span>
					<span class="md:block"><span class={`pill text-[0.54rem] ${s.risk === 'On track' ? '' : s.risk === 'Watch' ? 'pill-gold' : 'pill-coral'}`}>{s.risk}</span></span>
					<span class="hidden justify-end md:flex"><ChevronRight size={15} class="text-slate" /></span>
				</button>
			{/each}
		</div>
		{#if !filtered.length}
			<div class="px-4 py-10 text-center"><p class="text-2xl">🔎</p><p class="mt-1 text-sm font-extrabold">No learners match that filter</p><button class="btn btn-ghost btn-sm mt-2" onclick={() => { query = ''; risk = 'all'; }}>Clear filters</button></div>
		{/if}
	</div>

	<div class="grid gap-3 sm:grid-cols-3">
		{#each [{ l: 'Class average mastery', v: '74%' }, { l: 'Average accuracy', v: '78%' }, { l: 'Weekly active rate', v: '88%' }] as s}
			<div class="card p-4"><p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-slate">{s.l}</p><p class="mt-1 display text-2xl font-semibold">{s.v}</p></div>
		{/each}
	</div>
</div>

<Modal open={!!selected} title={selected?.name ?? ''} subtitle={selected ? `${selected.grade} · ${selected.xp.toLocaleString()} XP · ${selected.lastActive}` : ''} onclose={() => (selected = null)}>
	{#if selected}
		<div class="space-y-4">
			<div class="flex items-center gap-3">
				<Avatar emoji={selected.avatar} size={60} ring />
				<div class="flex-1">
					<p class="text-sm font-extrabold">{selected.name}</p>
					<p class="text-[0.68rem] text-slate">{selected.lessons} lessons · {selected.accuracy}% accuracy · {selected.streak}-day streak</p>
					<span class={`pill mt-1 text-[0.54rem] ${selected.risk === 'On track' ? '' : selected.risk === 'Watch' ? 'pill-gold' : 'pill-coral'}`}>{selected.risk}</span>
				</div>
				<ProgressRing value={avgMastery(selected)} size={68} stroke={7} sublabel="mastery" />
			</div>
			<div>
				<p class="text-[0.62rem] font-extrabold uppercase tracking-wider text-slate">Subject mastery</p>
				<div class="mt-2 space-y-2.5">
					{#each selected.mastery as m}<ProgressBar label={m.subject} value={m.value} />{/each}
				</div>
			</div>
			<div class="rounded-xl bg-[#f7f5ec] p-3">
				<p class="text-[0.64rem] font-extrabold">Suggested next step</p>
				<p class="mt-0.5 text-[0.68rem] leading-snug text-slate">
					{selected.risk === 'Needs help' ? 'Assign the Fraction Friends lesson and schedule a 10-minute one-to-one check-in.' : 'Keep momentum with a stretch quiz in their strongest subject, then revisit a weaker skill.'}
				</p>
			</div>
			<div class="grid gap-2 sm:grid-cols-2">
				<button class="btn btn-ghost" onclick={() => toast(`Message sent to ${selected?.name.split(' ')[0]}’s guardian`, 'success', '✉️')}><Mail size={15} /> Message guardian</button>
				<button class="btn btn-primary" onclick={() => { toast('Assignment created for ' + selected?.name.split(' ')[0], 'success', '📋'); selected = null; }}><Plus size={15} /> Assign lesson</button>
			</div>
		</div>
	{/if}
</Modal>

<Modal open={invite} title="Invite a learner" subtitle="They will receive a join link for JSS 2A." onclose={() => (invite = false)}>
	<div class="space-y-3">
		<div><label class="label" for="iemail">Learner or guardian email</label><input id="iemail" class="input" type="email" bind:value={inviteEmail} placeholder="name@example.com" /></div>
		<div class="rounded-xl bg-[#f2fbdf] p-3 text-[0.68rem] font-semibold text-[#256b16]">They can also join with code <strong>SAB-JSS2A</strong>.</div>
		<button class="btn btn-primary w-full" onclick={sendInvite}>Send invite</button>
	</div>
</Modal>
