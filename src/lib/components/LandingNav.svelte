<script lang="ts">
	import { Menu, X } from '@lucide/svelte';
	import Logo from './Logo.svelte';
	import { session } from '$lib/stores/session';

	let open = $state(false);
	const links = [
		{ label: 'Why Sabify', href: '/#why' },
		{ label: 'Subjects', href: '/#subjects' },
		{ label: 'Games', href: '/#games' },
		{ label: 'For schools', href: '/#schools' },
		{ label: 'Pricing', href: '/pricing' }
	];
</script>

<header class="sticky top-0 z-50 border-b border-[#e8e3d4]/70 bg-[#fbf8ef]/80 backdrop-blur-xl">
	<div class="container-page flex h-[72px] items-center justify-between gap-4">
		<Logo size={34} />
		<nav class="hidden items-center gap-1 lg:flex">
			{#each links as link}
				<a href={link.href} class="rounded-full px-3.5 py-2 text-sm font-bold text-[#3f564b] transition hover:bg-[#eef6ef] hover:text-forest">{link.label}</a>
			{/each}
		</nav>
		<div class="hidden items-center gap-2 sm:flex">
			{#if $session.user}
				<a href="/app" class="btn btn-primary btn-sm">Go to dashboard</a>
			{:else}
				<a href="/login" class="btn btn-ghost btn-sm">Log in</a>
				<a href="/signup" class="btn btn-primary btn-sm">Start free</a>
			{/if}
		</div>
		<button class="btn btn-ghost btn-icon sm:hidden" onclick={() => (open = !open)} aria-label="Toggle menu">
			{#if open}<X size={19} />{:else}<Menu size={19} />{/if}
		</button>
	</div>
	{#if open}
		<div class="border-t border-[#e8e3d4] bg-[#fbf8ef] px-4 py-4 sm:hidden">
			<nav class="flex flex-col gap-1">
				{#each links as link}
					<a href={link.href} class="rounded-xl px-3 py-2.5 text-sm font-bold text-[#3f564b] hover:bg-[#eef6ef]" onclick={() => (open = false)}>{link.label}</a>
				{/each}
			</nav>
			<div class="mt-3 grid grid-cols-2 gap-2">
				<a href="/login" class="btn btn-ghost btn-sm">Log in</a>
				<a href="/signup" class="btn btn-primary btn-sm">Start free</a>
			</div>
		</div>
	{/if}
</header>
