<script lang="ts">
	let {
		tabs = [],
		active = $bindable(''),
		onchange
	}: {
		tabs?: { id: string; label: string; count?: number }[];
		active?: string;
		onchange?: (id: string) => void;
	} = $props();
</script>

<div class="no-scrollbar flex gap-1 overflow-x-auto rounded-full border border-[#e5e0d1] bg-[#f1eee3] p-1" role="tablist">
	{#each tabs as tab}
		<button
			role="tab"
			aria-selected={active === tab.id}
			class={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-extrabold transition ${
				active === tab.id ? 'bg-white text-ink shadow-sm' : 'text-slate hover:text-ink'
			}`}
			onclick={() => onchange?.(tab.id)}
		>
			{tab.label}
			{#if tab.count !== undefined}
				<span class={`rounded-full px-1.5 py-0.5 text-[0.6rem] ${active === tab.id ? 'bg-[#e9fbf1] text-[#0b6b45]' : 'bg-[#e7e3d6] text-slate'}`}>{tab.count}</span>
			{/if}
		</button>
	{/each}
</div>
