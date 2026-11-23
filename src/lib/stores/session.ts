import { browser } from '$app/environment';
import { derived, get, writable } from 'svelte/store';
import { demoUser, type DemoUser } from '$lib/data/seed';

export interface SessionState {
	user: DemoUser | null;
	isDemo: boolean;
	onboardingComplete: boolean;
	joinedAt: string;
}

const STORAGE_KEY = 'sabify.session.v1';

function loadSession(): SessionState {
	if (!browser) {
		return { user: null, isDemo: false, onboardingComplete: false, joinedAt: '' };
	}
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw) as SessionState;
			if (parsed.user) return parsed;
		}
	} catch {
		/* ignore corrupt storage */
	}
	// First visit: open the demo so every screen is explorable immediately.
	return {
		user: { ...demoUser },
		isDemo: true,
		onboardingComplete: true,
		joinedAt: new Date().toISOString()
	};
}

export const session = writable<SessionState>(loadSession());

if (browser) {
	session.subscribe((value) => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
		} catch {
			/* storage may be unavailable */
		}
	});
}

export const currentUser = derived(session, ($s) => $s.user);
export const isLoggedIn = derived(session, ($s) => Boolean($s.user));

export const hasActiveSubscription = derived(session, ($s) => {
	const plan = $s.user?.plan;
	return plan === 'family' || plan === 'family-plus' || plan === 'school';
});

export function login(email: string, _password: string, role: DemoUser['role'] = 'learner') {
	const name = email
		.split('@')[0]
		.replace(/[._-]/g, ' ')
		.replace(/\b\w/g, (m) => m.toUpperCase());
	session.set({
		user: {
			...demoUser,
			id: 'usr_' + Math.random().toString(36).slice(2, 8),
			name: name || demoUser.name,
			firstName: (name || demoUser.firstName).split(' ')[0],
			email,
			role,
			plan: role === 'admin' ? 'school' : 'family'
		},
		isDemo: false,
		onboardingComplete: true,
		joinedAt: new Date().toISOString()
	});
}

export function signup(data: Partial<DemoUser> & { name: string; email: string; role?: DemoUser['role'] }) {
	session.set({
		user: {
			...demoUser,
			...data,
			id: 'usr_' + Math.random().toString(36).slice(2, 8),
			firstName: data.name.split(' ')[0],
			role: data.role ?? 'learner',
			plan: 'free',
			streak: 1
		},
		isDemo: false,
		onboardingComplete: false,
		joinedAt: new Date().toISOString()
	});
}

export function enterDemo() {
	session.set({
		user: { ...demoUser },
		isDemo: true,
		onboardingComplete: true,
		joinedAt: new Date().toISOString()
	});
}

export function logout() {
	session.set({ user: null, isDemo: false, onboardingComplete: false, joinedAt: '' });
}

export function updateProfile(patch: Partial<DemoUser>) {
	session.update((s) => (s.user ? { ...s, user: { ...s.user, ...patch } } : s));
}

export function completeOnboarding(patch: Partial<DemoUser>) {
	session.update((s) =>
		s.user
			? { ...s, user: { ...s.user, ...patch }, onboardingComplete: true }
			: {
					user: { ...demoUser, ...patch },
					isDemo: true,
					onboardingComplete: true,
					joinedAt: new Date().toISOString()
				}
	);
}

export function setPlan(plan: DemoUser['plan']) {
	session.update((s) => (s.user ? { ...s, user: { ...s.user, plan } } : s));
}

export function requireUser(): DemoUser | null {
	return get(session).user;
}
