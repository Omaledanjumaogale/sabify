import { allQuestions } from './curriculum';
import type { Difficulty, Question } from './types';

export interface GameMeta {
	id: string;
	slug: string;
	name: string;
	tagline: string;
	description: string;
	emoji: string;
	gradient: string;
	accent: string;
	skill: string;
	players: string;
	minutes: number;
	xp: number;
	difficulty: Difficulty;
	controls: string;
	howTo: string[];
	featured?: boolean;
}

export const games: GameMeta[] = [
	{
		id: 'number-nebula',
		slug: 'number-nebula',
		name: 'Number Nebula',
		tagline: 'Pilot a starship with maths.',
		description:
			'Fly through a 3D asteroid field. Solve maths questions to charge your ship, collect star crystals and keep your combo alive.',
		emoji: '🚀',
		gradient: 'from-[#0b2b1f] via-[#123f2e] to-[#1d5c44]',
		accent: '#c9f26b',
		skill: 'Maths fluency',
		players: '1 player',
		minutes: 4,
		xp: 150,
		difficulty: 'Starter',
		controls: 'Tap or click an answer',
		howTo: [
			'Read the question on the ship dashboard.',
			'Choose the correct answer to charge the thrusters.',
			'Every correct answer collects a crystal and builds your combo.',
			'Three wrong answers end the mission — take your time!'
		],
		featured: true
	},
	{
		id: 'word-forge',
		slug: 'word-forge',
		name: 'Word Forge',
		tagline: 'Forge words from scrambled letters.',
		description:
			'Unscramble letters, beat the timer and learn a new word with every round. Clues help when you get stuck.',
		emoji: '🔨',
		gradient: 'from-[#ff8f7a] to-[#ffc53d]',
		accent: '#7a2a17',
		skill: 'Vocabulary & spelling',
		players: '1 player',
		minutes: 3,
		xp: 120,
		difficulty: 'Explorer',
		controls: 'Tap letters or type your answer',
		howTo: [
			'Look at the scrambled letters.',
			'Use the clue to work out the word.',
			'Tap the letters in order, or type the word and press Enter.',
			'Faster answers earn bonus XP.'
		],
		featured: true
	},
	{
		id: 'type-storm',
		slug: 'type-storm',
		name: 'Type Storm',
		tagline: 'Out-type the storm.',
		description:
			'Practice touch typing with Nigerian stories and science facts. Track words per minute, accuracy and your personal best.',
		emoji: '⌨️',
		gradient: 'from-[#59c8f5] to-[#7c6cf6]',
		accent: '#062a3a',
		skill: 'Typing & focus',
		players: '1 player',
		minutes: 2,
		xp: 100,
		difficulty: 'Starter',
		controls: 'Type on your keyboard',
		howTo: [
			'Choose a passage that interests you.',
			'Start typing when the timer begins.',
			'Mistakes are highlighted in red — accuracy matters more than speed.',
			'Finish the passage to set a score on the leaderboard.'
		]
	},
	{
		id: 'memory-match',
		slug: 'memory-match',
		name: 'Memory Match',
		tagline: 'Pair ideas. Train your brain.',
		description:
			'Flip cards to match terms with meanings. Fewer moves and faster times earn more XP.',
		emoji: '🧠',
		gradient: 'from-[#c9f26b] to-[#83e0b0]',
		accent: '#0d3b2a',
		skill: 'Memory & concepts',
		players: '1–2 players',
		minutes: 3,
		xp: 110,
		difficulty: 'Starter',
		controls: 'Tap cards to flip',
		howTo: [
			'Pick a deck: Science, English, Money or Coding.',
			'Tap two cards to reveal them.',
			'If they match, they stay open and you score.',
			'Remember card positions to beat your best time.'
		]
	},
	{
		id: 'quiz-arena',
		slug: 'quiz-arena',
		name: 'Quiz Arena',
		tagline: 'Race Sabi Bot to the buzzer.',
		description:
			'Fast-paced quiz battles across every subject. Answer quickly, build streaks and climb the arena ranks.',
		emoji: '⚔️',
		gradient: 'from-[#7c6cf6] to-[#ff6b5e]',
		accent: '#fff',
		skill: 'Mixed revision',
		players: '1 player vs bot',
		minutes: 3,
		xp: 160,
		difficulty: 'Explorer',
		controls: 'Tap an answer',
		howTo: [
			'Five questions, one opponent: Sabi Bot.',
			'You have 12 seconds per question.',
			'Correct answers score points; streaks earn bonus points.',
			'Beat Sabi Bot to win the arena crown.'
		],
		featured: true
	},
	{
		id: 'logic-lab',
		slug: 'logic-lab',
		name: 'Logic Lab',
		tagline: 'Crack the pattern.',
		description:
			'Number and shape sequences that stretch your reasoning. Find the rule, choose the next term and explain your thinking.',
		emoji: '🧩',
		gradient: 'from-[#ffd166] to-[#ff9b8f]',
		accent: '#4a2500',
		skill: 'Logic & reasoning',
		players: '1 player',
		minutes: 4,
		xp: 130,
		difficulty: 'Champion',
		controls: 'Tap the answer',
		howTo: [
			'Study the sequence carefully.',
			'Look for adding, subtracting, multiplying or alternating patterns.',
			'Choose the next term.',
			'Use the hint if you are stuck — it costs a little XP.'
		]
	},
	{
		id: 'money-quest',
		slug: 'money-quest',
		name: 'Money Quest',
		tagline: 'Grow ₦5,000 into a smarter future.',
		description:
			'Make real-life money choices in Naira. Budget, save and invest across a virtual month while handling surprises.',
		emoji: '💰',
		gradient: 'from-[#ffc53d] to-[#c9f26b]',
		accent: '#3b2a00',
		skill: 'Financial literacy',
		players: '1 player',
		minutes: 5,
		xp: 140,
		difficulty: 'Explorer',
		controls: 'Tap a choice',
		howTo: [
			'You start with ₦5,000 and a monthly goal.',
			'Each scene asks you to make a spending or saving choice.',
			'Every choice changes your balance and your “future score”.',
			'Reach the end of the month with savings and a positive score.'
		]
	}
];

export const vocabWords = [
	{ word: 'curious', clue: 'Wanting to know or learn something.', hint: 'Starts with C, 7 letters.' },
	{ word: 'enormous', clue: 'Very, very big.', hint: 'Starts with E, 8 letters.' },
	{ word: 'brave', clue: 'Ready to face danger or fear.', hint: 'Starts with B, 5 letters.' },
	{ word: 'grateful', clue: 'Feeling thankful.', hint: 'Starts with G, 8 letters.' },
	{ word: 'ancient', clue: 'Very old; from long ago.', hint: 'Starts with A, 7 letters.' },
	{ word: 'vibrant', clue: 'Full of energy and bright colour.', hint: 'Starts with V, 7 letters.' },
	{ word: 'diligent', clue: 'Working hard and carefully.', hint: 'Starts with D, 8 letters.' },
	{ word: 'empathy', clue: 'Understanding how someone else feels.', hint: 'Starts with E, 7 letters.' },
	{ word: 'resilient', clue: 'Able to bounce back after difficulty.', hint: 'Starts with R, 9 letters.' },
	{ word: 'inventive', clue: 'Good at creating new ideas.', hint: 'Starts with I, 9 letters.' },
	{ word: 'generous', clue: 'Happy to give and share.', hint: 'Starts with G, 8 letters.' },
	{ word: 'patient', clue: 'Able to wait calmly.', hint: 'Starts with P, 7 letters.' },
	{ word: 'observe', clue: 'To watch something carefully.', hint: 'Starts with O, 7 letters.' },
	{ word: 'predict', clue: 'To say what might happen next.', hint: 'Starts with P, 7 letters.' },
	{ word: 'compare', clue: 'To look at how things are alike and different.', hint: 'Starts with C, 7 letters.' },
	{ word: 'solution', clue: 'An answer to a problem.', hint: 'Starts with S, 8 letters.' },
	{ word: 'culture', clue: 'The customs, arts and ways of a group of people.', hint: 'Starts with C, 7 letters.' },
	{ word: 'harvest', clue: 'To gather crops from a farm.', hint: 'Starts with H, 7 letters.' },
	{ word: 'community', clue: 'A group of people living or working together.', hint: 'Starts with C, 9 letters.' },
	{ word: 'courage', clue: 'Strength to do something difficult or scary.', hint: 'Starts with C, 7 letters.' },
	{ word: 'imagine', clue: 'To create a picture in your mind.', hint: 'Starts with I, 7 letters.' },
	{ word: 'fraction', clue: 'A part of a whole number.', hint: 'Starts with F, 8 letters.' },
	{ word: 'gravity', clue: 'The force that pulls things toward Earth.', hint: 'Starts with G, 7 letters.' },
	{ word: 'photosynthesis', clue: 'How plants use sunlight to make food.', hint: 'Starts with P, 14 letters.' },
	{ word: 'algorithm', clue: 'A clear list of steps to solve a problem.', hint: 'Starts with A, 9 letters.' },
	{ word: 'budget', clue: 'A plan for how to spend and save money.', hint: 'Starts with B, 6 letters.' },
	{ word: 'interest', clue: 'Extra money earned on savings.', hint: 'Starts with I, 8 letters.' },
	{ word: 'citizen', clue: 'A legal member of a country.', hint: 'Starts with C, 7 letters.' },
	{ word: 'symbol', clue: 'A sign that stands for something else.', hint: 'Starts with S, 6 letters.' },
	{ word: 'rhythm', clue: 'A pattern of sounds and silences.', hint: 'Starts with R, 6 letters.' }
];

export const typingPassages = [
	{
		id: 'lagos',
		title: 'Lagos at sunrise',
		text: 'The sun rises slowly over Lagos. Fishermen pull their nets from the water while market traders arrange fresh fruit on wooden tables. The city wakes up one street at a time.'
	},
	{
		id: 'science',
		title: 'The water cycle',
		text: 'Water is always on the move. The sun heats lakes and rivers, turning water into vapour. The vapour rises, cools and forms clouds. Then rain falls and the journey begins again.'
	},
	{
		id: 'kindness',
		title: 'A small kindness',
		text: 'Amina noticed that the new student was eating alone. She carried her tray across the hall and asked if she could sit beside him. By the end of lunch, they were laughing like old friends.'
	},
	{
		id: 'code',
		title: 'Think like a computer',
		text: 'A computer follows instructions exactly. It does not guess what you meant. That is why programmers test every step and fix every mistake until the program works.'
	},
	{
		id: 'market',
		title: 'The clever trader',
		text: 'Mama Ngozi sold tomatoes, peppers and onions. She kept a small notebook and wrote down every sale. At the end of the week she knew exactly how much she had earned and where her money had gone.'
	},
	{
		id: 'space',
		title: 'Our place in space',
		text: 'Earth is the third planet from the sun. It spins once every day and travels around the sun once every year. From space, our whole world looks like a blue and green marble.'
	}
];

export const memoryDecks = [
	{
		id: 'science',
		name: 'Science',
		emoji: '🔬',
		pairs: [
			{ a: 'Gravity', b: 'Pulls objects toward Earth' },
			{ a: 'Photosynthesis', b: 'Plants make food from sunlight' },
			{ a: 'Evaporation', b: 'Liquid changes to gas' },
			{ a: 'Friction', b: 'Force that slows sliding' },
			{ a: 'Oxygen', b: 'Gas released by plants' },
			{ a: 'Condensation', b: 'Gas changes to liquid' }
		]
	},
	{
		id: 'english',
		name: 'English',
		emoji: '📚',
		pairs: [
			{ a: 'Noun', b: 'A person, place or thing' },
			{ a: 'Verb', b: 'An action or state word' },
			{ a: 'Adjective', b: 'Describes a noun' },
			{ a: 'Simile', b: 'Comparison using like or as' },
			{ a: 'Inference', b: 'A conclusion from clues' },
			{ a: 'Digraph', b: 'Two letters, one sound' }
		]
	},
	{
		id: 'money',
		name: 'Money',
		emoji: '💰',
		pairs: [
			{ a: 'Needs', b: 'Essentials for safety and health' },
			{ a: 'Wants', b: 'Nice things, not essential' },
			{ a: 'Budget', b: 'A plan for money' },
			{ a: 'Savings', b: 'Money kept for later' },
			{ a: 'Income', b: 'Money coming in' },
			{ a: 'Expense', b: 'Money going out' }
		]
	},
	{
		id: 'coding',
		name: 'Coding',
		emoji: '🤖',
		pairs: [
			{ a: 'Algorithm', b: 'Steps to solve a problem' },
			{ a: 'Loop', b: 'Repeat instructions' },
			{ a: 'Variable', b: 'A named store of data' },
			{ a: 'Condition', b: 'A true or false test' },
			{ a: 'Bug', b: 'An error in a program' },
			{ a: 'Function', b: 'Reusable block of code' }
		]
	}
];

export const logicPuzzles = [
	{
		id: 'l1',
		sequence: ['2', '4', '6', '8', '?'],
		answer: '10',
		options: ['9', '10', '12', '16'],
		rule: 'Add 2 each time.',
		difficulty: 'Starter'
	},
	{
		id: 'l2',
		sequence: ['3', '6', '12', '24', '?'],
		answer: '48',
		options: ['30', '36', '48', '60'],
		rule: 'Double each time.',
		difficulty: 'Explorer'
	},
	{
		id: 'l3',
		sequence: ['1', '4', '9', '16', '?'],
		answer: '25',
		options: ['20', '24', '25', '36'],
		rule: 'Square numbers: 1², 2², 3², 4², 5².',
		difficulty: 'Explorer'
	},
	{
		id: 'l4',
		sequence: ['2', '3', '5', '8', '13', '?'],
		answer: '21',
		options: ['18', '20', '21', '26'],
		rule: 'Add the two previous numbers (Fibonacci).',
		difficulty: 'Champion'
	},
	{
		id: 'l5',
		sequence: ['100', '90', '81', '73', '?'],
		answer: '66',
		options: ['64', '65', '66', '70'],
		rule: 'Subtract 10, then 9, then 8, then 7.',
		difficulty: 'Champion'
	},
	{
		id: 'l6',
		sequence: ['A', 'C', 'F', 'J', '?'],
		answer: 'O',
		options: ['M', 'N', 'O', 'P'],
		rule: 'Skip 1 letter, then 2, then 3, then 4: A +2 = C, +3 = F, +4 = J, +5 = O.',
		difficulty: 'Champion'
	},
	{
		id: 'l7',
		sequence: ['5', '10', '20', '40', '?'],
		answer: '80',
		options: ['60', '70', '80', '100'],
		rule: 'Double each time.',
		difficulty: 'Starter'
	},
	{
		id: 'l8',
		sequence: ['1', '1', '2', '3', '5', '8', '?'],
		answer: '13',
		options: ['11', '12', '13', '15'],
		rule: 'Fibonacci: add the two previous numbers.',
		difficulty: 'Explorer'
	}
];

export const moneyScenes = [
	{
		id: 'm1',
		month: 'Week 1',
		title: 'Your allowance arrives',
		story: 'You receive ₦5,000 for the month. Your goal is to save at least ₦1,000 and still have transport money for school.',
		options: [
			{ label: 'Save ₦1,000 first, then plan the rest', balance: -1000, savings: 1000, score: 25, feedback: 'Excellent! Paying yourself first is the strongest money habit.' },
			{ label: 'Spend ₦2,000 on a new game now', balance: -2000, savings: 0, score: -10, feedback: 'Fun, but you have not protected your savings goal. Plan first, play later.' },
			{ label: 'Keep all ₦5,000 in your pocket', balance: 0, savings: 0, score: 0, feedback: 'Keeping cash is not the same as saving. Move it somewhere separate.' }
		]
	},
	{
		id: 'm2',
		month: 'Week 1',
		title: 'Lunch temptation',
		story: 'You forgot your lunch. A small meal costs ₦500; a large combo costs ₦1,200. You still need ₦600 for transport.',
		options: [
			{ label: 'Buy the ₦500 meal and keep ₦600 for transport', balance: -500, savings: 0, score: 20, feedback: 'Smart. You met the need and protected your transport money.' },
			{ label: 'Buy the ₦1,200 combo', balance: -1200, savings: 0, score: -15, feedback: 'The combo leaves you short for transport. Wants should not crowd out needs.' },
			{ label: 'Skip lunch and save the money', balance: 0, savings: 0, score: -20, feedback: 'Saving is good, but skipping meals harms your health. Food is a need.' }
		]
	},
	{
		id: 'm3',
		month: 'Week 2',
		title: 'A small hustle',
		story: 'Your neighbour needs help washing a car and will pay ₦1,500. It will take two hours.',
		options: [
			{ label: 'Take the job and save ₦1,000 of it', balance: 1500, savings: 1000, score: 30, feedback: 'Great! You increased income and still protected your savings goal.' },
			{ label: 'Take the job and spend all of it', balance: 1500, savings: 0, score: 5, feedback: 'Good income, but no savings. Keep a share for your future self.' },
			{ label: 'Decline because it is not fun', balance: 0, savings: 0, score: -5, feedback: 'Not every opportunity is fun, but this one was low-risk and paid fairly.' }
		]
	},
	{
		id: 'm4',
		month: 'Week 3',
		title: 'Data emergency',
		story: 'You need data for an online assignment. A 2GB bundle costs ₦800; a 10GB bundle costs ₦2,500. School Wi-Fi is unreliable.',
		options: [
			{ label: 'Buy the 2GB bundle for schoolwork', balance: -800, savings: 0, score: 20, feedback: 'Reasonable. Match the purchase to the need instead of over-buying.' },
			{ label: 'Buy the 10GB bundle for entertainment', balance: -2500, savings: 0, score: -20, feedback: 'That is a large want disguised as a need. Protect your budget.' },
			{ label: 'Wait and use the school library computer', balance: 0, savings: 0, score: 15, feedback: 'A free, sensible alternative. Use resources before spending.' }
		]
	},
	{
		id: 'm5',
		month: 'Week 4',
		title: 'End-of-month review',
		story: 'You have ₦1,000 in savings and ₦700 left. Your friend invites you to a movie that costs ₦700.',
		options: [
			{ label: 'Skip the movie and keep your buffer', balance: 0, savings: 0, score: 20, feedback: 'You protected your emergency buffer. There will be other movies.' },
			{ label: 'Go, but set a ₦300 cap and save the rest', balance: -300, savings: 0, score: 10, feedback: 'Balanced choice. You enjoyed yourself without spending everything.' },
			{ label: 'Spend all ₦700 and borrow for transport', balance: -700, savings: 0, score: -25, feedback: 'Borrowing for entertainment starts a cycle. Avoid it when you can.' }
		]
	}
];

/* ------------------------- generators ------------------------- */

function rand(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function makeMathQuestion(level: number): {
	prompt: string;
	answer: string;
	options: string[];
	explanation: string;
} {
	const ops = level < 3 ? ['+', '−'] : level < 6 ? ['+', '−', '×'] : ['+', '−', '×', '÷'];
	const op = ops[rand(0, ops.length - 1)];
	let a: number, b: number, answer: number, prompt: string;
	if (op === '+') {
		a = rand(5, 20 + level * 9);
		b = rand(3, 15 + level * 7);
		answer = a + b;
		prompt = `${a} + ${b}`;
	} else if (op === '−') {
		a = rand(10, 30 + level * 8);
		b = rand(2, a - 1);
		answer = a - b;
		prompt = `${a} − ${b}`;
	} else if (op === '×') {
		a = rand(2, 6 + Math.min(6, level));
		b = rand(2, 6 + Math.min(5, level));
		answer = a * b;
		prompt = `${a} × ${b}`;
	} else {
		b = rand(2, 6 + Math.min(6, level));
		answer = rand(2, 8 + Math.min(6, level));
		a = b * answer;
		prompt = `${a} ÷ ${b}`;
	}
	const options = new Set<number>([answer]);
	while (options.size < 4) {
		const offset = rand(-Math.max(3, Math.round(answer * 0.25)), Math.max(3, Math.round(answer * 0.25)));
		const candidate = answer + offset;
		if (candidate > 0 && candidate !== answer) options.add(candidate);
	}
	const shuffled = [...options].sort(() => Math.random() - 0.5).map(String);
	return {
		prompt,
		answer: String(answer),
		options: shuffled,
		explanation: `${prompt} = ${answer}.`
	};
}

export function buildDailyQuiz(seed = new Date().getDate()): Question[] {
	const pool = [...allQuestions];
	// deterministic-ish rotation by day
	const start = (seed * 7) % Math.max(1, pool.length - 6);
	return pool.slice(start, start + 6);
}

export function getGame(slug: string): GameMeta | undefined {
	return games.find((g) => g.slug === slug || g.id === slug);
}

export function shuffle<T>(arr: T[]): T[] {
	const copy = [...arr];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}
