import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import type { Id } from './_generated/dataModel';

const MILESTONES = [
	{ code: 'first-steps', xp: 100 },
	{ code: 'quiz-ace', xp: 1000 },
	{ code: 'xp-5000', xp: 5000 },
	{ code: 'xp-10000', xp: 10000 }
];

async function progressFor(ctx: any, userId: Id<'users'>) {
	const existing = await ctx.db
		.query('progress')
		.withIndex('by_user', (q: any) => q.eq('userId', userId))
		.first();
	if (existing) return existing;
	const id = await ctx.db.insert('progress', {
		userId,
		xp: 0,
		coins: 0,
		streak: 1,
		completedLessonIds: [],
		skillMastery: {},
		gameBests: {},
		questProgress: {},
		badgeCodes: [],
		updatedAt: Date.now()
	});
	return (await ctx.db.get(id))!;
}

async function grantMilestones(ctx: any, userId: Id<'users'>, xp: number, badgeCodes: string[]) {
	const earned = [...badgeCodes];
	for (const m of MILESTONES) {
		if (xp >= m.xp && !earned.includes(m.code)) {
			earned.push(m.code);
			const badge = await ctx.db
				.query('badges')
				.withIndex('by_code', (q: any) => q.eq('code', m.code))
				.first();
			await ctx.db.insert('notifications', {
				userId,
				title: `Badge unlocked: ${badge?.name ?? m.code}`,
				body: badge?.description ?? 'You reached a new learning milestone.',
				kind: 'achievement',
				read: false,
				href: '/app/achievements',
				createdAt: Date.now()
			});
		}
	}
	return earned;
}

export const get = query({
	args: { userId: v.id('users') },
	handler: async (ctx, { userId }) => {
		return await ctx.db
			.query('progress')
			.withIndex('by_user', (q) => q.eq('userId', userId))
			.first();
	}
});

export const dashboard = query({
	args: { userId: v.id('users') },
	handler: async (ctx, { userId }) => {
		const user = await ctx.db.get(userId);
		const progress = await ctx.db
			.query('progress')
			.withIndex('by_user', (q) => q.eq('userId', userId))
			.first();
		const recentQuizzes = await ctx.db
			.query('quizAttempts')
			.withIndex('by_user_created', (q) => q.eq('userId', userId))
			.order('desc')
			.take(7);
		const recentGames = await ctx.db
			.query('gameScores')
			.withIndex('by_user', (q) => q.eq('userId', userId))
			.order('desc')
			.take(5);
		return { user, progress, recentQuizzes, recentGames };
	}
});

export const addXp = mutation({
	args: {
		userId: v.id('users'),
		xp: v.number(),
		coins: v.optional(v.number()),
		reason: v.optional(v.string())
	},
	handler: async (ctx, { userId, xp, coins = 0 }) => {
		const progress = await progressFor(ctx, userId);
		const nextXp = progress.xp + Math.max(0, xp);
		const badgeCodes = await grantMilestones(ctx, userId, nextXp, progress.badgeCodes);
		await ctx.db.patch(progress._id, {
			xp: nextXp,
			coins: progress.coins + Math.max(0, coins),
			badgeCodes,
			updatedAt: Date.now()
		});
		const user = await ctx.db.get(userId);
		if (user) await ctx.db.patch(userId, { xp: nextXp, coins: progress.coins + coins, lastActiveAt: Date.now() });
		return { xp: nextXp, coins: progress.coins + coins };
	}
});

export const completeLesson = mutation({
	args: {
		userId: v.id('users'),
		lessonId: v.string(),
		skill: v.string(),
		xp: v.number(),
		score: v.optional(v.number())
	},
	handler: async (ctx, { userId, lessonId, skill, xp, score = 100 }) => {
		const progress = await progressFor(ctx, userId);
		const first = !progress.completedLessonIds.includes(lessonId);
		const completed = first ? [...progress.completedLessonIds, lessonId] : progress.completedLessonIds;
		const previous = progress.skillMastery[skill] ?? 0;
		const mastery = Math.round(previous * 0.7 + score * 0.3);
		const nextXp = progress.xp + (first ? xp : Math.round(xp * 0.2));
		const badgeCodes = await grantMilestones(ctx, userId, nextXp, progress.badgeCodes);

		await ctx.db.patch(progress._id, {
			xp: nextXp,
			coins: progress.coins + (first ? 15 : 3),
			completedLessonIds: completed,
			skillMastery: { ...progress.skillMastery, [skill]: mastery },
			badgeCodes,
			updatedAt: Date.now()
		});
		const user = await ctx.db.get(userId);
		if (user) await ctx.db.patch(userId, { xp: nextXp, lastActiveAt: Date.now() });

		return { first, mastery, xp: nextXp, lessonsCompleted: completed.length };
	}
});

export const recordQuiz = mutation({
	args: {
		userId: v.id('users'),
		packId: v.string(),
		score: v.number(),
		total: v.number(),
		durationSec: v.number(),
		answers: v.optional(v.array(v.any()))
	},
	handler: async (ctx, { userId, packId, score, total, durationSec, answers = [] }) => {
		const accuracy = total ? Math.round((score / total) * 100) : 0;
		const xp = score * 15 + (accuracy === 100 ? 50 : 0);
		await ctx.db.insert('quizAttempts', {
			userId,
			packId,
			score,
			total,
			accuracy,
			durationSec,
			answers,
			createdAt: Date.now()
		});
		const progress = await progressFor(ctx, userId);
		const nextXp = progress.xp + xp;
		const badgeCodes = await grantMilestones(ctx, userId, nextXp, progress.badgeCodes);
		await ctx.db.patch(progress._id, {
			xp: nextXp,
			coins: progress.coins + score * 5,
			badgeCodes,
			updatedAt: Date.now()
		});
		const user = await ctx.db.get(userId);
		if (user) await ctx.db.patch(userId, { xp: nextXp, lastActiveAt: Date.now() });
		return { accuracy, xp };
	}
});

export const recordGame = mutation({
	args: {
		userId: v.id('users'),
		gameId: v.string(),
		score: v.number(),
		xp: v.number(),
		meta: v.optional(v.any())
	},
	handler: async (ctx, { userId, gameId, score, xp, meta }) => {
		await ctx.db.insert('gameScores', { userId, gameId, score, xp, meta, createdAt: Date.now() });
		const progress = await progressFor(ctx, userId);
		const best = Math.max(progress.gameBests[gameId] ?? 0, score);
		const nextXp = progress.xp + xp;
		const badgeCodes = await grantMilestones(ctx, userId, nextXp, progress.badgeCodes);
		await ctx.db.patch(progress._id, {
			xp: nextXp,
			coins: progress.coins + Math.round(score / 10),
			gameBests: { ...progress.gameBests, [gameId]: best },
			badgeCodes,
			updatedAt: Date.now()
		});
		const user = await ctx.db.get(userId);
		if (user) await ctx.db.patch(userId, { xp: nextXp, lastActiveAt: Date.now() });
		return { best, xp: nextXp };
	}
});

export const claimQuest = mutation({
	args: { userId: v.id('users'), questCode: v.string() },
	handler: async (ctx, { userId, questCode }) => {
		const quest = await ctx.db
			.query('quests')
			.withIndex('by_code', (q) => q.eq('code', questCode))
			.first();
		if (!quest) throw new Error('Quest not found');
		const progress = await progressFor(ctx, userId);
		if ((progress.questProgress[questCode] ?? 0) >= quest.target) {
			throw new Error('Quest reward already claimed');
		}
		await ctx.db.patch(progress._id, {
			questProgress: { ...progress.questProgress, [questCode]: quest.target },
			xp: progress.xp + quest.rewardXp,
			coins: progress.coins + quest.rewardCoins,
			updatedAt: Date.now()
		});
		return { xp: quest.rewardXp, coins: quest.rewardCoins };
	}
});

export const leaderboard = query({
	args: { limit: v.optional(v.number()) },
	handler: async (ctx, { limit = 20 }) => {
		const learners = await ctx.db
			.query('users')
			.withIndex('by_role', (q) => q.eq('role', 'learner'))
			.collect();
		return learners
			.sort((a, b) => b.xp - a.xp)
			.slice(0, limit)
			.map((u, i) => ({
				rank: i + 1,
				name: u.name,
				avatar: u.avatar,
				grade: u.grade ?? '',
				xp: u.xp,
				streak: u.streak
			}));
	}
});
