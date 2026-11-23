<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		BarChart3,
		Bell,
		BookOpen,
		ChevronDown,
		ClipboardList,
		Coins,
		Compass,
		CreditCard,
		Flame,
		Gamepad2,
		Home,
		Library,
		LogOut,
		Medal,
		Menu,
		Search,
		Settings,
		Sparkles,
		Target,
		Trophy,
		User,
		Users,
		Wand2,
		X
	} from '@lucide/svelte';
	import type { Component, Snippet } from 'svelte';
	import Logo from './Logo.svelte';
	import Avatar from './Avatar.svelte';
	import { logout, session } from '$lib/stores/session';
	import { level, levelProgress, progress, rankTitle } from '$lib/stores/progress';
	import { notifications } from '$lib/data/seed';

	type NavItem = { label: string; href: string; icon: Component; exact?: boolean };
	type Group = { title: string; items: NavItem[] };

	let {
		role = 'learner',
		children
	}: { role?: 'learner' | 'teacher' | 'parent' | 'admin'; children?: Snippet } = $props();

	const learnerNav: Group[] = [
		{
			title: 'Learn',
			items: [
				{ label: 'Dashboard', href: '/app', icon: Home, exact: true },
				{ label: 'Subjects', href: '/app/subjects', icon: BookOpen },
				{ label: 'Daily quiz', href: '/app/quiz', icon: Target },
				{ label: 'AI study buddy', href: '/app/tutor', icon: Sparkles },
				{ label: 'Resource library', href: '/app/library', icon: Library }
			]
		},
		{
			title: 'Play',
			items: [
				{ label: 'Arcade', href: '/app/games', icon: Gamepad2 },
				{ label: 'Leaderboard', href: '/app/leaderboard', icon: Trophy },
				{ label: 'Achievements', href: '/app/achievements', icon: Medal },
				{ label: 'Quests', href: '/app/quests', icon: Compass }
			]
		},
		{
			title: 'Account',
			items: [
				{ label: 'Profile', href: '/app/profile', icon: User },
				{ label: 'Subscription', href: '/app/subscription', icon: CreditCard },
				{ label: 'Settings', href: '/app/settings', icon: Settings }
			]
		}
	];

	const teacherNav: Group[] = [
		{
			title: 'Teaching',
			items: [
				{ label: 'Dashboard', href: '/teacher', icon: Home, exact: true },
				{ label: 'My learners', href: '/teacher/students', icon: Users },
				{ label: 'Assignments', href: '/teacher/assignments', icon: ClipboardList },
				{ label: 'Content studio', href: '/teacher/studio', icon: Wand2 },
				{ label: 'Analytics', href: '/teacher/analytics', icon: BarChart3 }
			]
		},
		{
			title: 'Workspace',
			items: [
				{ label: 'Learner view', href: '/app', icon: Gamepad2 },
				{ label: 'Settings', href: '/teacher/settings', icon: Settings }
			]
		}
	];

	const parentNav: Group[] = [
		{
			title: 'Family',
			items: [
				{ label: 'Overview', href: '/parent', icon: Home, exact: true },
				{ label: 'Weekly reports', href: '/parent/reports', icon: BarChart3 },
				{ label: 'Children', href: '/parent/children', icon: Users },
				{ label: 'Billing', href: '/parent/billing', icon: CreditCard }
			]
		},
		{
			title: 'Workspace',
			items: [{ label: 'Learner view', href: '/app', icon: Gamepad2 }]
		}
	];

	const adminNav: Group[] = [
		{
			title: 'Operations',
			items: [
				{ label: 'Overview', href: '/admin', icon: Home, exact: true },
				{ label: 'Users', href: '/admin/users', icon: Users },
				{ label: 'Content', href: '/admin/content', icon: BookOpen },
				{ label: 'Revenue', href: '/admin/revenue', icon: BarChart3 }
			]
		},
		{
			title: 'Workspace',
			items: [{ label: 'Learner view', href: '/app', icon: Gamepad2 }]
		}
	];

	let nav = $derived(role === 'teacher' ? teacherNav : role === 'parent' ? parentNav : role === 'admin' ? adminNav : learnerNav);
	let path = $derived($page.url.pathname);
	let user = $derived($session.user);
	let identity = $derived(
		role === 'teacher'
			? { name: 'Emeka Obi', meta: 'JSS 2A · Mathematics teacher', avatar: '👨🏾‍🏫', email: 'emeka@greenfield.edu.ng' }
			: role === 'parent'
				? { name: 'Ngozi Okafor', meta: 'Parent · Family plan', avatar: '👩🏾', email: 'ngozi@example.com' }
				: role === 'admin'
					? { name: 'Sabify Operations', meta: 'Platform administrator', avatar: '🛡️', email: 'ops@sabify.ng' }
					: { name: user?.name ?? 'Guest learner', meta: `${user?.grade ?? 'Learner'} · Learner`, avatar: user?.avatar ?? '🦊', email: user?.email ?? '' }
	);
	let mobileOpen = $state(false);
	let menuOpen = $state(false);
	let bellOpen = $state(false);
	let query = $state('');

	function active(href: string, exact = false) {
		if (exact) return path === href;
		return path === href || path.startsWith(href + '/');
	}

	function submitSearch(e: Event) {
		e.preventDefault();
		if (query.trim()) goto(`/app/subjects?q=${encodeURIComponent(query.trim())}`);
	}

	const mobileItems: Record<string, NavItem[]> = {
		learner: [
			{ label: 'Home', href: '/app', icon: Home, exact: true },
			{ label: 'Learn', href: '/app/subjects', icon: BookOpen },
			{ label: 'Play', href: '/app/games', icon: Gamepad2 },
			{ label: 'Tutor', href: '/app/tutor', icon: Sparkles },
			{ label: 'Me', href: '/app/profile', icon: User }
		],
		teacher: [
			{ label: 'Home', href: '/teacher', icon: Home, exact: true },
			{ label: 'Learners', href: '/teacher/students', icon: Users },
			{ label: 'Tasks', href: '/teacher/assignments', icon: ClipboardList },
			{ label: 'Studio', href: '/teacher/studio', icon: Wand2 },
			{ label: 'Stats', href: '/teacher/analytics', icon: BarChart3 }
		],
		parent: [
			{ label: 'Home', href: '/parent', icon: Home, exact: true },
			{ label: 'Reports', href: '/parent/reports', icon: BarChart3 },
			{ label: 'Children', href: '/parent/children', icon: Users },
			{ label: 'Billing', href: '/parent/billing', icon: CreditCard }
		],
		admin: [
			{ label: 'Home', href: '/admin', icon: Home, exact: true },
			{ label: 'Users', href: '/admin/users', icon: Users },
			{ label: 'Content', href: '/admin/content', icon: BookOpen },
			{ label: 'Revenue', href: '/admin/revenue', icon: BarChart3 }
		]
	};

	const roleLabel = { learner: 'Learner', teacher: 'Teacher', parent: 'Parent', admin: 'Admin' };

	function signOut() {
		logout();
		goto('/');
	}
</script>

<div class="min-h-dvh bg-cream">
	<aside class="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col overflow-y-auto bg-[#0b2b1f] px-3.5 py-5 text-white lg:flex">
		<div class="px-2">
			<Logo light size={34} />
		</div>

		<div class="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-3">
			<div class="flex items-center gap-2">
				<Avatar emoji={identity.avatar} size={35} ring={false} />
				<div class="min-w-0 flex-1">
					<p class="truncate text-[0.8rem] font-extrabold leading-tight">{identity.name}</p>
					<p class="truncate text-[0.64rem] font-semibold text-white/55">{identity.meta}</p>
				</div>
				{#if role === 'learner'}
					<span class="pill pill-dark text-[0.56rem]">Lvl {$level}</span>
				{/if}
			</div>
			{#if role === 'learner'}
				<div class="mt-2.5 flex items-center gap-2">
					<div class="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
						<div class="h-full rounded-full bg-lime" style={`width:${Math.round($levelProgress * 100)}%`}></div>
					</div>
					<span class="text-[0.58rem] font-bold text-white/60">{$rankTitle}</span>
				</div>
			{/if}
		</div>

		<nav class="mt-5 flex-1 space-y-5">
			{#each nav as group}
				<div>
					<p class="px-3 text-[0.58rem] font-extrabold uppercase tracking-[0.18em] text-white/35">{group.title}</p>
					<div class="mt-1.5 space-y-0.5">
						{#each group.items as item}
							{@const Icon = item.icon}
							<a
								href={item.href}
								class={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.82rem] font-bold transition ${
									active(item.href, item.exact)
										? 'bg-lime text-[#0b2b1f] shadow-[0_8px_18px_-12px_rgba(201,242,107,0.8)]'
										: 'text-white/65 hover:bg-white/[0.07] hover:text-white'
								}`}
							>
								<Icon size={17} strokeWidth={2.2} />
								{item.label}
								{#if item.label === 'Quests'}<span class="ml-auto rounded-full bg-[#ffc53d] px-1.5 py-0.5 text-[0.55rem] font-extrabold text-[#3b2a00]">3</span>{/if}
							</a>
						{/each}
					</div>
				</div>
			{/each}
		</nav>

		<div class="mt-4 space-y-1">
			<button class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[0.8rem] font-bold text-white/55 transition hover:bg-white/[0.07] hover:text-white" onclick={signOut}>
				<LogOut size={17} /> Sign out
			</button>
			<p class="px-3 pt-2 text-[0.56rem] font-semibold text-white/30">Sabify v1.0 · Made in Nigeria 🇳🇬</p>
		</div>
	</aside>

	<div class="lg:pl-[260px]">
		<header class="sticky top-0 z-30 border-b border-[#e7e2d3] bg-cream/85 backdrop-blur-xl">
			<div class="mx-auto flex h-[68px] max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-8">
				<button class="btn btn-ghost btn-icon lg:hidden" onclick={() => (mobileOpen = true)} aria-label="Open menu">
					<Menu size={19} />
				</button>
				<div class="lg:hidden"><Logo size={30} showWord={false} /></div>

				<form class="hidden max-w-md flex-1 items-center gap-2 rounded-full border border-[#e1dccd] bg-white px-3.5 py-2 sm:flex" onsubmit={submitSearch}>
					<Search size={16} class="text-slate" />
					<input class="w-full bg-transparent text-sm outline-none placeholder:text-slate/70" placeholder="Search subjects, lessons or skills…" bind:value={query} />
					<kbd class="rounded bg-[#f1eee3] px-1.5 py-0.5 text-[0.6rem] font-bold text-slate">↵</kbd>
				</form>

				<div class="ml-auto flex items-center gap-1.5 sm:gap-2">
					{#if role === 'learner'}
						<span class="hidden items-center gap-1.5 rounded-full bg-[#fff4d2] px-3 py-1.5 text-xs font-extrabold text-[#7a4f00] sm:inline-flex">
							<Coins size={14} /> {$progress.coins.toLocaleString()}
						</span>
						<span class="inline-flex items-center gap-1.5 rounded-full bg-[#fff1e6] px-2.5 py-1.5 text-xs font-extrabold text-[#a23c17]">
							<Flame size={14} /> {$progress.streak}
						</span>
					{/if}
					<div class="relative">
						<button class="btn btn-ghost btn-icon relative" onclick={() => (bellOpen = !bellOpen)} aria-label="Notifications">
							<Bell size={18} />
							<span class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-coral ring-2 ring-cream"></span>
						</button>
						{#if bellOpen}
							<div class="absolute right-0 top-12 z-50 w-[min(92vw,340px)] rounded-3xl border border-[#e5e0d1] bg-white p-2 shadow-lift">
								<div class="flex items-center justify-between px-2 py-1.5">
									<p class="display text-sm font-semibold">Notifications</p>
									<button class="text-slate" onclick={() => (bellOpen = false)} aria-label="Close notifications"><X size={15} /></button>
								</div>
								{#each notifications as n}
									<div class="flex gap-2.5 rounded-2xl p-2.5 transition hover:bg-[#f7f5ed]">
										<span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f2f7e8] text-base">{n.emoji}</span>
										<div class="min-w-0">
											<p class="text-xs font-extrabold leading-tight">{n.title}</p>
											<p class="mt-0.5 text-[0.68rem] leading-snug text-slate">{n.body}</p>
											<p class="mt-1 text-[0.6rem] font-bold text-slate/70">{n.time}</p>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>

					<div class="relative">
						<button class="flex items-center gap-1.5 rounded-full border border-[#e1dccd] bg-white py-1 pl-1 pr-2 transition hover:border-[#cfc8b5]" onclick={() => (menuOpen = !menuOpen)}>
							<Avatar emoji={identity.avatar} size={32} ring={false} />
							<ChevronDown size={14} class="text-slate" />
						</button>
						{#if menuOpen}
							<div class="absolute right-0 top-12 z-50 w-56 rounded-3xl border border-[#e5e0d1] bg-white p-2 shadow-lift">
								<div class="px-3 py-2">
									<p class="truncate text-sm font-extrabold">{identity.name}</p>
									<p class="truncate text-[0.68rem] text-slate">{identity.email}</p>
								</div>
								<div class="my-1 h-px bg-[#eee9dc]"></div>
								{#if role === 'learner'}
									<a href="/app/profile" class="nav-link"><User size={16} /> My profile</a>
									<a href="/app/subscription" class="nav-link"><CreditCard size={16} /> Subscription</a>
								{/if}
								<a href={role === 'teacher' ? '/teacher/settings' : '/app/settings'} class="nav-link"><Settings size={16} /> Settings</a>
								<button class="nav-link w-full text-left" onclick={signOut}><LogOut size={16} /> Sign out</button>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</header>

		<main class="mx-auto max-w-[1440px] px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-12">
			{@render children?.()}
		</main>
	</div>

	{#if mobileOpen}
		<div class="fixed inset-0 z-[70] lg:hidden">
			<button class="absolute inset-0 bg-[#06130e]/50 backdrop-blur-sm" onclick={() => (mobileOpen = false)} aria-label="Close menu"></button>
			<div class="relative h-full w-[82vw] max-w-[320px] overflow-y-auto bg-[#0b2b1f] px-4 py-5 text-white">
				<div class="flex items-center justify-between">
					<Logo light size={32} />
					<button class="grid h-9 w-9 place-items-center rounded-full bg-white/10" onclick={() => (mobileOpen = false)} aria-label="Close"><X size={18} /></button>
				</div>
				<div class="mt-5 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.06] p-3">
					<Avatar emoji={identity.avatar} size={38} ring={false} />
					<div>
						<p class="text-sm font-extrabold">{user?.name}</p>
						<p class="text-[0.66rem] text-white/55">{user?.grade} · {roleLabel[role]}</p>
					</div>
				</div>
				<nav class="mt-4 space-y-5">
					{#each nav as group}
						<div>
							<p class="px-2 text-[0.58rem] font-extrabold uppercase tracking-[0.18em] text-white/35">{group.title}</p>
							<div class="mt-1 space-y-1">
								{#each group.items as item}
									{@const Icon = item.icon}
									<a href={item.href} class={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold ${active(item.href, item.exact) ? 'bg-lime text-[#0b2b1f]' : 'text-white/70'}`} onclick={() => (mobileOpen = false)}>
										<Icon size={17} /> {item.label}
									</a>
								{/each}
							</div>
						</div>
					{/each}
				</nav>
				<button class="mt-5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-white/60" onclick={signOut}><LogOut size={17} /> Sign out</button>
			</div>
		</div>
	{/if}

	<nav class="fixed inset-x-0 bottom-0 z-40 border-t border-[#e1dccd] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
		<div class={`mx-auto grid max-w-md ${mobileItems[role].length === 5 ? 'grid-cols-5' : 'grid-cols-4'} px-2 py-1.5`}>
			{#each mobileItems[role] as item}
				{@const Icon = item.icon}
				<a href={item.href} class={`flex flex-col items-center gap-1 rounded-2xl py-2 text-[0.6rem] font-extrabold transition ${active(item.href, item.exact) ? 'text-forest' : 'text-slate'}`}>
					<span class={`grid h-8 w-8 place-items-center rounded-xl ${active(item.href, item.exact) ? 'bg-[#e9f7d6]' : ''}`}>
						<Icon size={19} strokeWidth={2.3} />
					</span>
					{item.label}
				</a>
			{/each}
		</div>
	</nav>
</div>
