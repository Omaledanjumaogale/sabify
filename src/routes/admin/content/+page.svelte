<script lang="ts">
	import { BookOpen, Check, Eye, EyeOff, Filter, Gamepad2, MoreHorizontal, Plus, Search, ShieldCheck, Sparkles, Star, Upload } from '@lucide/svelte';
	import { courses, subjects } from '$lib/data/curriculum';
	import { games } from '$lib/data/games';
	import { toast } from '$lib/stores/toast';
	import { formatNumber } from '$lib/utils';
	import Modal from '$lib/components/Modal.svelte';
	import Tabs from '$lib/components/Tabs.svelte';

	let tab = $state('courses');
	let q = $state('');
	let published = $state<Record<string, boolean>>(Object.fromEntries(courses.map((c) => [c.slug, true])));
	let detail = $state<string | null>(null);
	let uploadOpen = $state(false);

	let rows = $derived(courses.filter((c) => c.title.toLowerCase().includes(q.toLowerCase()) || (subjects.find((s) => s.id === c.subjectId)?.name ?? '').toLowerCase().includes(q.toLowerCase())));
	let detailCourse = $derived(detail ? courses.find((c) => c.slug === detail) : null);
	let totalLessons = $derived(courses.reduce((s, c) => s + c.modules.reduce((a, m) => a + m.lessons.length, 0), 0));
	let enrollments: Record<string, number> = { 'number-ninjas': 4210, 'algebra-explorers': 3120, 'word-wizards': 3880, 'story-crafters': 2740, 'science-sparks': 4015, 'space-matter': 2280, 'code-quest': 3610, 'web-builders': 1980, 'digital-citizens': 2410, 'money-movers': 3050, 'naija-heroes': 3320, 'creative-studio': 1870 };

	function toggle(slug: string) {
		published[slug] = !published[slug];
		toast(`${courses.find((c) => c.slug === slug)?.title} ${published[slug] ? 'published' : 'unpublished'}`, published[slug] ? 'success' : 'info', published[slug] ? '🚀' : '⏸️');
	}
</script>

<svelte:head><title>Content · Sabify admin</title></svelte:head>

<div class="space-y-5">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">Catalogue</p>
			<h1 class="mt-1 display text-2xl font-semibold sm:text-3xl">Content library</h1>
			<p class="mt-1 text-sm text-slate">Courses, lessons, games and moderation.</p>
		</div>
		<div class="flex gap-2">
			<button class="btn btn-ghost btn-sm" onclick={() => toast('Bulk upload opened', 'info', '📤')}><Upload size={14} /> Bulk upload</button>
			<button class="btn btn-primary btn-sm" onclick={() => (uploadOpen = true)}><Plus size={15} /> New course</button>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
		{#each [{ l: 'Courses', v: courses.length.toString(), e: '📚' }, { l: 'Lessons', v: totalLessons.toString(), e: '📖' }, { l: 'Learning games', v: games.length.toString(), e: '🎮' }, { l: 'Subjects', v: subjects.length.toString(), e: '🌍' }] as s}
			<div class="card p-4"><span class="text-xl">{s.e}</span><p class="mt-1 display text-2xl font-semibold">{s.v}</p><p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-slate">{s.l}</p></div>
		{/each}
	</div>

	<Tabs tabs={[{ id: 'courses', label: 'Courses' }, { id: 'games', label: 'Games' }, { id: 'moderation', label: 'Moderation' }]} bind:active={tab} />

	{#if tab === 'courses'}
		<div class="card overflow-hidden">
			<div class="flex flex-wrap items-center gap-2 border-b border-[#eee9dc] p-3">
				<div class="relative min-w-[180px] flex-1">
					<Search size={14} class="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
					<input class="input !min-h-9 !rounded-full !py-1.5 !pl-9 text-xs" placeholder="Search courses…" bind:value={q} aria-label="Search courses" />
				</div>
				<span class="ml-auto text-[0.62rem] font-bold text-slate">{rows.length} courses</span>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full min-w-[700px] text-left">
					<thead><tr class="bg-[#faf8f0] text-[0.56rem] uppercase tracking-wider text-slate">
						<th class="px-4 py-2.5 font-extrabold">Course</th><th class="px-3 py-2.5 font-extrabold">Subject</th><th class="px-3 py-2.5 font-extrabold">Lessons</th><th class="px-3 py-2.5 font-extrabold">Enrolled</th><th class="px-3 py-2.5 font-extrabold">Rating</th><th class="px-3 py-2.5 font-extrabold">Status</th><th class="px-3 py-2.5 text-right font-extrabold">Actions</th>
					</tr></thead>
					<tbody>
						{#each rows as c (c.slug)}
							<tr class="border-t border-[#f4f1e6] transition hover:bg-[#fbfdf7]">
								<td class="px-4 py-2.5">
									<div class="flex items-center gap-2.5">
										<span class="grid h-8 w-8 place-items-center rounded-lg text-base" style="background:#f4f8ec">{c.emoji}</span>
										<div><p class="text-[0.72rem] font-extrabold">{c.title}</p><p class="text-[0.58rem] text-slate">{c.level} · {c.modules.length} modules</p></div>
									</div>
								</td>
								<td class="px-3 py-2.5 text-[0.64rem] text-slate">{subjects.find((s) => s.id === c.subjectId)?.name ?? c.subjectId}</td>
								<td class="px-3 py-2.5 text-[0.66rem] font-bold">{c.modules.reduce((a, m) => a + m.lessons.length, 0)}</td>
								<td class="px-3 py-2.5 text-[0.66rem] font-bold">{formatNumber(enrollments[c.slug] ?? 1200)}</td>
								<td class="px-3 py-2.5"><span class="flex items-center gap-1 text-[0.64rem] font-bold"><Star size={11} class="fill-gold text-gold" /> {(4.6 + ((c.title.length % 4) / 10)).toFixed(1)}</span></td>
								<td class="px-3 py-2.5"><span class={`pill text-[0.5rem] ${published[c.slug] ? '' : 'pill-gold'}`}>{published[c.slug] ? 'Published' : 'Draft'}</span></td>
								<td class="px-3 py-2.5 text-right">
									<button class="rounded-lg px-2 py-1 text-[0.6rem] font-extrabold text-forest hover:bg-[#f2fbdf]" onclick={() => (detail = c.slug)}>Review</button>
									<button class="rounded-lg p-1 text-slate hover:bg-[#f4f1e6]" onclick={() => toggle(c.slug)} aria-label="Toggle publish">{#if published[c.slug]}<EyeOff size={13} />{:else}<Eye size={13} />{/if}</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{:else if tab === 'games'}
		<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
			{#each games as g}
				<div class="card p-4">
					<div class="flex items-start justify-between">
						<div class="flex items-center gap-2.5">
							<span class="grid h-10 w-10 place-items-center rounded-xl text-xl" style="background:#f4f8ec">{g.emoji}</span>
							<div><p class="text-[0.76rem] font-extrabold">{g.name}</p><p class="text-[0.58rem] text-slate">{g.skill}</p></div>
						</div>
						<span class="pill text-[0.48rem]">Live</span>
					</div>
					<p class="mt-2 text-[0.64rem] leading-snug text-slate">{g.description}</p>
					<div class="mt-2 flex items-center justify-between text-[0.6rem] font-bold text-slate"><span>👥 {formatNumber(1800 + g.name.length * 210)} plays</span><span>⭐ {(4.6 + (g.name.length % 4) / 10).toFixed(1)}</span></div>
					<button class="btn btn-ghost btn-sm mt-2 w-full" onclick={() => toast(`${g.name} settings opened`, 'info', '🎮')}>Manage game</button>
				</div>
			{/each}
		</div>
	{:else}
		<div class="card overflow-hidden">
			<div class="border-b border-[#eee9dc] px-4 py-3"><h2 class="display text-base font-semibold">Teacher-submitted content</h2><p class="text-[0.66rem] text-slate">AI-generated drafts require human review before learners see them.</p></div>
			<div class="divide-y divide-[#f4f1e6]">
				{#each [
					{ t: 'Fractions exit ticket', by: 'Mr. Emeka Obi', type: 'Quiz', items: 5, flag: 'Auto-checked', e: '📘' },
					{ t: 'Photosynthesis card sort', by: 'Ms. Bisi Ade', type: 'Game', items: 8, flag: 'Needs review', e: '🎮' },
					{ t: 'Market story comprehension', by: 'Mrs. Halima Sani', type: 'Lesson', items: 4, flag: 'Auto-checked', e: '📖' },
					{ t: 'Budgeting role-play', by: 'Mr. Kunle A.', type: 'Game', items: 5, flag: 'Needs review', e: '💰' }
				] as m}
					<div class="flex flex-wrap items-center gap-2 px-4 py-3">
						<span class="grid h-9 w-9 place-items-center rounded-xl bg-[#f4f8ec] text-lg">{m.e}</span>
						<div class="min-w-0 flex-1"><p class="truncate text-[0.74rem] font-extrabold">{m.t}</p><p class="text-[0.6rem] text-slate">{m.by} · {m.type} · {m.items} items</p></div>
						<span class={`pill text-[0.5rem] ${m.flag === 'Needs review' ? 'pill-gold' : ''}`}>{m.flag}</span>
						<button class="btn btn-ghost btn-sm" onclick={() => toast(`${m.t} approved`, 'success', '✅')}><Check size={12} /> Approve</button>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<Modal open={detailCourse !== null} title={detailCourse?.title ?? ''} subtitle={detailCourse ? `${subjects.find((s) => s.id === detailCourse!.subjectId)?.name ?? ''} · ${detailCourse.level}` : ''} onclose={() => (detail = null)}>
	{#if detailCourse}
		<div class="space-y-3">
			<p class="text-[0.72rem] leading-relaxed text-slate">{detailCourse.description}</p>
			<div class="space-y-1.5">
				{#each detailCourse.modules as m, i}
					<div class="rounded-xl border border-[#eee9dc] p-2.5">
						<div class="flex items-center gap-2"><span class="grid h-5 w-5 place-items-center rounded-full bg-[#f2fbdf] text-[0.56rem] font-extrabold text-[#256b16]">{i + 1}</span><p class="text-[0.7rem] font-extrabold">{m.title}</p><span class="ml-auto text-[0.56rem] text-slate">{m.lessons.length} lessons</span></div>
						<ul class="mt-1 space-y-0.5 pl-7">
							{#each m.lessons as l}<li class="text-[0.6rem] text-slate">· {l.title}</li>{/each}
						</ul>
					</div>
				{/each}
			</div>
			<div class="flex gap-2">
				<button class="btn btn-ghost flex-1" onclick={() => toast('Course opened for editing', 'info', '✏️')}>Edit course</button>
				<button class="btn btn-primary flex-1" onclick={() => { toggle(detailCourse.slug); detail = null; }}>{published[detailCourse.slug] ? 'Unpublish' : 'Publish'}</button>
			</div>
		</div>
	{/if}
</Modal>

<Modal open={uploadOpen} title="Create a course" subtitle="Start with a title and subject. You can add modules next." onclose={() => (uploadOpen = false)}>
	<div class="space-y-3">
		<div><label class="label" for="ct">Course title</label><input id="ct" class="input" placeholder="e.g. Fractions in the Market" /></div>
		<div><label class="label" for="cs">Subject</label><select id="cs" class="input">{#each subjects as s}<option>{s.name}</option>{/each}</select></div>
		<div><label class="label" for="cl">Level</label><select id="cl" class="input"><option>Primary 4–6</option><option>JSS 1–3</option><option>SSS 1–3</option></select></div>
		<button class="btn btn-primary w-full" onclick={() => { uploadOpen = false; toast('Course draft created', 'success', '📚'); }}><Sparkles size={14} /> Create draft</button>
	</div>
</Modal>
