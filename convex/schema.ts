import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const role = v.union(v.literal('learner'), v.literal('teacher'), v.literal('parent'), v.literal('admin'));
const plan = v.union(v.literal('free'), v.literal('family'), v.literal('family-plus'), v.literal('school'), v.literal('educator'));
const level = v.union(v.literal('Starter'), v.literal('Explorer'), v.literal('Champion'));

export default defineSchema({
	users: defineTable({
		name: v.string(),
		email: v.string(),
		role,
		plan,
		avatar: v.string(),
		grade: v.optional(v.string()),
		xp: v.number(),
		coins: v.number(),
		streak: v.number(),
		schoolId: v.optional(v.id('schools')),
		parentId: v.optional(v.id('users')),
		classId: v.optional(v.id('classes')),
		lastActiveAt: v.number(),
		createdAt: v.number()
	})
		.index('by_email', ['email'])
		.index('by_role', ['role'])
		.index('by_school', ['schoolId'])
		.index('by_parent', ['parentId']),

	schools: defineTable({
		name: v.string(),
		city: v.string(),
		state: v.string(),
		contactEmail: v.string(),
		seats: v.number(),
		status: v.union(v.literal('trial'), v.literal('active'), v.literal('paused')),
		createdAt: v.number()
	}).index('by_name', ['name']),

	classes: defineTable({
		name: v.string(),
		schoolId: v.optional(v.id('schools')),
		teacherId: v.id('users'),
		subject: v.string(),
		grade: v.string(),
		joinCode: v.string(),
		learnerCount: v.number(),
		createdAt: v.number()
	})
		.index('by_teacher', ['teacherId'])
		.index('by_join_code', ['joinCode'])
		.index('by_school', ['schoolId']),

	enrollments: defineTable({
		classId: v.id('classes'),
		userId: v.id('users'),
		status: v.union(v.literal('active'), v.literal('invited'), v.literal('removed')),
		joinedAt: v.number()
	})
		.index('by_class', ['classId'])
		.index('by_user', ['userId'])
		.index('by_class_user', ['classId', 'userId']),

	subjects: defineTable({
		slug: v.string(),
		name: v.string(),
		short: v.string(),
		tagline: v.string(),
		emoji: v.string(),
		gradient: v.string(),
		order: v.number()
	}).index('by_slug', ['slug']),

	courses: defineTable({
		slug: v.string(),
		subjectId: v.string(),
		title: v.string(),
		summary: v.string(),
		description: v.string(),
		emoji: v.string(),
		gradient: v.string(),
		level,
		ages: v.string(),
		hours: v.number(),
		xp: v.number(),
		curriculum: v.array(v.string()),
		skills: v.array(v.string()),
		published: v.boolean()
	})
		.index('by_slug', ['slug'])
		.index('by_subject', ['subjectId'])
		.index('by_published', ['published']),

	modules: defineTable({
		courseId: v.id('courses'),
		title: v.string(),
		summary: v.string(),
		emoji: v.string(),
		order: v.number()
	}).index('by_course', ['courseId']),

	lessons: defineTable({
		slug: v.string(),
		courseId: v.id('courses'),
		moduleId: v.id('modules'),
		title: v.string(),
		summary: v.string(),
		objective: v.string(),
		minutes: v.number(),
		xp: v.number(),
		level,
		cards: v.array(v.any()),
		questions: v.array(v.any()),
		published: v.boolean()
	})
		.index('by_slug', ['slug'])
		.index('by_course', ['courseId'])
		.index('by_module', ['moduleId']),

	progress: defineTable({
		userId: v.id('users'),
		xp: v.number(),
		coins: v.number(),
		streak: v.number(),
		completedLessonIds: v.array(v.string()),
		skillMastery: v.record(v.string(), v.number()),
		gameBests: v.record(v.string(), v.number()),
		questProgress: v.record(v.string(), v.number()),
		badgeCodes: v.array(v.string()),
		updatedAt: v.number()
	}).index('by_user', ['userId']),

	quizAttempts: defineTable({
		userId: v.id('users'),
		packId: v.string(),
		score: v.number(),
		total: v.number(),
		accuracy: v.number(),
		durationSec: v.number(),
		answers: v.array(v.any()),
		createdAt: v.number()
	})
		.index('by_user', ['userId'])
		.index('by_user_created', ['userId', 'createdAt']),

	gameScores: defineTable({
		userId: v.id('users'),
		gameId: v.string(),
		score: v.number(),
		xp: v.number(),
		meta: v.optional(v.any()),
		createdAt: v.number()
	})
		.index('by_user', ['userId'])
		.index('by_game', ['gameId'])
		.index('by_user_game', ['userId', 'gameId']),

	quests: defineTable({
		code: v.string(),
		title: v.string(),
		description: v.string(),
		cadence: v.union(v.literal('daily'), v.literal('weekly')),
		target: v.number(),
		rewardXp: v.number(),
		rewardCoins: v.number(),
		active: v.boolean()
	}).index('by_code', ['code']),

	badges: defineTable({
		code: v.string(),
		name: v.string(),
		description: v.string(),
		emoji: v.string(),
		tier: v.union(v.literal('bronze'), v.literal('silver'), v.literal('gold'), v.literal('legend')),
		criteria: v.string()
	}).index('by_code', ['code']),

	assignments: defineTable({
		classId: v.id('classes'),
		teacherId: v.id('users'),
		title: v.string(),
		instructions: v.string(),
		lessonIds: v.array(v.string()),
		dueAt: v.number(),
		status: v.union(v.literal('draft'), v.literal('published'), v.literal('closed')),
		createdAt: v.number()
	})
		.index('by_class', ['classId'])
		.index('by_teacher', ['teacherId'])
		.index('by_due', ['dueAt']),

	submissions: defineTable({
		assignmentId: v.id('assignments'),
		userId: v.id('users'),
		status: v.union(v.literal('not-started'), v.literal('in-progress'), v.literal('submitted'), v.literal('graded')),
		score: v.optional(v.number()),
		feedback: v.optional(v.string()),
		submittedAt: v.optional(v.number())
	})
		.index('by_assignment', ['assignmentId'])
		.index('by_user', ['userId'])
		.index('by_assignment_user', ['assignmentId', 'userId']),

	subscriptions: defineTable({
		userId: v.id('users'),
		plan,
		amountNaira: v.number(),
		interval: v.union(v.literal('monthly'), v.literal('annual')),
		status: v.union(v.literal('active'), v.literal('past_due'), v.literal('cancelled'), v.literal('trialing')),
		provider: v.union(v.literal('paystack'), v.literal('transfer'), v.literal('ussd')),
		reference: v.string(),
		currentPeriodEnd: v.number(),
		createdAt: v.number()
	})
		.index('by_user', ['userId'])
		.index('by_reference', ['reference'])
		.index('by_status', ['status']),

	payments: defineTable({
		userId: v.optional(v.id('users')),
		schoolId: v.optional(v.id('schools')),
		subscriptionId: v.optional(v.id('subscriptions')),
		amountNaira: v.number(),
		status: v.union(v.literal('pending'), v.literal('successful'), v.literal('failed'), v.literal('refunded')),
		provider: v.string(),
		reference: v.string(),
		paidAt: v.optional(v.number()),
		createdAt: v.number()
	})
		.index('by_reference', ['reference'])
		.index('by_status', ['status'])
		.index('by_user', ['userId']),

	notifications: defineTable({
		userId: v.id('users'),
		title: v.string(),
		body: v.string(),
		kind: v.union(v.literal('system'), v.literal('assignment'), v.literal('achievement'), v.literal('billing'), v.literal('report')),
		read: v.boolean(),
		href: v.optional(v.string()),
		createdAt: v.number()
	}).index('by_user', ['userId']),

	tutorMessages: defineTable({
		userId: v.id('users'),
		role: v.union(v.literal('user'), v.literal('assistant')),
		body: v.string(),
		safetyFlag: v.optional(v.string()),
		createdAt: v.number()
	}).index('by_user', ['userId'])
});
