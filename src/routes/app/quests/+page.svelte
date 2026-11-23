<script lang="ts">
	import { Check, Coins, Flame, Gift, Snowflake, Sparkles, Star, Zap } from '@lucide/svelte';
	import { quests as questSeed } from '$lib/data/seed';
	import { addCoins, claimQuest, liveQuests, progress } from '$lib/stores/progress';
	import { celebrate } from '$lib/utils';
	import { toast } from '$lib/stores/toast';
	import QuestRow from '$lib/components/QuestRow.svelte';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import Mascot from '$lib/components/Mascot.svelte';

	let claimed = $state<string[]>([]);
	let daily = $derived($liveQuests.filter((q) => q.kind === 'daily'));
	let weekly = $derived($liveQuests.filter((q) => q.kind === 'weekly'));
	let dailyDone = $derived(daily.filter((q) => q.progress >= q.target).length);
	let dailyPct = $derived(Math.round((dailyDone / daily.length) * 100));
	let weekDays = $derived(
		['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({ d, done: i < Math.min(7, $progress.streak % 7 || 7), today: i === new Date().getDay() - 1 }))
	);

	const rewards = [
		{ id: 'freeze', name: 'Streak freeze', desc: 'Protect one missed day.', emoji: '❄️', cost: 250, tone: 'bg-[#eaf8ff]' },
		{ id: 'frame', name: 'Golden avatar frame', desc: 'Show off on the leaderboard.', emoji: '🖼️', cost: 400, tone: 'bg-[#fff4d2]' },
		{ id: 'theme', name: 'Sabi dark theme', desc: 'A calmer night-time look.', emoji: '🌙', cost: 500, tone: 'bg-[#f0edff]' },
		{ id: 'double', name: 'Double XP hour', desc: 'One hour of 2× XP.', emoji: '⚡', cost: 600, tone: 'bg-[#e9fbf1]' }
	];
	let owned = $state<string[]>([]);

	function claim(id: string, xp: number, title: string) {
		claimQuest(id, xp);
		claimed = [...claimed, id];
		toast(`Quest claimed — +${xp} XP`, 'xp', '⚡');
		celebrate();
	}

	function buy(id: string, cost: number, name: string) {
		if ($progress.coins < cost) {
			toast('Not enough coins yet. Complete quests to earn more.', 'info', '🪙');
			return;
		}
		addCoins(-cost);
		owned = [...owned, id];
		toast(`${name} unlocked!`, 'success', '🎁');
	}

	let weeklyPct = $derived(Math.round((weekly.filter((q) => q.progress >= q.target).length / weekly.length) * 100));
</script>

<svelte:head><title>Quests · Sabify</title></svelte:head>

<div class="space-y-5">
	<div class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0b2b1f] via-[#15452f] to-[#255f43] p-5 text-white sm:p-7">
		<div class="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-lime/15 blur-3xl"></div>
		<div class="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
			<div class="max-w-2xl">
				<p class="eyebrow !text-lime">Quests & rewards</p>
				<h1 class="mt-2 display text-3xl font-semibold sm:text-4xl">Small missions. Big momentum.</h1>
				<p class="mt-2 text-sm leading-relaxed text-white/60">Daily quests reset at midnight. Weekly quests reset on Monday. Finish them to earn XP and coins, then spend coins in the reward shop.</p>
				<div class="mt-4 flex flex-wrap gap-2">
					<span class="pill pill-dark text-[0.62rem]"><Coins size={12} /> {$progress.coins.toLocaleString()} coins</span>
					<span class="pill pill-dark text-[0.62rem]"><Flame size={12} /> {$progress.streak}-day streak</span>
					<span class="pill pill-dark text-[0.62rem]"><Snowflake size={12} /> {$progress.freezes} freezes</span>
				</div>
			</div>
			<div class="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
				<ProgressRing value={dailyPct} size={94} stroke={8} color="#c9f26b" track="rgba(255,255,255,0.12)" sublabel="today" />
				<div>
					<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-white/40">Daily progress</p>
					<p class="display text-2xl font-semibold text-lime">{dailyDone}/{daily.length}</p>
					<p class="text-[0.64rem] text-white/50">quests complete</p>
				</div>
			</div>
		</div>
	</div>

	<div class="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<div class="flex items-center justify-between">
					<div>
						<h2 class="display text-lg font-semibold">Daily quests</h2>
						<p class="text-[0.68rem] text-slate">Fresh set every day. Claim before midnight.</p>
					</div>
					<span class="pill pill-gold text-[0.58rem]">{dailyDone}/{daily.length} done</span>
				</div>
				<div class="mt-1 divide-y divide-[#f0ece0]">
					{#each daily as q}
						<QuestRow quest={q} claimed={claimed.includes(q.id)} onclaim={() => claim(q.id, q.xp, q.title)} />
					{/each}
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center justify-between">
					<div>
						<h2 class="display text-lg font-semibold">Weekly quests</h2>
						<p class="text-[0.68rem] text-slate">Bigger goals, bigger rewards. Resets Monday.</p>
					</div>
					<span class="pill text-[0.58rem]">{weeklyPct}%</span>
				</div>
				<div class="mt-1 divide-y divide-[#f0ece0]">
					{#each weekly as q}
						<QuestRow quest={q} claimed={claimed.includes(q.id)} onclaim={() => claim(q.id, q.xp, q.title)} />
					{/each}
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center justify-between">
					<div>
						<h2 class="display text-lg font-semibold">Reward shop</h2>
						<p class="text-[0.68rem] text-slate">Spend coins on extras, not on learning.</p>
					</div>
					<span class="pill pill-gold text-[0.58rem]"><Coins size={11} /> {$progress.coins.toLocaleString()}</span>
				</div>
				<div class="mt-3 grid gap-2.5 sm:grid-cols-2">
					{#each rewards as r}
						<div class="flex items-center gap-3 rounded-2xl border border-[#eee9dc] p-3">
							<span class={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg ${r.tone}`}>{r.emoji}</span>
							<div class="min-w-0 flex-1">
								<p class="text-[0.74rem] font-extrabold">{r.name}</p>
								<p class="text-[0.62rem] text-slate">{r.desc}</p>
							</div>
							<button class="btn btn-ghost btn-sm shrink-0" disabled={owned.includes(r.id)} onclick={() => buy(r.id, r.cost, r.name)}>
								{#if owned.includes(r.id)}<Check size={13} />{:else}<Coins size={12} /> {r.cost}{/if}
							</button>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2"><Flame size={17} class="text-coral" /><p class="text-sm font-extrabold">Streak calendar</p></div>
					<span class="pill pill-coral text-[0.56rem]">{$progress.streak} days</span>
				</div>
				<div class="mt-3 grid grid-cols-7 gap-1.5">
					{#each weekDays as day}
						<div class="text-center">
							<p class="text-[0.56rem] font-bold text-slate">{day.d}</p>
							<div class={`mt-1 grid aspect-square place-items-center rounded-xl text-sm ${day.done ? 'bg-[#ffd7c9] text-[#a23c17]' : day.today ? 'border-2 border-dashed border-[#c9d7b8] bg-white' : 'bg-[#f4f1e6] text-slate/40'}`}>
								{#if day.done}🔥{:else}·{/if}
							</div>
						</div>
					{/each}
				</div>
				<div class="mt-3 flex items-center gap-2 rounded-xl bg-[#eaf8ff] p-2.5">
					<Snowflake size={16} class="text-[#0a6486]" />
					<div class="flex-1">
						<p class="text-[0.68rem] font-extrabold text-[#0a6486]">Streak freeze</p>
						<p class="text-[0.6rem] text-[#0a6486]/70">{$progress.freezes} available. Protects one missed day.</p>
					</div>
				</div>
				<div class="mt-3">
					<div class="flex items-center justify-between text-[0.62rem] font-bold text-slate"><span>Best streak</span><span>{$progress.bestStreak} days</span></div>
					<div class="progress-track mt-1 h-1.5"><div class="progress-fill" style={`width:${Math.min(100, ($progress.streak / 30) * 100)}%`}></div></div>
					<p class="mt-1 text-[0.6rem] text-slate">30 days unlocks the Unstoppable badge.</p>
				</div>
			</div>

			<div class="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#fff4d2] to-[#ffc53d] p-4">
				<div class="flex items-center gap-2"><Gift size={16} class="text-[#7a4f00]" /><p class="text-sm font-extrabold text-[#4a3500]">Weekly chest</p></div>
				<p class="mt-1.5 text-[0.72rem] leading-relaxed text-[#4a3500]/80">Complete 5 of 7 daily quests to unlock a chest with 100 coins and a bonus badge.</p>
				<div class="mt-3 flex items-center gap-2">
					<div class="h-2 flex-1 overflow-hidden rounded-full bg-white/60"><div class="h-full rounded-full bg-[#0b6b45]" style={`width:${Math.min(100, (dailyDone / 5) * 100)}%`}></div></div>
					<span class="text-[0.62rem] font-extrabold text-[#4a3500]">{dailyDone}/5</span>
				</div>
				<button class="btn btn-primary btn-sm mt-3" disabled={dailyDone < 5} onclick={() => { addCoins(100); toast('Weekly chest opened — +100 coins!', 'success', '🎁'); celebrate(); }}>
					{dailyDone >= 5 ? 'Open chest' : 'Keep going'}
				</button>
			</div>

			<div class="card p-4">
				<div class="flex items-center gap-2"><Sparkles size={16} class="text-[#7a4f00]" /><p class="text-sm font-extrabold">Quest tips</p></div>
				<ul class="mt-2 space-y-1.5 text-[0.68rem] leading-snug text-slate">
					<li class="flex gap-1.5"><Star size={11} class="mt-0.5 shrink-0 text-[#a27000]" /> Start with the easiest quest to build momentum.</li>
					<li class="flex gap-1.5"><Star size={11} class="mt-0.5 shrink-0 text-[#a27000]" /> Games count toward XP quests too.</li>
					<li class="flex gap-1.5"><Star size={11} class="mt-0.5 shrink-0 text-[#a27000]" /> Claim rewards before midnight — they reset.</li>
				</ul>
				<div class="mt-3 flex items-center gap-2 rounded-xl bg-[#faf8f0] p-2.5">
					<Mascot size={44} expression="think" />
					<p class="text-[0.64rem] font-semibold leading-snug text-[#3f564b]">“Consistency beats cramming. Ten minutes today is worth more than two hours on Sunday.”</p>
				</div>
			</div>
		</div>
	</div>
</div>
