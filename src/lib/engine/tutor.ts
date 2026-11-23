export interface TutorContext {
	name: string;
	age: number;
	grade: string;
	style: string;
}

export interface TutorReply {
	text: string;
	suggestions: string[];
	topic: string;
}

const unsafe = ['kill myself', 'suicide', 'self harm', 'hurt myself', 'weapon', 'drugs', 'sex'];
const banned = ['stupid', 'idiot', 'hate you'];

function numbers(text: string): number[] {
	return (text.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
}

function simpleMath(text: string): string | null {
	const match = text.match(/(-?\d+(?:\.\d+)?)\s*([+\-*/x×÷])\s*(-?\d+(?:\.\d+)?)/);
	if (!match) return null;
	const a = Number(match[1]);
	const b = Number(match[3]);
	const op = match[2];
	let answer: number | string;
	let symbol = op;
	if (op === '+') answer = a + b;
	else if (op === '-') answer = a - b;
	else if (op === '*' || op === 'x' || op === '×') {
		answer = a * b;
		symbol = '×';
	} else {
		if (b === 0) return 'Dividing by zero is undefined — even for a supercomputer. Try another number.';
		answer = Math.round((a / b) * 1000) / 1000;
		symbol = '÷';
	}
	return `${a} ${symbol} ${b} = **${answer}**.\n\nHere is the thinking: ${a} ${symbol} ${b} means we are ${
		op === '+' ? 'putting the amounts together' : op === '-' ? 'taking one amount away from the other' : op === '*' || op === 'x' || op === '×' ? 'making ' + b + ' equal groups of ' + a : 'sharing ' + a + ' into ' + b + ' equal groups'
	}.\n\nYour turn: what would change if the second number were ${b + 1}?`;
}

export function tutorReply(input: string, ctx: TutorContext): TutorReply {
	const text = input.trim();
	const lower = text.toLowerCase();
	const age = ctx.age || 11;
	const young = age <= 9;
	const teen = age >= 14;

	if (!text) {
		return {
			text: 'Ask me anything about your lessons — maths, English, science, coding or money. I will start with a hint, not just the answer.',
			topic: 'start',
			suggestions: ['Explain fractions simply', 'Why is the sky blue?', 'Help me plan a story', 'Quiz me on science']
		};
	}

	if (unsafe.some((w) => lower.includes(w))) {
		return {
			text: 'I want you to be safe, and I am not the right helper for something that serious. Please talk to a trusted adult — a parent, teacher, school counsellor or doctor — right now. If you are in immediate danger, contact local emergency services.\n\nI can stay here and help with schoolwork whenever you are ready.',
			topic: 'safety',
			suggestions: ['I want to talk about school', 'Help me with a maths problem']
		};
	}
	if (banned.some((w) => lower.includes(w))) {
		return {
			text: 'I am here to help you learn, and I speak to you with respect. Let us reset. What would you like to understand better?',
			topic: 'kindness',
			suggestions: ['Explain fractions', 'Give me a science question']
		};
	}

	if (/^(hi|hello|hey|good morning|good afternoon|good evening|how far|wahala)/.test(lower)) {
		return {
			text: `Hi ${ctx.name}! 👋 I am Sabi, your study buddy. We can work through a lesson, untangle a homework question, or practise for a quiz.\n\nWhat are we tackling today?`,
			topic: 'greeting',
			suggestions: ['Explain fractions simply', 'Why do plants need sunlight?', 'Help me write a story opening', 'Quiz me on money']
		};
	}

	if (/(who are you|what are you|your name)/.test(lower)) {
		return {
			text: 'I am **Sabi**, Sabify’s AI study buddy. I am built to ask good questions, give hints and explain ideas in more than one way. I am not a replacement for your teacher or parent — think of me as a patient practice partner.\n\nI work best when you tell me what you have already tried.',
			topic: 'about',
			suggestions: ['Help me with homework', 'Explain a science idea']
		};
	}

	const math = simpleMath(lower);
	if (math) {
		return { text: math, topic: 'maths', suggestions: ['Explain the steps again', 'Give me a similar problem', 'Why does regrouping work?'] };
	}

	if (/(fraction|numerator|denominator|half|quarter|third)/.test(lower)) {
		return {
			text: `Think of a fraction as **a fair share of one whole**.\n\nThe bottom number (denominator) says how many equal pieces the whole is cut into. The top number (numerator) says how many pieces you have.\n\nPizza example: cut a pizza into 4 equal slices and eat 1. You ate **1/4**. Eat 2 slices and you ate **2/4**, which is the same as **1/2**.\n\nQuick check: which is bigger — 1/3 or 1/5? ${young ? 'More cuts means smaller pieces.' : 'Explain your reasoning before you answer.'}\n\nWant to try a fraction question, or shall I show you how to add fractions?`,
			topic: 'fractions',
			suggestions: ['Give me a fraction question', 'How do I add fractions?', 'What are equivalent fractions?']
		};
	}

	if (/(equation|solve for x|algebra|unknown)/.test(lower)) {
		return {
			text: `An equation is a **balance**. Whatever you do to one side, you must do to the other.\n\nExample: solve **x + 7 = 15**.\n\n1. Undo the +7 by subtracting 7 from both sides.\n2. x = 15 − 7\n3. **x = 8**\n\nCheck: 8 + 7 = 15 ✓\n\nYour turn: solve **2x = 18**. What is the first move?`,
			topic: 'algebra',
			suggestions: ['Check my answer', 'Give me another equation', 'Why do we balance equations?']
		};
	}

	if (/(percentage|percent|discount)/.test(lower)) {
		return {
			text: `Percent means **“out of 100”**. So 20% means 20 out of every 100.\n\nTo find 20% of ₦5,000:\n\n1. Find 10%: ₦5,000 ÷ 10 = ₦500\n2. Double it for 20%: ₦500 × 2 = **₦1,000**\n\nShortcut: 20% = 0.20, so 0.20 × 5,000 = 1,000.\n\nTry this: a ₦4,000 bag has a 25% discount. How much do you save?`,
			topic: 'percentage',
			suggestions: ['Show me the discount answer', 'Give me a money problem']
		};
	}

	if (/(sky blue|sunset|light scatter|rainbow)/.test(lower)) {
		return {
			text: `Great question. Sunlight looks white, but it is really a mix of colours.\n\nWhen sunlight passes through air, it bumps into tiny gas particles. **Blue light scatters more** than red light, so blue reaches your eyes from all directions — that is why the sky looks blue.\n\nAt sunset, sunlight travels through more air. The blue scatters away before it reaches you, leaving **reds and oranges**.\n\nYour turn: why do you think the sky on the Moon looks black even during the day?`,
			topic: 'science',
			suggestions: ['Tell me the Moon answer', 'Why do rainbows form?', 'Give me a science quiz']
		};
	}

	if (/(plant|photosynth|leaf|leaves|sunlight)/.test(lower)) {
		return {
			text: `Plants are solar-powered kitchens. 🌱\n\nIn **photosynthesis**, a plant uses:\n- sunlight\n- water from the roots\n- carbon dioxide from the air\n\nto make **glucose** (its food) and release **oxygen**.\n\nThat is why plants are happiest near light, and why forests help clean the air.\n\nQuick experiment: put one plant in sunlight and one in a dark cupboard for a week. Keep water the same. What do you predict will happen, and why?`,
			topic: 'plants',
			suggestions: ['Explain the experiment result', 'What is chlorophyll?', 'Quiz me on plants']
		};
	}

	if (/(gravity|force|friction|magnet)/.test(lower)) {
		return {
			text: `A force is a **push or a pull**. Forces can change an object’s speed, direction or shape.\n\n- **Gravity** pulls objects toward Earth.\n- **Friction** opposes sliding between surfaces.\n- **Magnetism** can push or pull without touching.\n\nEveryday test: slide a book across a table, then across a mat. The mat adds friction, so the book stops sooner.\n\nWhich force is at work when a ball falls? ${young ? 'Hint: it starts with G.' : 'Explain whether it is a contact or non-contact force.'}`,
			topic: 'forces',
			suggestions: ['Is gravity a contact force?', 'Give me a friction example', 'Quiz me on forces']
		};
	}

	if (/(water cycle|evaporation|condensation|rain)/.test(lower)) {
		return {
			text: `Water is always travelling. 💧\n\n1. **Evaporation** — the Sun heats water, turning it into vapour.\n2. **Condensation** — vapour cools high in the sky and forms clouds.\n3. **Precipitation** — water falls as rain, hail or snow.\n4. **Collection** — water gathers in rivers, lakes and the ground, and the cycle repeats.\n\nThink: why does a cold bottle get water droplets on the outside?`,
			topic: 'water',
			suggestions: ['Explain the bottle droplets', 'Quiz me on the water cycle']
		};
	}

	if (/(story|write|essay|paragraph|opening|narrative)/.test(lower)) {
		return {
			text: `Let’s build a story opening that makes the reader ask a question.\n\nTry this recipe:\n1. Start with a **specific place** and a small action.\n2. Give the character one thing they want right now.\n3. Add one detail that feels slightly wrong.\n\nExample: *“The market was closing, but Mama’s stall was still full. She counted the tomatoes twice, then hid the third basket under the table.”*\n\nNow you try: write one sentence about a character who has just found something strange. I will help you improve it.`,
			topic: 'writing',
			suggestions: ['Improve my sentence', 'Give me a story prompt', 'How do I write dialogue?']
		};
	}

	if (/(comprehension|inference|reading|main idea)/.test(lower)) {
		return {
			text: `For reading questions, use this 3-step routine:\n\n1. **Find the evidence** — underline the words that support your answer.\n2. **Make the inference** — ask “what does this tell me?”\n3. **Explain with because** — “I think ___ because ___.”\n\nInference = clue + thinking. The answer is often not written in one sentence; you connect the clues.\n\nPaste a short passage here and I will ask you three questions about it.`,
			topic: 'reading',
			suggestions: ['Give me a practice passage', 'What is an inference?', 'How do I find the main idea?']
		};
	}

	if (/(code|program|algorithm|loop|variable|javascript|html|css)/.test(lower)) {
		return {
			text: `Coding is giving very clear instructions to a machine.\n\nThink of an **algorithm** as a recipe:\n1. Start\n2. Do each step in order\n3. Stop when the goal is reached\n\nA **loop** repeats steps: instead of writing “jump” 10 times, write “repeat 10 times: jump”.\n\nA **variable** is a labelled box that stores a value, like score = 0.\n\nYour turn: write the steps to make a cup of tea as an algorithm. What could go wrong if the steps were out of order?`,
			topic: 'coding',
			suggestions: ['Give me a loop example', 'Explain variables', 'Quiz me on coding']
		};
	}

	if (/(money|save|budget|spend|naira|₦|invest)/.test(lower)) {
		return {
			text: `Money tip: **pay your future self first**.\n\nUse the 50/30/20 plan on ₦5,000:\n- 50% needs = ₦2,500\n- 30% wants = ₦1,500\n- 20% savings = ₦1,000\n\nIf expenses are bigger than income, cut a want or earn more. A budget is a plan, not a punishment.\n\nTry this: you get ₦5,000 and want to save ₦1,500. How much is left for needs and wants together?`,
			topic: 'money',
			suggestions: ['Show me the answer', 'Give me a budgeting scenario', 'How does interest work?']
		};
	}

	if (/(quiz me|test me|practice question|ask me)/.test(lower)) {
		return {
			text: `Yes! Let’s do a quick retrieval round.\n\n**Question:** In 4,582, what is the value of the digit 5?\n\nA) 5\nB) 50\nC) 500\nD) 5,000\n\nTell me your answer and why. Then I will give you the next one.`,
			topic: 'quiz',
			suggestions: ['C) 500', 'Give me a science question', 'Make it harder']
		};
	}

	if (/(exam|test|study plan|revision|remember)/.test(lower)) {
		return {
			text: `Let’s make revision stick.\n\nUse **spaced retrieval**:\n1. Study a small chunk today.\n2. Close the book and write what you remember.\n3. Revisit tomorrow, then in 3 days, then in a week.\n4. Mix old and new topics instead of cramming one subject.\n\nTell me your exam date and subjects, and I will help you build a simple weekly plan.`,
			topic: 'study',
			suggestions: ['Help me plan this week', 'How do I stop cramming?', 'Give me a revision quiz']
		};
	}

	if (/(tired|hard|difficult|give up|hate|boring|stupid)/.test(lower)) {
		return {
			text: `Thank you for being honest. Hard feelings are part of learning — they do not mean you cannot do it.\n\nLet’s shrink the task:\n1. Pick one tiny thing: one question, one paragraph, one example.\n2. Do it for **five minutes** only.\n3. Then decide whether to stop or continue.\n\nYou do not have to feel motivated first. Starting is what creates the motivation.\n\nWhat is the smallest piece we can try right now?`,
			topic: 'motivation',
			suggestions: ['Give me a 5-minute task', 'Explain it more simply', 'I want to try a game']
		};
	}

	if (/(thank|thanks|you helped|got it|i understand)/.test(lower)) {
		return {
			text: `You’re welcome, ${ctx.name}. 🎉 The best test of understanding is explaining it back to someone else. Try teaching this idea to a friend or family member in two sentences.\n\nWant to try a quick question on it?`,
			topic: 'thanks',
			suggestions: ['Yes, quiz me', 'I want to try a game', 'Back to my dashboard']
		};
	}

	const topicHints: { match: RegExp; topic: string; text: string; suggestions: string[] }[] = [
		{
			match: /(solar|planet|space|moon|sun)/,
			topic: 'space',
			text: 'Planets orbit the Sun because of **gravity**. The Sun’s huge mass pulls them into curved paths. Earth takes about **365 days** to complete one orbit and **24 hours** to spin once.\n\nWhich planet would you like to explore — and what do you already know about it?',
			suggestions: ['Tell me about Jupiter', 'Why is Pluto not a planet?', 'Quiz me on space']
		},
		{
			match: /(constitution|rights|government|civic|nigeria)/,
			topic: 'civics',
			text: 'Rights and responsibilities come as a pair. The Nigerian Constitution protects rights such as dignity, education and freedom of expression — and each right asks us to respect other people’s safety and dignity too.\n\nExample: free speech does **not** protect hate speech that harms others.\n\nWhat is one responsibility that comes with the right to education?',
			suggestions: ['Answer the question', 'Tell me about national symbols', 'Quiz me on civics']
		},
		{
			match: /(colour|color|draw|music|rhythm|art)/,
			topic: 'arts',
			text: 'Creativity is a skill, not a talent you are born with. Start with a simple constraint: three colours, one shape, or a six-word story. Constraints make decisions easier and ideas braver.\n\nTry this: describe a market scene using only sounds and smells — no visual words.',
			suggestions: ['Give me another art challenge', 'How do I mix green?', 'Quiz me on rhythm']
		}
	];
	for (const h of topicHints) {
		if (h.match.test(lower)) {
			return { text: h.text, topic: h.topic, suggestions: h.suggestions };
		}
	}

	return {
		text: `I want to make sure I help with the right thing. Tell me a little more about what you are trying to do, ${ctx.name}. For example:\n\n- “Explain fractions with a pizza”\n- “Why do plants need sunlight?”\n- “Help me start a story about a market”\n- “Ask me three science questions”\n\nYou can also paste a homework question here and I will help you break it down — without just handing you the answer.`,
		topic: 'clarify',
		suggestions: ['Explain fractions', 'Why is the sky blue?', 'Help me write a story', 'Quiz me on science']
	};
}
