<script lang="ts">
	import { goto } from '$app/navigation';
	import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, Check, ShieldCheck } from '@lucide/svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Mascot from '$lib/components/Mascot.svelte';
	import { login, enterDemo } from '$lib/stores/session';
	import { toast } from '$lib/stores/toast';

	let email = $state('ada@sabify.ng');
	let password = $state('sabify123');
	let role = $state<'learner' | 'teacher' | 'parent' | 'admin'>('learner');
	let show = $state(false);
	let loading = $state(false);
	let forgot = $state(false);

	function submit(e: Event) {
		e.preventDefault();
		if (!email.trim() || password.length < 4) {
			toast('Enter an email and a password of at least 4 characters', 'error', '⚠️');
			return;
		}
		loading = true;
		setTimeout(() => {
			login(email.trim(), password, role);
			loading = false;
			toast(`Welcome back! Signed in as ${role}.`, 'success', '👋');
			goto(role === 'teacher' ? '/teacher' : role === 'parent' ? '/parent' : role === 'admin' ? '/admin' : '/app');
		}, 600);
	}

	function demo() {
		enterDemo();
		toast('Demo learner loaded', 'info', '🦊');
		goto('/app');
	}
</script>

<svelte:head><title>Log in · Sabify</title></svelte:head>

<div class="grid min-h-dvh lg:grid-cols-[1.05fr_0.95fr]">
	<!-- Brand panel -->
	<div class="relative hidden overflow-hidden bg-[#0b2b1f] p-10 text-white lg:flex lg:flex-col lg:justify-between">
		<div class="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-lime/15 blur-3xl"></div>
		<div class="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-gold/10 blur-3xl"></div>
		<div class="relative"><Logo light size={38} /></div>
		<div class="relative mx-auto max-w-md">
			<Mascot size={170} expression="wink" float />
			<h1 class="mt-6 display text-4xl font-semibold leading-[1.02]">Welcome back.<br />Your streak missed you.</h1>
			<p class="mt-3 text-sm leading-relaxed text-white/55">Pick up where you left off — one lesson, one game, one small win at a time.</p>
			<div class="mt-6 space-y-2.5">
				{#each ['All 8 subjects and 7 games in one place', 'A study buddy that hints instead of guessing', 'Reports parents and teachers actually understand'] as f}
					<div class="flex items-center gap-2 text-sm font-semibold text-white/70"><Check size={15} class="text-lime" /> {f}</div>
				{/each}
			</div>
		</div>
		<div class="relative rounded-2xl border border-white/10 bg-white/[0.05] p-4">
			<p class="text-xs leading-relaxed text-white/60">“My daughter asks to play Number Nebula before dinner. Her maths test score went from 54% to 81%.”</p>
			<p class="mt-2 text-[0.66rem] font-extrabold text-white/40">Ngozi O. · Parent, Enugu</p>
		</div>
	</div>

	<!-- Form panel -->
	<div class="flex flex-col justify-center bg-cream px-5 py-10 sm:px-10">
		<div class="mx-auto w-full max-w-md">
			<div class="mb-8 flex items-center justify-between lg:hidden">
				<Logo size={34} />
				<a href="/" class="text-xs font-extrabold text-slate">Back home</a>
			</div>
			<p class="eyebrow">Log in</p>
			<h1 class="mt-2 display text-3xl font-semibold">Good to see you again.</h1>
			<p class="mt-1 text-sm text-slate">Log in to continue your learning adventure.</p>

			<form class="mt-6 space-y-3" onsubmit={submit}>
				<div>
					<label class="label" for="email">Email address</label>
					<div class="relative">
						<Mail size={16} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" />
						<input id="email" class="input pl-10" type="email" bind:value={email} placeholder="you@example.com" required />
					</div>
				</div>
				<div>
					<div class="flex items-center justify-between">
						<label class="label" for="password">Password</label>
						<button type="button" class="mb-1 text-[0.66rem] font-extrabold text-forest" onclick={() => (forgot = true)}>Forgot password?</button>
					</div>
					<div class="relative">
						<Lock size={16} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" />
						<input id="password" class="input pl-10 pr-11" type={show ? 'text' : 'password'} bind:value={password} placeholder="Your password" required />
						<button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate" onclick={() => (show = !show)} aria-label="Toggle password visibility">
							{#if show}<EyeOff size={17} />{:else}<Eye size={17} />{/if}
						</button>
					</div>
				</div>
				<div>
					<label class="label" for="role">I am a…</label>
					<select id="role" class="input" bind:value={role}>
						<option value="learner">Learner</option>
						<option value="teacher">Teacher</option>
						<option value="parent">Parent</option>
						<option value="admin">Administrator</option>
					</select>
				</div>
				<button class="btn btn-primary w-full" type="submit" disabled={loading}>
					{#if loading}Signing in…{:else}<span>Log in</span><ArrowRight size={16} />{/if}
				</button>
			</form>

			{#if forgot}
				<div class="mt-3 rounded-2xl border border-[#c4ecff] bg-[#eaf8ff] p-3 text-xs text-[#0a6486]">
					Password reset is not live in this demo. Use the prefilled credentials or <button class="font-extrabold underline" onclick={demo}>enter the demo learner</button>.
				</div>
			{/if}

			<div class="my-5 flex items-center gap-3"><div class="h-px flex-1 bg-[#e5e0d1]"></div><span class="text-[0.62rem] font-bold text-slate">OR</span><div class="h-px flex-1 bg-[#e5e0d1]"></div></div>

			<button class="btn btn-ghost w-full" onclick={demo}><Sparkles size={15} /> Explore the demo learner</button>

			<p class="mt-6 text-center text-sm text-slate">New to Sabify? <a href="/signup" class="font-extrabold text-forest">Create a free account</a></p>
			<div class="mt-6 flex items-center justify-center gap-1.5 text-[0.6rem] font-semibold text-slate"><ShieldCheck size={12} /> Child-safe · No card needed · Cancel anytime</div>
		</div>
	</div>
</div>
