<script lang="ts">
	import { CheckCircle2, Info, X, XCircle, Zap } from '@lucide/svelte';
	import { toasts, dismissToast } from '$lib/stores/toast';
</script>

<div class="pointer-events-none fixed inset-x-0 top-3 z-[120] flex flex-col items-center gap-2 px-3" aria-live="polite">
	{#each $toasts as t (t.id)}
		<div
			class="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-[#d9e6da] bg-white/95 px-4 py-3 shadow-lift backdrop-blur fade-up"
			role="status"
		>
			<span
				class={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
					t.type === 'error'
						? 'bg-[#fff0ee] text-[#b42318]'
						: t.type === 'xp'
							? 'bg-[#fff4d2] text-[#7a4f00]'
							: t.type === 'info'
								? 'bg-[#eaf8ff] text-[#0b6486]'
								: 'bg-[#e9fbf1] text-[#0b6b45]'
				}`}
			>
				{#if t.type === 'error'}<XCircle size={19} />
				{:else if t.type === 'info'}<Info size={19} />
				{:else if t.type === 'xp'}<Zap size={19} />
				{:else}<CheckCircle2 size={19} />{/if}
			</span>
			<p class="flex-1 text-sm font-bold leading-snug text-ink">{t.message}</p>
			<button class="text-slate transition hover:text-ink" onclick={() => dismissToast(t.id)} aria-label="Dismiss">
				<X size={16} />
			</button>
		</div>
	{/each}
</div>
