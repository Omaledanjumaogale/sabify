<script lang="ts">
	import { ArrowRight, Banknote, CalendarDays, Check, CreditCard, Download, Lock, RefreshCw, ShieldCheck, Sparkles, Users, X } from '@lucide/svelte';
	import { session, setPlan } from '$lib/stores/session';
	import { formatNaira, celebrate } from '$lib/utils';
	import { toast } from '$lib/stores/toast';
	import Modal from '$lib/components/Modal.svelte';
	import Mascot from '$lib/components/Mascot.svelte';

	let plan = $derived($session.user?.plan ?? 'family');
	let active = $derived(plan !== 'free');
	let cardOpen = $state(false);
	let cancelOpen = $state(false);
	let upgradeOpen = $state(false);
	let saving = $state(false);

	const invoices = [
		{ date: '24 Nov 2026', ref: 'INV-2026-1124', amount: 5000, status: 'Paid', method: 'Card · 4242' },
		{ date: '24 Oct 2026', ref: 'INV-2026-1024', amount: 5000, status: 'Paid', method: 'Card · 4242' },
		{ date: '24 Sep 2026', ref: 'INV-2026-0924', amount: 5000, status: 'Paid', method: 'Bank transfer' }
	];

	function updateCard() {
		saving = true;
		setTimeout(() => {
			saving = false;
			cardOpen = false;
			toast('Payment method updated', 'success', '💳');
		}, 800);
	}

	function upgrade() {
		saving = true;
		setTimeout(() => {
			saving = false;
			upgradeOpen = false;
			setPlan('family-plus');
			celebrate();
			toast('Family Plus active — 4 learner profiles unlocked', 'success', '🎉');
		}, 1200);
	}

	function cancel() {
		setPlan('free');
		cancelOpen = false;
		toast('Plan cancelled. Access continues until 24 December.', 'info', '📅');
	}
</script>

<svelte:head><title>Billing · Sabify for parents</title></svelte:head>

<div class="space-y-5">
	<div>
		<p class="eyebrow">Family billing</p>
		<h1 class="mt-1 display text-2xl font-semibold sm:text-3xl">Billing & plan</h1>
		<p class="mt-1 text-sm text-slate">Everything in Naira. No surprises.</p>
	</div>

	<div class="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
		<div class="space-y-4">
			<div class="relative overflow-hidden rounded-[2rem] bg-[#0b2b1f] p-5 text-white sm:p-7">
				<div class="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-lime/15 blur-3xl"></div>
				<div class="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<span class={`pill text-[0.56rem] ${active ? 'bg-lime text-ink' : 'bg-white/10 text-white'}`}>{active ? '● Active subscription' : 'Free plan'}</span>
						<h2 class="mt-2 display text-3xl font-semibold">{plan === 'family-plus' ? 'Family Plus' : active ? 'Family' : 'Explorer'}</h2>
						<div class="mt-1 flex items-end gap-1"><span class="display text-2xl font-semibold text-lime">{formatNaira(plan === 'family-plus' ? 12000 : active ? 5000 : 0)}</span><span class="pb-1 text-[0.66rem] text-white/40">{active ? '/month' : ''}</span></div>
						<p class="mt-1 text-[0.66rem] text-white/45">{active ? 'Next payment: 24 December 2026 · card ending 4242' : 'Upgrade to unlock all lessons, games and reports.'}</p>
					</div>
					<div class="flex flex-col gap-2">
						<button class="btn btn-lime btn-sm" onclick={() => (upgradeOpen = true)}><Sparkles size={14} /> {plan === 'family-plus' ? 'Manage Family Plus' : 'Upgrade to Family Plus'}</button>
						<button class="btn btn-white btn-sm" onclick={() => (cardOpen = true)}><CreditCard size={14} /> Update payment method</button>
					</div>
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center justify-between">
					<div><h2 class="display text-base font-semibold">Invoices</h2><p class="text-[0.68rem] text-slate">Download receipts for your records.</p></div>
					<span class="pill text-[0.56rem]">3 paid</span>
				</div>
				<div class="mt-3 divide-y divide-[#f4f1e6]">
					{#each invoices as inv}
						<div class="flex flex-wrap items-center gap-2 py-3">
							<div class="min-w-0 flex-1">
								<p class="text-[0.74rem] font-extrabold">{inv.date}</p>
								<p class="text-[0.6rem] text-slate">{inv.ref} · {inv.method}</p>
							</div>
							<span class="pill text-[0.52rem]">{inv.status}</span>
							<span class="w-16 text-right text-[0.72rem] font-extrabold">{formatNaira(inv.amount)}</span>
							<button class="text-slate" onclick={() => toast('Invoice downloaded', 'success', '🧾')} aria-label="Download invoice"><Download size={14} /></button>
						</div>
					{/each}
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<h2 class="display text-base font-semibold">Annual option</h2>
				<p class="mt-1 text-[0.7rem] leading-relaxed text-slate">Pay for 10 months and get 2 months free. Annual Family is <strong>₦50,000</strong> instead of ₦60,000.</p>
				<div class="mt-2 flex flex-wrap items-center gap-2">
					<span class="pill pill-gold text-[0.58rem]">Save ₦10,000</span>
					<button class="btn btn-ghost btn-sm" onclick={() => toast('Annual plan selected at checkout', 'success', '📅')}>Switch to annual <ArrowRight size={12} /></button>
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><CreditCard size={16} class="text-forest" /><p class="text-sm font-extrabold">Payment method</p></div>
				<div class="mt-2 rounded-2xl border border-[#eee9dc] p-3">
					<div class="flex items-center justify-between"><p class="text-[0.72rem] font-extrabold">Visa ending 4242</p><span class="pill text-[0.52rem]">Default</span></div>
					<p class="text-[0.62rem] text-slate">Expires 12/2028 · Okafor Family</p>
					<button class="mt-2 text-[0.64rem] font-extrabold text-forest" onclick={() => (cardOpen = true)}>Edit card</button>
				</div>
				<div class="mt-2 flex items-center gap-1.5 text-[0.6rem] text-slate"><Lock size={11} /> Secured by Paystack · PCI-DSS compliant</div>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><Users size={16} class="text-forest" /><p class="text-sm font-extrabold">Plan includes</p></div>
				<ul class="mt-2 space-y-1.5">
					{#each ['2 learner profiles', 'Unlimited lessons and games', 'Weekly reports for each child', 'AI study buddy', '45-minute screen-time controls'] as f}
						<li class="flex items-start gap-1.5 text-[0.68rem] font-semibold text-[#3f564b]"><Check size={12} class="mt-0.5 shrink-0 text-emerald" /> {f}</li>
					{/each}
				</ul>
				<p class="mt-2 text-[0.62rem] text-slate">Family Plus raises this to 4 learners and adds advanced controls.</p>
			</div>

			<div class="card p-4">
				<div class="flex items-center gap-2"><ShieldCheck size={15} class="text-[#0b6b45]" /><p class="text-sm font-extrabold">Fair billing promise</p></div>
				<p class="mt-1 text-[0.66rem] leading-relaxed text-slate">If your child cannot use Sabify for a full month due to a technical fault, we credit that month automatically. No forms, no arguing.</p>
			</div>

			<div class="rounded-[1.5rem] bg-gradient-to-br from-[#e9ffc0] to-[#c9f26b] p-4">
				<div class="flex items-center justify-between">
					<div><p class="text-sm font-extrabold text-[#3f564b]">Need a hand?</p><p class="text-[0.66rem] text-[#3f564b]/80">Billing questions? Email us.</p></div>
					<Mascot size={52} expression="wink" />
				</div>
				<a href="mailto:billing@sabify.ng" class="btn btn-primary btn-sm mt-2"><Banknote size={13} /> billing@sabify.ng</a>
			</div>

			<button class="btn btn-danger btn-sm w-full" onclick={() => (cancelOpen = true)}>Cancel subscription</button>
		</div>
	</div>
</div>

<Modal open={cardOpen} title="Update payment method" subtitle="Your card details are encrypted and never stored on our servers." onclose={() => (cardOpen = false)}>
	<div class="space-y-3">
		<div><label class="label" for="num">Card number</label><input id="num" class="input" placeholder="4242 4242 4242 4242" value="4242 4242 4242 4242" /></div>
		<div class="grid grid-cols-2 gap-2">
			<div><label class="label" for="exp">Expiry</label><input id="exp" class="input" value="12 / 28" /></div>
			<div><label class="label" for="cvv">CVV</label><input id="cvv" class="input" value="123" /></div>
		</div>
		<div><label class="label" for="cname">Name on card</label><input id="cname" class="input" value="Ngozi Okafor" /></div>
		<button class="btn btn-primary w-full" onclick={updateCard} disabled={saving}>{saving ? 'Saving…' : 'Save card'}</button>
	</div>
</Modal>

<Modal open={upgradeOpen} title="Upgrade to Family Plus" subtitle="Up to 4 learners · ₦12,000/month" onclose={() => (upgradeOpen = false)}>
	<div class="space-y-3">
		<div class="rounded-2xl bg-[#f2fbdf] p-3">
			<p class="text-sm font-extrabold">What changes</p>
			<ul class="mt-1.5 space-y-1.5 text-[0.7rem] text-[#3f564b]">
				{#each ['Add up to 4 learner profiles', 'Sibling leaderboards', 'Advanced screen-time controls', 'Priority support'] as f}
					<li class="flex items-start gap-1.5"><Check size={12} class="mt-0.5 shrink-0 text-[#256b16]" /> {f}</li>
				{/each}
			</ul>
		</div>
		<p class="text-[0.66rem] text-slate">You will be charged ₦7,000 today (the difference for the rest of this billing period), then ₦12,000 monthly.</p>
		<button class="btn btn-primary w-full" onclick={upgrade} disabled={saving}>{saving ? 'Upgrading…' : 'Confirm upgrade'}</button>
	</div>
</Modal>

<Modal open={cancelOpen} title="Cancel your plan?" subtitle="You keep access until the end of the paid period." onclose={() => (cancelOpen = false)}>
	<div class="space-y-3">
		<p class="text-sm leading-relaxed text-[#3f564b]">Your children keep their progress, badges and streak history. After 24 December, the account moves to the free Explorer plan.</p>
		<div class="rounded-2xl bg-[#fff8e8] p-3 text-[0.7rem] text-[#7a4f00]">If cost is the issue, email billing@sabify.ng — we offer school and hardship support.</div>
		<div class="flex gap-2">
			<button class="btn btn-ghost flex-1" onclick={() => (cancelOpen = false)}>Keep my plan</button>
			<button class="btn btn-danger flex-1" onclick={cancel}>Cancel plan</button>
		</div>
	</div>
</Modal>
