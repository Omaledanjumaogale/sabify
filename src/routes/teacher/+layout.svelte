<script lang="ts">
	import Shell from '$lib/components/Shell.svelte';
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<Shell role="teacher">
	{@render children()}
</Shell>
