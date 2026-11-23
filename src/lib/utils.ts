export function formatNaira(amount: number, compact = false): string {
	if (compact && amount >= 1_000_000) {
		return `₦${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
	}
	if (compact && amount >= 1_000) {
		return `₦${(amount / 1_000).toFixed(0)}k`;
	}
	return '₦' + amount.toLocaleString('en-NG');
}

export function formatNumber(n: number): string {
	return n.toLocaleString('en-NG');
}

export function initials(name: string): string {
	return name
		.split(' ')
		.map((p) => p[0])
		.slice(0, 2)
		.join('')
		.toUpperCase();
}

export function pct(value: number): string {
	return `${Math.round(value)}%`;
}

export function timeAgo(iso: string): string {
	const then = new Date(iso).getTime();
	if (Number.isNaN(then)) return iso;
	const mins = Math.max(1, Math.round((Date.now() - then) / 60000));
	if (mins < 60) return `${mins} min ago`;
	const hours = Math.round(mins / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.round(hours / 24);
	return `${days}d ago`;
}

export async function celebrate(colors = ['#c9f26b', '#ffc53d', '#59c8f5', '#ff6b5e', '#ffffff']) {
	if (typeof window === 'undefined') return;
	try {
		const confetti = (await import('canvas-confetti')).default;
		confetti({
			particleCount: 90,
			spread: 80,
			origin: { y: 0.65 },
			colors,
			disableForReducedMotion: true
		});
	} catch {
		/* optional */
	}
}

export function clamp(n: number, min: number, max: number) {
	return Math.min(max, Math.max(min, n));
}

export function shuffle<T>(arr: T[]): T[] {
	const copy = [...arr];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}
