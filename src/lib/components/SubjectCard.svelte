<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import type { Subject } from '$lib/data/types';

	let { subject, progress = 0, href = '' }: { subject: Subject; progress?: number; href?: string } = $props();
</script>

<a {href} class="card card-hover group relative overflow-hidden p-5">
	<div class={`absolute -right-6 -top-7 h-28 w-28 rounded-full bg-gradient-to-br ${subject.tint} opacity-70 blur-xl transition group-hover:scale-125`}></div>
	<div class="relative">
		<div class="flex items-start justify-between">
			<span class={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${subject.soft}`}>{subject.emoji}</span>
			<ArrowUpRight size={18} class="text-slate transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
		</div>
		<h3 class="mt-4 display text-lg font-semibold leading-tight">{subject.name}</h3>
		<p class="mt-1 line-clamp-2 text-xs leading-relaxed text-slate">{subject.tagline}</p>
		<div class="mt-4 flex items-center gap-2">
			<div class="progress-track flex-1"><div class="progress-fill" style={`width:${progress}%`}></div></div>
			<span class="text-[0.66rem] font-extrabold text-slate">{progress}%</span>
		</div>
		<p class="mt-2 text-[0.64rem] font-bold uppercase tracking-wider text-slate">{subject.stat}</p>
	</div>
</a>
