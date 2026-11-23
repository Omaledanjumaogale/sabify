<script lang="ts">
	import { Clock, Sparkles } from '@lucide/svelte';
	import type { Course } from '$lib/data/types';
	import { allLessons } from '$lib/data/curriculum';

	let { course, href = '', progress = 0, compact = false }: { course: Course; href?: string; progress?: number; compact?: boolean } = $props();
	let lessons = $derived(course.modules.reduce((sum, m) => sum + m.lessons.length, 0));
</script>

<a {href} class="card card-hover group block overflow-hidden p-0">
	<div class={`relative overflow-hidden bg-gradient-to-br ${course.gradient} ${compact ? 'h-24' : 'h-32'}`}>
		<div class="absolute inset-0 dot-bg opacity-30"></div>
		<span class="absolute -right-1 -top-3 text-[6rem] opacity-30 transition duration-500 group-hover:scale-110 group-hover:rotate-6">{course.emoji}</span>
		<div class="absolute bottom-3 left-4 flex items-center gap-2">
			<span class="pill bg-white/80 text-[0.62rem] text-ink backdrop-blur">{course.level}</span>
			<span class="pill bg-white/80 text-[0.62rem] text-ink backdrop-blur">Age {course.ages}</span>
		</div>
	</div>
	<div class="p-4">
		<h3 class="display text-base font-semibold leading-tight">{course.title}</h3>
		<p class="mt-1 line-clamp-2 text-xs leading-relaxed text-slate">{course.summary}</p>
		<div class="mt-3 flex items-center gap-3 text-[0.66rem] font-bold text-slate">
			<span class="inline-flex items-center gap-1"><Clock size={12} /> {course.hours}h</span>
			<span class="inline-flex items-center gap-1"><Sparkles size={12} /> {course.xp} XP</span>
			<span>{lessons} lessons</span>
		</div>
		<div class="mt-3.5 flex items-center gap-2">
			<div class="progress-track flex-1"><div class="progress-fill" style={`width:${progress}%`}></div></div>
			<span class="text-[0.66rem] font-extrabold text-slate">{progress}%</span>
		</div>
	</div>
</a>
