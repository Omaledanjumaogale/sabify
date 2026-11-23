<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import type { GameMeta } from '$lib/data/games';

	let { game, best = 0, href = '' }: { game: GameMeta; best?: number; href?: string } = $props();
	const dark = ['number-nebula', 'type-storm', 'quiz-arena'];
	let isDark = $derived(dark.includes(game.slug));
</script>

<a {href} class={`card-hover group relative block overflow-hidden rounded-[2rem] bg-gradient-to-br ${game.gradient} p-5 shadow-soft ${isDark ? 'text-white' : 'text-ink'}`}>
	<div class="absolute inset-0 dot-bg opacity-20"></div>
	<div class="relative flex h-full flex-col">
		<div class="flex items-start justify-between">
			<span class={`grid h-12 w-12 place-items-center rounded-2xl text-2xl backdrop-blur ${isDark ? 'bg-white/15' : 'bg-white/55'}`}>{game.emoji}</span>
			<span class={`pill text-[0.6rem] ${isDark ? 'pill-dark' : 'bg-white/70 text-ink'} `}>+{game.xp} XP</span>
		</div>
		<div class="mt-auto pt-8">
			<p class={`text-[0.62rem] font-extrabold uppercase tracking-[0.14em] ${isDark ? 'text-white/65' : 'text-ink/60'}`}>{game.skill}</p>
			<h3 class="display mt-1 text-xl font-semibold leading-tight">{game.name}</h3>
			<p class={`mt-1 text-xs leading-snug ${isDark ? 'text-white/75' : 'text-ink/70'}`}>{game.tagline}</p>
			<div class={`mt-3 flex items-center justify-between border-t pt-2.5 text-[0.66rem] font-bold ${isDark ? 'border-white/20 text-white/75' : 'border-ink/10 text-ink/60'}`}>
				<span>{best > 0 ? `Best ${best.toLocaleString()}` : `${game.minutes} min · ${game.players}`}</span>
				<span class="inline-flex items-center gap-1">Play <ArrowUpRight size={13} /></span>
			</div>
		</div>
	</div>
</a>
