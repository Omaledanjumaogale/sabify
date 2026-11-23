<script lang="ts">
	import { ArrowRight, BadgeCheck, Banknote, Check, CreditCard, ExternalLink, Lock, RefreshCw, ShieldCheck, Sparkles, Users, X, Zap } from '@lucide/svelte';
	import { session, setPlan } from '$lib/stores/session';
	import { pricingPlans } from '$lib/data/seed';
	import { formatNaira, celebrate } from '$lib/utils';
	import { toast } from '$lib/stores/toast';
	import Modal from '$lib/components/Modal.svelte';
	import Mascot from '$lib/components/Mascot.svelte';

	let user = $derived($session.user);
	let active = $derived(user?.plan !== 'free');
	let billing = $state<'monthly' | 'annual'>('monthly');
	let checkout = $state(false);
	let cancelOpen = $state(false);
	let method = $state('paystack');
	let paying = $state(false);
	let paid = $state(false);

	const history = [
		{ date: '24 Nov 2026', ref: 'SBF-8F2K19', amount: 5000, status: 'Paid', method: 'Paystack · card' },
		{ date: '24 Oct 2026', ref: 'SBF-7D1J82', amount: 5000, status: 'Paid', method: 'Paystack · card' },
		{ date: '24 Sep 2026', ref: 'SBF-6C0H71', amount: 5000, status: 'Paid', method: 'Bank transfer' },
		{ date: '24 Aug 2026', ref: 'SBF-5B9G60', amount: 0, status: 'Free trial', method: '—' }
	];

	function pay() {
		paying = true;
		setTimeout(() => {
			paying = false;
			paid = true;
			setPlan('family');
			celebrate(['#c9f26b', '#ffc53d', '#10b981']);
			toast('Payment successful — Family plan activated', 'success', '💳');
			setTimeout(() => {
				checkout = false;
				paid = false;
			}, 1400);
		}, 1600);
	}

	function cancelPlan() {
		setPlan('free');
		cancelOpen = false;
		toast('Subscription cancelled. You keep access until the end of the period.', 'info', '📅');
	}

	let annualTotal = 5000 * 10;
	let price = $derived(billing === 'monthly' ? 5000 : annualTotal);
</script>

<svelte:head><title>Subscription · Sabify</title></svelte:head>

<div class="space-y-5">
	<div>
		<h1 class="display text-2xl font-semibold sm:text-3xl">Subscription</h1>
		<p class="mt-1 text-sm text-slate">Simple, honest pricing in Naira. Cancel anytime.</p>
	</div>

	<div class="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
		<div class="space-y-4">
			<div class="relative overflow-hidden rounded-[2rem] bg-[#0b2b1f] p-5 text-white sm:p-7">
				<div class="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-lime/15 blur-3xl"></div>
				<div class="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<div class="flex flex-wrap items-center gap-2">
							<span class="pill pill-dark text-[0.58rem]">Current plan</span>
							<span class={`pill text-[0.58rem] ${active ? 'bg-lime text-ink' : 'bg-white/10 text-white'}`}>{active ? '● Active' : 'Free forever'}</span>
						</div>
						<h2 class="mt-2 display text-3xl font-semibold">{active ? 'Family' : 'Explorer'}</h2>
						<p class="mt-1 text-sm text-white/55">{active ? 'Everything unlocked for one learner.' : 'A taste of Sabify with limited lessons and games.'}</p>
						<div class="mt-3 flex items-end gap-1.5">
							<span class="display text-3xl font-semibold text-lime">{active ? formatNaira(5000) : '₦0'}</span>
							<span class="pb-1 text-[0.68rem] font-bold text-white/40">{active ? 'per month' : 'forever'}</span>
						</div>
						<p class="mt-1 text-[0.66rem] text-white/40">{active ? 'Renews 24 December 2026 · Paystack card ending 4242' : 'Upgrade anytime to unlock everything.'}</p>
					</div>
					<div class="flex flex-col gap-2">
						{#if active}
							<button class="btn btn-lime btn-sm" onclick={() => { paid = false; checkout = true; }}><RefreshCw size={14} /> Renew or change plan</button>
							<button class="btn btn-white btn-sm" onclick={() => (cancelOpen = true)}>Cancel subscription</button>
						{:else}
							<button class="btn btn-lime btn-sm" onclick={() => { paid = false; checkout = true; }}>Upgrade to Family <ArrowRight size={14} /></button>
							<a href="/pricing" class="btn btn-white btn-sm">Compare plans</a>
						{/if}
					</div>
				</div>
				<div class="relative mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 sm:grid-cols-4">
					{#each [{ l: 'Lessons', v: active ? 'Unlimited' : '2 / week' }, { l: 'Games', v: active ? 'All 7' : '2' }, { l: 'AI tutor', v: active ? 'Included' : 'Limited' }, { l: 'Reports', v: active ? 'Weekly' : '—' }] as f}
						<div><p class="text-[0.56rem] font-bold uppercase tracking-wider text-white/35">{f.l}</p><p class="text-[0.7rem] font-extrabold text-white/75">{f.v}</p></div>
					{/each}
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 class="display text-lg font-semibold">Choose your plan</h2>
						<p class="text-[0.68rem] text-slate">All prices in Nigerian Naira. No hidden fees.</p>
					</div>
					<div class="flex rounded-full border border-[#e5e0d1] bg-[#f1eee3] p-1">
						<button class={`rounded-full px-3 py-1.5 text-[0.66rem] font-extrabold ${billing === 'monthly' ? 'bg-white shadow-sm' : 'text-slate'}`} onclick={() => (billing = 'monthly')}>Monthly</button>
						<button class={`rounded-full px-3 py-1.5 text-[0.66rem] font-extrabold ${billing === 'annual' ? 'bg-white shadow-sm' : 'text-slate'}`} onclick={() => (billing = 'annual')}>Annual · 2 months free</button>
					</div>
				</div>
				<div class="mt-4 grid gap-3 sm:grid-cols-2">
					{#each pricingPlans.filter((p) => p.id !== 'free') as plan}
						<div class={`relative rounded-2xl border p-4 ${plan.highlight ? 'border-forest bg-[#f2fbdf]' : 'border-[#e5e0d1] bg-white'}`}>
							{#if plan.highlight}<span class="absolute -top-2.5 left-4 rounded-full bg-lime px-2 py-0.5 text-[0.54rem] font-extrabold uppercase tracking-wider text-ink">Recommended</span>{/if}
							<div class="flex items-center justify-between">
								<p class="text-sm font-extrabold">{plan.name}</p>
								{#if plan.id === 'family' && active}<span class="pill text-[0.52rem]">Current</span>{/if}
							</div>
							<div class="mt-1 flex items-end gap-1">
								<span class="display text-2xl font-semibold">{formatNaira(plan.id === 'family' ? price : plan.price)}</span>
								<span class="pb-1 text-[0.6rem] font-bold text-slate">{plan.id === 'family' ? (billing === 'monthly' ? '/month' : '/year') : plan.cadence}</span>
							</div>
							<ul class="mt-2 space-y-1">
								{#each plan.features.slice(0, 4) as f}<li class="flex items-start gap-1 text-[0.66rem] font-semibold text-[#3f564b]"><Check size={11} class="mt-0.5 shrink-0 text-emerald" /> {f}</li>{/each}
							</ul>
							<button class={`btn btn-sm mt-3 w-full ${plan.highlight ? 'btn-primary' : 'btn-ghost'}`} onclick={() => { if (plan.id === 'school') { toast('School enquiry form opened — our team will reach out.', 'info', '🏫'); return; } paid = false; checkout = true; }}>
								{plan.id === 'school' ? 'Talk to our team' : plan.id === 'family' ? (active ? 'Manage plan' : 'Choose Family') : 'Upgrade to Family Plus'}
							</button>
						</div>
					{/each}
				</div>
			</div>

			<div class="card overflow-hidden">
				<div class="flex items-center justify-between border-b border-[#eee9dc] px-4 py-3">
					<h2 class="display text-base font-semibold">Billing history</h2>
					<span class="pill text-[0.56rem]">4 records</span>
				</div>
				<div class="divide-y divide-[#f4f1e6]">
					{#each history as h}
						<div class="flex flex-wrap items-center gap-2 px-4 py-3">
							<div class="min-w-0 flex-1">
								<p class="text-[0.74rem] font-extrabold">{h.date}</p>
								<p class="text-[0.6rem] text-slate">{h.ref} · {h.method}</p>
							</div>
							<span class={`pill text-[0.54rem] ${h.status === 'Paid' ? '' : 'pill-gold'}`}>{h.status}</span>
							<span class="w-20 text-right text-[0.72rem] font-extrabold">{h.amount ? formatNaira(h.amount) : '—'}</span>
							<button class="text-slate" aria-label="Download receipt" onclick={() => toast('Receipt downloaded', 'success', '🧾')}><ExternalLink size={14} /></button>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><ShieldCheck size={17} class="text-[#0b6b45]" /><p class="text-sm font-extrabold">Secure payments</p></div>
				<p class="mt-1 text-[0.68rem] leading-relaxed text-slate">Payments are processed in Naira by Paystack and Flutterwave. Sabify never stores your full card details.</p>
				<div class="mt-3 flex flex-wrap gap-1.5">
					<span class="chip text-[0.62rem]">Paystack</span>
					<span class="chip text-[0.62rem]">Flutterwave</span>
					<span class="chip text-[0.62rem]">Visa</span>
					<span class="chip text-[0.62rem]">Mastercard</span>
					<span class="chip text-[0.62rem]">Bank transfer</span>
					<span class="chip text-[0.62rem]">USSD</span>
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<p class="text-sm font-extrabold">What ₦5,000 unlocks</p>
				<ul class="mt-2 space-y-2">
					{#each ['Unlimited lessons across 8 subjects', 'All 7 learning games', 'Daily quizzes and exam practice', 'AI study buddy with hints', 'Weekly parent report', 'Offline access on mobile'] as f}
						<li class="flex items-start gap-1.5 text-[0.7rem] font-semibold text-[#3f564b]"><Check size={12} class="mt-0.5 shrink-0 text-emerald" /> {f}</li>
					{/each}
				</ul>
				<div class="mt-3 rounded-xl bg-[#f2fbdf] p-2.5 text-[0.64rem] font-bold text-[#256b16]">That’s about ₦167 a day — less than a snack.</div>
			</div>

			<div class="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#e9ffc0] to-[#c9f26b] p-4">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-extrabold text-[#3f564b]">Family Plus</p>
						<p class="display mt-1 text-2xl font-semibold text-ink">₦12,000<span class="text-xs">/mo</span></p>
						<p class="text-[0.66rem] text-[#3f564b]/80">Up to 4 learners. Sibling leaderboards included.</p>
					</div>
					<Mascot size={70} expression="wink" />
				</div>
				<button class="btn btn-primary btn-sm mt-3" onclick={() => { paid = false; checkout = true; }}>Upgrade to Family Plus</button>
			</div>

			<div class="card p-4">
				<p class="text-sm font-extrabold">Need help?</p>
				<p class="mt-1 text-[0.68rem] text-slate">Questions about billing, school invoices or refunds? Our team replies within one working day.</p>
				<a href="mailto:billing@sabify.ng" class="btn btn-ghost btn-sm mt-2 w-full">Email billing@sabify.ng</a>
			</div>

			<div class="card p-4">
				<p class="text-sm font-extrabold">Cancel anytime</p>
				<p class="mt-1 text-[0.68rem] leading-relaxed text-slate">Cancel from this page in two clicks. You keep access until the end of your paid period, and your progress stays saved on the free plan.</p>
			</div>
		</div>
	</div>
</div>

<!-- Checkout -->
<Modal open={checkout} title="Complete your subscription" subtitle="Secure checkout · prices in Naira" onclose={() => (checkout = false)}>
	{#if paid}
		<div class="py-8 text-center">
			<div class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e9fbf1] text-[#0b6b45]"><Check size={30} /></div>
			<h3 class="mt-3 display text-xl font-semibold">Payment successful</h3>
			<p class="mt-1 text-sm text-slate">Family plan is now active. Everything is unlocked.</p>
		</div>
	{:else}
		<div class="space-y-4">
			<div class="rounded-2xl bg-[#f2fbdf] p-3">
				<div class="flex items-center justify-between"><span class="text-sm font-extrabold">Family plan</span><span class="display text-lg font-semibold">{formatNaira(price)}</span></div>
				<p class="text-[0.64rem] text-slate">{billing === 'monthly' ? 'Billed monthly · cancel anytime' : 'Billed annually · 2 months free'}</p>
			</div>
			<div>
				<span class="label">Payment method</span>
				<div class="grid grid-cols-3 gap-2">
					{#each [{ id: 'paystack', l: 'Paystack', e: '💳' }, { id: 'transfer', l: 'Transfer', e: '🏦' }, { id: 'ussd', l: 'USSD', e: '📱' }] as m}
						<button class={`rounded-xl border-2 p-2.5 text-center text-[0.66rem] font-extrabold ${method === m.id ? 'border-forest bg-[#f2fbdf]' : 'border-[#e9e4d6] bg-white'}`} onclick={() => (method = m.id)}>
							<span class="block text-lg">{m.e}</span>{m.l}
						</button>
					{/each}
				</div>
			</div>
			{#if method === 'paystack'}
				<div class="grid gap-2">
					<div><label class="label" for="card">Card number</label><input id="card" class="input" placeholder="4242 4242 4242 4242" value="4242 4242 4242 4242" /></div>
					<div class="grid grid-cols-2 gap-2">
						<div><label class="label" for="exp">Expiry</label><input id="exp" class="input" placeholder="MM / YY" value="12 / 28" /></div>
						<div><label class="label" for="cvv">CVV</label><input id="cvv" class="input" placeholder="123" value="123" /></div>
					</div>
				</div>
			{:else if method === 'transfer'}
				<div class="rounded-2xl bg-[#f7f5ec] p-3 text-xs">
					<p class="font-extrabold">Transfer to your virtual account</p>
					<p class="mt-1 text-slate">Bank: Providus Bank</p>
					<p class="text-slate">Account: 9901 2345 67</p>
					<p class="text-slate">Name: Sabify Technologies</p>
					<p class="mt-2 text-[0.64rem] font-bold text-[#7a4f00]">Use “SBF-{Math.floor(Math.random() * 90000 + 10000)}” as the transfer narration.</p>
				</div>
			{:else}
				<div class="rounded-2xl bg-[#f7f5ec] p-3 text-xs">
					<p class="font-extrabold">Dial on your phone</p>
					<p class="mt-1 display text-lg font-semibold">*737*000*{price}#</p>
					<p class="text-slate">Follow the prompts to approve the payment.</p>
				</div>
			{/if}
			<button class="btn btn-primary w-full" onclick={pay} disabled={paying}>
				{#if paying}Processing…{:else}<Lock size={15} /> Pay {formatNaira(price)}{/if}
			</button>
			<p class="text-center text-[0.6rem] text-slate">By paying you agree to the Terms and Privacy Policy. This is a demo checkout — no real charge is made.</p>
		</div>
	{/if}
</Modal>

<Modal open={cancelOpen} title="Cancel your subscription?" subtitle="We’re sad to see you go." onclose={() => (cancelOpen = false)}>
	<div class="space-y-3">
		<p class="text-sm leading-relaxed text-[#3f564b]">You will keep full access until <strong>24 December 2026</strong>. After that, your account moves to the free Explorer plan. All lesson progress and badges stay saved.</p>
		<div class="rounded-2xl bg-[#fff8e8] p-3 text-[0.7rem] text-[#7a4f00]">Tip: if cost is the issue, email billing@sabify.ng. We offer school and hardship support.</div>
		<div class="flex gap-2">
			<button class="btn btn-ghost flex-1" onclick={() => (cancelOpen = false)}>Keep my plan</button>
			<button class="btn btn-danger flex-1" onclick={cancelPlan}>Yes, cancel</button>
		</div>
	</div>
</Modal>
