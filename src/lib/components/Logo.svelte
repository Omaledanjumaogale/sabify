<script lang="ts">
	let { size = 36, light = false, showWord = true }: { size?: number; light?: boolean; showWord?: boolean } = $props();
</script>

<a href="/" class="inline-flex items-center gap-2.5" aria-label="Sabify home">
	<svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
		<rect width="64" height="64" rx="18" fill={light ? '#ffffff' : '#0d3b2a'} />
		<circle cx="32" cy="30" r="17" fill="#c9f26b" />
		<path d="M32 13.5l4.4 9.2 10.1 1.5-7.3 7.1 1.7 10-8.9-4.7-8.9 4.7 1.7-10-7.3-7.1 10.1-1.5z" fill={light ? '#0d3b2a' : '#0d3b2a'} />
		<circle cx="27.6" cy="30" r="1.8" fill="#c9f26b" />
		<circle cx="36.4" cy="30" r="1.8" fill="#c9f26b" />
		<path d="M26.8 35.8c1.6 2.5 8.8 2.5 10.4 0" stroke="#c9f26b" stroke-width="2.2" stroke-linecap="round" fill="none" />
		<path d="M17 52c3.5-4.2 8.4-6.3 15-6.3s11.5 2.1 15 6.3" stroke="#ffc53d" stroke-width="4" stroke-linecap="round" fill="none" />
	</svg>
	{#if showWord}
		<span
			class="display text-[1.35rem] font-semibold tracking-tight"
			style="color:{light ? '#fff' : '#082018'}"
		>
			sabify<span style="color:#10b981">.</span>
		</span>
	{/if}
</a>
