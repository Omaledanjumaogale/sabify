export interface DemoUser {
	id: string;
	name: string;
	firstName: string;
	email: string;
	role: 'learner' | 'teacher' | 'parent' | 'admin';
	avatar: string;
	age: number;
	grade: string;
	curriculum: string;
	city: string;
	interests: string[];
	learningStyle: string;
	joined: string;
	plan: 'free' | 'family' | 'family-plus' | 'school';
	streak: number;
	coins: number;
}

export const demoUser: DemoUser = {
	id: 'usr_ada',
	name: 'Ada Okafor',
	firstName: 'Ada',
	email: 'ada@sabify.ng',
	role: 'learner',
	avatar: '🦊',
	age: 11,
	grade: 'Primary 5',
	curriculum: 'NERDC',
	city: 'Enugu',
	interests: ['Space', 'Games', 'Music'],
	learningStyle: 'Playful',
	joined: '2026-09-02',
	plan: 'family',
	streak: 12,
	coins: 840
};

export interface BadgeDef {
	id: string;
	name: string;
	description: string;
	emoji: string;
	tone: string;
	xp: number;
	earned: boolean;
	progress: number;
	target: number;
	category: 'streak' | 'mastery' | 'game' | 'community';
}

export const badges: BadgeDef[] = [
	{ id: 'first-step', name: 'First Step', description: 'Complete your very first lesson.', emoji: '🌱', tone: 'bg-[#e9fbf1]', xp: 50, earned: true, progress: 1, target: 1, category: 'mastery' },
	{ id: 'streak-7', name: 'Seven Sparks', description: 'Learn 7 days in a row.', emoji: '🔥', tone: 'bg-[#fff1e6]', xp: 120, earned: true, progress: 7, target: 7, category: 'streak' },
	{ id: 'streak-30', name: 'Unstoppable', description: 'Keep a 30-day streak.', emoji: '🌋', tone: 'bg-[#fff0ee]', xp: 400, earned: false, progress: 12, target: 30, category: 'streak' },
	{ id: 'xp-1000', name: 'Thousand Club', description: 'Earn 1,000 XP.', emoji: '💎', tone: 'bg-[#eaf8ff]', xp: 200, earned: true, progress: 1240, target: 1000, category: 'mastery' },
	{ id: 'quiz-ace', name: 'Quiz Ace', description: 'Score 100% in any quiz.', emoji: '🎯', tone: 'bg-[#f0edff]', xp: 150, earned: true, progress: 1, target: 1, category: 'mastery' },
	{ id: 'math-ninja', name: 'Maths Ninja', description: 'Master 10 maths skills.', emoji: '🥷', tone: 'bg-[#f2fbdf]', xp: 180, earned: false, progress: 7, target: 10, category: 'mastery' },
	{ id: 'word-wizard', name: 'Word Wizard', description: 'Learn 50 new words.', emoji: '🪄', tone: 'bg-[#fff3ec]', xp: 180, earned: false, progress: 38, target: 50, category: 'mastery' },
	{ id: 'science-spark', name: 'Science Spark', description: 'Finish a science experiment lesson.', emoji: '⚡', tone: 'bg-[#eef9ff]', xp: 160, earned: true, progress: 1, target: 1, category: 'mastery' },
	{ id: 'code-explorer', name: 'Code Explorer', description: 'Complete the Code Quest course.', emoji: '🤖', tone: 'bg-[#f3f0ff]', xp: 250, earned: false, progress: 2, target: 4, category: 'mastery' },
	{ id: 'money-mover', name: 'Money Mover', description: 'Finish Money Quest with ₦1,000 saved.', emoji: '💰', tone: 'bg-[#fff9e5]', xp: 200, earned: false, progress: 700, target: 1000, category: 'game' },
	{ id: 'arena-crown', name: 'Arena Crown', description: 'Beat Sabi Bot in Quiz Arena.', emoji: '👑', tone: 'bg-[#fff4d2]', xp: 220, earned: true, progress: 1, target: 1, category: 'game' },
	{ id: 'community-hero', name: 'Community Hero', description: 'Share a learning win with your class.', emoji: '🤝', tone: 'bg-[#e9fbf1]', xp: 150, earned: false, progress: 0, target: 1, category: 'community' }
];

export interface Quest {
	id: string;
	title: string;
	description: string;
	emoji: string;
	xp: number;
	progress: number;
	target: number;
	kind: 'daily' | 'weekly';
	link: string;
}

export const quests: Quest[] = [
	{ id: 'q1', title: 'Warm-up mission', description: 'Complete 1 lesson in any subject.', emoji: '📘', xp: 80, progress: 1, target: 1, kind: 'daily', link: '/app/subjects' },
	{ id: 'q2', title: 'Sharp shooter', description: 'Score 80% or more in a quiz.', emoji: '🎯', xp: 60, progress: 0, target: 1, kind: 'daily', link: '/app/quiz' },
	{ id: 'q3', title: 'Nebula pilot', description: 'Play one round of Number Nebula.', emoji: '🚀', xp: 50, progress: 0, target: 1, kind: 'daily', link: '/app/games/number-nebula' },
	{ id: 'q4', title: 'XP collector', description: 'Earn 150 XP today.', emoji: '⚡', xp: 40, progress: 65, target: 150, kind: 'daily', link: '/app/games' },
	{ id: 'q5', title: 'Streak keeper', description: 'Learn on 5 days this week.', emoji: '🔥', xp: 150, progress: 3, target: 5, kind: 'weekly', link: '/app' },
	{ id: 'q6', title: 'Word builder', description: 'Learn 10 new words this week.', emoji: '🪄', xp: 120, progress: 6, target: 10, kind: 'weekly', link: '/app/games/word-forge' },
	{ id: 'q7', title: 'Subject explorer', description: 'Try lessons in 3 different subjects.', emoji: '🧭', xp: 100, progress: 2, target: 3, kind: 'weekly', link: '/app/subjects' }
];

export interface LeaderRow {
	id: string;
	name: string;
	avatar: string;
	grade: string;
	xp: number;
	streak: number;
	trend: number;
	isMe?: boolean;
}

export const leaderboard: LeaderRow[] = [
	{ id: 'u1', name: 'Zainab Bello', avatar: '🐼', grade: 'Primary 6', xp: 4820, streak: 21, trend: 0 },
	{ id: 'u2', name: 'Chidi Okafor', avatar: '🦁', grade: 'JSS 1', xp: 4390, streak: 17, trend: 2 },
	{ id: 'u3', name: 'Ada Okafor', avatar: '🦊', grade: 'Primary 5', xp: 4120, streak: 12, trend: 1, isMe: true },
	{ id: 'u4', name: 'Tunde Adeyemi', avatar: '🐯', grade: 'Primary 5', xp: 3860, streak: 9, trend: -2 },
	{ id: 'u5', name: 'Amara Eze', avatar: '🦋', grade: 'JSS 2', xp: 3640, streak: 14, trend: 3 },
	{ id: 'u6', name: 'Ibrahim Musa', avatar: '🐨', grade: 'Primary 4', xp: 3410, streak: 6, trend: -1 },
	{ id: 'u7', name: 'Halima Sani', avatar: '🦉', grade: 'JSS 1', xp: 3220, streak: 11, trend: 0 },
	{ id: 'u8', name: 'Emeka Nwosu', avatar: '🐢', grade: 'Primary 6', xp: 2980, streak: 4, trend: 2 },
	{ id: 'u9', name: 'Fatima Yusuf', avatar: '🐝', grade: 'Primary 5', xp: 2750, streak: 8, trend: -1 },
	{ id: 'u10', name: 'David Danjuma', avatar: '🦅', grade: 'JSS 3', xp: 2540, streak: 5, trend: 1 }
];

export interface TeacherStudent {
	id: string;
	name: string;
	avatar: string;
	grade: string;
	xp: number;
	lessons: number;
	accuracy: number;
	streak: number;
	lastActive: string;
	risk: 'On track' | 'Watch' | 'Needs help';
	mastery: { subject: string; value: number }[];
}

export const teacherStudents: TeacherStudent[] = [
	{ id: 's1', name: 'Ada Okafor', avatar: '🦊', grade: 'Primary 5', xp: 4120, lessons: 28, accuracy: 92, streak: 12, lastActive: 'Today', risk: 'On track', mastery: [{ subject: 'Maths', value: 88 }, { subject: 'English', value: 84 }, { subject: 'Science', value: 91 }, { subject: 'Coding', value: 76 }] },
	{ id: 's2', name: 'Tunde Adeyemi', avatar: '🐯', grade: 'Primary 5', xp: 3860, lessons: 25, accuracy: 78, streak: 9, lastActive: 'Today', risk: 'On track', mastery: [{ subject: 'Maths', value: 71 }, { subject: 'English', value: 80 }, { subject: 'Science', value: 66 }, { subject: 'Coding', value: 70 }] },
	{ id: 's3', name: 'Amara Eze', avatar: '🦋', grade: 'Primary 5', xp: 3640, lessons: 24, accuracy: 88, streak: 14, lastActive: 'Yesterday', risk: 'On track', mastery: [{ subject: 'Maths', value: 90 }, { subject: 'English', value: 94 }, { subject: 'Science', value: 86 }, { subject: 'Coding', value: 82 }] },
	{ id: 's4', name: 'Ibrahim Musa', avatar: '🐨', grade: 'Primary 5', xp: 2410, lessons: 16, accuracy: 61, streak: 2, lastActive: '3 days ago', risk: 'Needs help', mastery: [{ subject: 'Maths', value: 42 }, { subject: 'English', value: 55 }, { subject: 'Science', value: 58 }, { subject: 'Coding', value: 49 }] },
	{ id: 's5', name: 'Halima Sani', avatar: '🦉', grade: 'Primary 5', xp: 3220, lessons: 22, accuracy: 81, streak: 11, lastActive: 'Today', risk: 'On track', mastery: [{ subject: 'Maths', value: 78 }, { subject: 'English', value: 85 }, { subject: 'Science', value: 72 }, { subject: 'Coding', value: 68 }] },
	{ id: 's6', name: 'Emeka Nwosu', avatar: '🐢', grade: 'Primary 5', xp: 1980, lessons: 13, accuracy: 58, streak: 1, lastActive: '5 days ago', risk: 'Needs help', mastery: [{ subject: 'Maths', value: 38 }, { subject: 'English', value: 52 }, { subject: 'Science', value: 45 }, { subject: 'Coding', value: 40 }] },
	{ id: 's7', name: 'Fatima Yusuf', avatar: '🐝', grade: 'Primary 5', xp: 2750, lessons: 19, accuracy: 74, streak: 8, lastActive: 'Yesterday', risk: 'Watch', mastery: [{ subject: 'Maths', value: 62 }, { subject: 'English', value: 77 }, { subject: 'Science', value: 70 }, { subject: 'Coding', value: 64 }] },
	{ id: 's8', name: 'David Danjuma', avatar: '🦅', grade: 'Primary 5', xp: 2540, lessons: 17, accuracy: 69, streak: 5, lastActive: '2 days ago', risk: 'Watch', mastery: [{ subject: 'Maths', value: 58 }, { subject: 'English', value: 66 }, { subject: 'Science', value: 61 }, { subject: 'Coding', value: 72 }] }
];

export interface Assignment {
	id: string;
	title: string;
	course: string;
	subject: string;
	due: string;
	submitted: number;
	total: number;
	status: 'Active' | 'Draft' | 'Closed';
	emoji: string;
}

export const assignments: Assignment[] = [
	{ id: 'a1', title: 'Fractions exit ticket', course: 'Number Ninjas', subject: 'Mathematics', due: 'Fri, 28 Nov', submitted: 24, total: 32, status: 'Active', emoji: '🍕' },
	{ id: 'a2', title: 'My story mountain plan', course: 'Story Crafters', subject: 'English', due: 'Mon, 1 Dec', submitted: 19, total: 32, status: 'Active', emoji: '🏔️' },
	{ id: 'a3', title: 'Plant observation journal', course: 'Science Sparks', subject: 'Science', due: 'Wed, 3 Dec', submitted: 8, total: 32, status: 'Active', emoji: '🌱' },
	{ id: 'a4', title: 'Build a 3-page site', course: 'Web Builders', subject: 'Coding', due: 'Fri, 5 Dec', submitted: 0, total: 32, status: 'Draft', emoji: '🌐' },
	{ id: 'a5', title: 'Needs vs wants sort', course: 'Money Movers', subject: 'Money', due: 'Last week', submitted: 31, total: 32, status: 'Closed', emoji: '🪙' }
];

export const classPerformance = [
	{ label: 'Mon', value: 62 },
	{ label: 'Tue', value: 78 },
	{ label: 'Wed', value: 71 },
	{ label: 'Thu', value: 86 },
	{ label: 'Fri', value: 92 },
	{ label: 'Sat', value: 48 },
	{ label: 'Sun', value: 35 }
];

export const subjectMastery = [
	{ subject: 'Maths', value: 88, color: '#10b981' },
	{ subject: 'English', value: 84, color: '#ff6b5e' },
	{ subject: 'Science', value: 91, color: '#59c8f5' },
	{ subject: 'Coding', value: 76, color: '#7c6cf6' },
	{ subject: 'Money', value: 68, color: '#ffc53d' },
	{ subject: 'Civics', value: 72, color: '#0d3b2a' }
];

export const weeklyXp = [
	{ label: 'Mon', value: 120 },
	{ label: 'Tue', value: 180 },
	{ label: 'Wed', value: 90 },
	{ label: 'Thu', value: 240 },
	{ label: 'Fri', value: 150 },
	{ label: 'Sat', value: 210 },
	{ label: 'Sun', value: 65 }
];

export const activityDays = Array.from({ length: 84 }, (_, i) => {
	const seed = (i * 37 + 11) % 100;
	const value = seed > 72 ? 3 : seed > 48 ? 2 : seed > 22 ? 1 : 0;
	return { day: i, value };
});

export interface ResourceItem {
	id: string;
	title: string;
	type: 'Worksheet' | 'Video' | 'Practice' | 'Project' | 'Story';
	subject: string;
	subjectId: string;
	duration: string;
	level: string;
	rating: number;
	emoji: string;
	description: string;
}

export const library: ResourceItem[] = [
	{ id: 'r1', title: 'Fractions on a number line', type: 'Worksheet', subject: 'Mathematics', subjectId: 'mathematics', duration: '15 min', level: 'Primary 4–5', rating: 4.8, emoji: '🍕', description: 'A visual worksheet with 12 fraction problems and a teacher answer key.' },
	{ id: 'r2', title: 'The market story comprehension', type: 'Story', subject: 'English', subjectId: 'english', duration: '10 min', level: 'Primary 5', rating: 4.9, emoji: '📖', description: 'A short story set in Onitsha market with inference questions.' },
	{ id: 'r3', title: 'Build a balloon rocket', type: 'Project', subject: 'Science', subjectId: 'science', duration: '25 min', level: 'Age 8+', rating: 4.7, emoji: '🎈', description: 'A safe at-home forces experiment using a balloon, straw and string.' },
	{ id: 'r4', title: 'HTML in 10 minutes', type: 'Video', subject: 'Coding', subjectId: 'coding', duration: '10 min', level: 'Age 10+', rating: 4.6, emoji: '🌐', description: 'A friendly walkthrough of your first HTML page and how tags work.' },
	{ id: 'r5', title: 'Needs vs wants sorting game', type: 'Practice', subject: 'Money', subjectId: 'money', duration: '8 min', level: 'Age 9+', rating: 4.8, emoji: '🪙', description: 'Sort 20 real-life spending cards into needs and wants.' },
	{ id: 'r6', title: 'Nigeria’s national symbols', type: 'Worksheet', subject: 'Civics', subjectId: 'civics', duration: '12 min', level: 'Primary 4–6', rating: 4.7, emoji: '🇳🇬', description: 'Label the flag, coat of arms and match each symbol to its meaning.' },
	{ id: 'r7', title: 'Colour wheel challenge', type: 'Project', subject: 'Arts', subjectId: 'arts', duration: '20 min', level: 'Age 6+', rating: 4.5, emoji: '🎨', description: 'Mix primary colours to create a full secondary colour wheel.' },
	{ id: 'r8', title: 'Algebra balance puzzles', type: 'Practice', subject: 'Mathematics', subjectId: 'mathematics', duration: '15 min', level: 'JSS 1', rating: 4.8, emoji: '⚖️', description: 'Ten visual equation puzzles that make solving for x intuitive.' },
	{ id: 'r9', title: 'Online safety scenarios', type: 'Video', subject: 'Digital', subjectId: 'digital', duration: '6 min', level: 'Age 8+', rating: 4.9, emoji: '🛡️', description: 'Short role-play scenarios about privacy, strangers and reporting.' },
	{ id: 'r10', title: 'Write a 6-word story', type: 'Project', subject: 'English', subjectId: 'english', duration: '10 min', level: 'Age 9+', rating: 4.6, emoji: '✍️', description: 'A creative constraint challenge that teaches word choice and implication.' }
];

export interface NotificationItem {
	id: string;
	title: string;
	body: string;
	time: string;
	emoji: string;
	unread: boolean;
}

export const notifications: NotificationItem[] = [
	{ id: 'n1', title: 'Streak milestone!', body: 'You have learned 12 days in a row. Two more days to your next badge.', time: '2h ago', emoji: '🔥', unread: true },
	{ id: 'n2', title: 'New assignment from Mr. Obi', body: 'Fractions exit ticket is due Friday, 28 November.', time: '5h ago', emoji: '📚', unread: true },
	{ id: 'n3', title: 'Weekly report is ready', body: 'You earned 1,055 XP this week — 18% more than last week.', time: '1d ago', emoji: '📈', unread: false }
];

export interface ParentChild {
	id: string;
	name: string;
	avatar: string;
	grade: string;
	xp: number;
	streak: number;
	weeklyMinutes: number;
	accuracy: number;
	topSubject: string;
	needsSupport: string;
	plan: string;
}

export const parentChildren: ParentChild[] = [
	{ id: 'c1', name: 'Ada Okafor', avatar: '🦊', grade: 'Primary 5', xp: 4120, streak: 12, weeklyMinutes: 185, accuracy: 92, topSubject: 'Science', needsSupport: 'Fractions', plan: 'Family plan' },
	{ id: 'c2', name: 'Chidi Okafor', avatar: '🦁', grade: 'JSS 1', xp: 4390, streak: 17, weeklyMinutes: 150, accuracy: 86, topSubject: 'Coding', needsSupport: 'Algebra', plan: 'Family plan' }
];

export const parentWeekly = [
	{ label: 'Mon', ada: 34, chidi: 22 },
	{ label: 'Tue', ada: 41, chidi: 30 },
	{ label: 'Wed', ada: 28, chidi: 18 },
	{ label: 'Thu', ada: 46, chidi: 35 },
	{ label: 'Fri', ada: 22, chidi: 27 },
	{ label: 'Sat', ada: 14, chidi: 12 },
	{ label: 'Sun', ada: 0, chidi: 6 }
];

export const adminMetrics = {
	mrr: 18_450_000,
	learners: 12_480,
	teachers: 640,
	schools: 84,
	conversion: 6.8,
	churn: 2.1,
	weeklyRevenue: [
		{ label: 'W1', value: 3.9 },
		{ label: 'W2', value: 4.2 },
		{ label: 'W3', value: 4.8 },
		{ label: 'W4', value: 5.1 }
	],
	planSplit: [
		{ label: 'Family monthly', value: 62, color: '#10b981' },
		{ label: 'School seats', value: 31, color: '#0d3b2a' },
		{ label: 'Free trial', value: 7, color: '#ffc53d' }
	],
	recentSignups: [
		{ name: 'Blessing Ade', role: 'Learner', plan: 'Family', time: '2 min ago', emoji: '🐣' },
		{ name: 'Greenfield Academy', role: 'School', plan: 'School · 120 seats', time: '18 min ago', emoji: '🏫' },
		{ name: 'Mr. Kunle A.', role: 'Teacher', plan: 'Educator', time: '1h ago', emoji: '👨🏾‍🏫' },
		{ name: 'Mrs. Chioma N.', role: 'Parent', plan: 'Family', time: '3h ago', emoji: '👩🏾' }
	]
};

export const testimonials = [
	{
		quote: 'My daughter used to avoid maths. Now she asks to play Number Nebula before dinner — and her test scores have climbed from 54% to 81%.',
		name: 'Ngozi O.',
		role: 'Parent, Enugu',
		avatar: '👩🏾',
		stat: '+27% in 6 weeks'
	},
	{
		quote: 'I can see exactly which learners are stuck before the exam. The mastery dashboard saves me hours of marking and guessing.',
		name: 'Mr. Emeka Obi',
		role: 'JSS Teacher, Lagos',
		avatar: '👨🏾‍🏫',
		stat: '32 learners tracked'
	},
	{
		quote: 'The stories feel like home. I learned about fractions with suya and now I actually remember.',
		name: 'Tunde A.',
		role: 'Primary 5 learner',
		avatar: '🧒🏾',
		stat: '12-day streak'
	}
];

export const faqs = [
	{
		q: 'Is Sabify aligned to the Nigerian curriculum?',
		a: 'Yes. Core pathways are mapped to NERDC learning objectives for Primary and JSS, with WAEC/JAMB-style practice for senior learners. You can also switch to Common Core, UK National, Cambridge or IB alignment from your profile.'
	},
	{
		q: 'What does ₦5,000 per month include?',
		a: 'One learner profile gets unlimited lessons, all seven learning games, daily quizzes, the AI study buddy, offline-friendly resources and weekly progress reports. The Family plan covers up to four learners for ₦12,000 per month. Schools get seat-based pricing.'
	},
	{
		q: 'Can my child use it on a phone?',
		a: 'Sabify is built mobile-first and installs like an app. Lessons and the three most popular games work offline after the first visit, so learning continues even when data runs out.'
	},
	{
		q: 'Is it safe for children?',
		a: 'Yes. There are no open chat rooms with strangers, AI conversations are filtered for age-appropriateness, and parents can set daily time limits and view activity reports. We collect the minimum data needed to personalise learning.'
	},
	{
		q: 'How do teachers use it?',
		a: 'Teachers create a class, invite learners with a join code, assign lessons or quizzes, and see mastery, accuracy and risk alerts in one dashboard. Content Studio lets them build their own quizzes and game challenges.'
	},
	{
		q: 'Can I cancel anytime?',
		a: 'Yes. The subscription renews monthly and you can cancel from Settings → Subscription. Your progress stays saved on the free plan.'
	}
];

export const pricingPlans = [
	{
		id: 'free',
		name: 'Explorer',
		price: 0,
		cadence: 'forever',
		description: 'Try the universe with no card needed.',
		features: ['1 learner profile', '2 lessons per week', '2 learning games', 'Daily streak & XP', 'Community leaderboard'],
		cta: 'Start free',
		highlight: false
	},
	{
		id: 'family',
		name: 'Family',
		price: 5000,
		cadence: 'per month',
		description: 'Everything a curious learner needs, all month.',
		features: ['1 learner profile included', 'Unlimited lessons & all 7 games', 'AI study buddy', 'Daily quizzes & exam practice', 'Weekly parent report', 'Offline mode & mobile app', 'Cancel anytime'],
		cta: 'Choose Family',
		highlight: true
	},
	{
		id: 'family-plus',
		name: 'Family Plus',
		price: 12000,
		cadence: 'per month',
		description: 'Up to 4 learners under one roof.',
		features: ['Up to 4 learner profiles', 'Everything in Family', 'Parent controls & screen-time limits', 'Sibling leaderboards', 'Priority support'],
		cta: 'Choose Family Plus',
		highlight: false
	},
	{
		id: 'school',
		name: 'School',
		price: 3500,
		cadence: 'per learner / month',
		description: 'For classrooms that want real insight.',
		features: ['Teacher dashboard & class analytics', 'Assignments & Content Studio', 'Curriculum mapping', 'Risk alerts & reports', 'SSO-ready admin console', 'Dedicated onboarding'],
		cta: 'Talk to us',
		highlight: false
	}
];
