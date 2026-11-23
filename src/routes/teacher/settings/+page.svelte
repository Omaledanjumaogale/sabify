<script lang="ts">
	import { Check, CreditCard, GraduationCap, Link2, Mail, Save, Shield, Users, Zap } from '@lucide/svelte';
	import { session, updateProfile } from '$lib/stores/session';
	import { toast } from '$lib/stores/toast';

	let name = $state($session.user?.name ?? 'Emeka Obi');
	let email = $state($session.user?.email ?? 'emeka@greenfield.edu.ng');
	let school = $state('Greenfield Academy');
	let subject = $state('Mathematics');
	let classSize = $state('32');
	let joinPolicy = $state('Approval required');
	let reminders = $state(true);
	let weeklyDigest = $state(true);
	let parentReports = $state(true);
	let googleClassroom = $state(false);
	let teams = $state(false);

	function save() {
		updateProfile({ name, email });
		toast('Teacher settings saved', 'success', '✅');
	}

	function connect(name: string) {
		toast(`${name} connection started — you will be redirected to sign in.`, 'info', '🔗');
	}
</script>

<svelte:head><title>Teacher settings · Sabify</title></svelte:head>

<div class="space-y-5">
	<div>
		<h1 class="display text-2xl font-semibold sm:text-3xl">Teacher settings</h1>
		<p class="mt-1 text-sm text-slate">Your profile, class defaults and integrations.</p>
	</div>

	<div class="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><GraduationCap size={17} class="text-forest" /><h2 class="display text-base font-semibold">Teacher profile</h2></div>
				<div class="mt-3 grid gap-3 sm:grid-cols-2">
					<div><label class="label" for="name">Full name</label><input id="name" class="input" bind:value={name} /></div>
					<div><label class="label" for="email">Email</label><input id="email" class="input" bind:value={email} /></div>
					<div><label class="label" for="school">School</label><input id="school" class="input" bind:value={school} /></div>
					<div><label class="label" for="subject">Main subject</label><input id="subject" class="input" bind:value={subject} /></div>
				</div>
				<button class="btn btn-primary btn-sm mt-3" onclick={save}><Save size={14} /> Save profile</button>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><Users size={17} class="text-forest" /><h2 class="display text-base font-semibold">Class defaults</h2></div>
				<div class="mt-3 grid gap-3 sm:grid-cols-2">
					<div><label class="label" for="size">Default class size</label><input id="size" class="input" type="number" bind:value={classSize} /></div>
					<div>
						<label class="label" for="policy">Join policy</label>
						<select id="policy" class="input" bind:value={joinPolicy}><option>Approval required</option><option>Open with code</option><option>Invite only</option></select>
					</div>
				</div>
				<div class="mt-3 rounded-xl bg-[#f7f5ec] p-3 text-[0.66rem] text-slate">Join code for your active class: <strong class="tracking-wider">SAB-JSS2A</strong></div>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><Mail size={17} class="text-forest" /><h2 class="display text-base font-semibold">Notifications</h2></div>
				<div class="mt-2 divide-y divide-[#f0ece0]">
					{#each [
						{ l: 'Assignment reminders', d: 'When learners are close to a deadline.', v: reminders, set: (x: boolean) => (reminders = x) },
						{ l: 'Weekly class digest', d: 'Every Monday with mastery and risk changes.', v: weeklyDigest, set: (x: boolean) => (weeklyDigest = x) },
						{ l: 'Parent report copies', d: 'Receive a copy of each weekly parent report.', v: parentReports, set: (x: boolean) => (parentReports = x) }
					] as row}
						<div class="flex items-center gap-3 py-3">
							<div class="flex-1"><p class="text-[0.78rem] font-extrabold">{row.l}</p><p class="text-[0.64rem] text-slate">{row.d}</p></div>
							<button role="switch" aria-label={row.l} aria-checked={row.v} class={`relative h-6 w-11 shrink-0 rounded-full transition ${row.v ? 'bg-forest' : 'bg-[#ddd8c8]'}`} onclick={() => row.set(!row.v)}>
								<span class={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${row.v ? 'left-[22px]' : 'left-0.5'}`}></span>
							</button>
						</div>
					{/each}
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><Link2 size={17} class="text-forest" /><h2 class="display text-base font-semibold">Integrations</h2></div>
				<div class="mt-3 grid gap-2 sm:grid-cols-2">
					{#each [{ n: 'Google Classroom', d: 'Import classes and post assignments.', v: googleClassroom, set: (x: boolean) => (googleClassroom = x) }, { n: 'Microsoft Teams', d: 'Share lesson links and grades.', v: teams, set: (x: boolean) => (teams = x) }] as i}
						<div class="rounded-xl border border-[#eee9dc] p-3">
							<div class="flex items-center justify-between">
								<p class="text-[0.74rem] font-extrabold">{i.n}</p>
								<span class={`pill text-[0.5rem] ${i.v ? '' : 'pill-gold'}`}>{i.v ? 'Connected' : 'Not connected'}</span>
							</div>
							<p class="mt-0.5 text-[0.62rem] text-slate">{i.d}</p>
							<button class="btn btn-ghost btn-sm mt-2 w-full" onclick={() => (i.v ? i.set(false) : connect(i.n))}>{i.v ? 'Disconnect' : 'Connect'}</button>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><CreditCard size={17} class="text-forest" /><p class="text-sm font-extrabold">School plan</p></div>
				<p class="mt-1 text-[0.68rem] text-slate">Greenfield Academy · 120 learner seats</p>
				<div class="mt-2 rounded-xl bg-[#f2fbdf] p-3">
					<p class="text-[0.62rem] font-bold uppercase tracking-wider text-[#256b16]">Active until</p>
					<p class="display text-lg font-semibold text-[#256b16]">31 August 2027</p>
					<p class="text-[0.62rem] text-[#256b16]/70">Invoice #GF-2026-118 · ₦3,500/learner/month</p>
				</div>
				<button class="btn btn-ghost btn-sm mt-2 w-full" onclick={() => toast('Invoice downloaded', 'success', '🧾')}>Download invoice</button>
			</div>

			<div class="card p-4">
				<div class="flex items-center gap-2"><Shield size={16} class="text-forest" /><p class="text-sm font-extrabold">Safeguarding</p></div>
				<p class="mt-1 text-[0.66rem] leading-relaxed text-slate">All teacher accounts are verified against school records. Learner conversations with Sabi are filtered and visible to guardians.</p>
				<a href="/pricing" class="mt-2 inline-flex items-center gap-1 text-[0.64rem] font-extrabold text-forest">Read safety policy</a>
			</div>

			<div class="rounded-[1.5rem] bg-[#f4f1e4] p-4">
				<div class="flex items-center gap-2"><Zap size={15} class="text-[#7a4f00]" /><p class="text-sm font-extrabold">Need help?</p></div>
				<p class="mt-1 text-[0.66rem] text-slate">Your school success partner is Kemi. She usually replies within 2 hours.</p>
				<a href="mailto:kemi@sabify.ng" class="btn btn-primary btn-sm mt-2 w-full">Email Kemi</a>
			</div>
		</div>
	</div>
</div>
