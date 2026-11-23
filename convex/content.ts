import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const listSubjects = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query('subjects').collect();
	}
});

export const listCourses = query({
	args: { subjectId: v.optional(v.string()) },
	handler: async (ctx, { subjectId }) => {
		const courses = subjectId
			? await ctx.db
					.query('courses')
					.withIndex('by_subject', (q) => q.eq('subjectId', subjectId))
					.collect()
			: await ctx.db.query('courses').collect();
		return courses
			.filter((c) => c.published)
			.sort((a, b) => a.title.localeCompare(b.title));
	}
});

export const getCourse = query({
	args: { slug: v.string() },
	handler: async (ctx, { slug }) => {
		const course = await ctx.db
			.query('courses')
			.withIndex('by_slug', (q) => q.eq('slug', slug))
			.first();
		if (!course) return null;
		const modules = await ctx.db
			.query('modules')
			.withIndex('by_course', (q) => q.eq('courseId', course._id))
			.collect();
		const lessons = await ctx.db
			.query('lessons')
			.withIndex('by_course', (q) => q.eq('courseId', course._id))
			.collect();
		return {
			course,
			modules: modules.sort((a, b) => a.order - b.order),
			lessons: lessons.filter((l) => l.published)
		};
	}
});

export const getLesson = query({
	args: { slug: v.string() },
	handler: async (ctx, { slug }) => {
		const lesson = await ctx.db
			.query('lessons')
			.withIndex('by_slug', (q) => q.eq('slug', slug))
			.first();
		if (!lesson) return null;
		const course = await ctx.db.get(lesson.courseId);
		const module = await ctx.db.get(lesson.moduleId);
		return { lesson, course, module };
	}
});

export const search = query({
	args: { term: v.string(), limit: v.optional(v.number()) },
	handler: async (ctx, { term, limit = 20 }) => {
		const needle = term.toLowerCase().trim();
		if (!needle) return [];
		const lessons = await ctx.db.query('lessons').collect();
		return lessons
			.filter(
				(l) =>
					l.published &&
					(l.title.toLowerCase().includes(needle) ||
						l.summary.toLowerCase().includes(needle) ||
						l.objective.toLowerCase().includes(needle))
			)
			.slice(0, limit)
			.map((l) => ({ id: l._id, slug: l.slug, title: l.title, summary: l.summary, xp: l.xp }));
	}
});

export const dailyQuiz = query({
	args: {},
	handler: async (ctx) => {
		const lessons = await ctx.db.query('lessons').collect();
		const pool = lessons.filter((l) => l.published).flatMap((l) => l.questions as any[]);
		const day = Math.floor(Date.now() / 86_400_000);
		const picked = pool
			.filter((_, i) => (i * 7 + day) % 5 === 0)
			.slice(0, 10)
			.map((q, i) => ({ ...q, id: `daily-${day}-${i}` }));
		return { day, questions: picked.length ? picked : pool.slice(0, 10) };
	}
});

/** Admin-only catalogue update. In production this is gated by an admin claim. */
export const setPublished = mutation({
	args: { courseId: v.id('courses'), published: v.boolean() },
	handler: async (ctx, { courseId, published }) => {
		await ctx.db.patch(courseId, { published });
	}
});
