<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import type { Snippet } from 'svelte';

	let {
		eyebrow = '',
		title = '',
		subtitle = '',
		cta = '',
		href = '',
		align = 'left',
		children
	}: {
		eyebrow?: string;
		title?: string;
		subtitle?: string;
		cta?: string;
		href?: string;
		align?: 'left' | 'center';
		children?: Snippet;
	} = $props();
</script>

<div class={`mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${align === 'center' ? 'text-center sm:flex-col sm:items-center' : ''}`}>
	<div>
		{#if eyebrow}<p class="eyebrow mb-2">{eyebrow}</p>{/if}
		<h2 class="display text-2xl font-semibold sm:text-3xl">{title}</h2>
		{#if subtitle}<p class={`mt-1.5 max-w-2xl text-sm text-slate ${align === 'center' ? 'mx-auto' : ''}`}>{subtitle}</p>{/if}
		{#if children}{@render children()}{/if}
	</div>
	{#if cta && href}
		<a {href} class="btn btn-ghost btn-sm self-start sm:self-auto">
			{cta}
			<ArrowUpRight size={15} />
		</a>
	{/if}
</div>
