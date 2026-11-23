<script lang="ts">
	import { ArrowRight, Check, Clock, Plus, ShieldCheck, SlidersHorizontal, Users } from '@lucide/svelte';
	import { parentChildren } from '$lib/data/seed';
	import { toast } from '$lib/stores/toast';
	import Avatar from '$lib/components/Avatar.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';

	let limits = $state<Record<string, number>>({ c1: 45, c2: 60 });
	let add = $state(false);
	let manage = $state<string | null>(null);
	let childName = $state('');
	let childGrade = $state('Primary 3');
	let childAge = $state(8);
	let avatar = $state('🐣');
	let dailyGoal = $state<Record<string, number>>({ c1: 150, c2: 200 });
	let notifications = $state<Record<string, boolean>>({ c1: true, c2: true });

	let managed = $derived(parentChildren.find((c) => c.id === manage));

	function addChild() {
		if (!childName.trim()) return toast('Enter the child’s name', 'error', '✏️');
		add = false;
		toast(`${childName} added to the family plan`, 'success', '🎉');
		childName = '';
	}

	function saveLimits() {
		manage = null;
		toast('Screen-time settings saved', 'success', '✅');
	}
</script>

<svelte:head><title>Children · Sabify for parents</title></svelte:head>

<div class="space-y-5">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">Family · 2 learners</p>
			<h1 class="mt-1 display text-2xl font-semibold sm:text-3xl">Your children</h1>
			<p class="mt-1 text-sm text-slate">Profiles, screen-time limits and learning goals.</p>
		</div>
		<button class="btn btn-primary btn-sm" onclick={() => (add = true)}><Plus size={15} /> Add child</button>
	</div>

	<div class="grid gap-4 lg:grid-cols-2">
		{#each parentChildren as c}
			<div class="card p-5">
				<div class="flex items-start gap-3">
					<Avatar emoji={c.avatar} size={56} ring ringClass="ring-lime" />
					<div class="min-w-0 flex-1">
						<p class="display text-lg font-semibold">{c.name}</p>
						<p class="text-[0.66rem] text-slate">{c.grade} · {c.plan}</p>
					</div>
					<button class="btn btn-ghost btn-sm" onclick={() => (manage = c.id)}><SlidersHorizontal size={13} /> Manage</button>
				</div>
				<div class="mt-4 grid grid-cols-3 gap-2">
					{#each [{ l: 'XP', v: c.xp.toLocaleString() }, { l: 'Accuracy', v: `${c.accuracy}%` }, { l: 'Streak', v: `${c.streak} days` }] as s}
						<div class="rounded-xl bg-[#f7f5ec] p-2.5"><p class="text-[0.54rem] font-bold uppercase tracking-wider text-slate">{s.l}</p><p class="display text-base font-semibold">{s.v}</p></div>
					{/each}
				</div>
				<div class="mt-3 space-y-2">
					<div>
						<div class="flex justify-between text-[0.62rem] font-bold text-slate"><span>Daily screen time</span><span>{limits[c.id]} min limit</span></div>
						<div class="progress-track mt-1 h-1.5"><div class="progress-fill" style={`width:${Math.min(100, (28 / Math.max(1, limits[c.id])) * 100)}%`}></div></div>
					</div>
					<div>
						<div class="flex justify-between text-[0.62rem] font-bold text-slate"><span>Daily XP goal</span><span>{dailyGoal[c.id]} XP</span></div>
						<div class="progress-track mt-1 h-1.5"><div class="progress-fill" style={`width:${Math.min(100, (125 / Math.max(1, dailyGoal[c.id])) * 100)}%`}></div></div>
					</div>
				</div>
				<div class="mt-3 flex flex-wrap gap-1.5">
					<span class="pill text-[0.54rem]">{c.topSubject} strongest</span>
					<span class="pill pill-gold text-[0.54rem]">{c.needsSupport} focus</span>
					<span class={`pill text-[0.54rem] ${notifications[c.id] ? '' : 'pill-coral'}`}>{notifications[c.id] ? 'Alerts on' : 'Alerts off'}</span>
				</div>
				<div class="mt-3 flex gap-2">
					<a href="/parent/reports" class="btn btn-ghost btn-sm flex-1">View report</a>
					<button class="btn btn-primary btn-sm flex-1" onclick={() => (manage = c.id)}>Adjust plan</button>
				</div>
			</div>
		{/each}

		<div class="card grid place-items-center border-dashed p-6 text-center">
			<div class="grid h-14 w-14 place-items-center rounded-3xl bg-[#f2fbdf] text-2xl">👶🏾</div>
			<h3 class="mt-3 display text-lg font-semibold">Add a learner</h3>
			<p class="mt-1 max-w-xs text-[0.7rem] text-slate">Family Plus includes up to four learner profiles with separate progress and controls.</p>
			<button class="btn btn-primary btn-sm mt-3" onclick={() => (add = true)}><Plus size={14} /> Add child</button>
			<a href="/app/subscription" class="mt-2 text-[0.62rem] font-extrabold text-forest">Compare family plans <ArrowRight size={11} class="inline" /></a>
		</div>
	</div>

	<div class="grid gap-4 sm:grid-cols-3">
		{#each [
			{ e: '🛡️', t: 'Safe by design', d: 'No stranger chat. AI replies are age-filtered and visible to you.' },
			{ e: '⏱️', t: 'Healthy limits', d: 'Set daily screen time and a consistent learning window.' },
			{ e: '📊', t: 'Real visibility', d: 'See time, accuracy and mastery — not just a streak number.' }
		] as f}
			<div class="card p-4"><span class="text-xl">{f.e}</span><p class="mt-1 text-sm font-extrabold">{f.t}</p><p class="text-[0.66rem] leading-snug text-slate">{f.d}</p></div>
		{/each}
	</div>
</div>

<Modal open={manage !== null} title={`Manage ${managed?.name.split(' ')[0] ?? 'child'}`} subtitle="Changes apply immediately to their learner account." onclose={() => (manage = null)}>
	{#if managed}
		<div class="space-y-4">
			<div class="flex items-center gap-3">
				<Avatar emoji={managed.avatar} size={48} ring />
				<div><p class="text-sm font-extrabold">{managed.name}</p><p class="text-[0.66rem] text-slate">{managed.grade} · {managed.plan}</p></div>
			</div>
			<div>
				<label class="label" for="limit">Daily screen-time limit</label>
				<input id="limit" type="range" min="15" max="120" step="5" class="w-full accent-[#0d3b2a]" bind:value={limits[managed.id]} />
				<div class="flex justify-between text-[0.6rem] font-bold text-slate"><span>15 min</span><span class="text-ink">{limits[managed.id]} minutes</span><span>2 hours</span></div>
			</div>
			<div>
				<label class="label" for="goal">Daily XP goal</label>
				<select id="goal" class="input" bind:value={dailyGoal[managed.id]}>
					<option value={100}>100 XP · light</option><option value={150}>150 XP · steady</option><option value={250}>250 XP · ambitious</option>
				</select>
			</div>
			<div class="flex items-center gap-3 rounded-xl bg-[#f7f5ec] p-3">
				<div class="flex-1"><p class="text-[0.74rem] font-extrabold">Progress notifications</p><p class="text-[0.62rem] text-slate">Weekly report and milestone alerts.</p></div>
				<button role="switch" aria-label="Progress notifications" aria-checked={notifications[managed.id]} class={`relative h-6 w-11 rounded-full transition ${notifications[managed.id] ? 'bg-forest' : 'bg-[#ddd8c8]'}`} onclick={() => (notifications[managed.id] = !notifications[managed.id])}>
					<span class={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${notifications[managed.id] ? 'left-[22px]' : 'left-0.5'}`}></span>
				</button>
			</div>
			<div class="rounded-xl bg-[#e9fbf1] p-3 text-[0.66rem] text-[#0b6b45]"><ShieldCheck size={13} class="mr-1 inline" /> Settings are protected by your parent PIN in the full app.</div>
			<div class="flex gap-2">
				<button class="btn btn-ghost flex-1" onclick={() => (manage = null)}>Cancel</button>
				<button class="btn btn-primary flex-1" onclick={saveLimits}><Check size={14} /> Save changes</button>
			</div>
		</div>
	{/if}
</Modal>

<Modal open={add} title="Add a child" subtitle="Create a separate learner profile on your family plan." onclose={() => (add = false)}>
	<div class="space-y-3">
		<div><label class="label" for="cname">Child’s name</label><input id="cname" class="input" bind:value={childName} placeholder="e.g. Chidi Okafor" /></div>
		<div class="grid gap-3 sm:grid-cols-2">
			<div><label class="label" for="cage">Age</label><input id="cage" class="input" type="number" min="4" max="18" bind:value={childAge} /></div>
			<div>
				<label class="label" for="cgrade">Grade</label>
				<select id="cgrade" class="input" bind:value={childGrade}>
					{#each ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'JSS 1', 'JSS 2', 'JSS 3'] as g}<option>{g}</option>{/each}
				</select>
			</div>
		</div>
		<div>
			<span class="label">Avatar</span>
			<div class="flex flex-wrap gap-2">
				{#each ['🐣', '🦊', '🐼', '🦁', '🦋', '🐨'] as face}
					<button class={`grid h-9 w-9 place-items-center rounded-xl border-2 text-lg ${avatar === face ? 'border-forest bg-[#f2fbdf]' : 'border-[#e9e4d6] bg-white'}`} onclick={() => (avatar = face)}>{face}</button>
				{/each}
			</div>
		</div>
		<button class="btn btn-primary w-full" onclick={addChild}><Plus size={15} /> Add learner</button>
	</div>
</Modal>
