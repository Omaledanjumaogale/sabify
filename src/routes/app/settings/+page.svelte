<script lang="ts">
	import { goto } from '$app/navigation';
	import { Bell, Check, ChevronRight, Download, Eye, Globe2, Lock, LogOut, Mail, Shield, Sparkles, Trash2, Volume2, Zap } from '@lucide/svelte';
	import { session, logout, updateProfile } from '$lib/stores/session';
	import { progress, resetProgress } from '$lib/stores/progress';
	import { soundOn } from '$lib/engine/sound';
	import { toast } from '$lib/stores/toast';
	import { playTone } from '$lib/engine/sound';

	let sound = $state($soundOn);
	let voice = $state(true);
	let reduceMotion = $state(false);
	let autoplay = $state(true);
	let reminders = $state(true);
	let weeklyReport = $state(true);
	let productNews = $state(false);
	let aiHistory = $state(true);
	let profilePublic = $state(false);
	let dailyGoal = $state('150');
	let timeLimit = $state('45');
	let curriculum = $state($session.user?.curriculum ?? 'NERDC');
	let language = $state('English (Nigeria)');
	let saved = $state(false);

	function save() {
		soundOn.set(sound);
		updateProfile({ curriculum });
		saved = true;
		toast('Settings saved', 'success', '✅');
		setTimeout(() => (saved = false), 1800);
		playTone('correct');
	}

	function signOut() {
		logout();
		goto('/');
	}

	function wipe() {
		if (confirm('Reset all learning progress on this device? This cannot be undone.')) {
			resetProgress();
			toast('Progress reset on this device', 'info', '🧹');
		}
	}

	function exportData() {
		const data = {
			user: $session.user,
			progress: $progress,
			exportedAt: new Date().toISOString()
		};
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'sabify-data.json';
		a.click();
		URL.revokeObjectURL(url);
		toast('Your data has been downloaded', 'success', '⬇️');
	}
</script>

<svelte:head><title>Settings · Sabify</title></svelte:head>

<div class="space-y-5">
	<div>
		<h1 class="display text-2xl font-semibold sm:text-3xl">Settings</h1>
		<p class="mt-1 text-sm text-slate">Make Sabify work the way you and your family prefer.</p>
	</div>

	<div class="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><Volume2 size={17} class="text-forest" /><h2 class="display text-base font-semibold">Sound & experience</h2></div>
				<p class="mt-1 text-[0.68rem] text-slate">Control audio feedback, hovers and motion.</p>
				<div class="mt-3 divide-y divide-[#f0ece0]">
					{#each [
						{ label: 'Sound effects', desc: 'Correct-answer chimes and game feedback.', checked: sound, set: (v: boolean) => (sound = v) },
						{ label: 'Voice replies from Sabi', desc: 'Read out the study buddy’s replies.', checked: voice, set: (v: boolean) => (voice = v) },
						{ label: 'Autoplay next lesson', desc: 'Start the next lesson automatically after results.', checked: autoplay, set: (v: boolean) => (autoplay = v) },
						{ label: 'Reduce motion', desc: 'Fewer animations and floating elements.', checked: reduceMotion, set: (v: boolean) => (reduceMotion = v) }
					] as row}
						<div class="flex items-center gap-3 py-3">
							<div class="flex-1"><p class="text-[0.8rem] font-extrabold">{row.label}</p><p class="text-[0.64rem] text-slate">{row.desc}</p></div>
							<button role="switch" aria-label={row.label} aria-checked={row.checked} class={`relative h-6 w-11 shrink-0 rounded-full transition ${row.checked ? 'bg-forest' : 'bg-[#ddd8c8]'}`} onclick={() => row.set(!row.checked)}>
								<span class={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${row.checked ? 'left-[22px]' : 'left-0.5'}`}></span>
							</button>
						</div>
					{/each}
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><Globe2 size={17} class="text-forest" /><h2 class="display text-base font-semibold">Learning preferences</h2></div>
				<div class="mt-3 grid gap-3 sm:grid-cols-2">
					<div>
						<label class="label" for="curriculum">Curriculum framework</label>
						<select id="curriculum" class="input" bind:value={curriculum}>
							<option>NERDC</option><option>Common Core</option><option>UK National</option><option>Cambridge</option><option>IB</option><option>WAEC</option>
						</select>
					</div>
					<div>
						<label class="label" for="language">Language</label>
						<select id="language" class="input" bind:value={language}>
							<option>English (Nigeria)</option><option>English (UK)</option><option>Yoruba</option><option>Igbo</option><option>Hausa</option>
						</select>
					</div>
					<div>
						<label class="label" for="goal">Daily XP goal</label>
						<select id="goal" class="input" bind:value={dailyGoal}>
							<option value="100">100 XP · light</option>
							<option value="150">150 XP · steady</option>
							<option value="250">250 XP · ambitious</option>
							<option value="400">400 XP · intense</option>
						</select>
					</div>
					<div>
						<label class="label" for="limit">Daily screen-time limit</label>
						<select id="limit" class="input" bind:value={timeLimit}>
							<option value="20">20 minutes</option>
							<option value="30">30 minutes</option>
							<option value="45">45 minutes</option>
							<option value="60">60 minutes</option>
							<option value="0">No limit</option>
						</select>
					</div>
				</div>
				<div class="mt-3 rounded-xl bg-[#f7f5ec] p-3 text-[0.66rem] text-slate">Changing curriculum keeps your progress. Sabify re-maps skills to the new framework and shows any gaps.</div>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><Bell size={17} class="text-forest" /><h2 class="display text-base font-semibold">Notifications</h2></div>
				<div class="mt-3 divide-y divide-[#f0ece0]">
					{#each [
						{ label: 'Daily learning reminder', desc: 'A gentle nudge at 5pm if you have not learned.', checked: reminders, set: (v: boolean) => (reminders = v) },
						{ label: 'Weekly progress report', desc: 'A Sunday summary for learners and parents.', checked: weeklyReport, set: (v: boolean) => (weeklyReport = v) },
						{ label: 'Product updates', desc: 'New games, features and curriculum packs.', checked: productNews, set: (v: boolean) => (productNews = v) }
					] as row}
						<div class="flex items-center gap-3 py-3">
							<div class="flex-1"><p class="text-[0.8rem] font-extrabold">{row.label}</p><p class="text-[0.64rem] text-slate">{row.desc}</p></div>
							<button role="switch" aria-label={row.label} aria-checked={row.checked} class={`relative h-6 w-11 shrink-0 rounded-full transition ${row.checked ? 'bg-forest' : 'bg-[#ddd8c8]'}`} onclick={() => row.set(!row.checked)}>
								<span class={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${row.checked ? 'left-[22px]' : 'left-0.5'}`}></span>
							</button>
						</div>
					{/each}
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><Shield size={17} class="text-forest" /><h2 class="display text-base font-semibold">Privacy & data</h2></div>
				<div class="mt-3 divide-y divide-[#f0ece0]">
					{#each [
						{ label: 'Public profile', desc: 'Let classmates see your display name and badges.', checked: profilePublic, set: (v: boolean) => (profilePublic = v) },
						{ label: 'Save AI conversation history', desc: 'Keep Sabi chats so you can revisit explanations.', checked: aiHistory, set: (v: boolean) => (aiHistory = v) }
					] as row}
						<div class="flex items-center gap-3 py-3">
							<div class="flex-1"><p class="text-[0.8rem] font-extrabold">{row.label}</p><p class="text-[0.64rem] text-slate">{row.desc}</p></div>
							<button role="switch" aria-label={row.label} aria-checked={row.checked} class={`relative h-6 w-11 shrink-0 rounded-full transition ${row.checked ? 'bg-forest' : 'bg-[#ddd8c8]'}`} onclick={() => row.set(!row.checked)}>
								<span class={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${row.checked ? 'left-[22px]' : 'left-0.5'}`}></span>
							</button>
						</div>
					{/each}
				</div>
				<div class="mt-3 flex flex-wrap gap-2">
					<button class="btn btn-ghost btn-sm" onclick={exportData}><Download size={14} /> Export my data</button>
					<a href="/pricing" class="btn btn-ghost btn-sm"><Lock size={14} /> Privacy policy</a>
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<h2 class="display text-base font-semibold">Your account</h2>
				<div class="mt-3 space-y-2 text-[0.72rem]">
					<div class="flex justify-between gap-2"><span class="text-slate">Name</span><span class="font-bold">{$session.user?.name}</span></div>
					<div class="flex justify-between gap-2"><span class="text-slate">Email</span><span class="truncate font-bold">{$session.user?.email}</span></div>
					<div class="flex justify-between gap-2"><span class="text-slate">Plan</span><span class="font-bold">{$session.user?.plan === 'free' ? 'Explorer' : 'Family'}</span></div>
					<div class="flex justify-between gap-2"><span class="text-slate">Role</span><span class="font-bold capitalize">{$session.user?.role}</span></div>
				</div>
				<a href="/app/subscription" class="btn btn-ghost btn-sm mt-3 w-full">Manage subscription <ChevronRight size={14} /></a>
			</div>

			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><Sparkles size={16} class="text-[#7a4f00]" /><p class="text-sm font-extrabold">Saved automatically</p></div>
				<p class="mt-1 text-[0.68rem] leading-relaxed text-slate">Your preferences are stored on this device. In the full app they sync securely to your Convex account.</p>
				<button class="btn btn-primary mt-3 w-full" onclick={save}>{#if saved}<Check size={15} /> Saved{:else}<Zap size={15} /> Save settings{/if}</button>
			</div>

			<div class="card border-[#f0d5ce] p-4 sm:p-5">
				<div class="flex items-center gap-2"><Trash2 size={16} class="text-[#b42318]" /><p class="text-sm font-extrabold text-[#b42318]">Danger zone</p></div>
				<p class="mt-1 text-[0.66rem] leading-relaxed text-slate">Reset progress and clear local data. Your account remains active.</p>
				<button class="btn btn-danger btn-sm mt-3 w-full" onclick={wipe}>Reset progress</button>
				<button class="btn btn-ghost btn-sm mt-2 w-full" onclick={signOut}><LogOut size={14} /> Sign out</button>
			</div>

			<div class="rounded-[1.5rem] bg-[#f4f1e4] p-4 text-center">
				<p class="text-[0.6rem] font-bold uppercase tracking-wider text-slate">Sabify for Web</p>
				<p class="mt-1 text-xs font-extrabold">Version 1.0.0 · Build 2026.11</p>
				<p class="mt-1 text-[0.62rem] text-slate">Made with care in Nigeria 🇳🇬</p>
			</div>
		</div>
	</div>
</div>
