<script lang="ts">
	import Shell from '$lib/components/Shell.svelte';
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<Shell role="admin">
	{@render children()}
</Shell>
