<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, User } from '@lucide/svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Mascot from '$lib/components/Mascot.svelte';
	import { signup, enterDemo } from '$lib/stores/session';
	import { toast } from '$lib/stores/toast';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let role = $state<'learner' | 'teacher' | 'parent'>('learner');
	let grade = $state('Primary 5');
	let consent = $state(true);
	let show = $state(false);
	let step = $state(1);

	function next(e: Event) {
		e.preventDefault();
		if (!name.trim()) return toast('Please tell us your name', 'error', '✏️');
		if (!email.includes('@')) return toast('Enter a valid email address', 'error', '✉️');
		if (password.length < 6) return toast('Use a password with at least 6 characters', 'error', '🔒');
		if (!consent) return toast('Please agree to the terms to continue', 'error', '📄');
		step = 2;
	}

	function create() {
		signup({ name: name.trim(), email: email.trim(), role, grade, age: 11, plan: 'free' });
		toast('Account created — let’s personalise your learning', 'success', '🎉');
		goto(role === 'learner' ? '/onboarding' : role === 'teacher' ? '/teacher' : '/parent');
	}

	function demo() {
		enterDemo();
		goto('/app');
	}
</script>

<svelte:head><title>Create your account · Sabify</title></svelte:head>

<div class="grid min-h-dvh lg:grid-cols-[0.95fr_1.05fr]">
	<div class="relative hidden overflow-hidden bg-[#0b2b1f] p-10 text-white lg:flex lg:flex-col lg:justify-between">
		<div class="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-lime/15 blur-3xl"></div>
		<div class="relative"><Logo light size={38} /></div>
		<div class="relative mx-auto max-w-md">
			<Mascot size={160} expression="cheer" float />
			<h1 class="mt-6 display text-4xl font-semibold leading-[1.02]">Start free.<br />Stay curious.</h1>
			<p class="mt-3 text-sm leading-relaxed text-white/55">No card needed. Your first lesson, game and quest are waiting. Unlock everything later for ₦5,000/month.</p>
			<div class="mt-6 space-y-2.5">
				{#each ['Two free lessons every week', 'Two learning games included', 'Daily streak, XP and badges', 'Upgrade or cancel anytime'] as f}
					<div class="flex items-center gap-2 text-sm font-semibold text-white/70"><Check size={15} class="text-lime" /> {f}</div>
				{/each}
			</div>
		</div>
		<div class="relative flex items-center gap-2 text-[0.64rem] font-semibold text-white/40"><ShieldCheck size={13} /> Designed for ages 6–18 · COPPA-aware</div>
	</div>

	<div class="flex flex-col justify-center bg-cream px-5 py-10 sm:px-10">
		<div class="mx-auto w-full max-w-md">
			<div class="mb-8 flex items-center justify-between lg:hidden">
				<Logo size={34} />
				<a href="/" class="text-xs font-extrabold text-slate">Back home</a>
			</div>

			{#if step === 1}
				<p class="eyebrow">Create account</p>
				<h1 class="mt-2 display text-3xl font-semibold">Your adventure starts here.</h1>
				<p class="mt-1 text-sm text-slate">Already have an account? <a href="/login" class="font-extrabold text-forest">Log in</a></p>

				<form class="mt-6 space-y-3" onsubmit={next}>
					<div>
						<label class="label" for="name">Full name</label>
						<div class="relative">
							<User size={16} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" />
							<input id="name" class="input pl-10" bind:value={name} placeholder="e.g. Ada Okafor" required />
						</div>
					</div>
					<div>
						<label class="label" for="email">Email address</label>
						<div class="relative">
							<Mail size={16} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" />
							<input id="email" class="input pl-10" type="email" bind:value={email} placeholder="you@example.com" required />
						</div>
					</div>
					<div>
						<label class="label" for="password">Password</label>
						<div class="relative">
							<Lock size={16} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" />
							<input id="password" class="input pl-10 pr-11" type={show ? 'text' : 'password'} bind:value={password} placeholder="At least 6 characters" required />
							<button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate" onclick={() => (show = !show)} aria-label="Toggle password visibility">
								{#if show}<EyeOff size={17} />{:else}<Eye size={17} />{/if}
							</button>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-2">
						<div>
							<label class="label" for="role">I am a…</label>
							<select id="role" class="input" bind:value={role}>
								<option value="learner">Learner</option>
								<option value="teacher">Teacher</option>
								<option value="parent">Parent</option>
							</select>
						</div>
						<div>
							<label class="label" for="grade">Grade / class</label>
							<select id="grade" class="input" bind:value={grade}>
								<option>Primary 1</option><option>Primary 2</option><option>Primary 3</option><option>Primary 4</option><option>Primary 5</option><option>Primary 6</option><option>JSS 1</option><option>JSS 2</option><option>JSS 3</option><option>SSS 1</option><option>SSS 2</option><option>SSS 3</option>
							</select>
						</div>
					</div>
					<label class="flex items-start gap-2 text-[0.68rem] leading-snug text-slate">
						<input type="checkbox" class="mt-0.5 h-4 w-4 accent-[#0d3b2a]" bind:checked={consent} />
						<span>I agree to the Terms and Privacy Policy. For learners under 13, a parent or guardian confirms this account.</span>
					</label>
					<button class="btn btn-primary w-full" type="submit">Continue <ArrowRight size={16} /></button>
				</form>
			{:else}
				<button class="mb-4 flex items-center gap-1 text-xs font-extrabold text-slate" onclick={() => (step = 1)}><ArrowLeft size={14} /> Back</button>
				<p class="eyebrow">One last thing</p>
				<h1 class="mt-2 display text-3xl font-semibold">How will you use Sabify?</h1>
				<p class="mt-1 text-sm text-slate">We’ll tailor the dashboard and tools to fit.</p>
				<div class="mt-5 grid gap-2.5">
					{#each [
						{ id: 'learner', emoji: '🦊', title: 'I’m here to learn', desc: 'Lessons, games, quests and my own study buddy.' },
						{ id: 'teacher', emoji: '👨🏾‍🏫', title: 'I teach a class', desc: 'Class analytics, assignments and Content Studio.' },
						{ id: 'parent', emoji: '👩🏾', title: 'I’m a parent', desc: 'Weekly reports, screen-time controls and progress.' }
					] as r}
						<button class={`flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition ${role === r.id ? 'border-forest bg-[#f2fbdf]' : 'border-[#e9e4d6] bg-white hover:border-[#c9d7b8]'}`} onclick={() => (role = r.id as typeof role)}>
							<span class="text-2xl">{r.emoji}</span>
							<div class="flex-1"><p class="text-sm font-extrabold">{r.title}</p><p class="text-[0.68rem] text-slate">{r.desc}</p></div>
							<span class={`grid h-5 w-5 place-items-center rounded-full border-2 ${role === r.id ? 'border-forest bg-forest text-white' : 'border-[#d8d3c2]'}`}>{#if role === r.id}<Check size={11} />{/if}</span>
						</button>
					{/each}
				</div>
				<button class="btn btn-primary mt-5 w-full" onclick={create}><Sparkles size={16} /> Create my account</button>
				<button class="btn btn-ghost mt-2 w-full" onclick={demo}>Skip and explore the demo</button>
			{/if}

			<p class="mt-6 text-center text-[0.6rem] font-semibold text-slate">Child-safe by design · NERDC aligned · ₦5,000/month when you upgrade</p>
		</div>
	</div>
</div>
