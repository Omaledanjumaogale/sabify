<script lang="ts">
	let {
		emoji = '🦊',
		size = 44,
		ring = true,
		ringClass = 'ring-lime'
	}: { emoji?: string; size?: number; ring?: boolean; ringClass?: string } = $props();
</script>

<span
	class={`inline-grid shrink-0 place-items-center rounded-full bg-[#f3f7ee] ${ring ? `ring-2 ${ringClass}` : ''}`}
	style={`width:${size}px;height:${size}px;font-size:${Math.round(size * 0.55)}px;line-height:1`}
	aria-hidden="true"
>
	{emoji}
</span>
