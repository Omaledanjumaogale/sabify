<script lang="ts">
	import { BookOpen, Check, Download, Filter, Search, Sparkles, Star, WifiOff, X } from '@lucide/svelte';
	import { library } from '$lib/data/seed';
	import { subjects } from '$lib/data/curriculum';
	import { progress } from '$lib/stores/progress';
	import { toast } from '$lib/stores/toast';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Modal from '$lib/components/Modal.svelte';

	let q = $state('');
	let type = $state('all');
	let subject = $state('all');
	let offline = $state<string[]>([]);
	let selected = $state<(typeof library)[number] | null>(null);

	let types = ['all', 'Worksheet', 'Video', 'Practice', 'Project', 'Story'];
	let filtered = $derived(
		library.filter((r) => {
			const matchesQuery = !q || r.title.toLowerCase().includes(q.toLowerCase()) || r.description.toLowerCase().includes(q.toLowerCase());
			const matchesType = type === 'all' || r.type === type;
			const matchesSubject = subject === 'all' || r.subjectId === subject;
			return matchesQuery && matchesType && matchesSubject;
		})
	);
	let featured = $derived(library.slice(0, 3));

	function toggleOffline(id: string, title: string) {
		if (offline.includes(id)) {
			offline = offline.filter((x) => x !== id);
			toast(`Removed “${title}” from offline`, 'info', '📴');
		} else {
			offline = [...offline, id];
			toast(`“${title}” saved for offline use`, 'success', '⬇️');
		}
	}
</script>

<svelte:head><title>Resource library · Sabify</title></svelte:head>

<div class="space-y-5">
	<div class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0b2b1f] via-[#15452f] to-[#255f43] p-5 text-white sm:p-7">
		<div class="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-sky/20 blur-3xl"></div>
		<div class="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
			<div class="max-w-2xl">
				<p class="eyebrow !text-lime">Resource library</p>
				<h1 class="mt-2 display text-3xl font-semibold sm:text-4xl">Everything you need, in one shelf.</h1>
				<p class="mt-2 text-sm leading-relaxed text-white/60">Worksheets, short videos, practice packs and projects — curated by teachers and mapped to your curriculum. Save anything for offline use.</p>
			</div>
			<div class="flex gap-2">
				<span class="pill pill-dark text-[0.62rem]"><BookOpen size={12} /> {library.length} resources</span>
				<span class="pill pill-dark text-[0.62rem]"><WifiOff size={12} /> {offline.length} offline</span>
			</div>
		</div>
	</div>

	<div class="card flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
		<div class="flex flex-1 items-center gap-2 rounded-xl border border-[#e5e0d1] bg-[#fbf8ef] px-3 py-2">
			<Search size={16} class="text-slate" />
			<input class="w-full bg-transparent text-sm outline-none placeholder:text-slate/70" placeholder="Search worksheets, videos, projects…" bind:value={q} />
		</div>
		<select class="input !min-h-10 !rounded-xl !py-2 text-xs sm:w-40" bind:value={subject} aria-label="Filter by subject">
			<option value="all">All subjects</option>
			{#each subjects as s}<option value={s.id}>{s.name}</option>{/each}
		</select>
		<select class="input !min-h-10 !rounded-xl !py-2 text-xs sm:w-36" bind:value={type} aria-label="Filter by type">
			{#each types as t}<option value={t}>{t === 'all' ? 'All types' : t}</option>{/each}
		</select>
	</div>

	<div class="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
		<div>
			<div class="flex items-end justify-between">
				<div>
					<h2 class="display text-xl font-semibold">Browse resources</h2>
					<p class="text-xs text-slate">{filtered.length} result{filtered.length === 1 ? '' : 's'}</p>
				</div>
				{#if q || type !== 'all' || subject !== 'all'}
					<button class="text-xs font-extrabold text-forest" onclick={() => { q = ''; type = 'all'; subject = 'all'; }}>Clear filters</button>
				{/if}
			</div>

			{#if filtered.length}
				<div class="mt-4 grid gap-3 sm:grid-cols-2">
					{#each filtered as r}
						<div class="card card-hover flex flex-col p-4">
							<div class="flex items-start justify-between">
								<span class="grid h-11 w-11 place-items-center rounded-2xl bg-[#f4f8ec] text-xl">{r.emoji}</span>
								<span class="pill text-[0.56rem]">{r.type}</span>
							</div>
							<h3 class="mt-3 display text-base font-semibold leading-tight">{r.title}</h3>
							<p class="mt-1 text-[0.7rem] leading-snug text-slate">{r.description}</p>
							<div class="mt-2 flex flex-wrap items-center gap-2 text-[0.62rem] font-bold text-slate">
								<span>{r.subject}</span><span>·</span><span>{r.duration}</span><span>·</span><span>{r.level}</span>
							</div>
							<div class="mt-auto flex items-center justify-between border-t border-[#eee9dc] pt-3">
								<span class="flex items-center gap-1 text-[0.64rem] font-extrabold text-[#a27000]"><Star size={11} fill="currentColor" /> {r.rating}</span>
								<div class="flex gap-1.5">
									<button class={`btn btn-icon btn-sm ${offline.includes(r.id) ? 'btn-primary' : 'btn-ghost'}`} onclick={() => toggleOffline(r.id, r.title)} aria-label="Save offline">
										{#if offline.includes(r.id)}<Check size={13} />{:else}<Download size={13} />{/if}
									</button>
									<button class="btn btn-ghost btn-sm" onclick={() => (selected = r)}>Open</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="mt-4"><EmptyState title="No resources found" body="Try a different subject or clear the search filters." emoji="🔎" /></div>
			{/if}
		</div>

		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><Sparkles size={16} class="text-[#7a4f00]" /><p class="text-sm font-extrabold">Teacher picks this week</p></div>
				<div class="mt-2 space-y-2">
					{#each featured as r}
						<button class="flex w-full items-center gap-2.5 rounded-xl bg-[#faf8f0] p-2.5 text-left transition hover:bg-[#f4f0e3]" onclick={() => (selected = r)}>
							<span class="text-lg">{r.emoji}</span>
							<div class="min-w-0 flex-1"><p class="truncate text-[0.72rem] font-extrabold">{r.title}</p><p class="text-[0.6rem] text-slate">{r.subject} · {r.duration}</p></div>
							<span class="text-[0.6rem] font-extrabold text-[#a27000]">★ {r.rating}</span>
						</button>
					{/each}
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<p class="text-sm font-extrabold">Offline shelf</p>
				<p class="text-[0.66rem] text-slate">Resources save to this device for low-data learning.</p>
				{#if offline.length}
					<div class="mt-2 space-y-1.5">
						{#each library.filter((r) => offline.includes(r.id)) as r}
							<div class="flex items-center gap-2 rounded-xl border border-[#eee9dc] px-2.5 py-2">
								<span class="text-base">{r.emoji}</span>
								<p class="min-w-0 flex-1 truncate text-[0.68rem] font-bold">{r.title}</p>
								<button class="text-slate" onclick={() => toggleOffline(r.id, r.title)} aria-label="Remove"><X size={13} /></button>
							</div>
						{/each}
					</div>
				{:else}
					<div class="mt-2 rounded-xl border border-dashed border-[#d8d3c2] p-3 text-center">
						<WifiOff size={18} class="mx-auto text-slate" />
						<p class="mt-1 text-[0.64rem] text-slate">Nothing saved yet. Tap the download icon on any resource.</p>
					</div>
				{/if}
			</div>

			<div class="rounded-[1.75rem] bg-[#eef6df] p-4">
				<p class="text-sm font-extrabold">Curriculum packs</p>
				<div class="mt-2 grid grid-cols-2 gap-1.5">
					{#each subjects.slice(0, 6) as s}
						<button class="flex items-center gap-1.5 rounded-xl bg-white/70 px-2 py-2 text-left text-[0.66rem] font-bold" onclick={() => (subject = s.id)}>
							<span>{s.emoji}</span><span class="truncate">{s.short}</span>
						</button>
					{/each}
				</div>
				<p class="mt-2 text-[0.62rem] text-slate">Mapped to NERDC, Common Core, Cambridge and IB.</p>
			</div>

			<div class="card p-4">
				<p class="text-sm font-extrabold">Your learning stats</p>
				<div class="mt-2 grid grid-cols-2 gap-2">
					<div class="rounded-xl bg-[#f7f5ec] p-2.5"><p class="text-[0.56rem] font-bold uppercase text-slate">Lessons</p><p class="display text-lg font-semibold">{$progress.completedLessons.length}</p></div>
					<div class="rounded-xl bg-[#f7f5ec] p-2.5"><p class="text-[0.56rem] font-bold uppercase text-slate">Minutes</p><p class="display text-lg font-semibold">{$progress.minutesLearned}</p></div>
				</div>
			</div>
		</div>
	</div>
</div>

<Modal open={!!selected} title={selected?.title ?? ''} subtitle={selected ? `${selected.type} · ${selected.subject} · ${selected.duration}` : ''} onclose={() => (selected = null)}>
	{#if selected}
		<div class="space-y-3">
			<div class="grid place-items-center rounded-2xl bg-gradient-to-br from-[#f4f8ec] to-[#e9fbf1] p-8 text-6xl">{selected.emoji}</div>
			<p class="text-sm leading-relaxed text-[#3f564b]">{selected.description}</p>
			<div class="flex flex-wrap gap-2">
				<span class="pill text-[0.6rem]">{selected.level}</span>
				<span class="pill pill-gold text-[0.6rem]">★ {selected.rating}</span>
				<span class="pill pill-sky text-[0.6rem]">{selected.duration}</span>
			</div>
			<div class="grid gap-2 sm:grid-cols-2">
				<button class="btn btn-primary" onclick={() => { toast('Resource opened in the lesson player.', 'success', '📖'); selected = null; }}>Open resource</button>
				<button class="btn btn-ghost" onclick={() => { if (selected) toggleOffline(selected.id, selected.title); }}>
					{selected && offline.includes(selected.id) ? 'Remove offline' : 'Save offline'}
				</button>
			</div>
		</div>
	{/if}
</Modal>
