<script lang="ts">
	import { ArrowRight, BookOpen, Filter, Search, Sparkles } from '@lucide/svelte';
	import { page } from '$app/stores';
	import SubjectCard from '$lib/components/SubjectCard.svelte';
	import CourseCard from '$lib/components/CourseCard.svelte';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import { subjects, courses, curricula, coursesForSubject } from '$lib/data/curriculum';
	import { progress } from '$lib/stores/progress';

	let q = $derived($page.url.searchParams.get('q')?.toLowerCase() ?? '');
	let filter = $state('all');
	let level = $state('all');

	let filteredSubjects = $derived(
		subjects.filter((s) => {
			if (!q) return true;
			return (
				s.name.toLowerCase().includes(q) ||
				s.tagline.toLowerCase().includes(q) ||
				s.skills.some((k) => k.toLowerCase().includes(q))
			);
		})
	);

	let filteredCourses = $derived(
		courses.filter((c) => {
			const matchesSubject = filter === 'all' || c.subjectId === filter;
			const matchesLevel = level === 'all' || c.level === level;
			const matchesQuery =
				!q ||
				c.title.toLowerCase().includes(q) ||
				c.summary.toLowerCase().includes(q) ||
				c.skills.some((s) => s.toLowerCase().includes(q));
			return matchesSubject && matchesLevel && matchesQuery;
		})
	);

	function subjectProgress(subjectId: string) {
		const list = coursesForSubject(subjectId).flatMap((c) => c.modules.flatMap((m) => m.lessons));
		if (!list.length) return 0;
		return Math.round((list.filter((l) => $progress.completedLessons.includes(l.id)).length / list.length) * 100);
	}

	function courseProgress(courseId: string) {
		const c = courses.find((x) => x.id === courseId);
		if (!c) return 0;
		const list = c.modules.flatMap((m) => m.lessons);
		return Math.round((list.filter((l) => $progress.completedLessons.includes(l.id)).length / Math.max(1, list.length)) * 100);
	}
</script>

<svelte:head><title>Subjects · Sabify</title></svelte:head>

<div class="space-y-5">
	<div class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0b2b1f] via-[#12452f] to-[#1b5e42] p-5 text-white sm:p-7">
		<div class="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-lime/15 blur-3xl"></div>
		<div class="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
			<div class="max-w-2xl">
				<p class="eyebrow !text-lime">The learning universe</p>
				<h1 class="mt-2 display text-3xl font-semibold sm:text-4xl">Choose your next adventure.</h1>
				<p class="mt-2 max-w-xl text-sm leading-relaxed text-white/65">
					Eight subjects, {courses.length} courses and hundreds of small wins. Every lesson is mapped to a real skill and adapted to how you learn.
				</p>
				<div class="mt-4 flex flex-wrap gap-2">
					<span class="pill pill-dark text-[0.62rem]"><BookOpen size={12} /> {courses.reduce((s, c) => s + c.modules.reduce((n, m) => n + m.lessons.length, 0), 0)} lessons</span>
					<span class="pill pill-dark text-[0.62rem]"><Sparkles size={12} /> 6 curriculum frameworks</span>
					<span class="pill pill-dark text-[0.62rem]">🎮 Game-linked practice</span>
				</div>
			</div>
			<div class="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur">
				<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-white/40">Your progress</p>
				<div class="mt-2 flex items-end gap-2">
					<span class="display text-4xl font-semibold text-lime">{$progress.completedLessons.length}</span>
					<span class="pb-1 text-xs font-bold text-white/50">lessons completed</span>
				</div>
				<p class="mt-1 text-[0.66rem] text-white/45">Keep going — the next badge is closer than you think.</p>
			</div>
		</div>
	</div>

	{#if q}
		<div class="flex items-center gap-2 rounded-2xl border border-[#e5e0d1] bg-white px-4 py-3">
			<Search size={16} class="text-slate" />
			<p class="text-sm font-bold">Results for “{q}”</p>
			<span class="pill text-[0.58rem]">{filteredSubjects.length} subjects · {filteredCourses.length} courses</span>
			<a href="/app/subjects" class="ml-auto text-xs font-extrabold text-forest">Clear search</a>
		</div>
	{/if}

	<section>
		<SectionHeader eyebrow="Explore" title="Subjects" subtitle="Start anywhere. Sabify will connect the dots." />
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each filteredSubjects as s}
				<SubjectCard subject={s} progress={subjectProgress(s.id)} href={`/app/subjects/${s.slug}`} />
			{/each}
		</div>
	</section>

	<section class="pt-2">
		<SectionHeader eyebrow="Course catalogue" title="All courses" subtitle="Filter by subject or level to find the right fit.">
			<div class="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
				<div class="no-scrollbar flex gap-1.5 overflow-x-auto">
					<button class={`chip shrink-0 text-[0.68rem] ${filter === 'all' ? 'border-forest bg-forest text-white' : ''}`} onclick={() => (filter = 'all')}>All subjects</button>
					{#each subjects as s}
						<button class={`chip shrink-0 text-[0.68rem] ${filter === s.id ? 'border-forest bg-forest text-white' : ''}`} onclick={() => (filter = s.id)}>{s.emoji} {s.short}</button>
					{/each}
				</div>
				<select class="input !min-h-9 !rounded-full !py-1.5 text-xs sm:ml-auto sm:w-36" bind:value={level} aria-label="Filter by level">
					<option value="all">All levels</option>
					<option value="Starter">Starter</option>
					<option value="Explorer">Explorer</option>
					<option value="Champion">Champion</option>
				</select>
			</div>
		</SectionHeader>

		{#if filteredCourses.length}
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each filteredCourses as c}
					<CourseCard course={c} progress={courseProgress(c.id)} href={`/app/subjects/${c.subjectId}`} />
				{/each}
			</div>
		{:else}
			<div class="card p-10 text-center">
				<p class="text-3xl">🔎</p>
				<p class="mt-2 display text-lg font-semibold">No courses match that filter</p>
				<p class="text-sm text-slate">Try another subject or clear the filters.</p>
				<button class="btn btn-primary btn-sm mt-3" onclick={() => { filter = 'all'; level = 'all'; }}>Clear filters</button>
			</div>
		{/if}
	</section>

	<section class="pt-2">
		<SectionHeader eyebrow="Curriculum" title="Standards, mapped" subtitle="Switch frameworks without losing progress." />
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each curricula as c}
				<div class="card flex gap-3 p-4">
					<span class="text-2xl">{c.flag}</span>
					<div>
						<p class="text-sm font-extrabold">{c.name}</p>
						<p class="text-[0.64rem] font-bold uppercase tracking-wider text-slate">{c.country}</p>
						<p class="mt-1.5 text-[0.7rem] leading-snug text-slate">{c.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>
</div>
