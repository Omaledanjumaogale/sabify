import type {
	Course,
	CourseModule,
	CurriculumFramework,
	Difficulty,
	LearningCard,
	Lesson,
	Question,
	Subject
} from './types';

const read = (title: string, body: string, bullets?: string[]): LearningCard => ({
	kind: 'read',
	title,
	body,
	bullets
});
const tip = (title: string, body: string): LearningCard => ({ kind: 'tip', title, body });
const example = (title: string, body: string, bullets?: string[]): LearningCard => ({
	kind: 'example',
	title,
	body,
	bullets
});
const steps = (title: string, body: string, bullets: string[]): LearningCard => ({
	kind: 'steps',
	title,
	body,
	bullets
});
const didyouknow = (title: string, body: string): LearningCard => ({
	kind: 'didyouknow',
	title,
	body
});

const q = (
	id: string,
	prompt: string,
	options: string[],
	answer: string,
	explanation: string,
	skill: string,
	difficulty: Difficulty = 'Starter',
	hint?: string
): Question => ({
	id,
	type: 'choice',
	prompt,
	options,
	answer,
	explanation,
	skill,
	difficulty,
	xp: difficulty === 'Champion' ? 20 : difficulty === 'Explorer' ? 15 : 10,
	hint
});

const nq = (
	id: string,
	prompt: string,
	answer: string,
	explanation: string,
	skill: string,
	difficulty: Difficulty = 'Starter'
): Question => ({
	id,
	type: 'number',
	prompt,
	answer,
	explanation,
	skill,
	difficulty,
	xp: difficulty === 'Champion' ? 20 : difficulty === 'Explorer' ? 15 : 10
});

const tf = (
	id: string,
	prompt: string,
	answer: 'True' | 'False',
	explanation: string,
	skill: string,
	difficulty: Difficulty = 'Starter'
): Question => ({
	id,
	type: 'truefalse',
	prompt,
	options: ['True', 'False'],
	answer,
	explanation,
	skill,
	difficulty,
	xp: 10
});

const order = (
	id: string,
	prompt: string,
	options: string[],
	explanation: string,
	skill: string,
	difficulty: Difficulty = 'Explorer'
): Question => ({
	id,
	type: 'order',
	prompt,
	options,
	answer: options.join('|'),
	explanation,
	skill,
	difficulty,
	xp: 15
});

const match = (
	id: string,
	prompt: string,
	pairs: { left: string; right: string }[],
	explanation: string,
	skill: string,
	difficulty: Difficulty = 'Explorer'
): Question => ({
	id,
	type: 'match',
	prompt,
	pairs,
	answer: pairs.map((p) => p.left + '=' + p.right).join('|'),
	explanation,
	skill,
	difficulty,
	xp: 15
});

function lesson(
	id: string,
	title: string,
	summary: string,
	objective: string,
	cards: LearningCard[],
	questions: Question[],
	level: Difficulty = 'Starter',
	minutes = 12,
	xp = 60
): Lesson {
	return {
		id,
		slug: id,
		title,
		summary,
		objective,
		minutes,
		xp,
		level,
		cards,
		questions
	};
}

function mod(id: string, title: string, summary: string, emoji: string, lessons: Lesson[]): CourseModule {
	return { id, title, summary, emoji, lessons };
}

/* ------------------------------------------------------------------ */
/* Subjects                                                            */
/* ------------------------------------------------------------------ */

export const subjects: Subject[] = [
	{
		id: 'mathematics',
		slug: 'mathematics',
		name: 'Mathematics',
		short: 'Maths',
		tagline: 'Numbers, patterns and superpowers.',
		description:
			'Build rock-solid number sense, then level up to algebra, geometry and real-life problem solving. Every idea starts with something you can see and touch.',
		emoji: '🧮',
		color: 'text-[#256b16]',
		tint: 'from-[#e9ffc0] to-[#c9f26b]',
		soft: 'bg-[#f2fbdf]',
		skills: ['Place value', 'Operations', 'Fractions', 'Patterns', 'Algebra', 'Geometry'],
		curricula: ['NERDC', 'Common Core', 'Cambridge', 'WAEC'],
		stat: '1,240+ practice questions'
	},
	{
		id: 'english',
		slug: 'english',
		name: 'English & Literacy',
		short: 'English',
		tagline: 'Read bravely. Write boldly. Speak clearly.',
		description:
			'Phonics, vocabulary, comprehension and confident writing — taught through stories, riddles and real Nigerian voices.',
		emoji: '📚',
		color: 'text-[#9a3d17]',
		tint: 'from-[#ffe4d6] to-[#ffb59a]',
		soft: 'bg-[#fff3ec]',
		skills: ['Phonics', 'Vocabulary', 'Comprehension', 'Grammar', 'Writing', 'Speaking'],
		curricula: ['NERDC', 'Common Core', 'UK National', 'WAEC'],
		stat: '900+ words and stories'
	},
	{
		id: 'science',
		slug: 'science',
		name: 'Science',
		short: 'Science',
		tagline: 'Ask big questions. Test bold ideas.',
		description:
			'Explore living things, matter, energy and space with safe experiments you can try at home or in class.',
		emoji: '🔬',
		color: 'text-[#0a6486]',
		tint: 'from-[#dff5ff] to-[#8fdcff]',
		soft: 'bg-[#eef9ff]',
		skills: ['Living things', 'Plants', 'Forces', 'Matter', 'Space', 'Energy'],
		curricula: ['NERDC', 'Common Core', 'Cambridge', 'IB'],
		stat: '72 guided experiments'
	},
	{
		id: 'coding',
		slug: 'coding',
		name: 'Coding & Robotics',
		short: 'Coding',
		tagline: 'Think like a computer. Build like a creator.',
		description:
			'Learn algorithms, loops and logic, then build real web pages and small games with friendly, step-by-step projects.',
		emoji: '🤖',
		color: 'text-[#4b3bb5]',
		tint: 'from-[#e9e5ff] to-[#b9afff]',
		soft: 'bg-[#f3f0ff]',
		skills: ['Algorithms', 'Loops', 'Conditionals', 'Variables', 'HTML', 'CSS'],
		curricula: ['CSTA', 'Cambridge', 'NERDC'],
		stat: '48 buildable projects'
	},
	{
		id: 'digital',
		slug: 'digital',
		name: 'Digital Skills',
		short: 'Digital',
		tagline: 'Smart, safe and kind online.',
		description:
			'Grow into a confident digital citizen: protect your privacy, spot false information and use tools that help you learn.',
		emoji: '🛡️',
		color: 'text-[#9a3d17]',
		tint: 'from-[#fff0d0] to-[#ffd166]',
		soft: 'bg-[#fff8e8]',
		skills: ['Online safety', 'Passwords', 'Research', 'Digital kindness', 'AI literacy'],
		curricula: ['UNICEF Digital', 'Common Core'],
		stat: '30 real-life scenarios'
	},
	{
		id: 'money',
		slug: 'money',
		name: 'Money & Enterprise',
		short: 'Money',
		tagline: 'Small habits. Big future.',
		description:
			'Learn to save, budget and spot opportunities. Practical money skills in Naira, built for Nigerian homes and hustles.',
		emoji: '🪙',
		color: 'text-[#7a4f00]',
		tint: 'from-[#fff0b8] to-[#ffc53d]',
		soft: 'bg-[#fff9e5]',
		skills: ['Needs & wants', 'Saving', 'Budgeting', 'Interest', 'Entrepreneurship'],
		curricula: ['NERDC', 'Financial Literacy Framework'],
		stat: '₦5,000 monthly budget quests'
	},
	{
		id: 'civics',
		slug: 'civics',
		name: 'Civics & Naija History',
		short: 'Civics',
		tagline: 'Know your roots. Shape your community.',
		description:
			'Discover Nigeria’s symbols, rights, responsibilities and the everyday heroes who make communities stronger.',
		emoji: '🇳🇬',
		color: 'text-[#0b6b45]',
		tint: 'from-[#d8f7e6] to-[#83e0b0]',
		soft: 'bg-[#e9fbf1]',
		skills: ['National symbols', 'Constitution', 'Rights', 'Community', 'Leadership'],
		curricula: ['NERDC', 'Civic Education'],
		stat: '36 history stories'
	},
	{
		id: 'arts',
		slug: 'arts',
		name: 'Arts & Creativity',
		short: 'Arts',
		tagline: 'Imagine it. Make it. Share it.',
		description:
			'Colour, drawing, rhythm and storytelling — creative confidence for every learner, no expensive materials needed.',
		emoji: '🎨',
		color: 'text-[#a83227]',
		tint: 'from-[#ffe3df] to-[#ff9b8f]',
		soft: 'bg-[#fff1ef]',
		skills: ['Colour', 'Drawing', 'Rhythm', 'Storytelling', 'Design thinking'],
		curricula: ['NERDC', 'IB', 'Cambridge'],
		stat: '40 creative challenges'
	}
];

/* ------------------------------------------------------------------ */
/* Mathematics                                                         */
/* ------------------------------------------------------------------ */

const numberNinjas: Course = {
	id: 'number-ninjas',
	slug: 'number-ninjas',
	subjectId: 'mathematics',
	title: 'Number Ninjas',
	summary: 'Master place value, addition and fractions through quick, playful missions.',
	description:
		'A foundational maths quest for ages 7–11. Learners build number confidence with visual models, story problems and instant feedback.',
	emoji: '🥷',
	gradient: 'from-[#e9ffc0] via-[#d9f99d] to-[#bef264]',
	level: 'Starter',
	ages: '7–11',
	hours: 3,
	xp: 720,
	curriculum: ['NERDC Primary 3–5', 'Common Core 3–5', 'Cambridge Stage 4'],
	skills: ['Place value', 'Addition', 'Subtraction', 'Fractions'],
	featured: true,
	modules: [
		mod('nn-1', 'Number sense', 'Digits, place value and friendly number facts.', '🔢', [
			lesson(
				'math-place-value',
				'Place Value Party',
				'Every digit has a home — and its home changes its value.',
				'Read, write and compare numbers up to 10,000.',
				[
					read(
						'Every digit has a home',
						'In our number system, the position of a digit tells you how much it is worth. We call these positions **place values**.',
						[
							'Thousands, hundreds, tens and ones',
							'Moving one place to the left makes a digit 10 times bigger',
							'Zero is a very important placeholder'
						]
					),
					example(
						'Break 4,582 apart',
						'4,582 means 4 thousands + 5 hundreds + 8 tens + 2 ones.',
						['4,000 + 500 + 80 + 2 = 4,582', 'The 5 is worth 500', 'The 8 is worth 80']
					),
					tip(
						'Zero has a job',
						'In 7,406 the zero tells us there are no tens. Without it, 7,46 would be a totally different number!'
					)
				],
				[
					q(
						'math-pv-1',
						'In 7,406, what is the value of the digit 4?',
						['4', '40', '400', '4,000'],
						'400',
						'The 4 sits in the hundreds place, so it is worth 4 × 100 = 400.',
						'Place value'
					),
					nq(
						'math-pv-2',
						'Write 3,000 + 200 + 50 + 6 as one number.',
						'3256',
						'3,000 + 200 + 50 + 6 = 3,256.',
						'Place value'
					),
					q(
						'math-pv-3',
						'Which number has an 8 in the hundreds place?',
						['3,842', '8,342', '4,283', '2,483'],
						'3,842',
						'In 3,842 the 8 is in the hundreds column. In 8,342 it is thousands; in 4,283 it is tens.',
						'Place value',
						'Explorer'
					)
				]
			),
			lesson(
				'math-addition',
				'Addition Adventure',
				'Add big numbers by regrouping — no magic tricks needed.',
				'Add 2- and 3-digit numbers with regrouping.',
				[
					read(
						'Regrouping is trading',
						'When a column adds to 10 or more, we **trade 10 ones for 1 ten** and carry it to the next column.',
						[
							'Line up digits by place value',
							'Add the ones first',
							'Carry any group of ten to the left'
						]
					),
					steps('47 + 38', 'Let’s work it column by column.', [
						'7 + 8 = 15 → write 5, carry 1 ten',
						'4 + 3 + 1 carried = 8 tens',
						'Answer: 85'
					]),
					example(
						'Real-life story',
						'Ada sold 248 oranges on Monday and 137 on Tuesday. How many oranges in total?',
						['248 + 137 = 385', 'The answer is 385 oranges']
					)
				],
				[
					nq('math-add-1', '248 + 137 = ?', '385', '8+7=15 carry 1; 4+3+1=8; 2+1=3. Answer 385.', 'Addition'),
					nq('math-add-2', '56 + 29 = ?', '85', '6+9=15 carry 1; 5+2+1=8. Answer 85.', 'Addition'),
					q(
						'math-add-3',
						'A trader had ₦450 and earned ₦275 more. How much does she have now?',
						['₦625', '₦725', '₦675', '₦525'],
						'₦725',
						'450 + 275 = 725. Regroup the ones: 0+5=5, 5+7=12 carry 1, 4+2+1=7.',
						'Addition',
						'Explorer'
					)
				]
			)
		]),
		mod('nn-2', 'Fractions & fluency', 'Share fairly and see fractions everywhere.', '🍕', [
			lesson(
				'math-fractions',
				'Fraction Friends',
				'Fractions describe equal parts of a whole.',
				'Identify, compare and find equivalent fractions.',
				[
					read(
						'Numerator and denominator',
						'The **denominator** (bottom) tells how many equal parts the whole is cut into. The **numerator** (top) tells how many parts you have.',
						['1/2 means 1 part out of 2 equal parts', '2/4 is the same as 1/2', 'The bigger the denominator, the smaller each part']
					),
					example(
						'Pizza proof',
						'Eat 2 slices of a pizza cut into 8 equal slices. You ate 2/8. That is the same as 1/4.',
						['2/8 = 1/4', 'Divide top and bottom by 2', 'Equivalent fractions describe the same amount']
					),
					tip('Compare carefully', '1/3 is bigger than 1/4 even though 4 is bigger than 3. More cuts means smaller slices!')
				],
				[
					q(
						'math-fr-1',
						'Which fraction is equivalent to 1/2?',
						['2/4', '2/3', '1/4', '3/5'],
						'2/4',
						'Multiply the numerator and denominator of 1/2 by 2: 1×2 / 2×2 = 2/4.',
						'Fractions'
					),
					q(
						'math-fr-2',
						'Which is larger: 1/3 or 1/5?',
						['1/3', '1/5', 'They are equal', 'Cannot tell'],
						'1/3',
						'Thirds are bigger slices than fifths, so 1/3 is larger than 1/5.',
						'Fractions',
						'Explorer'
					),
					q(
						'math-fr-3',
						'A garden has 12 equal beds. 3 beds grow tomatoes. What fraction is that?',
						['1/4', '1/3', '3/4', '1/2'],
						'1/4',
						'3 out of 12 = 3/12. Divide both by 3 to get 1/4.',
						'Fractions',
						'Champion'
					)
				]
			)
		])
	]
};

const algebraExplorers: Course = {
	id: 'algebra-explorers',
	slug: 'algebra-explorers',
	subjectId: 'mathematics',
	title: 'Algebra Explorers',
	summary: 'Turn mystery numbers into equations you can solve with confidence.',
	description:
		'A gentle introduction to patterns, expressions and equations for upper primary and JSS learners.',
	emoji: '🧭',
	gradient: 'from-[#d8f7e6] to-[#7ee0a8]',
	level: 'Explorer',
	ages: '11–14',
	hours: 4,
	xp: 900,
	curriculum: ['NERDC JSS 1–2', 'Common Core 6–7', 'Cambridge Stage 6'],
	skills: ['Patterns', 'Expressions', 'Equations', 'Reasoning'],
	modules: [
		mod('ae-1', 'Patterns & expressions', 'Find the rule and write it with letters.', '🔎', [
			lesson(
				'math-patterns',
				'Pattern Power',
				'Spot the rule, predict the next term and describe it algebraically.',
				'Continue sequences and describe simple rules.',
				[
					read(
						'Rules are everywhere',
						'A sequence follows a rule. If you can say the rule in words, you can predict any term.',
						['2, 4, 6, 8… adds 2 each time', '3, 6, 12, 24… doubles each time', 'The position number can be used in the rule']
					),
					example('Find the 10th term', 'For 2, 4, 6, 8… the rule is 2 × position. So term 10 = 20.', [
						'Term 1 = 2 × 1',
						'Term 5 = 2 × 5 = 10',
						'Term n = 2n'
					])
				],
				[
					nq('math-pat-1', 'What comes next: 3, 6, 12, 24, …?', '48', 'Each term doubles: 24 × 2 = 48.', 'Patterns'),
					q(
						'math-pat-2',
						'Which rule fits 5, 10, 15, 20…?',
						['Add 5', 'Multiply by 2', 'Add 10', 'Multiply by 5'],
						'Add 5',
						'The numbers increase by 5 each time, so the rule is add 5 (or 5n).',
						'Patterns',
						'Explorer'
					),
					nq('math-pat-3', 'Using the rule 4n, what is the 7th term?', '28', '4 × 7 = 28.', 'Patterns', 'Explorer')
				]
			),
			lesson(
				'math-expressions',
				'Expression Lab',
				'Letters stand in for unknown numbers.',
				'Substitute values into simple expressions.',
				[
					read(
						'Letters are mystery boxes',
						'In 3x + 2, the letter x is a mystery number. If we know x, we can work out the value.',
						['3x means 3 × x', 'Follow order of operations', 'Replace the letter with its value in brackets']
					),
					example('Evaluate 3x + 2 when x = 4', '3 × 4 + 2 = 12 + 2 = 14.', ['Substitute: 3(4) + 2', 'Multiply first', 'Add last'])
				],
				[
					nq('math-exp-1', 'If x = 5, what is 2x + 3?', '13', '2 × 5 + 3 = 10 + 3 = 13.', 'Expressions'),
					nq('math-exp-2', 'If y = 6, what is 4y − 5?', '19', '4 × 6 − 5 = 24 − 5 = 19.', 'Expressions', 'Explorer'),
					q(
						'math-exp-3',
						'Which expression means “add 7 to a number n”?',
						['n + 7', '7n', 'n − 7', 'n ÷ 7'],
						'n + 7',
						'“Add 7” means plus 7, so the expression is n + 7.',
						'Expressions',
						'Explorer'
					)
				]
			)
		]),
		mod('ae-2', 'Equations', 'Balance both sides and find the mystery number.', '⚖️', [
			lesson(
				'math-equations',
				'Equation Quest',
				'Keep the equation balanced by doing the same thing to both sides.',
				'Solve one-step and two-step equations.',
				[
					read(
						'Think of a balance scale',
						'An equation says two sides are equal. To keep it balanced, whatever you do to one side you must do to the other.',
						['x + 7 = 15 → subtract 7 from both sides', '2x = 18 → divide both sides by 2', 'Check by substituting your answer']
					),
					steps('Solve 3x − 4 = 11', 'Undo operations in reverse order.', [
						'Add 4 to both sides: 3x = 15',
						'Divide both sides by 3: x = 5',
						'Check: 3(5) − 4 = 11 ✔'
					])
				],
				[
					nq('math-eq-1', 'Solve x + 7 = 15.', '8', 'Subtract 7 from both sides: x = 8.', 'Equations'),
					nq('math-eq-2', 'Solve 2x = 18.', '9', 'Divide both sides by 2: x = 9.', 'Equations', 'Explorer'),
					nq('math-eq-3', 'Solve 3x − 4 = 11.', '5', 'Add 4: 3x = 15, then divide by 3: x = 5.', 'Equations', 'Champion')
				]
			)
		])
	]
};

/* ------------------------------------------------------------------ */
/* English                                                             */
/* ------------------------------------------------------------------ */

const wordWizards: Course = {
	id: 'word-wizards',
	slug: 'word-wizards',
	subjectId: 'english',
	title: 'Word Wizards',
	summary: 'Crack the code of sounds, meanings and hidden clues in text.',
	description:
		'Build fluent reading with phonics, context clues and comprehension strategies. Perfect for primary learners and anyone rebuilding reading confidence.',
	emoji: '🪄',
	gradient: 'from-[#ffe4d6] to-[#ffb59a]',
	level: 'Starter',
	ages: '6–10',
	hours: 3,
	xp: 700,
	curriculum: ['NERDC Primary', 'UK National Phonics', 'Common Core'],
	skills: ['Phonics', 'Vocabulary', 'Comprehension', 'Inference'],
	featured: true,
	modules: [
		mod('ww-1', 'Sounds & clues', 'Blend sounds and use clues to unlock meaning.', '🔤', [
			lesson(
				'eng-phonics',
				'Sound Starters',
				'Two letters can team up to make one new sound.',
				'Recognise common digraphs and blends.',
				[
					read(
						'Digraph teams',
						'A **digraph** is two letters that make one sound, like **sh** in ship or **ch** in chair.',
						['sh — ship, shop, fish', 'ch — chair, lunch, teacher', 'th — this, think, bath', 'ng — ring, song, king']
					),
					tip('Blend, don’t guess', 'Say each sound, then slide them together: /sh/ + /i/ + /p/ → ship.')
				],
				[
					q(
						'eng-ph-1',
						'Which word begins with the /sh/ sound?',
						['Ship', 'Chip', 'Trip', 'Zip'],
						'Ship',
						'Ship starts with the digraph sh, which makes the /sh/ sound.',
						'Phonics'
					),
					q(
						'eng-ph-2',
						'Which pair of letters is a digraph?',
						['ch', 'st', 'bl', 'gr'],
						'ch',
						'ch is a digraph: two letters making one sound. st, bl and gr are blends where both sounds are heard.',
						'Phonics',
						'Explorer'
					),
					q(
						'eng-ph-3',
						'Which word rhymes with “light”?',
						['Night', 'Laugh', 'Lion', 'Little'],
						'Night',
						'Night and light share the same ending sound, -ight.',
						'Phonics'
					)
				]
			),
			lesson(
				'eng-context',
				'Context Clue Detectives',
				'Use the words around an unknown word to work out its meaning.',
				'Use context clues to infer word meaning.',
				[
					read(
						'Be a word detective',
						'When you meet a new word, look for clues: a definition, an example, a contrast or a word that means the same thing.',
						['“The enormous elephant…” — enormous must mean very big', '“Unlike her cheerful brother, Ada was gloomy.” — gloomy is the opposite of cheerful', '“Canines, such as dogs and wolves…” — canines are dog-like animals']
					),
					example(
						'Clue hunt',
						'The soup was **scalding**, so Tunde waited before tasting it.',
						['Clue: he had to wait before tasting', 'Meaning: very hot', 'Strategy: cause and effect clue']
					)
				],
				[
					q(
						'eng-cc-1',
						'The path was **treacherous**, so we walked slowly and held the rope. What does treacherous mean?',
						['Dangerous', 'Short', 'Beautiful', 'Boring'],
						'Dangerous',
						'Walking slowly and holding a rope suggests the path was unsafe or dangerous.',
						'Context clues'
					),
					q(
						'eng-cc-2',
						'“Unlike the noisy market, the library was **serene**.” What does serene mean?',
						['Calm', 'Crowded', 'Colourful', 'Smelly'],
						'Calm',
						'The contrast with “noisy market” tells us serene means quiet and calm.',
						'Context clues',
						'Explorer'
					),
					q(
						'eng-cc-3',
						'“The **fragile** glass broke when it fell.” Fragile most likely means —',
						['Easily broken', 'Very heavy', 'Brand new', 'Made of metal'],
						'Easily broken',
						'It broke when it fell, so fragile means easily broken.',
						'Context clues'
					)
				]
			)
		]),
		mod('ww-2', 'Reading for meaning', 'Find the big idea and read between the lines.', '📖', [
			lesson(
				'eng-comprehension',
				'Reading Between the Lines',
				'Good readers ask questions, find evidence and make inferences.',
				'Answer inference questions using evidence from a text.',
				[
					read(
						'Inference = clue + thinking',
						'An inference is a smart guess based on evidence. The answer is not always written in one sentence — you have to connect the clues.',
						['Find the evidence first', 'Ask: what does this tell me?', 'Use “because” to explain your thinking']
					),
					example(
						'Mini story',
						'Musa grabbed his umbrella and rushed out. Dark clouds covered the sky.',
						['Clue: umbrella + dark clouds', 'Inference: it is likely to rain', 'Evidence: “rushed out” suggests he wanted to beat the rain']
					)
				],
				[
					q(
						'eng-co-1',
						'“Musa grabbed his umbrella and rushed out. Dark clouds covered the sky.” What will probably happen?',
						['It will rain', 'It will snow', 'The sun will shine', 'Musa will sleep'],
						'It will rain',
						'Dark clouds and an umbrella are clues that rain is coming.',
						'Inference'
					),
					q(
						'eng-co-2',
						'What is the best evidence that Musa was in a hurry?',
						['He grabbed his umbrella', 'He rushed out', 'Dark clouds covered the sky', 'He owns an umbrella'],
						'He rushed out',
						'“Rushed out” directly shows speed and hurry.',
						'Comprehension',
						'Explorer'
					),
					q(
						'eng-co-3',
						'Which question can be answered directly from the text?',
						['Why was Musa sad?', 'What did Musa grab?', 'Where does Musa live?', 'Who is Musa’s friend?'],
						'What did Musa grab?',
						'The text says he grabbed his umbrella. The other details are not given.',
						'Comprehension',
						'Explorer'
					)
				]
			)
		])
	]
};

const storyCrafters: Course = {
	id: 'story-crafters',
	slug: 'story-crafters',
	subjectId: 'english',
	title: 'Story Crafters',
	summary: 'Build stories with structure, sensory detail and voices that feel real.',
	description:
		'A creative writing studio for ages 9–14. Learners plan, draft and polish short stories using proven story shapes.',
	emoji: '✍️',
	gradient: 'from-[#fff0d0] to-[#ffd166]',
	level: 'Explorer',
	ages: '9–14',
	hours: 4,
	xp: 880,
	curriculum: ['NERDC Upper Primary', 'UK National', 'Common Core Writing'],
	skills: ['Story structure', 'Description', 'Dialogue', 'Editing'],
	modules: [
		mod('sc-1', 'Story architecture', 'Give your story a strong spine.', '🏔️', [
			lesson(
				'eng-story-mountain',
				'Story Mountain',
				'Most stories climb: setup, problem, climb, climax, resolution.',
				'Plan a story using the story mountain structure.',
				[
					read(
						'The five peaks',
						'A story mountain helps you organise events so the reader keeps turning pages.',
						['Opening — meet the character and place', 'Problem — something changes', 'Rising action — obstacles grow', 'Climax — the biggest moment', 'Resolution — how things settle']
					),
				],
				[
					order(
						'eng-sm-1',
						'Put the story mountain stages in order.',
						['Opening', 'Problem', 'Rising action', 'Climax', 'Resolution'],
						'Stories usually open with character and setting, introduce a problem, build tension, reach a climax, then resolve.',
						'Story structure'
					),
					q(
						'eng-sm-2',
						'Which part is the most exciting turning point?',
						['Climax', 'Opening', 'Resolution', 'Setting'],
						'Climax',
						'The climax is the peak of tension and the key turning point.',
						'Story structure'
					),
					q(
						'eng-sm-3',
						'Why do writers build rising action before the climax?',
						['To create suspense', 'To make the story shorter', 'To confuse readers', 'To add a glossary'],
						'To create suspense',
						'Obstacles and tension make the reader care about the climax.',
						'Story structure',
						'Explorer'
					)
				]
			),
			lesson(
				'eng-show-dont-tell',
				'Show, Don’t Tell',
				'Let readers feel the emotion through actions and senses.',
				'Replace telling statements with showing details.',
				[
					read(
						'Paint a picture',
						'“She was nervous” tells. “Her fingers tapped the table and she checked the clock every ten seconds” shows.',
						['Use the five senses', 'Choose precise verbs', 'Let actions reveal feelings']
					),
					example(
						'Transformation',
						'Tell: The room was messy. Show: Books leaned out of the shelf, a sock hung from the lamp, and yesterday’s rice sat cold on the desk.',
						['Concrete details', 'Specific objects', 'Reader draws the conclusion']
					)
				],
				[
					q(
						'eng-sd-1',
						'Which sentence shows rather than tells?',
						['He was tired.', 'His eyelids drooped and he yawned three times.', 'He felt sleepy.', 'Tiredness is a feeling.'],
						'His eyelids drooped and he yawned three times.',
						'The actions let us infer tiredness instead of naming it.',
						'Descriptive writing',
						'Explorer'
					),
					q(
						'eng-sd-2',
						'Which detail best shows a character is cold?',
						['She shivered and pulled her wrapper tight.', 'She was cold.', 'The weather was cold.', 'Cold is a temperature.'],
						'She shivered and pulled her wrapper tight.',
						'Physical actions show the cold without stating it.',
						'Descriptive writing'
					)
				]
			)
		]),
		mod('sc-2', 'Voice & polish', 'Make dialogue sing and editing count.', '🎙️', [
			lesson(
				'eng-dialogue',
				'Dialogue & Editing',
				'Great dialogue does two jobs: reveals character and moves the story.',
				'Punctuate dialogue correctly and edit for clarity.',
				[
					read(
						'Dialogue rules',
						'Use quotation marks around spoken words and start a new line for each speaker.',
						['“Where are we going?” asked Tola.', '“To the market,” Mama replied.', 'Punctuation goes inside the quotation marks.']
					),
					example(
						'Edit for clarity',
						'Draft: “i dont know” she said. Edit: “I don’t know,” she said.',
						['Capital I', 'Apostrophe in don’t', 'Comma before the closing quote']
					)
				],
				[
					q(
						'eng-dia-1',
						'Which sentence uses dialogue punctuation correctly?',
						['“Come here” she said.', '“Come here,” she said.', 'Come here, “she said”.', '“Come here,” She said.'],
						'“Come here,” she said.',
						'The spoken words are in quotes, with a comma before the closing quote and lowercase “she”.',
						'Dialogue'
					),
					tf(
						'eng-dia-2',
						'Each new speaker should start on a new line.',
						'True',
						'Starting a new line makes it clear who is speaking.',
						'Dialogue'
					)
				]
			)
		])
	]
};

/* ------------------------------------------------------------------ */
/* Science                                                             */
/* ------------------------------------------------------------------ */

const scienceSparks: Course = {
	id: 'science-sparks',
	slug: 'science-sparks',
	subjectId: 'science',
	title: 'Science Sparks',
	summary: 'Living things, plants and forces — explained with experiments you can try.',
	description:
		'Hands-on science for curious minds. Every lesson includes a safe observation or mini-experiment using everyday materials.',
	emoji: '⚡',
	gradient: 'from-[#dff5ff] to-[#8fdcff]',
	level: 'Starter',
	ages: '8–12',
	hours: 3,
	xp: 760,
	curriculum: ['NERDC Basic Science', 'Cambridge Stage 5', 'Common Core NGSS'],
	skills: ['Living things', 'Plants', 'Forces', 'Observation'],
	featured: true,
	modules: [
		mod('ss-1', 'Life & plants', 'What makes something alive, and how do plants eat sunlight?', '🌱', [
			lesson(
				'sci-living',
				'Living or Not?',
				'All living things share seven life processes.',
				'Use the seven life processes to classify things as living or non-living.',
				[
					read(
						'MRS GREN',
						'Scientists use seven processes to decide if something is alive: **Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition**.',
						['A car moves, but it does not grow or reproduce', 'A seed grows and responds to light', 'Fire uses oxygen but is not alive']
					),
					didyouknow(
						'Viruses are tricky',
						'Viruses can reproduce only inside a host cell. Scientists debate whether to call them fully alive — a great example of science in progress.'
					)
				],
				[
					q(
						'sci-liv-1',
						'Which of these is a life process?',
						['Respiration', 'Reflection', 'Revolution', 'Radiation'],
						'Respiration',
						'Respiration is how living things release energy from food.',
						'Living things'
					),
					tf(
						'sci-liv-2',
						'A car is a living thing because it moves.',
						'False',
						'Movement alone is not enough. A car does not grow, reproduce, excrete or need nutrition.',
						'Living things'
					),
					q(
						'sci-liv-3',
						'Which group contains only living things?',
						['Goat, mango tree, mushroom', 'Goat, rock, water', 'Mango tree, sunlight, soil', 'Mushroom, phone, ant'],
						'Goat, mango tree, mushroom',
						'All three grow, respond and reproduce. Rocks, water, sunlight and phones are non-living.',
						'Living things',
						'Explorer'
					)
				]
			),
			lesson(
				'sci-plants',
				'Plant Power',
				'Plants make their own food using sunlight, water and air.',
				'Explain photosynthesis in simple terms.',
				[
					read(
						'Photosynthesis',
						'Leaves are tiny solar kitchens. Using **sunlight**, **water** and **carbon dioxide**, plants make **glucose** (food) and release **oxygen**.',
						['Chlorophyll gives leaves their green colour', 'Roots absorb water and minerals', 'Stomata let gases in and out']
					),
					example(
						'Test it safely',
						'Place one plant in sunlight and one in a dark cupboard for a week. Compare leaf colour and growth.',
						['Keep water equal', 'Change only light', 'Record observations daily']
					)
				],
				[
					q(
						'sci-pl-1',
						'Which gas do plants release during photosynthesis?',
						['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
						'Oxygen',
						'Plants release oxygen as a by-product of making glucose.',
						'Plants'
					),
					q(
						'sci-pl-2',
						'What is the main source of energy for photosynthesis?',
						['Sunlight', 'Soil', 'Wind', 'Moonlight'],
						'Sunlight',
						'Sunlight powers the reaction inside chloroplasts.',
						'Plants'
					),
					q(
						'sci-pl-3',
						'Why are leaves usually green?',
						['They contain chlorophyll', 'They absorb green light only', 'They are painted by nature', 'They store water'],
						'They contain chlorophyll',
						'Chlorophyll reflects green light and absorbs other colours for photosynthesis.',
						'Plants',
						'Explorer'
					)
				]
			)
		]),
		mod('ss-2', 'Forces & matter', 'Push, pull, float and change state.', '🧪', [
			lesson(
				'sci-forces',
				'Forces in Action',
				'Forces are pushes or pulls that can change motion or shape.',
				'Identify contact and non-contact forces.',
				[
					read(
						'Meet the forces',
						'**Gravity** pulls objects toward Earth. **Friction** opposes motion between surfaces. **Magnetism** can pull or push without touching.',
						['Forces have size and direction', 'Balanced forces mean no change in motion', 'Unbalanced forces change speed or direction']
					),
					example(
						'Friction test',
						'Slide a book across a table, then across a mat. The mat adds friction, so the book stops sooner.',
						['Same push each time', 'Measure distance', 'More friction = shorter slide']
					)
				],
				[
					q(
						'sci-fo-1',
						'What force pulls a dropped ball toward the ground?',
						['Gravity', 'Friction', 'Magnetism', 'Tension'],
						'Gravity',
						'Gravity is the non-contact force pulling objects toward Earth.',
						'Forces'
					),
					q(
						'sci-fo-2',
						'Which force slows a sliding box?',
						['Friction', 'Gravity', 'Magnetism', 'Air pressure'],
						'Friction',
						'Friction acts between surfaces and opposes sliding motion.',
						'Forces'
					),
					tf(
						'sci-fo-3',
						'Balanced forces can still make an object speed up.',
						'False',
						'Balanced forces cancel out, so motion does not change.',
						'Forces',
						'Explorer'
					)
				]
			)
		])
	]
};

const spaceMatter: Course = {
	id: 'space-and-matter',
	slug: 'space-and-matter',
	subjectId: 'science',
	title: 'Space & Matter',
	summary: 'From the solar system to the water cycle — big systems, clear explanations.',
	description:
		'Explore planets, states of matter and Earth’s water cycle with visual models and quick checks for understanding.',
	emoji: '🪐',
	gradient: 'from-[#e9e5ff] to-[#b9afff]',
	level: 'Explorer',
	ages: '10–14',
	hours: 3,
	xp: 820,
	curriculum: ['NERDC JSS', 'Cambridge Stage 7', 'IB MYP'],
	skills: ['Solar system', 'States of matter', 'Water cycle', 'Systems thinking'],
	modules: [
		mod('sm-1', 'Space & change', 'Zoom out to space, then zoom into particles.', '🌍', [
			lesson(
				'sci-solar',
				'Solar System Tour',
				'Eight planets orbit one star — our Sun.',
				'Name and order the planets and describe key features.',
				[
					read(
						'Order from the Sun',
						'**Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.** Remember: *My Very Educated Mother Just Served Us Noodles.*',
						['Jupiter is the largest planet', 'Venus is the hottest planet', 'Earth is the only known planet with life']
					),
				],
				[
					order(
						'sci-so-1',
						'Order these planets from the Sun outward.',
						['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'],
						'These are the first five planets in order from the Sun.',
						'Solar system'
					),
					q(
						'sci-so-2',
						'Which planet is largest?',
						['Jupiter', 'Earth', 'Saturn', 'Neptune'],
						'Jupiter',
						'Jupiter is the largest planet in our solar system.',
						'Solar system'
					),
					q(
						'sci-so-3',
						'What keeps planets in orbit around the Sun?',
						['Gravity', 'Magnetism', 'Friction', 'Wind'],
						'Gravity',
						'The Sun’s gravity pulls planets into curved orbits.',
						'Solar system',
						'Explorer'
					)
				]
			),
			lesson(
				'sci-matter',
				'States of Matter',
				'Solids, liquids and gases are the same particles with different energy.',
				'Describe particle arrangement in solids, liquids and gases.',
				[
					read(
						'Particle party',
						'Particles are always moving. Add heat and they move faster; remove heat and they slow down.',
						['Solid: tightly packed, fixed shape', 'Liquid: close but flowing, fixed volume', 'Gas: far apart, fills the container']
					),
					example(
						'Water’s three looks',
						'Ice (solid) → water (liquid) → steam (gas). Melting, evaporation and freezing are changes of state, not new substances.',
						['Melting: solid → liquid', 'Evaporation: liquid → gas', 'Condensation: gas → liquid']
					)
				],
				[
					q(
						'sci-ma-1',
						'In which state are particles farthest apart?',
						['Gas', 'Liquid', 'Solid', 'All the same'],
						'Gas',
						'Gas particles are spread far apart and move quickly.',
						'States of matter'
					),
					q(
						'sci-ma-2',
						'What change is ice turning into water?',
						['Melting', 'Freezing', 'Condensation', 'Evaporation'],
						'Melting',
						'Solid ice absorbs heat and becomes liquid water.',
						'States of matter'
					),
					tf(
						'sci-ma-3',
						'Evaporation happens faster when it is hot.',
						'True',
						'Heat gives particles more energy to escape into the air.',
						'States of matter'
					)
				]
			)
		]),
		mod('sm-2', 'Earth systems', 'Follow a drop of water around the planet.', '💧', [
			lesson(
				'sci-water',
				'The Water Cycle',
				'Water moves between the ground, the air and the clouds.',
				'Explain evaporation, condensation, precipitation and collection.',
				[
					read(
						'A endless journey',
						'The Sun heats water, which **evaporates** into vapour. High in the sky it **condenses** into clouds. Then it falls as **precipitation** and **collects** in rivers, lakes and the ground.',
						['Evaporation: liquid → vapour', 'Condensation: vapour → droplets', 'Precipitation: rain, hail or snow', 'Collection: water gathers and the cycle repeats']
					),
				],
				[
					order(
						'sci-wa-1',
						'Order the water cycle stages.',
						['Evaporation', 'Condensation', 'Precipitation', 'Collection'],
						'Water evaporates, condenses into clouds, falls as rain, then collects and repeats.',
						'Water cycle'
					),
					q(
						'sci-wa-2',
						'What forms clouds?',
						['Condensation of water vapour', 'Evaporation of clouds', 'Melting of ice', 'Freezing of rain'],
						'Condensation of water vapour',
						'Vapour cools and condenses into tiny droplets that form clouds.',
						'Water cycle'
					),
					q(
						'sci-wa-3',
						'Which process returns water to the atmosphere?',
						['Evaporation', 'Collection', 'Precipitation', 'Erosion'],
						'Evaporation',
						'Heat turns liquid water into vapour, which rises into the atmosphere.',
						'Water cycle',
						'Explorer'
					)
				]
			)
		])
	]
};

/* ------------------------------------------------------------------ */
/* Coding                                                              */
/* ------------------------------------------------------------------ */

const codeQuest: Course = {
	id: 'code-quest',
	slug: 'code-quest',
	subjectId: 'coding',
	title: 'Code Quest',
	summary: 'Learn computational thinking with loops, conditions and variables.',
	description:
		'A screen-free-friendly coding course. Learn the ideas first, then apply them in the built-in code playground and games.',
	emoji: '🕹️',
	gradient: 'from-[#e9e5ff] to-[#b9afff]',
	level: 'Explorer',
	ages: '9–15',
	hours: 4,
	xp: 950,
	curriculum: ['CSTA 1B–2', 'Cambridge Stage 7', 'NERDC Computer Studies'],
	skills: ['Algorithms', 'Loops', 'Conditionals', 'Variables', 'Debugging'],
	featured: true,
	modules: [
		mod('cq-1', 'Think like a coder', 'Break problems down and repeat without repeating yourself.', '🧠', [
			lesson(
				'code-algorithms',
				'What is an Algorithm?',
				'An algorithm is a clear list of steps for solving a problem.',
				'Write and order precise steps for a simple task.',
				[
					read(
						'Recipes for computers',
						'Computers follow instructions exactly. An algorithm must be **clear**, have a **finite number of steps**, and produce a **result**.',
						['Start with the goal', 'List steps in order', 'Test with an example', 'Fix anything ambiguous']
					),
				],
				[
					order(
						'code-al-1',
						'Order the steps to make a cup of tea.',
						['Boil water', 'Put tea bag in cup', 'Pour hot water', 'Wait 3 minutes', 'Remove tea bag'],
						'An algorithm needs the right order. You cannot pour water before boiling it.',
						'Algorithms'
					),
					q(
						'code-al-2',
						'Which is the best algorithm for brushing teeth?',
						[
							'Pick brush → add paste → brush → rinse',
							'Rinse → brush → add paste → pick brush',
							'Brush → sleep → add paste',
							'Pick brush → rinse → sleep'
						],
						'Pick brush → add paste → brush → rinse',
						'The steps must be in a sensible order and complete.',
						'Algorithms'
					),
					tf(
						'code-al-3',
						'An algorithm can have infinitely many steps.',
						'False',
						'A good algorithm must finish after a finite number of steps.',
						'Algorithms',
						'Explorer'
					)
				]
			),
			lesson(
				'code-loops',
				'Loops Save Time',
				'Repeat instructions instead of writing them again and again.',
				'Use repeat loops to shorten instructions.',
				[
					read(
						'Repeat power',
						'A **loop** runs the same instructions many times. Instead of writing “jump” 10 times, write “repeat 10 times: jump”.',
						['Loops reduce repetition', 'Every loop needs a stopping condition', 'Nested loops run a loop inside a loop']
					),
					example(
						'Draw a square',
						'Repeat 4 times: move forward 100 steps, turn right 90°.',
						['4 sides', 'Same length each time', 'Same turn each time']
					)
				],
				[
					q(
						'code-lo-1',
						'How many times will “repeat 6 times: clap” clap?',
						['6', '1', '12', '0'],
						'6',
						'The loop repeats the action 6 times.',
						'Loops'
					),
					q(
						'code-lo-2',
						'Which shape uses “repeat 3 times: forward, turn 120°”?',
						['Triangle', 'Square', 'Circle', 'Pentagon'],
						'Triangle',
						'Three equal sides with 120° turns make a triangle.',
						'Loops',
						'Explorer'
					)
				]
			)
		]),
		mod('cq-2', 'Decisions & data', 'Make programs choose and remember.', '🎛️', [
			lesson(
				'code-conditionals',
				'If… Then…',
				'Conditionals let a program choose different paths.',
				'Write if/else conditions for everyday decisions.',
				[
					read(
						'Programs make choices',
						'An **if statement** runs code only when a condition is true. **Else** runs when it is false.',
						['If it is raining, take an umbrella', 'Else, wear sunglasses', 'Conditions must be true or false']
					),
					example(
						'Game logic',
						'If score > 100, unlock the golden badge. Else, show “keep going!”.',
						['Condition: score > 100', 'True path: unlock badge', 'False path: encouragement']
					)
				],
				[
					q(
						'code-co-1',
						'If age >= 13, show “teen”. What shows for age 15?',
						['Teen', 'Child', 'Nothing', 'Error'],
						'Teen',
						'15 is greater than or equal to 13, so the condition is true.',
						'Conditionals'
					),
					q(
						'code-co-2',
						'What does “else” mean in a program?',
						['What to do when the condition is false', 'Repeat forever', 'Stop the program', 'Store a value'],
						'What to do when the condition is false',
						'Else handles the other path when the if condition is not met.',
						'Conditionals',
						'Explorer'
					)
				]
			)
		])
	]
};

const webBuilders: Course = {
	id: 'web-builders',
	slug: 'web-builders',
	subjectId: 'coding',
	title: 'Web Builders',
	summary: 'Build your first real web page with HTML, CSS and JavaScript.',
	description:
		'From blank page to interactive mini-site. Learners publish a personal “About Me” page and a mini quiz app.',
	emoji: '🌐',
	gradient: 'from-[#dff5ff] to-[#8fdcff]',
	level: 'Explorer',
	ages: '12–17',
	hours: 5,
	xp: 1100,
	curriculum: ['CSTA 2', 'Cambridge IGCSE prep', 'NERDC Computer Studies'],
	skills: ['HTML', 'CSS', 'JavaScript', 'Publishing'],
	modules: [
		mod('wb-1', 'Structure & style', 'Give content structure, then make it beautiful.', '🧱', [
			lesson(
				'code-html',
				'HTML Skeleton',
				'HTML gives a page its structure and meaning.',
				'Use headings, paragraphs, lists and links in HTML.',
				[
					read(
						'Tags are labels',
						'HTML uses **tags** to label content. Most tags have an opening and closing tag.',
						['<h1> is the main heading', '<p> is a paragraph', '<a> is a link', '<img> displays an image']
					),
					example(
						'A tiny page',
						'<h1>My Portfolio</h1><p>I build games and stories.</p><a href="mailto:me@example.com">Email me</a>',
						['One main heading', 'One paragraph', 'One link']
					)
				],
				[
					q(
						'code-ht-1',
						'Which tag creates the biggest main heading?',
						['<h1>', '<p>', '<a>', '<div>'],
						'<h1>',
						'<h1> is the top-level heading, used once per page for the main title.',
						'HTML'
					),
					q(
						'code-ht-2',
						'Which tag creates a link?',
						['<a>', '<link>', '<href>', '<nav>'],
						'<a>',
						'The anchor tag <a> with an href attribute creates a link.',
						'HTML',
						'Explorer'
					)
				]
			),
			lesson(
				'code-css',
				'CSS Style',
				'CSS controls colour, spacing and layout.',
				'Write simple CSS selectors and declarations.',
				[
					read(
						'Selectors and declarations',
						'CSS rules choose an element and set properties: `h1 { color: green; }`.',
						['selector { property: value; }', 'Classes start with a dot: .card', 'IDs start with a hash: #hero']
					),
					example(
						'Card style',
						'.card { background: #c9f26b; border-radius: 24px; padding: 20px; }',
						['Class selector', 'Background colour', 'Rounded corners', 'Inner spacing']
					)
				],
				[
					q(
						'code-cs-1',
						'Which selector targets class “hero”?',
						['.hero', '#hero', 'hero', '<hero>'],
						'.hero',
						'Classes are selected with a dot.',
						'CSS'
					),
					q(
						'code-cs-2',
						'Which property changes text colour?',
						['color', 'background', 'padding', 'margin'],
						'color',
						'The color property sets text colour; background sets the element background.',
						'CSS',
						'Explorer'
					)
				]
			)
		]),
		mod('wb-2', 'Interactivity', 'Make the page respond to the user.', '⚡', [
			lesson(
				'code-js',
				'JavaScript Magic',
				'JavaScript adds logic, reactions and data to a page.',
				'Use variables and click events in a tiny app.',
				[
					read(
						'Bring pages to life',
						'JavaScript can read input, make decisions and update the page. Start with a variable and a function.',
						['let score = 0;', 'function addPoint() { score = score + 1; }', 'button.addEventListener("click", addPoint);']
					),
					example(
						'Click counter',
						'A button calls addPoint each time it is clicked, and the score increases by one.',
						['Variable stores the score', 'Function changes it', 'Event connects click to function']
					)
				],
				[
					q(
						'code-js-1',
						'Which keyword creates a variable that can change?',
						['let', 'const', 'fixed', 'var only'],
						'let',
						'let creates a reassignable variable; const cannot be reassigned.',
						'JavaScript'
					),
					q(
						'code-js-2',
						'What does an event listener do?',
						['Runs code when something happens', 'Styles the page', 'Stores HTML', 'Deletes the browser'],
						'Runs code when something happens',
						'Event listeners connect user actions such as clicks to functions.',
						'JavaScript',
						'Explorer'
					)
				]
			)
		])
	]
};

/* ------------------------------------------------------------------ */
/* Digital, Money, Civics, Arts                                        */
/* ------------------------------------------------------------------ */

const digitalCitizens: Course = {
	id: 'digital-citizens',
	slug: 'digital-citizens',
	subjectId: 'digital',
	title: 'Digital Citizens',
	summary: 'Stay safe, spot misinformation and be kind online.',
	description:
		'Practical digital literacy scenarios for young people growing up online. Includes AI literacy and privacy basics.',
	emoji: '🛡️',
	gradient: 'from-[#fff0d0] to-[#ffd166]',
	level: 'Starter',
	ages: '8–16',
	hours: 2,
	xp: 620,
	curriculum: ['UNICEF Digital Citizenship', 'Common Core Speaking & Listening'],
	skills: ['Online safety', 'Passwords', 'Research', 'Kindness', 'AI literacy'],
	modules: [
		mod('dc-1', 'Safety first', 'Protect your information and your accounts.', '🔐', [
			lesson(
				'dig-safety',
				'Smart & Safe Online',
				'Your personal information is valuable. Share it carefully.',
				'Identify safe and unsafe online behaviour.',
				[
					read(
						'STOP before you share',
						'Never share your **full name, address, school, phone number or password** with strangers online. Tell a trusted adult if something feels wrong.',
						['Use privacy settings', 'Do not meet strangers alone', 'Screenshot and report harmful messages', 'Remember: people online may not be who they say']
					),
					tip(
						'Trust your tummy',
						'If a message makes you feel scared, rushed or secretive, stop and tell a trusted adult. Scammers often create urgency.'
					)
				],
				[
					q(
						'dig-sf-1',
						'A stranger online asks for your home address. What should you do?',
						['Do not share it and tell a trusted adult', 'Send it quickly', 'Post it publicly', 'Ask them for money'],
						'Do not share it and tell a trusted adult',
						'Home addresses are private. Never share them with strangers; tell an adult you trust.',
						'Online safety'
					),
					tf(
						'dig-sf-2',
						'It is safe to meet an online friend alone without telling anyone.',
						'False',
						'Never meet an online stranger alone. Tell a trusted adult and meet only in safe, public places with supervision.',
						'Online safety'
					)
				]
			),
			lesson(
				'dig-passwords',
				'Super Passwords',
				'Long, unique passphrases beat short, guessable passwords.',
				'Create strong passwords and protect accounts.',
				[
					read(
						'Build a passphrase',
						'Use four unrelated words plus a number and symbol: **Mango-Cloud-7-Tiger!**. Make it long, memorable and unique to each account.',
						['At least 12 characters', 'Never reuse passwords', 'Use two-factor authentication', 'Never share passwords']
					),
					example(
						'Strong vs weak',
						'Weak: password123. Strong: 7-Mango-Cloud-Tiger!',
						['Length matters most', 'Avoid names and birthdays', 'A password manager can remember them for you']
					)
				],
				[
					q(
						'dig-pw-1',
						'Which password is strongest?',
						['Mango-Cloud-7-Tiger!', 'password123', 'ada2012', '12345678'],
						'Mango-Cloud-7-Tiger!',
						'It is long, mixes words, numbers and symbols, and is not personal information.',
						'Passwords'
					),
					q(
						'dig-pw-2',
						'Why should you use a different password for each account?',
						['So one leak does not unlock everything', 'To make them harder to remember', 'Because websites require it', 'To share with friends'],
						'So one leak does not unlock everything',
						'If a password is leaked, unique passwords stop attackers from accessing your other accounts.',
						'Passwords',
						'Explorer'
					)
				]
			)
		]),
		mod('dc-2', 'Truth & kindness', 'Check before you share.', '🔎', [
			lesson(
				'dig-research',
				'Smart Searching',
				'Not everything online is true. Verify before you trust or share.',
				'Evaluate sources using the SIFT method.',
				[
					read(
						'SIFT your sources',
						'**Stop. Investigate the source. Find better coverage. Trace claims.** Anyone can publish online, so check who is behind the information.',
						['Look for named authors and dates', 'Cross-check with trusted sites', 'Be suspicious of ALL-CAPS and strong emotions', 'Images can be old or edited']
					),
					example(
						'Headline check',
						'“Scientists discover moon is made of cheese!” — check the site, author, date and other coverage before believing it.',
						['Who published it?', 'Do other reliable outlets report it?', 'Is it a joke or satire?']
					)
				],
				[
					q(
						'dig-rs-1',
						'Before sharing a shocking claim, what should you do first?',
						['Check the source and cross-check the claim', 'Share it immediately', 'Add more emojis', 'Ask a friend to share it'],
						'Check the source and cross-check the claim',
						'Verify the source and look for reliable coverage before sharing.',
						'Research'
					),
					tf(
						'dig-rs-2',
						'If a post has many likes, it must be true.',
						'False',
						'Popularity is not proof. Misinformation can spread quickly because it is emotional.',
						'Research',
						'Explorer'
					)
				]
			)
		])
	]
};

const moneyMovers: Course = {
	id: 'money-movers',
	slug: 'money-movers',
	subjectId: 'money',
	title: 'Money Movers',
	summary: 'Save, budget and build a small hustle — all in Naira.',
	description:
		'Practical money skills aligned to Nigerian daily life. Learners run a virtual ₦5,000 monthly budget and grow a small business.',
	emoji: '💰',
	gradient: 'from-[#fff0b8] to-[#ffc53d]',
	level: 'Starter',
	ages: '10–17',
	hours: 3,
	xp: 740,
	curriculum: ['NERDC Financial Literacy', 'Money & Enterprise Framework'],
	skills: ['Needs & wants', 'Saving', 'Budgeting', 'Entrepreneurship'],
	featured: true,
	modules: [
		mod('mm-1', 'Money habits', 'Know the difference and build the habit.', '🧠', [
			lesson(
				'money-needs',
				'Needs vs Wants',
				'Needs keep you safe and healthy. Wants make life sweeter.',
				'Classify spending decisions as needs or wants.',
				[
					read(
						'Two lists',
						'**Needs** are essential: food, shelter, school materials, medicine. **Wants** are nice to have: new sneakers, games, treats.',
						['Needs come first in a budget', 'Some wants can become needs (a phone for school)', 'Delay wants to reach bigger goals']
					),
					tip(
						'Ask the 3 questions',
						'Before spending, ask: Do I need it to be safe, healthy or ready for school? Can I wait? Is there a cheaper option?'
					)
				],
				[
					q(
						'money-nw-1',
						'Which is a need for a student?',
						['School books', 'Video game skin', 'Designer cap', 'Extra sweets'],
						'School books',
						'School books support learning and are essential for school.',
						'Needs & wants'
					),
					q(
						'money-nw-2',
						'Which is a want?',
						['A new game', 'Clean drinking water', 'Medicine', 'Bus fare to school'],
						'A new game',
						'A game is enjoyable but not essential for health or school.',
						'Needs & wants'
					)
				]
			),
			lesson(
				'money-saving',
				'Save Like a Star',
				'Pay yourself first — even small amounts grow.',
				'Apply a simple 50/30/20 saving plan.',
				[
					read(
						'The 50/30/20 rule',
						'Split income: **50% needs, 30% wants, 20% savings**. On ₦5,000 that is ₦2,500 needs, ₦1,500 wants and ₦1,000 savings.',
						['Save before spending', 'Use a separate savings pouch or account', 'Track small daily spending']
					),
					example(
						'Compound growth',
						'Saving ₦1,000 monthly for a year gives ₦12,000. Add interest and the total grows even more.',
						['Consistency beats size', 'Set a goal', 'Celebrate milestones']
					)
				],
				[
					nq(
						'money-sv-1',
						'You receive ₦5,000. Using 20% for savings, how much do you save?',
						'1000',
						'20% of ₦5,000 = 0.2 × 5,000 = ₦1,000.',
						'Saving'
					),
					q(
						'money-sv-2',
						'Which habit builds savings fastest?',
						['Save a fixed amount every month', 'Save only when you feel like it', 'Spend first, save leftovers', 'Borrow to save'],
						'Save a fixed amount every month',
						'Consistent, planned saving beats saving random leftovers.',
						'Saving',
						'Explorer'
					)
				]
			)
		]),
		mod('mm-2', 'Budget & hustle', 'Plan every Naira and test a business idea.', '📊', [
			lesson(
				'money-budget',
				'Budget Boss',
				'A budget is a plan for your money before you spend it.',
				'Create a simple monthly budget that balances.',
				[
					read(
						'Income − expenses = balance',
						'List all income, then all planned spending. If expenses are bigger than income, cut a want or increase income.',
						['Track fixed costs first', 'Set aside savings', 'Leave a small buffer for surprises']
					),
				],
				[
					order(
						'money-bu-1',
						'Order these budgeting steps.',
						['List income', 'List expenses', 'Compare totals', 'Adjust spending', 'Track and review'],
						'A budget starts with knowing what comes in, then planning what goes out, then adjusting.',
						'Budgeting'
					),
					q(
						'money-bu-2',
						'Income is ₦5,000 and expenses are ₦5,800. What should you do?',
						['Cut ₦800 of wants or earn more', 'Ignore it', 'Borrow forever', 'Spend more'],
						'Cut ₦800 of wants or earn more',
						'A budget must balance. Reduce non-essential spending or increase income.',
						'Budgeting',
						'Explorer'
					),
					tf(
						'money-bu-3',
						'A budget should include savings.',
						'True',
						'Savings are a planned expense, not an afterthought.',
						'Budgeting'
					)
				]
			)
		])
	]
};

const naijaHeroes: Course = {
	id: 'naija-heroes',
	slug: 'naija-heroes',
	subjectId: 'civics',
	title: 'Naija Heroes',
	summary: 'National symbols, rights and the power of community.',
	description:
		'A civic education journey through Nigeria’s symbols, constitution and everyday change makers.',
	emoji: '🇳🇬',
	gradient: 'from-[#d8f7e6] to-[#83e0b0]',
	level: 'Starter',
	ages: '9–15',
	hours: 2,
	xp: 600,
	curriculum: ['NERDC Civic Education', 'Nigeria Constitution (simplified)'],
	skills: ['National symbols', 'Rights', 'Responsibilities', 'Community'],
	modules: [
		mod('nh-1', 'Our nation', 'Know the symbols that unite us.', '🏛️', [
			lesson(
				'civ-symbols',
				'Symbols of Nigeria',
				'Our flag, anthem, pledge and coat of arms tell a story.',
				'Identify Nigeria’s national symbols and their meanings.',
				[
					read(
						'Green, white, green',
						'Nigeria’s flag has **green** for agriculture and **white** for peace and unity. The coat of arms features a black shield, two horses and an eagle.',
						['Flag designed by Taiwo Akinkunmi', 'National anthem: “Arise, O Compatriots”', 'National pledge: a promise of loyalty', 'Eagle stands for strength']
					),
					didyouknow(
						'The flag was a student’s idea',
						'Michael Taiwo Akinkunmi designed the Nigerian flag in 1959 while studying in London. His original design also had a red sun, which was removed by the judges.'
					)
				],
				[
					q(
						'civ-sy-1',
						'What do the white stripes on Nigeria’s flag represent?',
						['Peace and unity', 'Oil and gas', 'Rivers and lakes', 'Strength and courage'],
						'Peace and unity',
						'The white stands for peace and unity; green stands for agriculture and natural wealth.',
						'National symbols'
					),
					tf(
						'civ-sy-2',
						'The Nigerian national anthem is “Arise, O Compatriots”.',
						'True',
						'“Arise, O Compatriots” is Nigeria’s national anthem.',
						'National symbols'
					)
				]
			),
			lesson(
				'civ-rights',
				'Rights & Responsibilities',
				'Every right comes with a matching responsibility.',
				'Explain basic rights and responsibilities of citizens.',
				[
					read(
						'Two sides of one coin',
						'The constitution protects rights such as **life, education, dignity and freedom of expression**. With each right comes a duty to respect others.',
						['Right to education → responsibility to learn', 'Right to speech → responsibility not to harm', 'Right to safety → responsibility to follow laws']
					),
				],
				[
					match(
						'civ-rt-1',
						'Match each right to its responsibility.',
						[
							{ left: 'Right to education', right: 'Attend and study' },
							{ left: 'Right to speech', right: 'Listen and speak respectfully' },
							{ left: 'Right to a clean environment', right: 'Dispose of waste properly' }
						],
						'Rights and responsibilities work together. Using a right well includes respecting others.',
						'Rights'
					),
					q(
						'civ-rt-2',
						'Which is a responsibility of a student?',
						['Respect teachers and classmates', 'Skip classes', 'Bully others', 'Damage school property'],
						'Respect teachers and classmates',
						'Respect is a core responsibility that protects everyone’s right to learn safely.',
						'Responsibilities'
					),
					q(
						'civ-rt-3',
						'What does freedom of expression NOT protect?',
						['Hate speech that harms others', 'Sharing your opinion', 'Peaceful protest', 'Writing a letter to a leader'],
						'Hate speech that harms others',
						'Rights have limits when they harm other people’s safety and dignity.',
						'Rights',
						'Explorer'
					)
				]
			)
		]),
		mod('nh-2', 'Change makers', 'Small actions build stronger communities.', '🤝', [
			lesson(
				'civ-community',
				'Community Change Makers',
				'You do not need to be famous to make your community better.',
				'Plan a small community improvement project.',
				[
					read(
						'Start where you are',
						'Change makers notice a problem, listen to people, plan a small action and involve others.',
						['Notice: what needs fixing?', 'Listen: who is affected?', 'Plan: what can we do this week?', 'Act: start small and measure', 'Share: inspire others']
					),
					example(
						'A 7-day project',
						'Problem: litter near the school gate. Plan: borrow gloves, organise a 30-minute clean-up, add two labelled bins, ask the principal for support.',
						['Specific problem', 'Small realistic action', 'Community involvement']
					)
				],
				[
					q(
						'civ-cc-1',
						'What is the best first step for a community project?',
						['Understand the problem and listen to people', 'Buy expensive equipment', 'Blame leaders', 'Wait for someone else'],
						'Understand the problem and listen to people',
						'Good projects start by understanding the real need and involving affected people.',
						'Community'
					),
					q(
						'civ-cc-2',
						'Which project is most likely to succeed?',
						['A small clean-up with a clear plan', 'A giant plan with no budget', 'A project only you know about', 'A one-day event with no follow-up'],
						'A small clean-up with a clear plan',
						'Small, clear, resourced actions are more likely to succeed and sustain.',
						'Community',
						'Explorer'
					)
				]
			)
		])
	]
};

const creativeStudio: Course = {
	id: 'creative-studio',
	slug: 'creative-studio',
	subjectId: 'arts',
	title: 'Creative Studio',
	summary: 'Colour, draw, make rhythm and tell stories with confidence.',
	description:
		'A low-material creativity course. Learners use paper, pencils, everyday objects and their voices to make and share art.',
	emoji: '🎨',
	gradient: 'from-[#ffe3df] to-[#ff9b8f]',
	level: 'Starter',
	ages: '6–14',
	hours: 2,
	xp: 560,
	curriculum: ['NERDC Cultural & Creative Arts', 'IB PYP Arts'],
	skills: ['Colour', 'Drawing', 'Rhythm', 'Storytelling'],
	modules: [
		mod('cs-1', 'See & make', 'Train your eyes and hands.', '🖌️', [
			lesson(
				'art-colour',
				'Colour Power',
				'Colours carry feelings and can be mixed to make new ones.',
				'Identify primary colours and mix secondary colours.',
				[
					read(
						'The colour wheel',
						'**Primary** colours — red, blue and yellow — cannot be mixed. Mix two primaries to get a **secondary** colour.',
						['Red + blue = purple', 'Blue + yellow = green', 'Red + yellow = orange', 'Warm colours feel energetic; cool colours feel calm']
					),
				],
				[
					q(
						'art-cl-1',
						'What do blue and yellow make?',
						['Green', 'Purple', 'Orange', 'Brown'],
						'Green',
						'Blue and yellow are primary colours; mixed, they make green.',
						'Colour'
					),
					q(
						'art-cl-2',
						'Which is a primary colour?',
						['Red', 'Green', 'Purple', 'Orange'],
						'Red',
						'Red, blue and yellow are primary colours; they cannot be made by mixing.',
						'Colour'
					),
					q(
						'art-cl-3',
						'Which palette feels calm?',
						['Soft blues and greens', 'Bright reds and oranges', 'Neon yellow and pink', 'Black and red'],
						'Soft blues and greens',
						'Cool colours such as soft blue and green often feel calm.',
						'Colour',
						'Explorer'
					)
				]
			),
			lesson(
				'art-drawing',
				'Drawing Basics',
				'Break everything into simple shapes, then add detail.',
				'Use shapes and guidelines to draw a simple object.',
				[
					read(
						'Shapes first',
						'Artists simplify before they detail. A bird is an oval body + circle head + triangle beak + curved wings.',
						['Start with light guidelines', 'Use big shapes then small details', 'Check proportions', 'Practice a little every day']
					),
					steps('Draw a bird', 'Follow the shape recipe.', [
						'Draw an oval for the body',
						'Add a circle for the head',
						'Add a triangle beak and tail',
						'Draw curved wings',
						'Erase extra lines and add colour'
					])
				],
				[
					q(
						'art-dr-1',
						'What should you draw first?',
						['Big simple shapes', 'Tiny details', 'The background', 'The title'],
						'Big simple shapes',
						'Starting with big shapes helps you get proportions right before adding detail.',
						'Drawing'
					),
					tf(
						'art-dr-2',
						'Guidelines are mistakes and should never appear in a drawing.',
						'False',
						'Light guidelines are a normal planning tool and are erased or covered later.',
						'Drawing'
					)
				]
			)
		]),
		mod('cs-2', 'Sound & story', 'Find rhythm everywhere.', '🥁', [
			lesson(
				'art-rhythm',
				'Rhythm & Sound',
				'Rhythm is a pattern of sounds and silences.',
				'Clap simple rhythm patterns and describe tempo.',
				[
					read(
						'Beat and tempo',
						'The **beat** is the steady pulse. **Tempo** is how fast or slow it goes. A **rhythm** is a pattern of long and short sounds.',
						['Clap: ta ta ti-ti ta', 'Fast tempo = allegro', 'Slow tempo = adagio', 'Silence is part of rhythm']
					),
					example(
						'Body percussion',
						'Make a four-beat pattern: clap, clap, stomp, rest. Repeat it and add a friend on a different part.',
						['Keep a steady pulse', 'Count 1-2-3-4', 'Layer patterns for texture']
					)
				],
				[
					q(
						'art-rh-1',
						'What is tempo?',
						['How fast or slow the music is', 'How loud the music is', 'The words of a song', 'The colour of an instrument'],
						'How fast or slow the music is',
						'Tempo describes speed; dynamics describe loudness.',
						'Rhythm'
					),
					q(
						'art-rh-2',
						'Which pattern has a rest?',
						['Clap, clap, stomp, silence', 'Clap, clap, stomp, clap', 'Clap, stomp, clap, stomp', 'Clap, clap, clap, clap'],
						'Clap, clap, stomp, silence',
						'A rest is a moment of silence within the rhythm.',
						'Rhythm',
						'Explorer'
					)
				]
			)
		])
	]
};

export const courses: Course[] = [
	numberNinjas,
	algebraExplorers,
	wordWizards,
	storyCrafters,
	scienceSparks,
	spaceMatter,
	codeQuest,
	webBuilders,
	digitalCitizens,
	moneyMovers,
	naijaHeroes,
	creativeStudio
];

export const curricula: CurriculumFramework[] = [
	{
		id: 'nerdc',
		name: 'NERDC Nigerian Curriculum',
		country: 'Nigeria',
		flag: '🇳🇬',
		description:
			'Primary and junior secondary learning objectives mapped to the Nigerian Educational Research and Development Council framework.',
		subjects: ['Mathematics', 'English', 'Basic Science', 'Computer Studies', 'Civic Education', 'Creative Arts']
	},
	{
		id: 'common-core',
		name: 'US Common Core',
		country: 'United States',
		flag: '🇺🇸',
		description: 'Standards-aligned maths and English language arts progressions for K–8 learners.',
		subjects: ['Mathematics', 'English Language Arts']
	},
	{
		id: 'uk-national',
		name: 'UK National Curriculum',
		country: 'United Kingdom',
		flag: '🇬🇧',
		description: 'Key Stage 1–3 objectives with phonics, grammar and mastery maths support.',
		subjects: ['Mathematics', 'English', 'Science', 'Computing']
	},
	{
		id: 'cambridge',
		name: 'Cambridge International',
		country: 'Global',
		flag: '🌍',
		description: 'Cambridge Primary and Lower Secondary learning objectives for international schools.',
		subjects: ['Mathematics', 'English', 'Science', 'Computing', 'Global Perspectives']
	},
	{
		id: 'ib',
		name: 'IB Primary Years / MYP',
		country: 'Global',
		flag: '🌐',
		description: 'Inquiry-led units with conceptual understanding and interdisciplinary projects.',
		subjects: ['Mathematics', 'Language', 'Sciences', 'Arts', 'Design']
	},
	{
		id: 'waec',
		name: 'WAEC / JAMB Prep',
		country: 'West Africa',
		flag: '🎓',
		description: 'Exam-style practice and revision pathways for West African senior secondary learners.',
		subjects: ['Mathematics', 'English', 'Science', 'Economics', 'Government']
	}
];

/* ------------------------------------------------------------------ */
/* Derived helpers                                                     */
/* ------------------------------------------------------------------ */

export const allLessons: Lesson[] = courses.flatMap((c) =>
	c.modules.flatMap((m) =>
		m.lessons.map((l) => ({ ...l, id: l.id, slug: l.slug }))
	)
);

export function getSubject(slug: string): Subject | undefined {
	return subjects.find((s) => s.slug === slug || s.id === slug);
}

export function getCourse(slug: string): Course | undefined {
	return courses.find((c) => c.slug === slug || c.id === slug);
}

export function getLesson(id: string): Lesson | undefined {
	return allLessons.find((l) => l.id === id || l.slug === id);
}

export function getCourseForLesson(id: string): Course | undefined {
	return courses.find((c) => c.modules.some((m) => m.lessons.some((l) => l.id === id || l.slug === id)));
}

export function coursesForSubject(subjectId: string): Course[] {
	return courses.filter((c) => c.subjectId === subjectId);
}

export function lessonCountForSubject(subjectId: string): number {
	return coursesForSubject(subjectId).reduce(
		(sum, c) => sum + c.modules.reduce((n, m) => n + m.lessons.length, 0),
		0
	);
}

export const allQuestions: Question[] = allLessons.flatMap((l) => l.questions);

export const lessonMap: Record<string, Lesson> = Object.fromEntries(
	allLessons.map((l) => [l.id, l])
);

export const courseForLessonMap: Record<string, Course> = Object.fromEntries(
	allLessons
		.map((l) => [l.id, getCourseForLesson(l.id)] as const)
		.filter((entry): entry is [string, Course] => Boolean(entry[1]))
);

export const subjectMap: Record<string, Subject> = Object.fromEntries(
	subjects.map((s) => [s.id, s])
);
