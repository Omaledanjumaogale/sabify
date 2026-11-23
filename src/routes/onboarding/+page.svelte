<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft, ArrowRight, Check, Sparkles, Target, Wand2 } from '@lucide/svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Mascot from '$lib/components/Mascot.svelte';
	import { untrack } from 'svelte';
	import { session, completeOnboarding } from '$lib/stores/session';
	import { toast } from '$lib/stores/toast';

	let step = $state(1);
	let user = $derived($session.user);
	let name = $state(untrack(() => user?.name ?? 'Ada Okafor'));
	let age = $state(untrack(() => user?.age ?? 11));
	let grade = $state(untrack(() => user?.grade ?? 'Primary 5'));
	let city = $state(untrack(() => user?.city ?? 'Enugu'));
	let style = $state(untrack(() => user?.learningStyle ?? 'Playful'));
	let interests = $state<string[]>(untrack(() => user?.interests ?? ['Space', 'Games']));
	let curriculum = $state(untrack(() => user?.curriculum ?? 'NERDC'));
	let avatar = $state(untrack(() => user?.avatar ?? '🦊'));
	let goal = $state('150');
	let avatarChoices = ['🦊', '🦁', '🐼', '🦋', '🐯', '🐨', '🦉', '🐢', '🐝', '🦅'];
	let interestOptions = ['Space', 'Games', 'Music', 'Football', 'Stories', 'Coding', 'Art', 'Money', 'Science', 'Animals', 'Cooking', 'History'];
	let styles = [
		{ id: 'Playful', emoji: '🎮', desc: 'Games, challenges and quick wins.' },
		{ id: 'Visual', emoji: '🎨', desc: 'Diagrams, colour and models.' },
		{ id: 'Story-led', emoji: '📖', desc: 'Learn through characters and stories.' },
		{ id: 'Step-by-step', emoji: '🪜', desc: 'Clear instructions, one at a time.' },
		{ id: 'Fast-paced', emoji: '⚡', desc: 'Short bursts and harder challenges.' }
	];

	function toggleInterest(i: string) {
		interests = interests.includes(i) ? interests.filter((x) => x !== i) : [...interests, i];
	}

	function next() {
		if (step === 1 && !name.trim()) return toast('Please enter your name', 'error', '✏️');
		if (step === 2 && interests.length < 2) return toast('Pick at least two interests', 'error', '💡');
		if (step < 3) {
			step++;
			return;
		}
		completeOnboarding({ name: name.trim(), firstName: name.trim().split(' ')[0], age: Number(age), grade, city, learningStyle: style, interests, curriculum, avatar });
		toast('Your learning path is ready!', 'success', '🎉');
		goto('/app');
	}

	function skip() {
		completeOnboarding({ name: name.trim(), firstName: name.trim().split(' ')[0], age: Number(age), grade, curriculum, avatar });
		goto('/app');
	}
</script>

<svelte:head><title>Personalise your learning · Sabify</title></svelte:head>

<div class="min-h-dvh bg-cream">
	<header class="border-b border-[#e8e3d4] bg-cream/85 backdrop-blur">
		<div class="container-page flex h-[68px] items-center justify-between">
			<Logo size={32} />
			<button class="text-xs font-extrabold text-slate" onclick={skip}>Skip for now</button>
		</div>
	</header>

	<div class="container-page grid items-start gap-8 py-8 lg:grid-cols-[0.85fr_1.15fr] lg:py-12">
		<div class="hidden lg:block">
			<Mascot size={150} expression={step === 3 ? 'cheer' : 'think'} float />
			<h1 class="mt-5 display text-4xl font-semibold leading-[1.02]">Let’s build your<br />learning path.</h1>
			<p class="mt-3 text-sm leading-relaxed text-slate">Three quick questions. Sabify uses them to choose examples, difficulty and the order of your lessons.</p>
			<div class="mt-6 space-y-3">
				{#each [{ n: 1, t: 'About you' }, { n: 2, t: 'How you learn' }, { n: 3, t: 'Your plan' }] as s}
					<div class="flex items-center gap-3">
						<span class={`grid h-8 w-8 place-items-center rounded-full text-[0.7rem] font-extrabold ${step > s.n ? 'bg-[#0b6b45] text-white' : step === s.n ? 'bg-lime text-ink' : 'bg-[#ece9dd] text-slate'}`}>{#if step > s.n}<Check size={14} />{:else}{s.n}{/if}</span>
						<p class={`text-sm font-extrabold ${step >= s.n ? 'text-ink' : 'text-slate'}`}>{s.t}</p>
					</div>
				{/each}
			</div>
		</div>

		<div class="card p-5 sm:p-7">
			<div class="flex items-center justify-between">
				<p class="text-[0.62rem] font-extrabold uppercase tracking-wider text-slate">Step {step} of 3</p>
				<div class="h-1.5 w-28 overflow-hidden rounded-full bg-[#e9e6da]"><div class="h-full rounded-full bg-emerald transition-all" style={`width:${(step / 3) * 100}%`}></div></div>
			</div>

			{#if step === 1}
				<h2 class="mt-4 display text-2xl font-semibold">First, who are we teaching?</h2>
				<p class="mt-1 text-sm text-slate">This helps us choose the right level and examples.</p>
				<div class="mt-5 space-y-3">
					<div><label class="label" for="name">Your name</label><input id="name" class="input" bind:value={name} /></div>
					<div class="grid gap-3 sm:grid-cols-2">
						<div><label class="label" for="age">Age</label><input id="age" class="input" type="number" min="4" max="19" bind:value={age} /></div>
						<div>
							<label class="label" for="grade">Grade / class</label>
							<select id="grade" class="input" bind:value={grade}>
								{#each ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'] as g}<option>{g}</option>{/each}
							</select>
						</div>
					</div>
					<div><label class="label" for="city">City</label><input id="city" class="input" bind:value={city} placeholder="e.g. Enugu" /></div>
					<div>
						<span class="label">Choose an avatar</span>
						<div class="flex flex-wrap gap-2">
							{#each avatarChoices as face}
								<button class={`grid h-10 w-10 place-items-center rounded-xl border-2 text-xl transition ${avatar === face ? 'border-forest bg-[#f2fbdf]' : 'border-[#e9e4d6] bg-white'}`} onclick={() => (avatar = face)}>{face}</button>
							{/each}
						</div>
					</div>
				</div>
			{:else if step === 2}
				<h2 class="mt-4 display text-2xl font-semibold">How do you like to learn?</h2>
				<p class="mt-1 text-sm text-slate">Pick the style that sounds most like you — you can change it later.</p>
				<div class="mt-4 grid gap-2">
					{#each styles as s}
						<button class={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${style === s.id ? 'border-forest bg-[#f2fbdf]' : 'border-[#e9e4d6] bg-white hover:border-[#c9d7b8]'}`} onclick={() => (style = s.id)}>
							<span class="text-2xl">{s.emoji}</span>
							<div class="flex-1"><p class="text-sm font-extrabold">{s.id}</p><p class="text-[0.68rem] text-slate">{s.desc}</p></div>
							<span class={`grid h-5 w-5 place-items-center rounded-full border-2 ${style === s.id ? 'border-forest bg-forest text-white' : 'border-[#d8d3c2]'}`}>{#if style === s.id}<Check size={11} />{/if}</span>
						</button>
					{/each}
				</div>
				<div class="mt-4">
					<span class="label">What are you into? (pick at least two)</span>
					<div class="flex flex-wrap gap-1.5">
						{#each interestOptions as i}
							<button class={`chip text-[0.68rem] ${interests.includes(i) ? 'border-forest bg-forest text-white' : ''}`} onclick={() => toggleInterest(i)}>{i}</button>
						{/each}
					</div>
				</div>
			{:else}
				<h2 class="mt-4 display text-2xl font-semibold">Your learning plan</h2>
				<p class="mt-1 text-sm text-slate">One last check. Then we’ll build your dashboard.</p>
				<div class="mt-4 space-y-3">
					<div>
						<label class="label" for="curriculum">Curriculum</label>
						<select id="curriculum" class="input" bind:value={curriculum}>
							<option>NERDC</option><option>Common Core</option><option>UK National</option><option>Cambridge</option><option>IB</option><option>WAEC</option>
						</select>
					</div>
					<div>
						<label class="label" for="goal">Daily XP goal</label>
						<select id="goal" class="input" bind:value={goal}>
							<option value="100">100 XP · light and steady</option>
							<option value="150">150 XP · recommended</option>
							<option value="250">250 XP · ambitious</option>
							<option value="400">400 XP · exam mode</option>
						</select>
					</div>
					<div class="rounded-2xl bg-[#f7f5ec] p-4">
						<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-slate">Your snapshot</p>
						<div class="mt-2 flex items-center gap-3">
							<span class="grid h-12 w-12 place-items-center rounded-2xl bg-white text-2xl">{avatar}</span>
							<div>
								<p class="display text-lg font-semibold">{name}, {age}</p>
								<p class="text-[0.68rem] text-slate">{grade} · {curriculum} · {style} learner</p>
							</div>
						</div>
						<div class="mt-2 flex flex-wrap gap-1.5">
							{#each interests as i}<span class="pill text-[0.56rem]">{i}</span>{/each}
						</div>
					</div>
					<div class="flex items-start gap-2 rounded-xl bg-[#e9fbf1] p-3">
						<Target size={16} class="mt-0.5 shrink-0 text-[#0b6b45]" />
						<p class="text-[0.68rem] leading-snug text-[#0b6b45]">Sabify will start with <strong>Number Ninjas</strong> and <strong>Word Wizards</strong>, then adapt based on your first quiz.</p>
					</div>
				</div>
			{/if}

			<div class="mt-6 flex items-center justify-between gap-2 border-t border-[#eee9dc] pt-4">
				<button class="btn btn-ghost btn-sm" disabled={step === 1} onclick={() => step--}><ArrowLeft size={14} /> Back</button>
				<button class="btn btn-primary" onclick={next}>
					{#if step === 3}<Wand2 size={16} /> Build my dashboard{:else}Continue <ArrowRight size={16} />{/if}
				</button>
			</div>
			{#if step === 3}
				<p class="mt-2 flex items-center justify-center gap-1 text-[0.62rem] font-semibold text-slate"><Sparkles size={11} /> Free plan starts now. Upgrade for ₦5,000/month anytime.</p>
			{/if}
		</div>
	</div>
</div>
