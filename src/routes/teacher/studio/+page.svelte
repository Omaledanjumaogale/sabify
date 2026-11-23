<script lang="ts">
	import { ArrowRight, Check, ChevronRight, Copy, FileText, Gamepad2, Loader2, Plus, Save, Sparkles, Trash2, Wand2, Zap } from '@lucide/svelte';
	import { makeMathQuestion, shuffle } from '$lib/data/games';
	import { celebrate } from '$lib/utils';
	import { toast } from '$lib/stores/toast';
	import { courses } from '$lib/data/curriculum';
	import Tabs from '$lib/components/Tabs.svelte';

	interface DraftQ {
		id: string;
		prompt: string;
		options: string[];
		answer: string;
		explanation: string;
		skill: string;
	}

	let type = $state('quiz');
	let subject = $state('Mathematics');
	let grade = $state('JSS 2');
	let topic = $state('Equivalent fractions');
	let difficulty = $state('Explorer');
	let count = $state('5');
	let generating = $state(false);
	let draft = $state<{ title: string; questions: DraftQ[] } | null>(null);
	let saved = $state<{ title: string; type: string; items: number; status: string; emoji: string }[]>([
		{ title: 'Fractions exit ticket', type: 'Quiz', items: 5, status: 'Published', emoji: '📘' },
		{ title: 'Photosynthesis card sort', type: 'Game', items: 8, status: 'Draft', emoji: '🎮' },
		{ title: 'Market story comprehension', type: 'Lesson', items: 4, status: 'Published', emoji: '📖' }
	]);
	let preview = $state(true);

	const templates = [
		{ t: 'Exit ticket', d: '3 questions, 5 minutes', e: '🎟️' },
		{ t: 'Retrieval quiz', d: '8 mixed questions', e: '🧠' },
		{ t: 'Vocabulary game', d: 'Match term to meaning', e: '🔨' },
		{ t: 'Project brief', d: 'Rubric + checklist', e: '🛠️' }
	];

	function generateQuestions(): DraftQ[] {
		const n = Number(count);
		const list: DraftQ[] = [];
		if (subject === 'Mathematics') {
			for (let i = 0; i < n; i++) {
				const q = makeMathQuestion(2 + i);
				list.push({ id: 'q' + i, prompt: `${q.prompt} = ?`, options: q.options, answer: q.answer, explanation: q.explanation, skill: topic });
			}
			return list;
		}
		if (subject === 'English') {
			const bank = [
				{ p: `Which word is closest in meaning to “${topic.toLowerCase()}”?`, o: ['Similar meaning', 'Opposite meaning', 'A type of food', 'A place'], a: 'Similar meaning', e: 'Use context clues and word parts to confirm the meaning.' },
				{ p: `Which sentence uses “${topic.toLowerCase()}” correctly?`, o: ['The character showed great ' + topic.toLowerCase() + ' in the story.', 'The ' + topic.toLowerCase() + ' ran quickly to the market.', 'She ' + topic.toLowerCase() + ' the book on the table.', 'We ate ' + topic.toLowerCase() + ' for breakfast.'], a: 'The character showed great ' + topic.toLowerCase() + ' in the story.', e: 'The word is used as an abstract quality in the correct sentence.' },
				{ p: `What is the best first step when reading a passage about ${topic.toLowerCase()}?`, o: ['Skim for the main idea', 'Memorise every word', 'Ignore the title', 'Start with the hardest question'], a: 'Skim for the main idea', e: 'Skimming gives your brain a map before you read closely.' },
				{ p: `Which punctuation mark ends a question?`, o: ['?', '.', '!', ','], a: '?', e: 'A question mark signals a direct question.' }
			];
			for (let i = 0; i < n; i++) {
				const b = bank[i % bank.length];
				list.push({ id: 'q' + i, prompt: b.p, options: b.o, answer: b.a, explanation: b.e, skill: topic });
			}
			return list;
		}
		const bankBySubject: Record<string, { p: string; o: string[]; a: string; e: string }[]> = {
			Science: [
				{ p: `Which statement best describes ${topic.toLowerCase()}?`, o: ['A process that can be observed and tested', 'A magic trick', 'A type of weather only', 'Something that never changes'], a: 'A process that can be observed and tested', e: 'Science explains observable processes with evidence.' },
				{ p: `What should you do before drawing a conclusion in a ${topic.toLowerCase()} experiment?`, o: ['Record observations', 'Guess the answer', 'Change every variable', 'Skip the method'], a: 'Record observations', e: 'Evidence comes before conclusions.' },
				{ p: `Which tool helps measure change during the experiment?`, o: ['A ruler or thermometer', 'A story book', 'A paint brush', 'A football'], a: 'A ruler or thermometer', e: 'Measurement tools give numerical evidence.' }
			],
			Coding: [
				{ p: `Which best describes an algorithm for ${topic.toLowerCase()}?`, o: ['A clear ordered list of steps', 'A random guess', 'A type of computer screen', 'A colour palette'], a: 'A clear ordered list of steps', e: 'Algorithms are precise, finite instructions.' },
				{ p: `What does a loop do?`, o: ['Repeats instructions', 'Deletes the program', 'Changes the screen colour', 'Stops all code'], a: 'Repeats instructions', e: 'Loops reduce repetition.' },
				{ p: `What is a variable used for?`, o: ['Storing a value', 'Printing paper', 'Closing the browser', 'Drawing a circle only'], a: 'Storing a value', e: 'Variables label data so programs can reuse it.' }
			],
			Money: [
				{ p: `Which is a need rather than a want?`, o: ['School books', 'A new game skin', 'Designer shoes', 'Extra sweets'], a: 'School books', e: 'Needs support health, safety or school.' },
				{ p: `You earn ₦5,000 and save 20%. How much is saved?`, o: ['₦1,000', '₦500', '₦2,000', '₦250'], a: '₦1,000', e: '20% = 0.2 × 5,000 = 1,000.' },
				{ p: `What is a budget?`, o: ['A plan for money', 'A type of loan', 'A shopping list only', 'A bank building'], a: 'A plan for money', e: 'A budget plans income, spending and savings.' }
			],
			Civics: [
				{ p: `What do the white stripes on Nigeria’s flag represent?`, o: ['Peace and unity', 'Oil', 'Rivers', 'Strength'], a: 'Peace and unity', e: 'Green stands for agriculture; white for peace and unity.' },
				{ p: `Which is a responsibility of a citizen?`, o: ['Respect others’ rights', 'Ignore laws', 'Damage public property', 'Skip school'], a: 'Respect others’ rights', e: 'Rights and responsibilities are paired.' },
				{ p: `What is a constitution?`, o: ['The fundamental rules of a country', 'A type of market', 'A school timetable', 'A football rule'], a: 'The fundamental rules of a country', e: 'A constitution sets out how a country is governed and protects rights.' }
			]
		};
		const bank = bankBySubject[subject] ?? bankBySubject.Science;
		for (let i = 0; i < n; i++) {
			const b = bank[i % bank.length];
			list.push({ id: 'q' + i, prompt: b.p, options: b.o, answer: b.a, explanation: b.e, skill: topic });
		}
		return list;
	}

	function generate() {
		if (!topic.trim()) return toast('Add a topic first', 'error', '✏️');
		generating = true;
		setTimeout(() => {
			draft = { title: `${topic} · ${type === 'quiz' ? 'quick quiz' : type}`, questions: generateQuestions() };
			generating = false;
			toast('Draft generated — review and edit before publishing.', 'success', '✨');
		}, 900);
	}

	function addQuestion() {
		if (!draft) return;
		draft.questions = [...draft.questions, { id: 'q' + Date.now(), prompt: 'New question…', options: ['Option A', 'Option B', 'Option C', 'Option D'], answer: 'Option A', explanation: 'Explain why the answer is correct.', skill: topic }];
	}

	function removeQuestion(id: string) {
		if (!draft) return;
		draft.questions = draft.questions.filter((q) => q.id !== id);
	}

	function publish() {
		if (!draft) return;
		saved = [{ title: draft.title, type: type === 'quiz' ? 'Quiz' : type === 'lesson' ? 'Lesson' : 'Game', items: draft.questions.length, status: 'Published', emoji: type === 'quiz' ? '📘' : type === 'lesson' ? '📖' : '🎮' }, ...saved];
		toast(`“${draft.title}” published to JSS 2A`, 'success', '🚀');
		celebrate();
		draft = null;
	}

	function saveDraft() {
		if (!draft) return;
		saved = [{ title: draft.title, type: type === 'quiz' ? 'Quiz' : type === 'lesson' ? 'Lesson' : 'Game', items: draft.questions.length, status: 'Draft', emoji: '📝' }, ...saved];
		toast('Draft saved', 'info', '💾');
		draft = null;
	}

	const types = [
		{ id: 'quiz', label: 'Quiz', emoji: '❓', desc: 'Auto-marked questions' },
		{ id: 'lesson', label: 'Lesson', emoji: '📖', desc: 'Cards + practice' },
		{ id: 'game', label: 'Game challenge', emoji: '🎮', desc: 'Turn content into play' }
	];
</script>

<svelte:head><title>Content Studio · Sabify for teachers</title></svelte:head>

<div class="space-y-5">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">Content Studio</p>
			<h1 class="mt-1 display text-2xl font-semibold sm:text-3xl">Turn any topic into a learning experience.</h1>
			<p class="mt-1 text-sm text-slate">Generate a draft with AI, edit every question, then publish to your class.</p>
		</div>
		<div class="flex gap-2">
			<button class="btn btn-ghost btn-sm" onclick={() => toast('Template gallery opened', 'info', '📚')}>Templates</button>
			<button class="btn btn-primary btn-sm" onclick={generate} disabled={generating}>{#if generating}<Loader2 size={14} class="animate-spin" /> Generating…{:else}<Wand2 size={15} /> Generate draft{/if}</button>
		</div>
	</div>

	<div class="grid gap-4 xl:grid-cols-[0.9fr_1.35fr]">
		<div class="space-y-4">
			<div class="card p-4 sm:p-5">
				<div class="flex items-center gap-2"><Sparkles size={16} class="text-[#7a4f00]" /><p class="text-sm font-extrabold">Build with Sabi</p></div>
				<p class="mt-1 text-[0.68rem] text-slate">Describe what you want to teach. The draft is a starting point — your judgement stays in charge.</p>
				<div class="mt-3 space-y-2.5">
					<div>
						<span class="label">Content type</span>
						<div class="grid grid-cols-3 gap-1.5">
							{#each types as t}
								<button class={`rounded-xl border-2 p-2 text-center text-[0.62rem] font-extrabold transition ${type === t.id ? 'border-forest bg-[#f2fbdf]' : 'border-[#e9e4d6] bg-white'}`} onclick={() => (type = t.id)}>
									<span class="block text-lg">{t.emoji}</span>{t.label}
								</button>
							{/each}
						</div>
					</div>
					<div class="grid gap-2 sm:grid-cols-2">
						<div>
							<label class="label" for="subject">Subject</label>
							<select id="subject" class="input" bind:value={subject}>
								{#each ['Mathematics', 'English', 'Science', 'Coding', 'Money', 'Civics'] as s}<option>{s}</option>{/each}
							</select>
						</div>
						<div>
							<label class="label" for="grade">Grade</label>
							<select id="grade" class="input" bind:value={grade}>
								{#each ['Primary 4', 'Primary 5', 'Primary 6', 'JSS 1', 'JSS 2', 'JSS 3', 'SSS 1'] as g}<option>{g}</option>{/each}
							</select>
						</div>
					</div>
					<div>
						<label class="label" for="topic">Topic or learning objective</label>
						<textarea id="topic" class="input min-h-20" bind:value={topic} placeholder="e.g. Compare fractions with unlike denominators"></textarea>
					</div>
					<div class="grid grid-cols-2 gap-2">
						<div>
							<label class="label" for="diff">Difficulty</label>
							<select id="diff" class="input" bind:value={difficulty}><option>Starter</option><option>Explorer</option><option>Champion</option></select>
						</div>
						<div>
							<label class="label" for="count">Questions</label>
							<select id="count" class="input" bind:value={count}><option value="3">3</option><option value="5">5</option><option value="8">8</option><option value="10">10</option></select>
						</div>
					</div>
					<button class="btn btn-primary w-full" onclick={generate} disabled={generating}>{#if generating}Generating draft…{:else}<Wand2 size={15} /> Generate draft{/if}</button>
					<p class="text-center text-[0.58rem] text-slate">AI drafts must be reviewed by a teacher before publishing.</p>
				</div>
			</div>

			<div class="card p-4 sm:p-5">
				<p class="text-sm font-extrabold">Quick templates</p>
				<div class="mt-2 grid grid-cols-2 gap-1.5">
					{#each templates as t}
						<button class="rounded-xl border border-[#eee9dc] bg-white p-2.5 text-left transition hover:border-[#c9d7b8]" onclick={() => { topic = t.t; type = t.t.includes('game') ? 'game' : 'quiz'; toast(`${t.t} template loaded`, 'info', '📋'); }}>
							<span class="text-lg">{t.e}</span>
							<p class="mt-1 text-[0.66rem] font-extrabold">{t.t}</p>
							<p class="text-[0.58rem] text-slate">{t.d}</p>
						</button>
					{/each}
				</div>
			</div>

			<div class="card p-4">
				<p class="text-sm font-extrabold">My content</p>
				<div class="mt-2 space-y-1.5">
					{#each saved.slice(0, 5) as c}
						<div class="flex items-center gap-2 rounded-xl bg-[#faf8f0] px-2.5 py-2">
							<span class="text-base">{c.emoji}</span>
							<div class="min-w-0 flex-1"><p class="truncate text-[0.68rem] font-bold">{c.title}</p><p class="text-[0.58rem] text-slate">{c.type} · {c.items} items</p></div>
							<span class={`pill text-[0.5rem] ${c.status === 'Published' ? '' : 'pill-gold'}`}>{c.status}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="space-y-4">
			{#if draft}
				<div class="card overflow-hidden">
					<div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#eee9dc] px-4 py-3">
						<div>
							<p class="text-[0.58rem] font-extrabold uppercase tracking-wider text-slate">Draft preview</p>
							<input class="mt-0.5 w-full bg-transparent display text-lg font-semibold outline-none" bind:value={draft.title} />
						</div>
						<div class="flex gap-1.5">
							<button class="btn btn-ghost btn-sm" onclick={saveDraft}><Save size={13} /> Save draft</button>
							<button class="btn btn-primary btn-sm" onclick={publish}><Check size={13} /> Publish</button>
						</div>
					</div>
					<div class="space-y-3 p-4">
						{#each draft.questions as q, i}
							<div class="rounded-2xl border border-[#eee9dc] p-3">
								<div class="flex items-center gap-2">
									<span class="grid h-6 w-6 place-items-center rounded-full bg-[#f2fbdf] text-[0.6rem] font-extrabold text-[#256b16]">{i + 1}</span>
									<input class="flex-1 bg-transparent text-[0.78rem] font-extrabold outline-none" bind:value={q.prompt} />
									<button class="text-slate hover:text-[#b42318]" onclick={() => removeQuestion(q.id)} aria-label="Delete question"><Trash2 size={13} /></button>
								</div>
								<div class="mt-2 grid gap-1.5 sm:grid-cols-2">
									{#each q.options as option, oi}
										<div class="flex items-center gap-1.5 rounded-lg bg-[#faf8f0] px-2 py-1">
											<span class="text-[0.56rem] font-extrabold text-slate">{String.fromCharCode(65 + oi)}</span>
											<input class="w-full bg-transparent text-[0.66rem] outline-none" bind:value={q.options[oi]} />
											<button class={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${q.answer === option ? 'border-forest bg-forest text-white' : 'border-[#d8d3c2]'}`} onclick={() => (q.answer = option)} aria-label="Mark correct">{#if q.answer === option}<Check size={9} />{/if}</button>
										</div>
									{/each}
								</div>
								<p class="mt-1.5 text-[0.6rem] text-slate"><span class="font-extrabold text-[#0b6b45]">Answer:</span> {q.answer}</p>
							</div>
						{/each}
						<button class="btn btn-ghost btn-sm w-full" onclick={addQuestion}><Plus size={14} /> Add question</button>
					</div>
				</div>
			{:else}
				<div class="card grid place-items-center px-6 py-16 text-center">
					<div class="grid h-16 w-16 place-items-center rounded-3xl bg-[#f2fbdf] text-3xl">🪄</div>
					<h3 class="mt-3 display text-xl font-semibold">Your draft will appear here</h3>
					<p class="mt-1 max-w-sm text-sm text-slate">Choose a subject, add a topic and press Generate. You can edit every question, option and explanation before publishing.</p>
					<button class="btn btn-primary btn-sm mt-4" onclick={generate} disabled={generating}><Wand2 size={14} /> Generate my first draft</button>
				</div>
			{/if}

			<div class="grid gap-3 sm:grid-cols-3">
				{#each [
					{ e: '🎯', t: 'Curriculum aligned', d: 'Drafts are mapped to NERDC and Cambridge skills.' },
					{ e: '🛡️', t: 'Teacher-controlled', d: 'Nothing publishes without your review.' },
					{ e: '🎮', t: 'Game-ready', d: 'Turn any quiz into a classroom challenge.' }
				] as f}
					<div class="card p-3.5"><span class="text-xl">{f.e}</span><p class="mt-1 text-[0.74rem] font-extrabold">{f.t}</p><p class="text-[0.62rem] leading-snug text-slate">{f.d}</p></div>
				{/each}
			</div>
		</div>
	</div>
</div>
