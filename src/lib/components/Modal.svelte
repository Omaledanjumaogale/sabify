<script lang="ts">
	import type { Snippet } from 'svelte';
	import { X } from '@lucide/svelte';

	let {
		open = false,
		title = '',
		subtitle = '',
		size = 'md',
		onclose,
		children,
		footer
	}: {
		open?: boolean;
		title?: string;
		subtitle?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		onclose: () => void;
		children?: Snippet;
		footer?: Snippet;
	} = $props();

	const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' };

	function keydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) onclose();
	}
</script>

<svelte:window on:keydown={keydown} />

{#if open}
	<div class="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-[#06130e]/55 p-0 backdrop-blur-sm sm:items-center sm:p-6">
		<button class="absolute inset-0 h-full w-full cursor-default" onclick={onclose} aria-label="Close dialog"></button>
		<div
			class={`relative z-10 max-h-[92vh] w-full ${widths[size]} overflow-y-auto rounded-t-[2rem] border border-white/70 bg-[#fbf8ef] shadow-lift sm:rounded-[2rem]`}
			role="dialog"
			aria-modal="true"
			aria-label={title}
		>
			<div class="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#e8e2d2] bg-[#fbf8ef]/95 px-5 py-4 backdrop-blur sm:px-7">
				<div>
					{#if title}<h2 class="display text-xl font-semibold">{title}</h2>{/if}
					{#if subtitle}<p class="mt-1 text-sm text-slate">{subtitle}</p>{/if}
				</div>
				<button class="btn btn-ghost btn-icon shrink-0" onclick={onclose} aria-label="Close">
					<X size={18} />
				</button>
			</div>
			<div class="px-5 py-5 sm:px-7">
				{@render children?.()}
			</div>
			{#if footer}
				<div class="sticky bottom-0 border-t border-[#e8e2d2] bg-[#fbf8ef]/95 px-5 py-4 backdrop-blur sm:px-7">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
