<script lang="ts">
	import '../app.css';
	import ToastHost from '$lib/components/ToastHost.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<title>Sabify — Learn it. Play it. Own it.</title>
</svelte:head>

<ToastHost />
{@render children()}
