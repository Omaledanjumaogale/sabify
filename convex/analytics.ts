import { v } from 'convex/values';
import { query } from './_generated/server';

async function learnerSnapshot(ctx: any, userId: any) {
	const user = await ctx.db.get(userId);
	const progress = await ctx.db
		.query('progress')
		.withIndex('by_user', (q: any) => q.eq('userId', userId))
		.first();
	const quizzes = await ctx.db
		.query('quizAttempts')
		.withIndex('by_user', (q: any) => q.eq('userId', userId))
		.collect();
	const accuracy = quizzes.length
		? Math.round(quizzes.reduce((sum: number, q: any) => sum + q.accuracy, 0) / quizzes.length)
		: 0;
	return {
		user,
		xp: progress?.xp ?? user?.xp ?? 0,
		streak: progress?.streak ?? user?.streak ?? 0,
		accuracy,
		lessonsCompleted: progress?.completedLessonIds.length ?? 0,
		lastActiveAt: user?.lastActiveAt ?? 0
	};
}

export const teacherOverview = query({
	args: { teacherId: v.id('users') },
	handler: async (ctx, { teacherId }) => {
		const classes = await ctx.db
			.query('classes')
			.withIndex('by_teacher', (q) => q.eq('teacherId', teacherId))
			.collect();
		const assignments = await ctx.db
			.query('assignments')
			.withIndex('by_teacher', (q) => q.eq('teacherId', teacherId))
			.collect();

		const learners: any[] = [];
		for (const c of classes) {
			const enrollments = await ctx.db
				.query('enrollments')
				.withIndex('by_class', (q) => q.eq('classId', c._id))
				.collect();
			for (const e of enrollments.filter((x) => x.status === 'active')) {
				const snapshot = await learnerSnapshot(ctx, e.userId);
				if (snapshot.user) learners.push({ ...snapshot, classId: c._id, className: c.name });
			}
		}

		const unique = Array.from(new Map(learners.map((l) => [l.user._id, l])).values());
		const now = Date.now();
		const atRisk = unique.filter(
			(l) => now - (l.lastActiveAt || 0) > 3 * 86_400_000 || l.accuracy < 60
		);
		const avgAccuracy = unique.length
			? Math.round(unique.reduce((sum, l) => sum + l.accuracy, 0) / unique.length)
			: 0;

		return {
			classes,
			assignments,
			learnerCount: unique.length,
			avgAccuracy,
			atRisk: atRisk.map((l) => ({
				name: l.user.name,
				avatar: l.user.avatar,
				grade: l.user.grade ?? '',
				accuracy: l.accuracy,
				lastActiveAt: l.lastActiveAt
			})),
			learners: unique
				.sort((a, b) => b.xp - a.xp)
				.slice(0, 50)
				.map((l) => ({
					name: l.user.name,
					avatar: l.user.avatar,
					grade: l.user.grade ?? '',
					xp: l.xp,
					streak: l.streak,
					accuracy: l.accuracy,
					className: l.className
				}))
		};
	}
});

export const adminOverview = query({
	args: {},
	handler: async (ctx) => {
		const users = await ctx.db.query('users').collect();
		const schools = await ctx.db.query('schools').collect();
		const payments = await ctx.db.query('payments').collect();
		const successful = payments.filter((p) => p.status === 'successful');
		const mrr = successful
			.filter((p) => p.paidAt && p.paidAt > Date.now() - 31 * 86_400_000)
			.reduce((sum, p) => sum + p.amountNaira, 0);

		return {
			learners: users.filter((u) => u.role === 'learner').length,
			teachers: users.filter((u) => u.role === 'teacher').length,
			parents: users.filter((u) => u.role === 'parent').length,
			schools: schools.filter((s) => s.status === 'active').length,
			mrr,
			activeSubscriptions: users.filter((u) => u.plan !== 'free').length,
			signupsLast7Days: users.filter((u) => u.createdAt > Date.now() - 7 * 86_400_000).length,
			recentSignups: users
				.sort((a, b) => b.createdAt - a.createdAt)
				.slice(0, 8)
				.map((u) => ({
					name: u.name,
					role: u.role,
					plan: u.plan,
					avatar: u.avatar,
					createdAt: u.createdAt
				}))
		};
	}
});

export const learnerReport = query({
	args: { learnerId: v.id('users') },
	handler: async (ctx, { learnerId }) => {
		const snapshot = await learnerSnapshot(ctx, learnerId);
		const quizzes = await ctx.db
			.query('quizAttempts')
			.withIndex('by_user_created', (q) => q.eq('userId', learnerId))
			.order('desc')
			.take(12);
		const games = await ctx.db
			.query('gameScores')
			.withIndex('by_user', (q) => q.eq('userId', learnerId))
			.order('desc')
			.take(12);
		const assignments = await ctx.db
			.query('submissions')
			.withIndex('by_user', (q) => q.eq('userId', learnerId))
			.collect();
		return { ...snapshot, quizzes, games, assignments };
	}
});
