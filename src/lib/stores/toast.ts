import { writable } from 'svelte/store';

export type ToastType = 'success' | 'info' | 'error' | 'xp';

export interface Toast {
	id: number;
	message: string;
	type: ToastType;
	icon?: string;
}

export const toasts = writable<Toast[]>([]);
let counter = 0;

export function toast(message: string, type: ToastType = 'success', icon?: string) {
	const id = ++counter;
	const item: Toast = { id, message, type, icon };
	toasts.update((list) => [...list, item]);
	if (typeof window !== 'undefined') {
		setTimeout(() => dismissToast(id), 3200);
	}
	return id;
}

export function dismissToast(id: number) {
	toasts.update((list) => list.filter((t) => t.id !== id));
}
