<script lang="ts">
	import { ArrowRight, Check, Minus, ShieldCheck, Sparkles, Star, Users, Zap } from '@lucide/svelte';
	import LandingNav from '$lib/components/LandingNav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Mascot from '$lib/components/Mascot.svelte';
	import { pricingPlans, faqs, testimonials } from '$lib/data/seed';
	import { formatNaira } from '$lib/utils';

	let annual = $state(false);
	let activeFaq = $state(0);

	const comparison = [
		{ feature: 'Learner profiles', free: '1', family: '1', plus: 'Up to 4', school: 'Per seat' },
		{ feature: 'Lessons per week', free: '2', family: 'Unlimited', plus: 'Unlimited', school: 'Unlimited' },
		{ feature: 'Learning games', free: '2', family: 'All 7', plus: 'All 7', school: 'All 7' },
		{ feature: 'Daily quizzes', free: '1 / week', family: 'Unlimited', plus: 'Unlimited', school: 'Unlimited' },
		{ feature: 'AI study buddy', free: 'Limited', family: 'Included', plus: 'Included', school: 'Included' },
		{ feature: 'Offline access', free: false, family: true, plus: true, school: true },
		{ feature: 'Weekly progress report', free: false, family: true, plus: true, school: true },
		{ feature: 'Parent screen-time controls', free: false, family: false, plus: true, school: true },
		{ feature: 'Teacher dashboard & class analytics', free: false, family: false, plus: false, school: true },
		{ feature: 'Content Studio & assignments', free: false, family: false, plus: false, school: true },
		{ feature: 'School onboarding & invoices', free: false, family: false, plus: false, school: true }
	];
</script>

<svelte:head>
	<title>Pricing · Sabify</title>
	<meta name="description" content="Sabify pricing in Naira. Start free, unlock everything for ₦5,000 per month. Family Plus and school plans available." />
</svelte:head>

<LandingNav />

<main>
	<section class="mesh-hero relative overflow-hidden">
		<div class="container-page py-14 text-center sm:py-20">
			<p class="eyebrow justify-center">Pricing</p>
			<h1 class="mx-auto mt-3 max-w-3xl display text-4xl font-semibold leading-[1.02] sm:text-6xl">One subscription.<br />A whole learning universe.</h1>
			<p class="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate sm:text-base">Start free with no card. Unlock every subject, game, quiz and report for <strong>₦5,000 per month</strong> — less than ₦167 a day. Cancel anytime.</p>
			<div class="mt-6 inline-flex rounded-full border border-[#e1dccd] bg-white p-1 shadow-sm">
				<button class={`rounded-full px-4 py-2 text-xs font-extrabold transition ${!annual ? 'bg-forest text-white' : 'text-slate'}`} onclick={() => (annual = false)}>Monthly</button>
				<button class={`rounded-full px-4 py-2 text-xs font-extrabold transition ${annual ? 'bg-forest text-white' : 'text-slate'}`} onclick={() => (annual = true)}>Annual <span class="ml-1 rounded-full bg-lime px-1.5 py-0.5 text-[0.55rem] text-ink">2 months free</span></button>
			</div>
		</div>
	</section>

	<section class="pb-16">
		<div class="container-page">
			<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{#each pricingPlans as plan}
					{@const displayPrice = plan.id === 'family' && annual ? 50000 : plan.price}
					<div class={`relative flex flex-col rounded-[1.9rem] border p-5 ${plan.highlight ? 'border-forest bg-[#0b2b1f] text-white shadow-lift xl:-translate-y-2' : 'border-[#e3ddca] bg-white'}`}>
						{#if plan.highlight}
							<span class="absolute -top-3 left-5 rounded-full bg-lime px-3 py-1 text-[0.58rem] font-extrabold uppercase tracking-wider text-ink">Most popular</span>
						{/if}
						<div class="flex items-center justify-between">
							<p class="text-[0.62rem] font-extrabold uppercase tracking-wider opacity-60">{plan.name}</p>
							{#if plan.id === 'family'}<Star size={15} class="text-[#ffc53d]" fill="currentColor" />{/if}
						</div>
						<div class="mt-2 flex items-end gap-1">
							<span class="display text-3xl font-semibold">{displayPrice === 0 ? 'Free' : formatNaira(displayPrice)}</span>
							{#if displayPrice > 0}<span class={`pb-1 text-[0.64rem] font-bold ${plan.highlight ? 'text-white/45' : 'text-slate'}`}>{plan.id === 'family' && annual ? '/year' : plan.cadence}</span>{/if}
						</div>
						{#if plan.id === 'family' && annual}<p class="text-[0.62rem] font-bold text-lime">Save ₦10,000 every year</p>{/if}
						<p class={`mt-1 text-[0.72rem] leading-snug ${plan.highlight ? 'text-white/55' : 'text-slate'}`}>{plan.description}</p>
						<ul class="mt-4 flex-1 space-y-2">
							{#each plan.features as f}
								<li class="flex items-start gap-1.5 text-[0.72rem] font-semibold"><Check size={13} class={`mt-0.5 shrink-0 ${plan.highlight ? 'text-lime' : 'text-emerald'}`} /><span class={plan.highlight ? 'text-white/75' : 'text-[#3f564b]'}>{f}</span></li>
							{/each}
						</ul>
						<a href={plan.id === 'school' ? '/teacher' : '/signup'} class={`btn mt-5 ${plan.highlight ? 'btn-lime' : 'btn-ghost'} btn-sm`}>{plan.cta}</a>
					</div>
				{/each}
			</div>
			<div class="mt-4 flex flex-wrap items-center justify-center gap-4 text-[0.66rem] font-bold text-slate">
				<span class="flex items-center gap-1"><ShieldCheck size={13} /> Secure Paystack & Flutterwave checkout</span>
				<span class="flex items-center gap-1"><Zap size={13} /> No hidden fees</span>
				<span class="flex items-center gap-1"><Users size={13} /> School invoices available</span>
			</div>
		</div>
	</section>

	<section class="section bg-[#f4f1e4]">
		<div class="container-page">
			<div class="mx-auto max-w-2xl text-center">
				<p class="eyebrow justify-center">Compare</p>
				<h2 class="mt-3 display text-3xl font-semibold sm:text-4xl">Exactly what you get.</h2>
			</div>
			<div class="mt-8 overflow-x-auto">
				<table class="w-full min-w-[720px] border-separate border-spacing-0 text-left">
					<thead>
						<tr>
							<th class="rounded-tl-2xl bg-white px-4 py-3 text-[0.66rem] font-extrabold uppercase tracking-wider text-slate">Feature</th>
							{#each ['Explorer', 'Family', 'Family Plus', 'School'] as h}
								<th class={`bg-white px-4 py-3 text-center text-[0.66rem] font-extrabold uppercase tracking-wider ${h === 'Family' ? 'text-forest' : 'text-slate'} ${h === 'School' ? 'rounded-tr-2xl' : ''}`}>{h}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each comparison as row, i}
							<tr class={i % 2 === 0 ? 'bg-white/70' : 'bg-white'}>
								<td class="border-t border-[#eee9dc] px-4 py-3 text-[0.74rem] font-bold">{row.feature}</td>
								{#each [row.free, row.family, row.plus, row.school] as value}
									<td class="border-t border-[#eee9dc] px-4 py-3 text-center">
										{#if value === true}
											<span class="inline-grid h-5 w-5 place-items-center rounded-full bg-[#e9fbf1] text-[#0b6b45]"><Check size={12} /></span>
										{:else if value === false}
											<span class="text-slate/40"><Minus size={14} /></span>
										{:else}
											<span class="text-[0.72rem] font-extrabold">{value}</span>
										{/if}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</section>

	<section class="section">
		<div class="container-page grid gap-10 lg:grid-cols-2">
			<div>
				<p class="eyebrow">For schools</p>
				<h2 class="mt-3 display text-3xl font-semibold sm:text-4xl">Bring Sabify to your whole school.</h2>
				<p class="mt-3 text-sm leading-relaxed text-slate">Seat-based pricing from ₦3,500 per learner per month, billed termly or annually. Includes teacher training, curriculum mapping, admin analytics and a dedicated success partner.</p>
				<div class="mt-5 grid grid-cols-2 gap-3">
					{#each [{ l: 'Schools', v: '84' }, { l: 'Teachers', v: '640' }, { l: 'Learners', v: '12,480' }, { l: 'Mastery lift', v: '+23%' }] as s}
						<div class="rounded-2xl border border-[#e5e0d1] bg-white p-3.5"><p class="display text-2xl font-semibold text-forest">{s.v}</p><p class="text-[0.6rem] font-bold uppercase tracking-wider text-slate">{s.l}</p></div>
					{/each}
				</div>
				<div class="mt-5 flex flex-col gap-2 sm:flex-row">
					<a href="mailto:schools@sabify.ng" class="btn btn-primary">Book a school tour <ArrowRight size={16} /></a>
					<a href="/teacher" class="btn btn-ghost">Explore teacher dashboard</a>
				</div>
			</div>
			<div class="card p-5">
				<div class="flex items-center gap-2"><Sparkles size={17} class="text-[#7a4f00]" /><p class="text-sm font-extrabold">What school leaders ask us</p></div>
				<div class="mt-3 space-y-3">
					{#each [
						{ q: 'Can we use our own curriculum?', a: 'Yes. We map your scheme of work to Sabify skills or build custom pathways with your academic team.' },
						{ q: 'How do teachers get started?', a: 'A 90-minute onboarding workshop, ready-made class templates and a success partner for the first term.' },
						{ q: 'Is learner data safe?', a: 'Data is encrypted, access is role-based, and we sign a data processing agreement. No advertising, ever.' }
					] as item}
						<div class="rounded-2xl bg-[#f7f5ec] p-3">
							<p class="text-[0.74rem] font-extrabold">{item.q}</p>
							<p class="mt-1 text-[0.68rem] leading-relaxed text-slate">{item.a}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<section class="section bg-[#f4f1e4]">
		<div class="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
			<div>
				<p class="eyebrow">Questions</p>
				<h2 class="mt-3 display text-3xl font-semibold">Before you commit.</h2>
				<div class="mt-5 flex items-center gap-3 rounded-2xl bg-white p-3.5">
					<Mascot size={54} expression="think" />
					<p class="text-xs font-semibold leading-snug text-[#3f564b]">“Still unsure? Try the demo first. No card, no pressure — just a look around.”</p>
				</div>
			</div>
			<div class="space-y-2.5">
				{#each faqs as faq, i}
					<div class="card overflow-hidden">
						<button class="flex w-full items-center justify-between gap-4 px-4 py-4 text-left" onclick={() => (activeFaq = activeFaq === i ? -1 : i)} aria-expanded={activeFaq === i}>
							<span class="text-sm font-extrabold leading-snug">{faq.q}</span>
							<span class={`text-lg text-slate transition ${activeFaq === i ? 'rotate-45' : ''}`}>+</span>
						</button>
						{#if activeFaq === i}<p class="px-4 pb-4 text-xs leading-relaxed text-slate">{faq.a}</p>{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="pb-16">
		<div class="container-page">
			<div class="relative overflow-hidden rounded-[2.5rem] bg-[#0b2b1f] px-6 py-12 text-center text-white sm:px-10">
				<div class="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-lime/15 blur-3xl"></div>
				<Mascot size={110} expression="cheer" float />
				<h2 class="mt-3 display text-3xl font-semibold sm:text-4xl">Start free. Upgrade when it clicks.</h2>
				<p class="mx-auto mt-2 max-w-xl text-sm text-white/55">No card needed to begin. ₦5,000/month unlocks everything, and you can cancel in two clicks.</p>
				<div class="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
					<a href="/signup" class="btn btn-lime btn-lg">Create a free account <ArrowRight size={18} /></a>
					<a href="/app" class="btn btn-white btn-lg">Explore the demo</a>
				</div>
			</div>
		</div>
	</section>
</main>

<Footer />
