import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const KEY = 'sabify.sound';

function initial() {
	if (!browser) return true;
	return localStorage.getItem(KEY) !== 'off';
}

export const soundOn = writable(initial());
if (browser) {
	soundOn.subscribe((v) => {
		try {
			localStorage.setItem(KEY, v ? 'on' : 'off');
		} catch {
			/* ignore */
		}
	});
}

let ctx: AudioContext | null = null;

function context() {
	if (!browser) return null;
	if (!ctx) {
		const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
		if (!Ctor) return null;
		ctx = new Ctor();
	}
	return ctx;
}

export function playTone(kind: 'correct' | 'wrong' | 'click' | 'level' | 'win' = 'click') {
	if (!browser) return;
	let enabled = true;
	soundOn.subscribe((v) => (enabled = v))();
	if (!enabled) return;
	const ac = context();
	if (!ac) return;
	if (ac.state === 'suspended') void ac.resume();
	const notes: Record<string, number[]> = {
		correct: [523.25, 659.25, 783.99],
		wrong: [220, 174.61],
		click: [440],
		level: [523.25, 659.25, 783.99, 1046.5],
		win: [523.25, 659.25, 783.99, 1046.5, 1318.5]
	};
	const seq = notes[kind];
	const start = ac.currentTime;
	seq.forEach((freq, i) => {
		const osc = ac.createOscillator();
		const gain = ac.createGain();
		osc.type = kind === 'wrong' ? 'sawtooth' : 'sine';
		osc.frequency.value = freq;
		gain.gain.setValueAtTime(0.0001, start);
		gain.gain.exponentialRampToValueAtTime(0.09, start + 0.01 + i * 0.09);
		gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22 + i * 0.09);
		osc.connect(gain).connect(ac.destination);
		osc.start(start + i * 0.09);
		osc.stop(start + 0.24 + i * 0.09);
	});
}
