export type Difficulty = 'Starter' | 'Explorer' | 'Champion';
export type QuestionType = 'choice' | 'number' | 'truefalse' | 'order' | 'match' | 'text';

export interface Question {
	id: string;
	type: QuestionType;
	prompt: string;
	options?: string[];
	answer: string;
	explanation: string;
	hint?: string;
	skill: string;
	xp: number;
	difficulty: Difficulty;
	pairs?: { left: string; right: string }[];
}

export type CardKind =
	| 'read'
	| 'tip'
	| 'example'
	| 'vocab'
	| 'reflect'
	| 'steps'
	| 'didyouknow';

export interface LearningCard {
	kind: CardKind;
	title?: string;
	body: string;
	bullets?: string[];
	quote?: string;
}

export interface Lesson {
	id: string;
	slug: string;
	title: string;
	summary: string;
	objective: string;
	minutes: number;
	xp: number;
	level: Difficulty;
	cards: LearningCard[];
	questions: Question[];
}

export interface CourseModule {
	id: string;
	title: string;
	summary: string;
	emoji: string;
	lessons: Lesson[];
}

export interface Course {
	id: string;
	slug: string;
	subjectId: string;
	title: string;
	summary: string;
	description: string;
	emoji: string;
	gradient: string;
	level: Difficulty;
	ages: string;
	hours: number;
	xp: number;
	curriculum: string[];
	skills: string[];
	modules: CourseModule[];
	featured?: boolean;
}

export interface Subject {
	id: string;
	slug: string;
	name: string;
	short: string;
	tagline: string;
	description: string;
	emoji: string;
	color: string;
	tint: string;
	soft: string;
	skills: string[];
	curricula: string[];
	stat: string;
}

export interface CurriculumFramework {
	id: string;
	name: string;
	country: string;
	flag: string;
	description: string;
	subjects: string[];
}
