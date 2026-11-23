import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const listForClass = query({
	args: { classId: v.id('classes') },
	handler: async (ctx, { classId }) => {
		const assignments = await ctx.db
			.query('assignments')
			.withIndex('by_class', (q) => q.eq('classId', classId))
			.collect();
		const counts = await Promise.all(
			assignments.map(async (a) => {
				const submissions = await ctx.db
					.query('submissions')
					.withIndex('by_assignment', (q) => q.eq('assignmentId', a._id))
					.collect();
				return {
					...a,
					submitted: submissions.filter((s) => s.status === 'submitted' || s.status === 'graded').length,
					graded: submissions.filter((s) => s.status === 'graded').length
				};
			})
		);
		return counts.sort((a, b) => a.dueAt - b.dueAt);
	}
});

export const listForTeacher = query({
	args: { teacherId: v.id('users') },
	handler: async (ctx, { teacherId }) => {
		return await ctx.db
			.query('assignments')
			.withIndex('by_teacher', (q) => q.eq('teacherId', teacherId))
			.order('desc')
			.collect();
	}
});

export const create = mutation({
	args: {
		classId: v.id('classes'),
		teacherId: v.id('users'),
		title: v.string(),
		instructions: v.string(),
		lessonIds: v.array(v.string()),
		dueAt: v.number(),
		status: v.optional(v.union(v.literal('draft'), v.literal('published')))
	},
	handler: async (ctx, args) => {
		if (!args.title.trim()) throw new Error('Title is required');
		const assignmentId = await ctx.db.insert('assignments', {
			classId: args.classId,
			teacherId: args.teacherId,
			title: args.title.trim(),
			instructions: args.instructions.trim(),
			lessonIds: args.lessonIds,
			dueAt: args.dueAt,
			status: args.status ?? 'published',
			createdAt: Date.now()
		});
		const enrolled = await ctx.db
			.query('enrollments')
			.withIndex('by_class', (q) => q.eq('classId', args.classId))
			.collect();
		for (const e of enrolled.filter((x) => x.status === 'active')) {
			await ctx.db.insert('submissions', {
				assignmentId,
				userId: e.userId,
				status: 'not-started'
			});
			await ctx.db.insert('notifications', {
				userId: e.userId,
				title: 'New assignment',
				body: args.title,
				kind: 'assignment',
				read: false,
				href: '/app',
				createdAt: Date.now()
			});
		}
		return assignmentId;
	}
});

export const setStatus = mutation({
	args: {
		assignmentId: v.id('assignments'),
		status: v.union(v.literal('draft'), v.literal('published'), v.literal('closed'))
	},
	handler: async (ctx, { assignmentId, status }) => {
		await ctx.db.patch(assignmentId, { status });
	}
});

export const submit = mutation({
	args: {
		assignmentId: v.id('assignments'),
		userId: v.id('users'),
		score: v.number()
	},
	handler: async (ctx, { assignmentId, userId, score }) => {
		const existing = await ctx.db
			.query('submissions')
			.withIndex('by_assignment_user', (q) => q.eq('assignmentId', assignmentId).eq('userId', userId))
			.first();
		const patch = {
			status: 'submitted' as const,
			score: Math.max(0, Math.min(100, score)),
			submittedAt: Date.now()
		};
		if (existing) await ctx.db.patch(existing._id, patch);
		else await ctx.db.insert('submissions', { assignmentId, userId, ...patch });
	}
});

export const grade = mutation({
	args: {
		assignmentId: v.id('assignments'),
		userId: v.id('users'),
		score: v.number(),
		feedback: v.optional(v.string())
	},
	handler: async (ctx, { assignmentId, userId, score, feedback }) => {
		const existing = await ctx.db
			.query('submissions')
			.withIndex('by_assignment_user', (q) => q.eq('assignmentId', assignmentId).eq('userId', userId))
			.first();
		if (!existing) throw new Error('Submission not found');
		await ctx.db.patch(existing._id, {
			status: 'graded',
			score: Math.max(0, Math.min(100, score)),
			feedback,
			submittedAt: existing.submittedAt ?? Date.now()
		});
		await ctx.db.insert('notifications', {
			userId,
			title: 'Assignment graded',
			body: feedback ?? 'Your teacher has reviewed your work.',
			kind: 'assignment',
			read: false,
			href: '/app',
			createdAt: Date.now()
		});
	}
});
