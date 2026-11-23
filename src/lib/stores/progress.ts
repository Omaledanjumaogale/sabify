import { browser } from '$app/environment';
import { derived, get, writable } from 'svelte/store';
import { badges as badgeSeed, quests as questSeed, type BadgeDef, type Quest } from '$lib/data/seed';

export interface QuizRecord {
	id: string;
	title: string;
	score: number;
	total: number;
	xp: number;
	at: string;
}

export interface ProgressState {
	xp: number;
	streak: number;
	bestStreak: number;
	coins: number;
	completedLessons: string[];
	lessonScores: Record<string, number>;
	gameBests: Record<string, number>;
	gamesPlayed: number;
	quizzesPlayed: number;
	questionsAnswered: number;
	correctAnswers: number;
	minutesLearned: number;
	earnedBadges: string[];
	skillMastery: Record<string, number>;
	quizHistory: QuizRecord[];
	dailyXp: number;
	lastActive: string;
	questProgress: Record<string, number>;
	freezes: number;
}

const KEY = 'sabify.progress.v1';

const initial: ProgressState = {
	xp: 4120,
	streak: 12,
	bestStreak: 18,
	coins: 840,
	completedLessons: [
		'math-place-value',
		'math-addition',
		'eng-phonics',
		'sci-living',
		'money-needs'
	],
	lessonScores: {
		'math-place-value': 100,
		'math-addition': 90,
		'eng-phonics': 85,
		'sci-living': 95,
		'money-needs': 90
	},
	gameBests: {
		'number-nebula': 780,
		'word-forge': 620,
		'memory-match': 540,
		'quiz-arena': 860,
		'logic-lab': 410
	},
	gamesPlayed: 34,
	quizzesPlayed: 21,
	questionsAnswered: 386,
	correctAnswers: 338,
	minutesLearned: 462,
	earnedBadges: [
		'first-step',
		'streak-7',
		'xp-1000',
		'quiz-ace',
		'science-spark',
		'arena-crown'
	],
	skillMastery: {
		'Place value': 92,
		Addition: 86,
		Fractions: 68,
		Phonics: 94,
		'Context clues': 82,
		Comprehension: 78,
		'Living things': 90,
		Plants: 84,
		Forces: 72,
		Algorithms: 80,
		Loops: 74,
		'Needs & wants': 88,
		Saving: 76,
		Budgeting: 64,
		'Online safety': 86
	},
	quizHistory: [
		{ id: 'qh1', title: 'Daily quiz — 21 Nov', score: 5, total: 6, xp: 80, at: '2026-11-21' },
		{ id: 'qh2', title: 'Fractions checkpoint', score: 4, total: 5, xp: 60, at: '2026-11-20' },
		{ id: 'qh3', title: 'Science sprint', score: 6, total: 6, xp: 100, at: '2026-11-19' }
	],
	dailyXp: 65,
	lastActive: new Date().toISOString(),
	questProgress: {
		q1: 1,
		q2: 0,
		q3: 0,
		q4: 65,
		q5: 3,
		q6: 6,
		q7: 2
	},
	freezes: 2
};

function load(): ProgressState {
	if (!browser) return initial;
	try {
		const raw = localStorage.getItem(KEY);
		if (raw) {
			const parsed = JSON.parse(raw) as Partial<ProgressState>;
			return { ...initial, ...parsed };
		}
	} catch {
		/* ignore */
	}
	return initial;
}

export const progress = writable<ProgressState>(load());

if (browser) {
	progress.subscribe((value) => {
		try {
			localStorage.setItem(KEY, JSON.stringify(value));
		} catch {
			/* ignore */
		}
	});
}

export const level = derived(progress, ($p) => Math.floor($p.xp / 500) + 1);
export const levelProgress = derived(progress, ($p) => ($p.xp % 500) / 500);
export const xpToNextLevel = derived(progress, ($p) => 500 - ($p.xp % 500));
export const accuracy = derived(progress, ($p) =>
	$p.questionsAnswered === 0 ? 1 : $p.correctAnswers / $p.questionsAnswered
);
export const rankTitle = derived(level, ($l) => {
	if ($l >= 15) return 'Legend';
	if ($l >= 12) return 'Grandmaster';
	if ($l >= 9) return 'Trailblazer';
	if ($l >= 6) return 'Explorer';
	if ($l >= 3) return 'Rising Star';
	return 'Newcomer';
});
export const earnedBadgeList = derived(progress, ($p) =>
	badgeSeed.map((b) => ({ ...b, earned: $p.earnedBadges.includes(b.id) }))
);
export const nextBadge = derived(earnedBadgeList, ($list) => $list.find((b) => !b.earned));
export const liveQuests = derived(progress, ($p) =>
	questSeed.map((q) => ({ ...q, progress: $p.questProgress[q.id] ?? q.progress }))
);

export function addXp(amount: number) {
	progress.update((p) => ({
		...p,
		xp: p.xp + amount,
		dailyXp: p.dailyXp + amount,
		questProgress: { ...p.questProgress, q4: (p.questProgress.q4 ?? 0) + amount },
		lastActive: new Date().toISOString()
	}));
}

export function addCoins(amount: number) {
	progress.update((p) => ({ ...p, coins: p.coins + amount }));
}

export function completeLesson(lessonId: string, score: number, xp: number, skills: string[]) {
	progress.update((p) => {
		const already = p.completedLessons.includes(lessonId);
		const mastery = { ...p.skillMastery };
		for (const skill of skills) {
			const current = mastery[skill] ?? 40;
			mastery[skill] = Math.min(100, Math.round(current + (score >= 80 ? 6 : 2)));
		}
		return {
			...p,
			xp: p.xp + (already ? Math.round(xp * 0.25) : xp),
			dailyXp: p.dailyXp + (already ? Math.round(xp * 0.25) : xp),
			coins: p.coins + (score >= 80 ? 25 : 10),
			completedLessons: already ? p.completedLessons : [...p.completedLessons, lessonId],
			lessonScores: { ...p.lessonScores, [lessonId]: Math.max(p.lessonScores[lessonId] ?? 0, score) },
			minutesLearned: p.minutesLearned + 10,
			skillMastery: mastery,
			questProgress: {
				...p.questProgress,
				q1: Math.max(1, p.questProgress.q1 ?? 0),
				q4: (p.questProgress.q4 ?? 0) + xp
			},
			lastActive: new Date().toISOString()
		};
	});
	checkBadges();
}

export function recordAnswer(correct: boolean, skill: string, xp = 10) {
	progress.update((p) => {
		const mastery = { ...p.skillMastery };
		const current = mastery[skill] ?? 45;
		mastery[skill] = Math.max(0, Math.min(100, Math.round(current + (correct ? 2 : -1))));
		return {
			...p,
			questionsAnswered: p.questionsAnswered + 1,
			correctAnswers: p.correctAnswers + (correct ? 1 : 0),
			xp: p.xp + (correct ? xp : 0),
			dailyXp: p.dailyXp + (correct ? xp : 0),
			coins: p.coins + (correct ? 5 : 0),
			skillMastery: mastery,
			questProgress: {
				...p.questProgress,
				q4: (p.questProgress.q4 ?? 0) + (correct ? xp : 0)
			}
		};
	});
}

export function recordQuiz(title: string, score: number, total: number, xp: number) {
	const record: QuizRecord = {
		id: 'qh_' + Date.now(),
		title,
		score,
		total,
		xp,
		at: new Date().toISOString()
	};
	progress.update((p) => ({
		...p,
		xp: p.xp + xp,
		dailyXp: p.dailyXp + xp,
		coins: p.coins + score * 5,
		quizzesPlayed: p.quizzesPlayed + 1,
		quizHistory: [record, ...p.quizHistory].slice(0, 20),
		questProgress: {
			...p.questProgress,
			q2: score / Math.max(1, total) >= 0.8 ? 1 : p.questProgress.q2 ?? 0,
			q4: (p.questProgress.q4 ?? 0) + xp
		}
	}));
	checkBadges();
}

export function recordGame(slug: string, score: number, xp: number) {
	progress.update((p) => ({
		...p,
		xp: p.xp + xp,
		dailyXp: p.dailyXp + xp,
		coins: p.coins + Math.round(score / 10),
		gamesPlayed: p.gamesPlayed + 1,
		gameBests: { ...p.gameBests, [slug]: Math.max(p.gameBests[slug] ?? 0, score) },
		questProgress: {
			...p.questProgress,
			q3: 1,
			q4: (p.questProgress.q4 ?? 0) + xp
		}
	}));
	checkBadges();
}

function checkBadges() {
	const p = get(progress);
	const earned = new Set(p.earnedBadges);
	const add = (id: string) => earned.add(id);
	if (p.completedLessons.length >= 1) add('first-step');
	if (p.streak >= 7) add('streak-7');
	if (p.streak >= 30) add('streak-30');
	if (p.xp >= 1000) add('xp-1000');
	if (p.quizHistory.some((q) => q.score === q.total)) add('quiz-ace');
	if (p.completedLessons.some((l) => l.startsWith('math-'))) add('math-ninja');
	if (p.gamesPlayed >= 10) add('arena-crown');
	if (Object.values(p.skillMastery).filter((v) => v >= 80).length >= 5) add('science-spark');
	const next = [...earned];
	if (next.length !== p.earnedBadges.length) {
		progress.update((state) => ({ ...state, earnedBadges: next }));
	}
}

export function claimQuest(id: string, xp: number) {
	progress.update((p) => ({
		...p,
		xp: p.xp + xp,
		coins: p.coins + 20,
		questProgress: { ...p.questProgress, [id]: -1 }
	}));
}

export function toggleFreeze() {
	progress.update((p) => ({ ...p, freezes: Math.max(0, p.freezes - 1) }));
}

export function resetProgress() {
	progress.set(initial);
	if (browser) localStorage.removeItem(KEY);
}
