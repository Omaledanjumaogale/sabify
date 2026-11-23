<script lang="ts">
	import { ArrowRight, Flame, Gamepad2, Play, Sparkles, Trophy, Zap } from '@lucide/svelte';
	import { games, getGame } from '$lib/data/games';
	import { progress } from '$lib/stores/progress';
	import { leaderboard } from '$lib/data/seed';
	import GameCard from '$lib/components/GameCard.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import SectionHeader from '$lib/components/SectionHeader.svelte';

	let filter = $state('all');
	const categories = [
		{ id: 'all', label: 'All games' },
		{ id: 'maths', label: 'Maths' },
		{ id: 'words', label: 'Words' },
		{ id: 'thinking', label: 'Thinking' },
		{ id: 'money', label: 'Money' },
		{ id: 'typing', label: 'Typing' }
	];
	const categoryMap: Record<string, string[]> = {
		maths: ['number-nebula', 'logic-lab'],
		words: ['word-forge', 'memory-match'],
		thinking: ['quiz-arena', 'logic-lab', 'memory-match'],
		money: ['money-quest'],
		typing: ['type-storm']
	};
	let filtered = $derived(filter === 'all' ? games : games.filter((g) => (categoryMap[filter] ?? []).includes(g.slug)));
	let featured = $derived(getGame('number-nebula')!);
	let totalPlays = $derived($progress.gamesPlayed);
	let bestTotal = $derived(Object.values($progress.gameBests).reduce((s, v) => s + v, 0));
</script>

<svelte:head><title>Arcade · Sabify</title></svelte:head>

<div class="space-y-5">
	<div class="relative overflow-hidden rounded-[2rem] bg-[#0b2b1f] p-5 text-white sm:p-7">
		<div class="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-lime/15 blur-3xl"></div>
		<div class="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-grape/20 blur-3xl"></div>
		<div class="relative grid items-center gap-6 lg:grid-cols-[1.2fr_0.8fr]">
			<div>
				<p class="eyebrow !text-lime">Sabify arcade</p>
				<h1 class="mt-2 display text-3xl font-semibold sm:text-4xl">Play with a purpose.</h1>
				<p class="mt-2 max-w-xl text-sm leading-relaxed text-white/60">Seven original games, each tied to a real skill. Ten minutes of play feeds your mastery map and earns XP you can actually use.</p>
				<div class="mt-4 flex flex-wrap gap-2">
					<span class="pill pill-dark text-[0.62rem]"><Gamepad2 size={12} /> {games.length} games</span>
					<span class="pill pill-dark text-[0.62rem]"><Zap size={12} /> {totalPlays} rounds played</span>
					<span class="pill pill-dark text-[0.62rem]"><Trophy size={12} /> {bestTotal.toLocaleString()} total best score</span>
				</div>
				<div class="mt-5 flex flex-wrap gap-2">
					<a href="/app/games/number-nebula" class="btn btn-lime"><Play size={16} fill="currentColor" /> Play Number Nebula</a>
					<a href="/app/games/quiz-arena" class="btn btn-white">Challenge Sabi Bot</a>
				</div>
			</div>
			<div class="relative rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-white/40">Featured mission</p>
						<p class="display mt-1 text-xl font-semibold">{featured.name}</p>
					</div>
					<span class="text-4xl">🚀</span>
				</div>
				<p class="mt-1 text-xs text-white/55">{featured.tagline}</p>
				<div class="mt-3 flex items-center justify-between rounded-xl bg-black/20 px-3 py-2">
					<span class="text-[0.62rem] font-bold text-white/50">Your best</span>
					<span class="display text-base font-semibold text-lime">{($progress.gameBests['number-nebula'] ?? 0).toLocaleString()}</span>
				</div>
				<div class="mt-3 grid grid-cols-2 gap-1.5">
					{#each games.slice(0, 4) as g}
						<a href={`/app/games/${g.slug}`} class="rounded-xl bg-white/[0.06] px-2.5 py-2 text-[0.66rem] font-bold text-white/70 transition hover:bg-white/10">{g.emoji} {g.name}</a>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<div class="grid gap-3.5 xl:grid-cols-[1.5fr_1fr]">
		<div>
			<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h2 class="display text-xl font-semibold">The arcade</h2>
					<p class="text-xs text-slate">Pick a skill. Pick a game. Beat your best.</p>
				</div>
				<div class="no-scrollbar flex gap-1.5 overflow-x-auto">
					{#each categories as c}
						<button class={`chip shrink-0 text-[0.66rem] ${filter === c.id ? 'border-forest bg-forest text-white' : ''}`} onclick={() => (filter = c.id)}>{c.label}</button>
					{/each}
				</div>
			</div>
			<div class="mt-4 grid gap-3.5 sm:grid-cols-2">
				{#each filtered as game}
					<GameCard {game} best={$progress.gameBests[game.slug] ?? 0} href={`/app/games/${game.slug}`} />
				{/each}
			</div>
		</div>

		<div class="space-y-3.5">
			<div class="card p-4 sm:p-5">
				<div class="flex items-center justify-between">
					<div>
						<h3 class="display text-base font-semibold">Daily game challenge</h3>
						<p class="text-[0.68rem] text-slate">Bonus XP once per day</p>
					</div>
					<Flame size={18} class="text-coral" />
				</div>
				<div class="mt-3 rounded-2xl bg-gradient-to-br from-[#e9ffc0] to-[#bef264] p-4">
					<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-[#3f564b]">Today’s challenge</p>
					<p class="display mt-1 text-lg font-semibold leading-tight">Score 500+ in Word Forge</p>
					<p class="mt-1 text-[0.68rem] text-[#3f564b]/80">Forge at least six words without skipping. Reward: +100 bonus XP.</p>
					<a href="/app/games/word-forge" class="btn btn-primary btn-sm mt-3">Accept challenge <ArrowRight size={14} /></a>
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center justify-between">
					<h3 class="display text-base font-semibold">Arcade leaderboard</h3>
					<a href="/app/leaderboard" class="text-[0.64rem] font-extrabold text-forest">View all</a>
				</div>
				<div class="mt-2 space-y-1">
					{#each leaderboard.slice(0, 5) as row, i}
						<div class={`flex items-center gap-2 rounded-xl px-2 py-2 ${row.isMe ? 'bg-[#f2fbdf]' : ''}`}>
							<span class="w-5 text-center text-[0.64rem] font-extrabold text-slate">{i === 0 ? '🥇' : i + 1}</span>
							<Avatar emoji={row.avatar} size={26} ring={false} />
							<p class="min-w-0 flex-1 truncate text-[0.72rem] font-extrabold">{row.name}</p>
							<span class="text-[0.64rem] font-extrabold">{row.xp.toLocaleString()}</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="rounded-[1.75rem] bg-[#f4f1e4] p-4">
				<div class="flex items-center gap-2">
					<Sparkles size={16} class="text-[#7a4f00]" />
					<p class="text-sm font-extrabold">Why games work</p>
				</div>
				<p class="mt-1.5 text-[0.72rem] leading-relaxed text-slate">Retrieval practice and immediate feedback are two of the most evidence-backed learning strategies. Games make both feel like play — and the XP keeps the habit going.</p>
				<a href="/#why" class="mt-2 inline-flex items-center gap-1 text-[0.66rem] font-extrabold text-forest">Read the science <ArrowRight size={12} /></a>
			</div>
		</div>
	</div>

	<SectionHeader eyebrow="Your stats" title="Arcade record" subtitle="A quick look at how you play." />
	<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
		{#each [{ l: 'Rounds played', v: $progress.gamesPlayed.toString() }, { l: 'Favourite', v: '🚀 Number Nebula' }, { l: 'Best score', v: Math.max(...Object.values($progress.gameBests), 0).toLocaleString() }, { l: 'Coins earned', v: $progress.coins.toLocaleString() }] as s}
			<div class="card p-4">
				<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-slate">{s.l}</p>
				<p class="mt-1 display text-xl font-semibold">{s.v}</p>
			</div>
		{/each}
	</div>
</div>
