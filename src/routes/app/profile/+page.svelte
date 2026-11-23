<script lang="ts">
	import { Award, BookOpen, CalendarDays, Check, Copy, Edit3, Flame, GraduationCap, MapPin, Share2, Sparkles, Target, Trophy, Zap } from '@lucide/svelte';
	import { session, updateProfile } from '$lib/stores/session';
	import { accuracy, earnedBadgeList, level, levelProgress, progress, rankTitle } from '$lib/stores/progress';
	import { activityDays, badges } from '$lib/data/seed';
	import { subjects } from '$lib/data/curriculum';
	import { toast } from '$lib/stores/toast';
	import Modal from '$lib/components/Modal.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import BadgeTile from '$lib/components/BadgeTile.svelte';
	import Heatmap from '$lib/components/Heatmap.svelte';
	import ProgressRing from '$lib/components/ProgressRing.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';

	let user = $derived($session.user);
	let edit = $state(false);
	let avatarChoices = ['🦊', '🦁', '🐼', '🦋', '🐯', '🐨', '🦉', '🐢', '🐝', '🦅', '🐣', '🦄'];
	let form = $state({ name: '', age: 11, grade: '', city: '', curriculum: '', learningStyle: '', interests: '', avatar: '🦊' });

	function openEdit() {
		if (!user) return;
		form = {
			name: user.name,
			age: user.age,
			grade: user.grade,
			city: user.city,
			curriculum: user.curriculum,
			learningStyle: user.learningStyle,
			interests: user.interests.join(', '),
			avatar: user.avatar
		};
		edit = true;
	}

	function save() {
		updateProfile({
			name: form.name,
			firstName: form.name.split(' ')[0],
			age: Number(form.age),
			grade: form.grade,
			city: form.city,
			curriculum: form.curriculum,
			learningStyle: form.learningStyle,
			interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean),
			avatar: form.avatar
		});
		edit = false;
		toast('Profile updated', 'success', '✅');
	}

	function copyProfile() {
		const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/app/profile`;
		void navigator.clipboard?.writeText(link).then(() => toast('Profile link copied', 'success', '🔗')).catch(() => toast('Could not copy link', 'error'));
	}

	let accuracyPct = $derived(Math.round($accuracy * 100));
	let earnedCount = $derived($progress.earnedBadges.length);
</script>

<svelte:head><title>My profile · Sabify</title></svelte:head>

<div class="space-y-5">
	<div class="relative overflow-hidden rounded-[2rem] bg-[#0b2b1f] p-5 text-white sm:p-7">
		<div class="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-lime/15 blur-3xl"></div>
		<div class="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-gold/10 blur-3xl"></div>
		<div class="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center">
				<div class="relative">
					<Avatar emoji={user?.avatar ?? '🦊'} size={96} ring ringClass="ring-gold" />
					<span class="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-gold text-[0.62rem] font-extrabold text-ink">{$level}</span>
				</div>
				<div>
					<div class="flex flex-wrap items-center gap-2">
						<h1 class="display text-3xl font-semibold">{user?.name}</h1>
						<span class="pill pill-dark text-[0.58rem]">{user?.plan === 'free' ? 'Free plan' : 'Family plan'}</span>
					</div>
					<p class="mt-1 text-sm text-white/55">{user?.grade} · {user?.curriculum} · {user?.city}</p>
					<div class="mt-2 flex flex-wrap gap-2">
						<span class="pill pill-dark text-[0.6rem]"><Flame size={11} /> {$progress.streak}-day streak</span>
						<span class="pill pill-dark text-[0.6rem]"><Trophy size={11} /> {$rankTitle}</span>
						<span class="pill pill-dark text-[0.6rem]"><CalendarDays size={11} /> Joined Sep 2026</span>
					</div>
					<div class="mt-3 flex flex-wrap gap-2">
						<button class="btn btn-lime btn-sm" onclick={openEdit}><Edit3 size={14} /> Edit profile</button>
						<button class="btn btn-white btn-sm" onclick={copyProfile}><Share2 size={14} /> Share</button>
					</div>
				</div>
			</div>
			<div class="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
				<ProgressRing value={$levelProgress * 100} size={94} stroke={8} color="#c9f26b" track="rgba(255,255,255,0.12)" sublabel="to next" />
				<div>
					<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-white/40">Level {$level}</p>
					<p class="display text-2xl font-semibold text-lime">{$progress.xp.toLocaleString()} XP</p>
					<p class="text-[0.64rem] text-white/50">{$rankTitle} · keep climbing</p>
				</div>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
		{#each [
			{ l: 'Lessons complete', v: $progress.completedLessons.length.toString(), e: '📚' },
			{ l: 'Accuracy', v: `${accuracyPct}%`, e: '🎯' },
			{ l: 'Games played', v: $progress.gamesPlayed.toString(), e: '🎮' },
			{ l: 'Badges earned', v: `${earnedCount}/${badges.length}`, e: '🏅' }
		] as s}
			<div class="card p-4">
				<span class="text-xl">{s.e}</span>
				<p class="mt-2 display text-2xl font-semibold">{s.v}</p>
				<p class="text-[0.6rem] font-extrabold uppercase tracking-wider text-slate">{s.l}</p>
			</div>
		{/each}
	</div>

	<div class="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<div class="flex items-center justify-between">
					<div>
						<h2 class="display text-lg font-semibold">Skill mastery</h2>
						<p class="text-[0.68rem] text-slate">Based on lessons, quizzes and games.</p>
					</div>
					<span class="pill text-[0.56rem]">{Object.keys($progress.skillMastery).length} skills tracked</span>
				</div>
				<div class="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
					{#each Object.entries($progress.skillMastery).sort((a, b) => b[1] - a[1]) as [skill, value]}
						<ProgressBar label={skill} value={value} />
					{/each}
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center justify-between">
					<div>
						<h2 class="display text-lg font-semibold">Learning activity</h2>
						<p class="text-[0.68rem] text-slate">Your last 12 weeks, one square per day.</p>
					</div>
					<span class="pill pill-gold text-[0.56rem]"><Zap size={11} /> {$progress.minutesLearned} min</span>
				</div>
				<div class="mt-4"><Heatmap days={activityDays} /></div>
				<div class="mt-3 grid grid-cols-3 gap-2">
					<div class="rounded-xl bg-[#f7f5ec] p-2.5"><p class="text-[0.56rem] font-bold uppercase text-slate">Best streak</p><p class="display text-base font-semibold">{$progress.bestStreak} days</p></div>
					<div class="rounded-xl bg-[#f7f5ec] p-2.5"><p class="text-[0.56rem] font-bold uppercase text-slate">Quizzes</p><p class="display text-base font-semibold">{$progress.quizzesPlayed}</p></div>
					<div class="rounded-xl bg-[#f7f5ec] p-2.5"><p class="text-[0.56rem] font-bold uppercase text-slate">Coins</p><p class="display text-base font-semibold">{$progress.coins}</p></div>
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center justify-between">
					<h2 class="display text-lg font-semibold">Badge cabinet</h2>
					<a href="/app/achievements" class="text-[0.64rem] font-extrabold text-forest">View all</a>
				</div>
				<div class="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
					{#each $earnedBadgeList.filter((b) => b.earned) as badge}
						<BadgeTile {badge} size="sm" />
					{/each}
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<h2 class="display text-base font-semibold">About me</h2>
				<div class="mt-3 space-y-2.5">
					{#each [
						{ icon: GraduationCap, l: 'Grade', v: user?.grade ?? '—' },
						{ icon: BookOpen, l: 'Curriculum', v: user?.curriculum ?? '—' },
						{ icon: MapPin, l: 'City', v: user?.city ?? '—' },
						{ icon: Sparkles, l: 'Learning style', v: user?.learningStyle ?? '—' },
						{ icon: Target, l: 'Age group', v: `${user?.age ?? 11} years` }
					] as row}
						{@const Icon = row.icon}
						<div class="flex items-center gap-2.5">
							<span class="grid h-7 w-7 place-items-center rounded-lg bg-[#f4f8ec] text-[#0b6b45]"><Icon size={13} /></span>
							<div class="flex-1"><p class="text-[0.58rem] font-bold uppercase tracking-wider text-slate">{row.l}</p><p class="text-[0.78rem] font-extrabold">{row.v}</p></div>
						</div>
					{/each}
				</div>
				<div class="mt-3">
					<p class="text-[0.58rem] font-bold uppercase tracking-wider text-slate">Interests</p>
					<div class="mt-1 flex flex-wrap gap-1.5">
						{#each user?.interests ?? [] as interest}<span class="chip text-[0.62rem]">{interest}</span>{/each}
					</div>
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<h2 class="display text-base font-semibold">Subject strengths</h2>
				<div class="mt-3 space-y-2.5">
					{#each subjects.slice(0, 6) as s, i}
						<ProgressBar label={s.name} value={[88, 84, 91, 76, 68, 72][i]} />
					{/each}
				</div>
				<a href="/app/subjects" class="mt-3 inline-flex items-center gap-1 text-[0.64rem] font-extrabold text-forest">Explore subjects →</a>
			</div>

			<div class="card p-4 sm:p-5">
				<h2 class="display text-base font-semibold">Account</h2>
				<div class="mt-2 space-y-2 text-[0.72rem]">
					<div class="flex justify-between gap-2"><span class="text-slate">Email</span><span class="truncate font-bold">{user?.email}</span></div>
					<div class="flex justify-between gap-2"><span class="text-slate">Plan</span><span class="font-bold">{user?.plan === 'free' ? 'Explorer (free)' : 'Family · ₦5,000/mo'}</span></div>
					<div class="flex justify-between gap-2"><span class="text-slate">Member since</span><span class="font-bold">Sep 2026</span></div>
					<div class="flex justify-between gap-2"><span class="text-slate">Language</span><span class="font-bold">English (Nigeria)</span></div>
				</div>
				<a href="/app/settings" class="btn btn-ghost btn-sm mt-3 w-full">Manage account</a>
			</div>

			<div class="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#e9ffc0] to-[#c9f26b] p-4">
				<div class="flex items-center justify-between">
					<p class="text-sm font-extrabold text-[#3f564b]">You’re in the top 8%</p>
					<Award size={20} class="text-[#3f564b]" />
				</div>
				<p class="mt-1 text-[0.7rem] leading-relaxed text-[#3f564b]/80">Your consistency puts you ahead of most learners in your grade. Keep the streak alive for the Unstoppable badge.</p>
			</div>
		</div>
	</div>
</div>

<Modal open={edit} title="Edit your profile" subtitle="This personalises your lessons, examples and recommendations." onclose={() => (edit = false)} footer={undefined}>
	<div class="space-y-3">
		<div>
			<label class="label" for="name">Full name</label>
			<input id="name" class="input" bind:value={form.name} />
		</div>
		<div class="grid gap-3 sm:grid-cols-2">
			<div><label class="label" for="age">Age</label><input id="age" class="input" type="number" min="4" max="19" bind:value={form.age} /></div>
			<div><label class="label" for="grade">Grade</label><input id="grade" class="input" bind:value={form.grade} /></div>
		</div>
		<div class="grid gap-3 sm:grid-cols-2">
			<div><label class="label" for="city">City</label><input id="city" class="input" bind:value={form.city} /></div>
			<div>
				<label class="label" for="curriculum">Curriculum</label>
				<select id="curriculum" class="input" bind:value={form.curriculum}>
					<option>NERDC</option><option>Common Core</option><option>UK National</option><option>Cambridge</option><option>IB</option><option>WAEC</option>
				</select>
			</div>
		</div>
		<div>
			<label class="label" for="style">Learning style</label>
			<select id="style" class="input" bind:value={form.learningStyle}>
				<option>Playful</option><option>Visual</option><option>Story-led</option><option>Step-by-step</option><option>Fast-paced</option>
			</select>
		</div>
		<div><label class="label" for="interests">Interests (comma separated)</label><input id="interests" class="input" bind:value={form.interests} /></div>
		<div>
			<span class="label">Avatar</span>
			<div class="flex flex-wrap gap-2">
				{#each avatarChoices as face}
					<button class={`grid h-10 w-10 place-items-center rounded-xl border-2 text-xl ${form.avatar === face ? 'border-forest bg-[#f2fbdf]' : 'border-[#e9e4d6] bg-white'}`} onclick={() => (form.avatar = face)}>{face}</button>
				{/each}
			</div>
		</div>
		<div class="flex gap-2 pt-1">
			<button class="btn btn-ghost flex-1" onclick={() => (edit = false)}>Cancel</button>
			<button class="btn btn-primary flex-1" onclick={save}><Check size={15} /> Save changes</button>
		</div>
	</div>
</Modal>
