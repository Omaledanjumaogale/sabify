import { mutation } from './_generated/server';
import { courses, subjects } from '../src/lib/data/curriculum';

const DEMO_BADGES = [
	['first-steps', 'First Steps', 'Finished your very first lesson.', '🌱', 'bronze', 'Complete 1 lesson'],
	['quiz-ace', 'Quiz Ace', 'Scored 100% in a quiz.', '🏅', 'silver', 'Get a perfect quiz score'],
	['xp-5000', 'XP Collector', 'Earned 5,000 XP.', '⚡', 'gold', 'Reach 5,000 XP'],
	['xp-10000', 'XP Legend', 'Earned 10,000 XP.', '👑', 'legend', 'Reach 10,000 XP']
] as const;

const DEMO_QUESTS = [
	['daily-lesson', 'Daily lesson', 'Finish one lesson today.', 'daily', 1, 40, 10],
	['daily-quiz', 'Daily quiz', 'Score 80% or more in any quiz.', 'daily', 1, 60, 15],
	['daily-game', 'Arcade warm-up', 'Play any learning game.', 'daily', 1, 30, 5],
	['weekly-streak', 'Keep the flame', 'Learn on 5 days this week.', 'weekly', 5, 200, 50],
	['weekly-mastery', 'Mastery climb', 'Improve two skills by 10%.', 'weekly', 2, 250, 60]
] as const;

export const run = mutation({
	args: {},
	handler: async (ctx) => {
		const existing = await ctx.db.query('users').first();
		if (existing) return { skipped: true, reason: 'Database already seeded' };

		const schoolId = await ctx.db.insert('schools', {
			name: 'Greenfield Academy',
			city: 'Lagos',
			state: 'Lagos',
			contactEmail: 'admin@greenfield.edu.ng',
			seats: 120,
			status: 'active',
			createdAt: Date.now()
		});

		const teacherId = await ctx.db.insert('users', {
			name: 'Emeka Obi',
			email: 'emeka@greenfield.edu.ng',
			role: 'teacher',
			plan: 'educator',
			avatar: '👨🏾‍🏫',
			xp: 0,
			coins: 0,
			streak: 0,
			schoolId,
			lastActiveAt: Date.now(),
			createdAt: Date.now()
		});

		const classId = await ctx.db.insert('classes', {
			name: 'JSS 2A',
			schoolId,
			teacherId,
			subject: 'Mathematics',
			grade: 'JSS 2',
			joinCode: 'SAB-JSS2A',
			learnerCount: 2,
			createdAt: Date.now()
		});

		const parentId = await ctx.db.insert('users', {
			name: 'Ngozi Okafor',
			email: 'ngozi@example.com',
			role: 'parent',
			plan: 'family',
			avatar: '👩🏾',
			xp: 0,
			coins: 0,
			streak: 0,
			lastActiveAt: Date.now(),
			createdAt: Date.now()
		});

		const learners = [
			{ name: 'Ada Okafor', email: 'ada@example.com', avatar: '🦊', grade: 'Primary 5', xp: 5717, coins: 480, streak: 12 },
			{ name: 'Chidi Okafor', email: 'chidi@example.com', avatar: '🐣', grade: 'Primary 3', xp: 3490, coins: 260, streak: 6 }
		];

		for (const learner of learners) {
			const userId = await ctx.db.insert('users', {
				...learner,
				role: 'learner',
				plan: 'family',
				parentId,
				schoolId,
				classId,
				lastActiveAt: Date.now(),
				createdAt: Date.now()
			});
			await ctx.db.insert('progress', {
				userId,
				xp: learner.xp,
				coins: learner.coins,
				streak: learner.streak,
				completedLessonIds: [],
				skillMastery: { Fractions: 62, Reading: 81, Science: 91 },
				gameBests: { 'number-nebula': 840 },
				questProgress: {},
				badgeCodes: ['first-steps'],
				updatedAt: Date.now()
			});
			await ctx.db.insert('enrollments', {
				classId,
				userId,
				status: 'active',
				joinedAt: Date.now()
			});
		}

		for (const [index, subject] of subjects.entries()) {
			await ctx.db.insert('subjects', {
				slug: subject.slug,
				name: subject.name,
				short: subject.short,
				tagline: subject.tagline,
				emoji: (subject as any).emoji ?? '📘',
				gradient: (subject as any).gradient ?? 'from-[#e9fbf1] to-[#c9f26b]',
				order: index
			});
		}

		for (const course of courses) {
			const courseId = await ctx.db.insert('courses', {
				slug: course.slug,
				subjectId: course.subjectId,
				title: course.title,
				summary: course.summary,
				description: course.description,
				emoji: course.emoji,
				gradient: course.gradient,
				level: course.level,
				ages: course.ages,
				hours: course.hours,
				xp: course.xp,
				curriculum: course.curriculum,
				skills: course.skills,
				published: true
			});
			for (const [moduleIndex, module] of course.modules.entries()) {
				const moduleId = await ctx.db.insert('modules', {
					courseId,
					title: module.title,
					summary: module.summary,
					emoji: module.emoji,
					order: moduleIndex
				});
				for (const lesson of module.lessons) {
					await ctx.db.insert('lessons', {
						slug: lesson.slug,
						courseId,
						moduleId,
						title: lesson.title,
						summary: lesson.summary,
						objective: lesson.objective,
						minutes: lesson.minutes,
						xp: lesson.xp,
						level: lesson.level,
						cards: lesson.cards as any,
						questions: lesson.questions as any,
						published: true
					});
				}
			}
		}

		for (const [code, name, description, emoji, tier, criteria] of DEMO_BADGES) {
			await ctx.db.insert('badges', { code, name, description, emoji, tier, criteria });
		}

		for (const [code, title, description, cadence, target, rewardXp, rewardCoins] of DEMO_QUESTS) {
			await ctx.db.insert('quests', {
				code,
				title,
				description,
				cadence,
				target,
				rewardXp,
				rewardCoins,
				active: true
			});
		}

		const firstCourse = courses[0];
		const firstLesson = firstCourse.modules[0].lessons[0];
		await ctx.db.insert('assignments', {
			classId,
			teacherId,
			title: 'Fractions practice sprint',
			instructions: 'Complete the fractions lesson, then try the daily quiz. Show your working in your notebook.',
			lessonIds: [firstLesson.slug],
			dueAt: Date.now() + 3 * 86_400_000,
			status: 'published',
			createdAt: Date.now()
		});

		return {
			seeded: true,
			courses: courses.length,
			lessons: courses.reduce((sum, c) => sum + c.modules.reduce((s, m) => s + m.lessons.length, 0), 0)
		};
	}
});
