import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const role = v.union(v.literal('learner'), v.literal('teacher'), v.literal('parent'), v.literal('admin'));

export const getByEmail = query({
	args: { email: v.string() },
	handler: async (ctx, { email }) => {
		return await ctx.db
			.query('users')
			.withIndex('by_email', (q) => q.eq('email', email.toLowerCase().trim()))
			.first();
	}
});

export const get = query({
	args: { userId: v.id('users') },
	handler: async (ctx, { userId }) => {
		return await ctx.db.get(userId);
	}
});

/** Called by the auth provider after a successful sign-in. Idempotent on email. */
export const ensureUser = mutation({
	args: {
		name: v.string(),
		email: v.string(),
		role,
		avatar: v.optional(v.string()),
		grade: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		const email = args.email.toLowerCase().trim();
		const existing = await ctx.db
			.query('users')
			.withIndex('by_email', (q) => q.eq('email', email))
			.first();
		if (existing) return existing._id;

		const userId = await ctx.db.insert('users', {
			name: args.name,
			email,
			role: args.role,
			plan: args.role === 'learner' ? 'free' : 'educator',
			avatar: args.avatar ?? '🦊',
			grade: args.grade,
			xp: 0,
			coins: 0,
			streak: 1,
			lastActiveAt: Date.now(),
			createdAt: Date.now()
		});

		await ctx.db.insert('progress', {
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

		return userId;
	}
});

export const updateProfile = mutation({
	args: {
		userId: v.id('users'),
		name: v.optional(v.string()),
		avatar: v.optional(v.string()),
		grade: v.optional(v.string()),
		classId: v.optional(v.id('classes'))
	},
	handler: async (ctx, { userId, ...patch }) => {
		const clean = Object.fromEntries(Object.entries(patch).filter(([, value]) => value !== undefined));
		if (Object.keys(clean).length) await ctx.db.patch(userId, clean);
		await ctx.db.patch(userId, { lastActiveAt: Date.now() });
		return await ctx.db.get(userId);
	}
});

export const setPlan = mutation({
	args: {
		userId: v.id('users'),
		plan: v.union(v.literal('free'), v.literal('family'), v.literal('family-plus'), v.literal('school'), v.literal('educator'))
	},
	handler: async (ctx, { userId, plan }) => {
		await ctx.db.patch(userId, { plan });
	}
});

export const touch = mutation({
	args: { userId: v.id('users') },
	handler: async (ctx, { userId }) => {
		await ctx.db.patch(userId, { lastActiveAt: Date.now() });
	}
});
