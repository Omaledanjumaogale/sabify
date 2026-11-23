export function rich(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/`(.+?)`/g, '<code class="rounded bg-[#eef2e4] px-1 py-0.5 text-[0.9em]">$1</code>')
		.replace(/\n/g, '<br />');
}
