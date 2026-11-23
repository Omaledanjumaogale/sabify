<script lang="ts">
	import { Award, Check, Lock, Sparkles, Trophy, Zap } from '@lucide/svelte';
	import { badges } from '$lib/data/seed';
	import { progress, nextBadge } from '$lib/stores/progress';
	import { celebrate } from '$lib/utils';
	import BadgeTile from '$lib/components/BadgeTile.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import Mascot from '$lib/components/Mascot.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

	let filter = $state('all');
	let earnedList = $derived(badges.map((b) => ({ ...b, earned: $progress.earnedBadges.includes(b.id) })));
	let earned = $derived(earnedList.filter((b) => b.earned));
	let locked = $derived(earnedList.filter((b) => !b.earned));
	let pct = $derived(Math.round((earned.length / badges.length) * 100));
	let shown = $derived(
		filter === 'all'
			? earnedList
			: filter === 'earned'
				? earned
				: filter === 'locked'
					? locked
					: earnedList.filter((b) => b.category === filter)
	);
	let totalXpFromBadges = $derived(earned.reduce((s, b) => s + b.xp, 0));
	let next = $derived(earnedList.find((b) => !b.earned));

	let tabs = $derived([
		{ id: 'all', label: 'All', count: badges.length },
		{ id: 'earned', label: 'Earned', count: earned.length },
		{ id: 'locked', label: 'In progress', count: locked.length },
		{ id: 'mastery', label: 'Mastery' },
		{ id: 'streak', label: 'Streaks' },
		{ id: 'game', label: 'Games' }
	]);
</script>

<svelte:head><title>Achievements · Sabify</title></svelte:head>

<div class="space-y-5">
	<div class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0b2b1f] via-[#15452f] to-[#255f43] p-5 text-white sm:p-7">
		<div class="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl"></div>
		<div class="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
			<div>
				<p class="eyebrow !text-lime">Achievements</p>
				<h1 class="mt-2 display text-3xl font-semibold sm:text-4xl">Little wins. Real proof.</h1>
				<p class="mt-2 max-w-xl text-sm leading-relaxed text-white/60">Badges are not decoration. Each one marks a habit, a skill or a moment where you kept going. Collect them all at your own pace.</p>
				<div class="mt-4 flex flex-wrap gap-2">
					<span class="pill pill-dark text-[0.62rem]"><Trophy size={12} /> {earned.length} of {badges.length} earned</span>
					<span class="pill pill-dark text-[0.62rem]"><Zap size={12} /> {totalXpFromBadges.toLocaleString()} bonus XP</span>
				</div>
			</div>
			<div class="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
				<ProgressRing value={pct} size={100} stroke={9} color="#c9f26b" track="rgba(255,255,255,0.12)" sublabel="collected" />
				<div>
					<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-white/40">Completion</p>
					<p class="display text-2xl font-semibold text-lime">{pct}%</p>
					<p class="text-[0.64rem] text-white/50">Keep collecting</p>
				</div>
			</div>
		</div>
	</div>

	<div class="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
		<div>
			<Tabs {tabs} active={filter} onchange={(id) => (filter = id)} />
			{#if shown.length}
				<div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
					{#each shown as badge}
						<BadgeTile {badge} />
					{/each}
				</div>
			{:else}
				<div class="mt-4"><EmptyState title="No badges in this filter" body="Try another category or earn your first badge by finishing a lesson." emoji="🏅" cta="Find a lesson" href="/app/subjects" /></div>
			{/if}
		</div>

		<div class="space-y-4">
			{#if next}
				<div class="card p-4 sm:p-5">
					<div class="flex items-center gap-2"><Sparkles size={16} class="text-[#7a4f00]" /><p class="text-sm font-extrabold">Next up</p></div>
					<div class="mt-2 flex items-center gap-3">
						<span class={`grid h-14 w-14 place-items-center rounded-2xl text-2xl ${next.tone}`}>{next.emoji}</span>
						<div>
							<p class="display text-base font-semibold">{next.name}</p>
							<p class="text-[0.68rem] text-slate">{next.description}</p>
						</div>
					</div>
					<div class="mt-3">
						<div class="flex items-center justify-between text-[0.64rem] font-bold text-slate"><span>Progress</span><span>{next.progress}/{next.target}</span></div>
						<div class="progress-track mt-1 h-2"><div class="progress-fill" style={`width:${Math.min(100, (next.progress / next.target) * 100)}%`}></div></div>
					</div>
					<p class="mt-2 text-[0.64rem] font-bold text-[#0b6b45]">Reward: +{next.xp} XP</p>
				</div>
			{/if}

			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><Award size={16} class="text-forest" /><p class="text-sm font-extrabold">Recently earned</p></div>
				<div class="mt-2 space-y-2">
					{#each earned.slice(-4).reverse() as b}
						<div class="flex items-center gap-2.5 rounded-xl bg-[#faf8f0] p-2.5">
							<span class={`grid h-8 w-8 place-items-center rounded-xl text-base ${b.tone}`}>{b.emoji}</span>
							<div class="min-w-0 flex-1"><p class="truncate text-[0.72rem] font-extrabold">{b.name}</p><p class="text-[0.6rem] text-slate">+{b.xp} XP</p></div>
							<Check size={14} class="text-[#0b6b45]" />
						</div>
					{/each}
				</div>
			</div>

			<div class="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#e9ffc0] to-[#c9f26b] p-4">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-[#3f564b]">Badge philosophy</p>
						<p class="display mt-1 text-base font-semibold leading-tight">Reward the habit,<br />not just the result.</p>
					</div>
					<Mascot size={64} expression="wink" />
				</div>
				<p class="mt-1.5 text-[0.68rem] leading-relaxed text-[#3f564b]/80">A streak badge does not care whether you got everything right. It celebrates showing up — because consistency is what makes mastery possible.</p>
			</div>

			<div class="card p-4">
				<p class="text-sm font-extrabold">Locked by design</p>
				<div class="mt-2 space-y-1.5">
					{#each locked.slice(0, 3) as b}
						<div class="flex items-center gap-2 rounded-xl border border-[#eee9dc] px-2.5 py-2">
							<Lock size={12} class="text-slate" />
							<p class="flex-1 truncate text-[0.68rem] font-bold text-slate">{b.name}</p>
							<span class="text-[0.6rem] font-bold text-slate">{Math.min(100, Math.round((b.progress / b.target) * 100))}%</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
