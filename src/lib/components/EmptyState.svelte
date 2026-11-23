<script lang="ts">
	import { Compass } from '@lucide/svelte';
	let { title = 'Nothing here yet', body = 'Try another filter or start something new.', emoji = '🧭', cta = '', href = '' }: { title?: string; body?: string; emoji?: string; cta?: string; href?: string } = $props();
</script>

<div class="card grid place-items-center px-6 py-14 text-center">
	<div class="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-[#f1f7e6] text-3xl">{emoji}</div>
	<h3 class="display text-xl font-semibold">{title}</h3>
	<p class="mt-2 max-w-sm text-sm text-slate">{body}</p>
	{#if cta && href}
		<a {href} class="btn btn-primary mt-5"><Compass size={16} /> {cta}</a>
	{/if}
</div>
