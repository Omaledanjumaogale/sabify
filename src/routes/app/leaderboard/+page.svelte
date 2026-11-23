<script lang="ts">
	import { Crown, Flame, TrendingDown, TrendingUp, Trophy, Users, Zap } from '@lucide/svelte';
	import { leaderboard, weeklyXp } from '$lib/data/seed';
	import { progress, level, rankTitle } from '$lib/stores/progress';
	import { session } from '$lib/stores/session';
	import Avatar from '$lib/components/Avatar.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import BarChart from '$lib/components/BarChart.svelte';
	import SectionHeader from '$lib/components/SectionHeader.svelte';

	let scope = $state('class');
	let rows = $derived(leaderboard);
	let me = $derived(rows.find((r) => r.isMe));
	let myRank = $derived(rows.findIndex((r) => r.isMe) + 1);
	let podium = $derived([rows[1], rows[0], rows[2]]);
	let user = $derived($session.user);

	const tabs = [
		{ id: 'class', label: 'My class', count: 32 },
		{ id: 'school', label: 'My school', count: 412 },
		{ id: 'global', label: 'Global', count: 12480 }
	];
</script>

<svelte:head><title>Leaderboard · Sabify</title></svelte:head>

<div class="space-y-5">
	<div class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0b2b1f] via-[#15452f] to-[#255f43] p-5 text-white sm:p-7">
		<div class="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-gold/20 blur-3xl"></div>
		<div class="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
			<div>
				<p class="eyebrow !text-lime">Leaderboard</p>
				<h1 class="mt-2 display text-3xl font-semibold sm:text-4xl">The climb is the fun part.</h1>
				<p class="mt-2 max-w-xl text-sm leading-relaxed text-white/60">XP is earned through lessons, quizzes and games. Rankings reset every Monday so everyone gets a fresh start.</p>
			</div>
			<div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 backdrop-blur">
				<Avatar emoji={user?.avatar ?? '🦊'} size={44} ring={false} />
				<div>
					<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-white/40">Your position</p>
					<p class="display text-xl font-semibold">#{myRank} of 32</p>
				</div>
				<div class="border-l border-white/10 pl-3 text-right">
					<p class="display text-xl font-semibold text-lime">{$progress.xp.toLocaleString()}</p>
					<p class="text-[0.6rem] font-bold text-white/40">total XP</p>
				</div>
			</div>
		</div>
	</div>

	<Tabs tabs={tabs} active={scope} onchange={(id) => (scope = id)} />

	<div class="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
		<div class="space-y-4">
			<div class="grid grid-cols-3 items-end gap-2 rounded-[2rem] border border-[#e3ddca] bg-white p-4 pt-8 shadow-soft sm:gap-3 sm:p-6 sm:pt-10">
				{#each podium as row, i}
					{@const place = [2, 1, 3][i]}
					<div class={`flex flex-col items-center ${place === 1 ? 'order-2' : ''}`}>
						{#if place === 1}<Crown size={26} class="mb-1 text-[#d99a00]" fill="currentColor" />{/if}
						<div class="relative">
							<Avatar emoji={row.avatar} size={place === 1 ? 76 : 58} ring={place === 1} ringClass="ring-gold" />
							<span class={`absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full text-[0.6rem] font-extrabold ${place === 1 ? 'bg-gold text-ink' : place === 2 ? 'bg-[#dfe7e2] text-ink' : 'bg-[#f3d7c4] text-ink'}`}>{place}</span>
						</div>
						<p class="mt-2 max-w-full truncate text-center text-[0.72rem] font-extrabold">{row.name.split(' ')[0]}</p>
						<p class="text-[0.6rem] font-bold text-slate">{row.xp.toLocaleString()} XP</p>
						<div class={`mt-2 w-full rounded-t-xl ${place === 1 ? 'h-20 bg-gradient-to-t from-[#fff4d2] to-[#ffc53d]' : place === 2 ? 'h-14 bg-gradient-to-t from-[#f1f5f0] to-[#dfe7e2]' : 'h-10 bg-gradient-to-t from-[#fff0e4] to-[#f3d7c4]'}`}></div>
					</div>
				{/each}
			</div>

			<div class="card overflow-hidden">
				<div class="flex items-center justify-between border-b border-[#eee9dc] px-4 py-3">
					<p class="text-sm font-extrabold">Full ranking</p>
					<span class="pill text-[0.56rem]">Resets Monday</span>
				</div>
				<div class="divide-y divide-[#f4f1e6]">
					{#each rows as row, i}
						<div class={`flex items-center gap-2.5 px-4 py-3 ${row.isMe ? 'bg-[#f2fbdf]' : ''}`}>
							<span class={`w-6 text-center text-[0.7rem] font-extrabold ${i < 3 ? 'text-[#a27000]' : 'text-slate'}`}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
							<Avatar emoji={row.avatar} size={34} ring={false} />
							<div class="min-w-0 flex-1">
								<p class="truncate text-[0.8rem] font-extrabold">{row.name} {#if row.isMe}<span class="pill ml-1 text-[0.5rem]">You</span>{/if}</p>
								<p class="text-[0.62rem] text-slate">{row.grade}</p>
							</div>
							<div class="hidden items-center gap-1 text-[0.66rem] font-bold text-[#a23c17] sm:flex"><Flame size={11} /> {row.streak}</div>
							<div class="w-16 text-right text-[0.74rem] font-extrabold">{row.xp.toLocaleString()}</div>
							<div class={`flex w-9 items-center justify-end gap-0.5 text-[0.6rem] font-bold ${row.trend > 0 ? 'text-[#0b6b45]' : row.trend < 0 ? 'text-[#b42318]' : 'text-slate'}`}>
								{#if row.trend > 0}<TrendingUp size={11} /> +{row.trend}{:else if row.trend < 0}<TrendingDown size={11} /> {row.trend}{:else}—{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<p class="display text-base font-semibold">Your week</p>
				<p class="text-[0.68rem] text-slate">XP earned this week</p>
				<div class="mt-3"><BarChart data={weeklyXp} height={140} color="#10b981" accent="#c9f26b" showValues /></div>
				<div class="mt-3 grid grid-cols-2 gap-2">
					<div class="rounded-xl bg-[#f7f5ec] p-2.5"><p class="text-[0.58rem] font-bold uppercase text-slate">Level</p><p class="display text-lg font-semibold">{$level} · {$rankTitle}</p></div>
					<div class="rounded-xl bg-[#f7f5ec] p-2.5"><p class="text-[0.58rem] font-bold uppercase text-slate">Streak</p><p class="display text-lg font-semibold">{$progress.streak} days</p></div>
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><Trophy size={16} class="text-[#a27000]" /><p class="text-sm font-extrabold">How ranking works</p></div>
				<ul class="mt-2 space-y-2 text-[0.7rem] leading-snug text-slate">
					<li class="flex gap-2"><span class="text-emerald">✦</span> Lessons award 25–100 XP depending on difficulty.</li>
					<li class="flex gap-2"><span class="text-emerald">✦</span> Quizzes award 10–20 XP per correct answer.</li>
					<li class="flex gap-2"><span class="text-emerald">✦</span> Games award XP based on score and streak.</li>
					<li class="flex gap-2"><span class="text-emerald">✦</span> Rankings reset every Monday at 00:00 WAT.</li>
				</ul>
			</div>

			<div class="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#fff4d2] to-[#ffc53d] p-4">
				<div class="flex items-center gap-2"><Users size={16} class="text-[#7a4f00]" /><p class="text-sm font-extrabold text-[#4a3500]">Class challenge</p></div>
				<p class="mt-1.5 text-[0.72rem] leading-relaxed text-[#4a3500]/80">Primary 5B is 4,200 XP behind Primary 5A. Finish a lesson today to close the gap.</p>
				<div class="mt-3 flex items-center gap-2">
					<div class="h-2 flex-1 overflow-hidden rounded-full bg-white/60"><div class="h-full w-[78%] rounded-full bg-[#0b6b45]"></div></div>
					<span class="text-[0.62rem] font-extrabold text-[#4a3500]">78%</span>
				</div>
				<a href="/app/subjects" class="btn btn-primary btn-sm mt-3"><Zap size={13} /> Earn XP for the class</a>
			</div>

			<div class="card p-4">
				<p class="text-sm font-extrabold">Top of the school</p>
				<div class="mt-2 space-y-1.5">
					{#each rows.slice(0, 3) as row, i}
						<div class="flex items-center gap-2 rounded-xl bg-[#faf8f0] px-2.5 py-2">
							<span class="w-4 text-center text-[0.62rem] font-extrabold text-slate">{i + 1}</span>
							<Avatar emoji={row.avatar} size={26} ring={false} />
							<p class="min-w-0 flex-1 truncate text-[0.7rem] font-bold">{row.name}</p>
							<span class="text-[0.62rem] font-extrabold">{row.xp.toLocaleString()}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
