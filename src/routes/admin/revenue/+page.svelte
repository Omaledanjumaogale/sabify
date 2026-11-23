<script lang="ts">
	import { ArrowDown, ArrowRight, ArrowUp, Banknote, CalendarDays, CreditCard, Download, GraduationCap, Landmark, ReceiptText, TrendingUp, Wallet } from '@lucide/svelte';
	import { adminMetrics } from '$lib/data/seed';
	import { formatNaira } from '$lib/utils';
	import { toast } from '$lib/stores/toast';
	import BarChart from '$lib/components/BarChart.svelte';
	import DonutChart from '$lib/components/DonutChart.svelte';
	import LineChart from '$lib/components/LineChart.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import Tabs from '$lib/components/Tabs.svelte';

	let tab = $state('transactions');
	let range = $state('Last 6 months');

	let months = [
		{ label: 'Jun', value: 11.2 }, { label: 'Jul', value: 12.8 }, { label: 'Aug', value: 14.1 }, { label: 'Sep', value: 15.6 }, { label: 'Oct', value: 17.2 }, { label: 'Nov', value: 18.45 }
	];
	let forecast = [
		{ label: 'Dec', value: 20.1 }, { label: 'Jan', value: 21.8 }, { label: 'Feb', value: 23.4 }, { label: 'Mar', value: 25.6 }
	];
	let tx = [
		{ id: 'TXN-8821', who: 'Ngozi Okafor', plan: 'Family monthly', amount: 5000, method: 'Card · 4242', date: '24 Nov, 09:14', status: 'Successful' },
		{ id: 'TXN-8820', who: 'Greenfield Academy', plan: 'School · 120 seats', amount: 420000, method: 'Bank transfer', date: '24 Nov, 08:02', status: 'Successful' },
		{ id: 'TXN-8819', who: 'Kunle Adeyemi', plan: 'Family annual', amount: 50000, method: 'Paystack', date: '23 Nov, 19:41', status: 'Successful' },
		{ id: 'TXN-8818', who: 'Crescent International', plan: 'School · 240 seats', amount: 840000, method: 'Bank transfer', date: '23 Nov, 14:12', status: 'Pending' },
		{ id: 'TXN-8817', who: 'Blessing Nwosu', plan: 'Family monthly', amount: 5000, method: 'Card · 8810', date: '23 Nov, 11:05', status: 'Failed' },
		{ id: 'TXN-8816', who: 'Unity College', plan: 'School · 180 seats', amount: 630000, method: 'Bank transfer', date: '22 Nov, 16:30', status: 'Successful' }
	];
	let invoices = [
		{ school: 'Greenfield Academy', seats: 120, rate: 3500, total: 420000, due: '1 Dec 2026', status: 'Paid' },
		{ school: 'Crescent International', seats: 240, rate: 3500, total: 840000, due: '1 Dec 2026', status: 'Pending' },
		{ school: 'Unity College', seats: 180, rate: 3500, total: 630000, due: '1 Dec 2026', status: 'Paid' },
		{ school: 'Bright Future Academy', seats: 90, rate: 3500, total: 315000, due: '5 Dec 2026', status: 'Overdue' }
	];
	let statusTone: Record<string, string> = { Successful: '', Pending: 'pill-gold', Failed: 'pill-coral', Paid: '', Overdue: 'pill-coral' };
</script>

<svelte:head><title>Revenue · Sabify admin</title></svelte:head>

<div class="space-y-5">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">Finance</p>
			<h1 class="mt-1 display text-2xl font-semibold sm:text-3xl">Revenue & payments</h1>
			<p class="mt-1 text-sm text-slate">MRR, collections and school invoicing in Naira.</p>
		</div>
		<div class="flex gap-2">
			<select class="input !min-h-10 !w-auto !rounded-full !py-2 text-xs font-bold" bind:value={range} aria-label="Date range"><option>Last 6 months</option><option>This year</option><option>All time</option></select>
			<button class="btn btn-primary btn-sm" onclick={() => toast('Finance report exported', 'success', '⬇️')}><Download size={14} /> Export</button>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-3 lg:grid-cols-5">
		<StatCard label="MRR" value={formatNaira(adminMetrics.mrr, true)} emoji="💳" tone="bg-[#e9fbf1]" trend="+8.4%" sub="₦18.45m" />
		<StatCard label="ARR" value="₦221.4m" emoji="📈" tone="bg-[#eaf8ff]" trend="+64%" sub="Annualised" />
		<StatCard label="School revenue" value="₦5.7m" emoji="🏫" tone="bg-[#fff4d2]" trend="+11%" sub="31% of MRR" />
		<StatCard label="Failed payments" value="₦84k" emoji="⚠️" tone="bg-[#fff1ee]" trend="-18%" trendUp={false} sub="7 retries queued" />
		<StatCard label="Net revenue" value="₦17.9m" emoji="🏦" tone="bg-[#f0edff]" trend="+8.1%" sub="After fees" />
	</div>

	<div class="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<div class="flex flex-wrap items-start justify-between gap-2">
					<div><h2 class="display text-base font-semibold">Revenue vs forecast</h2><p class="text-[0.68rem] text-slate">Monthly recurring revenue, millions of Naira</p></div>
					<span class="pill text-[0.58rem]"><TrendingUp size={11} /> Tracking 4% above plan</span>
				</div>
				<div class="mt-4 grid gap-4 sm:grid-cols-[1.35fr_1fr]">
					<div><BarChart data={months} height={150} color="#0d3b2a" accent="#c9f26b" showValues /></div>
					<div>
						<p class="text-[0.58rem] font-extrabold uppercase tracking-wider text-slate">Next quarter forecast</p>
						<div class="mt-1 space-y-1.5">
							{#each forecast as f}
								<div class="flex items-center gap-2"><span class="w-8 text-[0.62rem] font-bold text-slate">{f.label}</span><div class="progress-track h-2 flex-1"><div class="h-full rounded-full bg-[#9fc7af]" style={`width:${(f.value / 26) * 100}%`}></div></div><span class="w-12 text-right text-[0.62rem] font-extrabold">₦{f.value}m</span></div>
							{/each}
						</div>
						<p class="mt-2 rounded-xl bg-[#f7f5ec] p-2 text-[0.6rem] leading-snug text-slate">Forecast assumes 2.1% churn and 14 new schools by March.</p>
					</div>
				</div>
			</div>

			<Tabs tabs={[{ id: 'transactions', label: 'Transactions' }, { id: 'schools', label: 'School invoices' }]} bind:active={tab} />

			{#if tab === 'transactions'}
				<div class="card overflow-hidden">
					<div class="overflow-x-auto">
						<table class="w-full min-w-[680px] text-left">
							<thead><tr class="bg-[#faf8f0] text-[0.56rem] uppercase tracking-wider text-slate"><th class="px-4 py-2.5 font-extrabold">Reference</th><th class="px-3 py-2.5 font-extrabold">Customer</th><th class="px-3 py-2.5 font-extrabold">Plan</th><th class="px-3 py-2.5 font-extrabold">Method</th><th class="px-3 py-2.5 font-extrabold">Date</th><th class="px-3 py-2.5 text-right font-extrabold">Amount</th><th class="px-3 py-2.5 text-right font-extrabold">Status</th></tr></thead>
							<tbody>
								{#each tx as t}
									<tr class="border-t border-[#f4f1e6] transition hover:bg-[#fbfdf7]">
										<td class="px-4 py-2.5 text-[0.62rem] font-bold text-slate">{t.id}</td>
										<td class="px-3 py-2.5 text-[0.7rem] font-extrabold">{t.who}</td>
										<td class="px-3 py-2.5 text-[0.62rem] text-slate">{t.plan}</td>
										<td class="px-3 py-2.5 text-[0.62rem] text-slate">{t.method}</td>
										<td class="px-3 py-2.5 text-[0.6rem] text-slate">{t.date}</td>
										<td class="px-3 py-2.5 text-right text-[0.7rem] font-extrabold">{formatNaira(t.amount)}</td>
										<td class="px-3 py-2.5 text-right"><span class={`pill text-[0.5rem] ${statusTone[t.status]}`}>{t.status}</span></td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					<div class="flex items-center justify-between border-t border-[#eee9dc] px-4 py-2.5 text-[0.62rem] font-bold text-slate"><span>6 of 8,214 transactions</span><button class="font-extrabold text-forest" onclick={() => toast('Full ledger opened', 'info', '📒')}>View full ledger</button></div>
				</div>
			{:else}
				<div class="card overflow-hidden">
					<div class="overflow-x-auto">
						<table class="w-full min-w-[620px] text-left">
							<thead><tr class="bg-[#faf8f0] text-[0.56rem] uppercase tracking-wider text-slate"><th class="px-4 py-2.5 font-extrabold">School</th><th class="px-3 py-2.5 font-extrabold">Seats</th><th class="px-3 py-2.5 font-extrabold">Rate</th><th class="px-3 py-2.5 font-extrabold">Due</th><th class="px-3 py-2.5 text-right font-extrabold">Amount</th><th class="px-3 py-2.5 text-right font-extrabold">Status</th></tr></thead>
							<tbody>
								{#each invoices as i}
									<tr class="border-t border-[#f4f1e6]">
										<td class="px-4 py-2.5 text-[0.7rem] font-extrabold">{i.school}</td>
										<td class="px-3 py-2.5 text-[0.66rem]">{i.seats}</td>
										<td class="px-3 py-2.5 text-[0.62rem] text-slate">{formatNaira(i.rate)}/learner</td>
										<td class="px-3 py-2.5 text-[0.6rem] text-slate">{i.due}</td>
										<td class="px-3 py-2.5 text-right text-[0.7rem] font-extrabold">{formatNaira(i.total)}</td>
										<td class="px-3 py-2.5 text-right"><span class={`pill text-[0.5rem] ${statusTone[i.status]}`}>{i.status}</span></td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					<div class="flex items-center justify-between border-t border-[#eee9dc] px-4 py-2.5 text-[0.62rem] font-bold text-slate"><span>December invoicing not yet issued</span><button class="font-extrabold text-forest" onclick={() => toast('December invoices queued for 1 Dec', 'success', '🧾')}>Generate invoices</button></div>
				</div>
			{/if}

			<div class="card p-4 sm:p-5">
				<h2 class="display text-base font-semibold">Payment health</h2>
				<div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
					{#each [{ l: 'Success rate', v: '98.2%', d: '+0.6%' }, { l: 'Avg. collection', v: '1.4 days', d: '-0.2' }, { l: 'Failed retries', v: '7', d: '-3' }, { l: 'Chargeback', v: '0.04%', d: 'stable' }] as s}
						<div class="rounded-xl bg-[#f7f5ec] p-2.5"><p class="display text-lg font-semibold">{s.v}</p><p class="text-[0.54rem] font-bold uppercase tracking-wider text-slate">{s.l}</p><p class="text-[0.56rem] font-extrabold text-[#0b6b45]">{s.d}</p></div>
					{/each}
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<h2 class="display text-base font-semibold">Revenue by plan</h2>
				<div class="mt-3 flex items-center gap-4">
					<DonutChart data={adminMetrics.planSplit} size={124} thickness={18} centerLabel="18.4m" centerSub="MRR" />
					<div class="space-y-1.5">
						{#each adminMetrics.planSplit as p}
							<div class="flex items-center gap-1.5 text-[0.64rem] font-bold"><span class="h-2 w-2 rounded-full" style={`background:${p.color}`}></span>{p.label}<span class="text-slate">{p.value}%</span></div>
						{/each}
					</div>
				</div>
				<p class="mt-2 text-[0.62rem] text-slate">Family monthly is the largest stream at ₦11.4m.</p>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><Landmark size={16} class="text-forest" /><p class="text-sm font-extrabold">Payout schedule</p></div>
				<div class="mt-2 space-y-2">
					{#each [{ d: '29 Nov 2026', a: 4_210_000, s: 'Scheduled' }, { d: '22 Nov 2026', a: 3_980_000, s: 'Paid' }, { d: '15 Nov 2026', a: 3_740_000, s: 'Paid' }] as p}
						<div class="flex items-center gap-2 rounded-xl bg-[#faf8f0] px-2.5 py-2">
							<div class="min-w-0 flex-1"><p class="text-[0.66rem] font-extrabold">{formatNaira(p.a)}</p><p class="text-[0.58rem] text-slate">{p.d}</p></div>
							<span class={`pill text-[0.48rem] ${p.s === 'Paid' ? '' : 'pill-gold'}`}>{p.s}</span>
						</div>
					{/each}
				</div>
				<p class="mt-2 text-[0.58rem] text-slate">Settled to GTBank ···· 8821</p>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><ReceiptText size={16} class="text-forest" /><p class="text-sm font-extrabold">Unit economics</p></div>
				<div class="mt-2 space-y-2">
					{#each [{ l: 'ARPU', v: '₦1,478' }, { l: 'CAC', v: '₦2,900' }, { l: 'LTV', v: '₦24,600' }, { l: 'LTV : CAC', v: '8.5×' }] as m}
						<div class="flex items-center justify-between border-b border-[#f4f1e6] pb-1.5 text-[0.7rem]"><span class="font-semibold text-slate">{m.l}</span><span class="font-extrabold">{m.v}</span></div>
					{/each}
				</div>
			</div>

			<div class="relative overflow-hidden rounded-[1.75rem] bg-[#0b2b1f] p-4 text-white">
				<div class="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-lime/15 blur-2xl"></div>
				<div class="relative flex items-center gap-2"><Wallet size={16} class="text-lime" /><p class="text-sm font-extrabold">Pricing opportunity</p></div>
				<p class="relative mt-1.5 text-[0.72rem] leading-relaxed text-white/65">Annual conversion is 22%. A 10% discount for annual Family could add ₦1.3m MRR while reducing churn.</p>
				<button class="btn btn-lime btn-sm relative mt-3" onclick={() => toast('Pricing experiment drafted', 'success', '🧪')}>Draft experiment <ArrowRight size={13} /></button>
			</div>

			<div class="card p-4">
				<div class="flex items-center gap-2"><CalendarDays size={15} class="text-forest" /><p class="text-sm font-extrabold">Upcoming</p></div>
				<div class="mt-2 space-y-1.5 text-[0.66rem]">
					<div class="flex justify-between"><span class="text-slate">1 Dec · School invoices</span><span class="font-extrabold">₦2.2m</span></div>
					<div class="flex justify-between"><span class="text-slate">5 Dec · Paystack payout</span><span class="font-extrabold">₦4.2m</span></div>
					<div class="flex justify-between"><span class="text-slate">31 Dec · VAT filing</span><span class="font-extrabold">₦1.1m</span></div>
				</div>
			</div>
		</div>
	</div>
</div>
