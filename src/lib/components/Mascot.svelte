<script lang="ts">
	let {
		size = 140,
		expression = 'happy',
		float = false
	}: { size?: number; expression?: 'happy' | 'think' | 'cheer' | 'wink' | 'calm'; float?: boolean } = $props();

	let eyeLeft = $derived(expression === 'wink' ? 2 : expression === 'cheer' ? 5 : 6);
</script>

<div class={`relative ${float ? 'floaty' : ''}`} style={`width:${size}px;height:${size}px`}>
	<svg viewBox="0 0 160 160" width={size} height={size} aria-hidden="true">
		<defs>
			<radialGradient id="bodyGrad" cx="35%" cy="25%" r="85%">
				<stop offset="0%" stop-color="#ecffb9" />
				<stop offset="60%" stop-color="#c9f26b" />
				<stop offset="100%" stop-color="#9fd83e" />
			</radialGradient>
			<filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
				<feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#0d3b2a" flood-opacity="0.22" />
			</filter>
		</defs>
		<ellipse cx="80" cy="146" rx="42" ry="8" fill="#0d3b2a" opacity="0.12" />
		<circle cx="80" cy="76" r="59" fill="url(#bodyGrad)" filter="url(#softShadow)" />
		<path d="M80 20l10 21 23 3-17 16 4 23-20-11-20 11 4-23-17-16 23-3z" fill="#0d3b2a" opacity="0.08" />
		<circle cx="59" cy="72" r="8" fill="#0d3b2a" />
		<circle cx="101" cy="72" r="8" fill="#0d3b2a" />
		<circle cx="62" cy="69" r="2.6" fill="#fff" />
		<circle cx="104" cy="69" r="2.6" fill="#fff" />
		{#if expression === 'wink'}
			<rect x="92" y="70" width="18" height="4" rx="2" fill="#0d3b2a" />
		{:else}
			<circle cx="101" cy="72" r={eyeLeft - 4} fill="#0d3b2a" />
		{/if}
		{#if expression === 'think'}
			<path d="M64 96c8 4 24 4 32 0" stroke="#0d3b2a" stroke-width="5" stroke-linecap="round" fill="none" />
			<circle cx="111" cy="101" r="3" fill="#0d3b2a" opacity="0.5" />
			<circle cx="120" cy="108" r="2" fill="#0d3b2a" opacity="0.35" />
		{:else if expression === 'cheer'}
			<path d="M58 92c6 15 38 15 44 0z" fill="#0d3b2a" />
			<path d="M70 104c4 5 16 5 20 0" stroke="#ff8f7a" stroke-width="4" stroke-linecap="round" fill="none" />
		{:else if expression === 'calm'}
			<path d="M66 98c8 5 20 5 28 0" stroke="#0d3b2a" stroke-width="5" stroke-linecap="round" fill="none" />
		{:else}
			<path d="M60 91c7 12 33 12 40 0" stroke="#0d3b2a" stroke-width="5" stroke-linecap="round" fill="none" />
		{/if}
		<circle cx="49" cy="88" r="7" fill="#ff8f7a" opacity="0.55" />
		<circle cx="111" cy="88" r="7" fill="#ff8f7a" opacity="0.55" />
		<path d="M41 124c8 10 19 15 39 15s31-5 39-15" stroke="#ffc53d" stroke-width="9" stroke-linecap="round" fill="none" />
		<path d="M80 31l2.8 6 6.5 1-4.7 4.6 1.1 6.4-5.7-3-5.7 3 1.1-6.4-4.7-4.6 6.5-1z" fill="#fff" opacity="0.35" />
	</svg>
</div>
