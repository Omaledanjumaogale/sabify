<script lang="ts">
	import { Check, ChevronDown, Download, Mail, MoreHorizontal, Plus, Search, Shield, UserCheck, Users, X } from '@lucide/svelte';
	import { toast } from '$lib/stores/toast';
	import { formatNaira } from '$lib/utils';
	import Modal from '$lib/components/Modal.svelte';
	import Avatar from '$lib/components/Avatar.svelte';

	type Person = { id: string; name: string; email: string; role: string; plan: string; status: string; joined: string; xp: number; avatar: string; school: string; spend: number };

	let people = $state<Person[]>([
		{ id: 'u1', name: 'Ada Okafor', email: 'ada@example.com', role: 'Learner', plan: 'Family', status: 'Active', joined: '12 Sep 2026', xp: 5717, avatar: '🦊', school: 'Greenfield Academy', spend: 10000 },
		{ id: 'u2', name: 'Chidi Okafor', email: 'chidi@example.com', role: 'Learner', plan: 'Family', status: 'Active', joined: '12 Sep 2026', xp: 3490, avatar: '🐣', school: 'Greenfield Academy', spend: 10000 },
		{ id: 'u3', name: 'Ngozi Okafor', email: 'ngozi@example.com', role: 'Parent', plan: 'Family', status: 'Active', joined: '12 Sep 2026', xp: 0, avatar: '👩🏾', school: '—', spend: 5000 },
		{ id: 'u4', name: 'Emeka Obi', email: 'emeka@greenfield.edu.ng', role: 'Teacher', plan: 'Educator', status: 'Active', joined: '2 Aug 2026', xp: 0, avatar: '👨🏾‍🏫', school: 'Greenfield Academy', spend: 0 },
		{ id: 'u5', name: 'Greenfield Academy', email: 'admin@greenfield.edu.ng', role: 'School', plan: 'School · 120', status: 'Active', joined: '15 Jan 2026', xp: 0, avatar: '🏫', school: 'Lagos', spend: 420000 },
		{ id: 'u6', name: 'Tunde Adeyemi', email: 'tunde@example.com', role: 'Learner', plan: 'Explorer', status: 'Trial', joined: '20 Nov 2026', xp: 820, avatar: '🧒🏾', school: 'Unity College', spend: 0 },
		{ id: 'u7', name: 'Halima Sani', email: 'halima@example.com', role: 'Teacher', plan: 'Educator', status: 'Active', joined: '5 Oct 2026', xp: 0, avatar: '👩🏾‍🏫', school: 'Crescent International', spend: 0 },
		{ id: 'u8', name: 'Blessing Nwosu', email: 'blessing@example.com', role: 'Learner', plan: 'Family', status: 'Suspended', joined: '1 Nov 2026', xp: 2100, avatar: '👧🏾', school: 'Bright Future', spend: 5000 }
	]);
	let q = $state('');
	let role = $state('All roles');
	let status = $state('All status');
	let detail = $state<Person | null>(null);
	let addOpen = $state(false);
	let newName = $state('');
	let newEmail = $state('');
	let newRole = $state('Learner');

	let filtered = $derived(people.filter((p) => (role === 'All roles' || p.role === role) && (status === 'All status' || p.status === status) && (p.name.toLowerCase().includes(q.toLowerCase()) || p.email.toLowerCase().includes(q.toLowerCase()) || p.school.toLowerCase().includes(q.toLowerCase()))));
	let counts = $derived({ learners: people.filter((p) => p.role === 'Learner').length, teachers: people.filter((p) => p.role === 'Teacher').length, schools: people.filter((p) => p.role === 'School').length });

	function toggleStatus(p: Person) {
		p.status = p.status === 'Suspended' ? 'Active' : 'Suspended';
		toast(`${p.name} ${p.status === 'Suspended' ? 'suspended' : 'reactivated'}`, p.status === 'Suspended' ? 'error' : 'success', p.status === 'Suspended' ? '🚫' : '✅');
	}

	function addUser() {
		if (!newName.trim() || !newEmail.trim()) return toast('Name and email are required', 'error', '✏️');
		people = [{ id: 'u' + Date.now(), name: newName, email: newEmail, role: newRole, plan: newRole === 'School' ? 'School · 30' : 'Family', status: 'Trial', joined: 'Today', xp: 0, avatar: newRole === 'Teacher' ? '👨🏾‍🏫' : newRole === 'Parent' ? '👩🏾' : newRole === 'School' ? '🏫' : '🐣', school: '—', spend: 0 }, ...people];
		addOpen = false;
		newName = '';
		newEmail = '';
		toast('User invited by email', 'success', '✉️');
	}
</script>

<svelte:head><title>Users · Sabify admin</title></svelte:head>

<div class="space-y-5">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">People</p>
			<h1 class="mt-1 display text-2xl font-semibold sm:text-3xl">Users & organisations</h1>
			<p class="mt-1 text-sm text-slate">12,480 learners, 640 teachers and 84 school partners.</p>
		</div>
		<div class="flex gap-2">
			<button class="btn btn-ghost btn-sm" onclick={() => toast('User list exported', 'success', '⬇️')}><Download size={14} /> Export</button>
			<button class="btn btn-primary btn-sm" onclick={() => (addOpen = true)}><Plus size={15} /> Invite user</button>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
		{#each [{ l: 'Learners', v: '12,480', d: '+6.2% this month', e: '👩🏾‍🎓' }, { l: 'Teachers', v: '640', d: '+4.1% this month', e: '👨🏾‍🏫' }, { l: 'Schools', v: '84', d: '9 onboarding', e: '🏫' }, { l: 'Suspended', v: people.filter((p) => p.status === 'Suspended').length.toString(), d: 'Under review', e: '🚫' }] as s}
			<div class="card p-4"><div class="flex items-center justify-between"><span class="text-xl">{s.e}</span><span class="pill text-[0.5rem]">{s.d}</span></div><p class="mt-1 display text-2xl font-semibold">{s.v}</p><p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-slate">{s.l}</p></div>
		{/each}
	</div>

	<div class="card overflow-hidden">
		<div class="flex flex-wrap items-center gap-2 border-b border-[#eee9dc] p-3">
			<div class="relative min-w-[180px] flex-1">
				<Search size={14} class="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
				<input class="input !min-h-9 !rounded-full !py-1.5 !pl-9 text-xs" placeholder="Search name, email or school…" bind:value={q} aria-label="Search users" />
			</div>
			<select class="input !min-h-9 !w-auto !rounded-full !py-1.5 text-xs font-bold" bind:value={role} aria-label="Filter role">
				{#each ['All roles', 'Learner', 'Teacher', 'Parent', 'School'] as r}<option>{r}</option>{/each}
			</select>
			<select class="input !min-h-9 !w-auto !rounded-full !py-1.5 text-xs font-bold" bind:value={status} aria-label="Filter status">
				{#each ['All status', 'Active', 'Trial', 'Suspended'] as s}<option>{s}</option>{/each}
			</select>
			<span class="ml-auto text-[0.62rem] font-bold text-slate">{filtered.length} shown</span>
		</div>
		<div class="overflow-x-auto">
			<table class="w-full min-w-[720px] text-left">
				<thead><tr class="bg-[#faf8f0] text-[0.56rem] uppercase tracking-wider text-slate">
					<th class="px-4 py-2.5 font-extrabold">User</th><th class="px-3 py-2.5 font-extrabold">Role</th><th class="px-3 py-2.5 font-extrabold">Plan</th><th class="px-3 py-2.5 font-extrabold">School</th><th class="px-3 py-2.5 font-extrabold">Joined</th><th class="px-3 py-2.5 font-extrabold">Status</th><th class="px-3 py-2.5 text-right font-extrabold">Actions</th>
				</tr></thead>
				<tbody>
					{#each filtered as p (p.id)}
						<tr class="border-t border-[#f4f1e6] transition hover:bg-[#fbfdf7]">
							<td class="px-4 py-2.5">
								<div class="flex items-center gap-2.5">
									<Avatar emoji={p.avatar} size={30} ring={false} />
									<div><p class="text-[0.72rem] font-extrabold">{p.name}</p><p class="text-[0.58rem] text-slate">{p.email}</p></div>
								</div>
							</td>
							<td class="px-3 py-2.5"><span class="pill text-[0.5rem]">{p.role}</span></td>
							<td class="px-3 py-2.5 text-[0.66rem] font-bold">{p.plan}</td>
							<td class="px-3 py-2.5 text-[0.64rem] text-slate">{p.school}</td>
							<td class="px-3 py-2.5 text-[0.62rem] text-slate">{p.joined}</td>
							<td class="px-3 py-2.5"><span class={`pill text-[0.5rem] ${p.status === 'Active' ? '' : p.status === 'Trial' ? 'pill-gold' : 'pill-coral'}`}>{p.status}</span></td>
							<td class="px-3 py-2.5 text-right">
								<button class="rounded-lg px-2 py-1 text-[0.6rem] font-extrabold text-forest hover:bg-[#f2fbdf]" onclick={() => (detail = p)}>View</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		{#if filtered.length === 0}
			<div class="p-8 text-center"><p class="text-sm font-extrabold">No users match those filters</p><button class="btn btn-ghost btn-sm mt-2" onclick={() => { q = ''; role = 'All roles'; status = 'All status'; }}>Clear filters</button></div>
		{/if}
	</div>
</div>

<Modal open={detail !== null} title={detail?.name ?? ''} subtitle={detail ? `${detail.role} · joined ${detail.joined}` : ''} onclose={() => (detail = null)}>
	{#if detail}
		<div class="space-y-3">
			<div class="flex items-center gap-3">
				<Avatar emoji={detail.avatar} size={52} ring />
				<div class="min-w-0"><p class="text-sm font-extrabold">{detail.email}</p><p class="text-[0.66rem] text-slate">{detail.school}</p></div>
				<span class={`pill ml-auto text-[0.52rem] ${detail.status === 'Active' ? '' : detail.status === 'Trial' ? 'pill-gold' : 'pill-coral'}`}>{detail.status}</span>
			</div>
			<div class="grid grid-cols-3 gap-2">
				{#each [{ l: 'Plan', v: detail.plan }, { l: 'XP', v: detail.xp.toLocaleString() }, { l: 'Lifetime', v: formatNaira(detail.spend) }] as s}
					<div class="rounded-xl bg-[#f7f5ec] p-2.5"><p class="text-[0.54rem] font-bold uppercase tracking-wider text-slate">{s.l}</p><p class="text-[0.72rem] font-extrabold">{s.v}</p></div>
				{/each}
			</div>
			<div class="rounded-xl border border-[#eee9dc] p-3">
				<p class="text-[0.62rem] font-extrabold uppercase tracking-wider text-slate">Recent activity</p>
				{#each [{ t: 'Completed a Fractions lesson', d: '2 hours ago' }, { t: 'Scored 90% in a science quiz', d: 'Yesterday' }, { t: 'Earned Quiz Ace badge', d: '3 days ago' }] as a}
					<div class="mt-1.5 flex justify-between text-[0.66rem]"><span class="font-semibold text-[#3f564b]">{a.t}</span><span class="text-slate">{a.d}</span></div>
				{/each}
			</div>
			<div class="flex gap-2">
				<button class="btn btn-ghost flex-1" onclick={() => toast('Password reset email sent', 'success', '✉️')}><Mail size={13} /> Reset password</button>
				<button class={`btn ${detail.status === 'Suspended' ? 'btn-primary' : 'btn-danger'} flex-1`} onclick={() => { toggleStatus(detail!); detail = null; }}>{detail.status === 'Suspended' ? 'Reactivate' : 'Suspend'} account</button>
			</div>
		</div>
	{/if}
</Modal>

<Modal open={addOpen} title="Invite a user" subtitle="They receive a secure email invitation." onclose={() => (addOpen = false)}>
	<div class="space-y-3">
		<div><label class="label" for="un">Full name</label><input id="un" class="input" bind:value={newName} placeholder="e.g. Kemi Adeyemi" /></div>
		<div><label class="label" for="ue">Email</label><input id="ue" class="input" type="email" bind:value={newEmail} placeholder="name@example.com" /></div>
		<div><label class="label" for="ur">Role</label><select id="ur" class="input" bind:value={newRole}>{#each ['Learner', 'Teacher', 'Parent', 'School'] as r}<option>{r}</option>{/each}</select></div>
		<button class="btn btn-primary w-full" onclick={addUser}><UserCheck size={15} /> Send invitation</button>
	</div>
</Modal>
