<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/components/Logo.svelte';
	let status = $derived(page.status ?? 404);
</script>

<svelte:head><title>{status} · Sabify</title></svelte:head>

<div class="mesh-hero grain relative grid min-h-[70vh] place-items-center px-5 py-20 text-center">
	<div class="relative">
		<Logo size={54} />
		<p class="mt-8 display text-8xl font-semibold text-forest/15">{status}</p>
		<h1 class="mt-2 display text-3xl font-semibold sm:text-4xl">{status === 404 ? 'This page took a detour.' : 'Something went wrong.'}</h1>
		<p class="mx-auto mt-2 max-w-md text-sm text-slate">{status === 404 ? 'The link may be old, or the page moved. Your streak is safe — let’s get you back to learning.' : 'Refresh the page or head back to your dashboard. If it keeps happening, email hello@sabify.ng.'}</p>
		<div class="mt-6 flex flex-wrap justify-center gap-2">
			<a href="/app" class="btn btn-primary">Back to dashboard</a>
			<a href="/" class="btn btn-ghost">Home</a>
		</div>
	</div>
</div>
