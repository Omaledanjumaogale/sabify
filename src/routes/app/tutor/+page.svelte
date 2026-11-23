<script lang="ts">
	import { onMount } from 'svelte';
	import { Mic, Send, Sparkles, Trash2, Volume2, VolumeX, ShieldCheck, Brain, Lightbulb, ArrowRight } from '@lucide/svelte';
	import { session } from '$lib/stores/session';
	import { progress } from '$lib/stores/progress';
	import { tutorReply } from '$lib/engine/tutor';
	import { rich } from '$lib/engine/text';
	import { toast } from '$lib/stores/toast';
	import Mascot from '$lib/components/Mascot.svelte';

	interface Msg {
		id: string;
		role: 'user' | 'sabi';
		text: string;
		topic?: string;
		at: string;
	}

	const KEY = 'sabify.tutor.v1';
	let messages = $state<Msg[]>([]);
	let input = $state('');
	let typing = $state(false);
	let voiceOn = $state(false);
	let listening = $state(false);
	let level = $state('Standard');
	let scroller: HTMLDivElement;
	type SpeechRec = {
		start: () => void;
		stop: () => void;
		lang: string;
		interimResults: boolean;
		continuous: boolean;
		onresult: ((e: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
		onend: (() => void) | null;
	};
	let recognition: SpeechRec | null = null;

	let user = $derived($session.user);
	let lastSuggestions = $state<string[]>(['Explain fractions simply', 'Why is the sky blue?', 'Help me plan a story', 'Quiz me on science']);
	let suggestions = $derived(messages.filter((m) => m.role === 'sabi').at(-1)?.topic ? lastSuggestions : ['Explain fractions simply', 'Why is the sky blue?', 'Help me plan a story', 'Quiz me on science']);

	function welcome(): Msg {
		return {
			id: 'welcome',
			role: 'sabi',
			text: `Hi ${user?.firstName ?? 'there'}! 👋 I’m **Sabi**, your study buddy.\n\nI can explain a tricky idea, help you break down homework, or quiz you on what you’ve learned. I’ll start with hints and questions — not just answers.\n\nWhat shall we work on?`,
			topic: 'greeting',
			at: new Date().toISOString()
		};
	}

	onMount(() => {
		try {
			const saved = localStorage.getItem(KEY);
			if (saved) {
				const parsed = JSON.parse(saved) as Msg[];
				if (Array.isArray(parsed) && parsed.length) messages = parsed;
			}
		} catch {
			/* ignore */
		}
		if (!messages.length) messages = [welcome()];
	});

	function persist() {
		try {
			localStorage.setItem(KEY, JSON.stringify(messages.slice(-40)));
		} catch {
			/* ignore */
		}
	}

	function scrollBottom() {
		setTimeout(() => {
			if (scroller) scroller.scrollTop = scroller.scrollHeight;
		}, 40);
	}

	function send(text?: string) {
		const content = (text ?? input).trim();
		if (!content || typing) return;
		messages = [...messages, { id: 'm' + Date.now(), role: 'user', text: content, at: new Date().toISOString() }];
		input = '';
		typing = true;
		persist();
		scrollBottom();
		setTimeout(() => {
			const reply = tutorReply(content, {
				name: user?.firstName ?? 'friend',
				age: user?.age ?? 11,
				grade: user?.grade ?? 'Primary 5',
				style: user?.learningStyle ?? 'Playful'
			});
			lastSuggestions = reply.suggestions;
			messages = [...messages, { id: 's' + Date.now(), role: 'sabi', text: reply.text, topic: reply.topic, at: new Date().toISOString() }];
			typing = false;
			persist();
			scrollBottom();
			if (voiceOn && typeof speechSynthesis !== 'undefined') {
				const utterance = new SpeechSynthesisUtterance(reply.text.replace(/\*\*/g, '').replace(/[#*_]/g, ''));
				utterance.rate = 0.95;
				speechSynthesis.cancel();
				speechSynthesis.speak(utterance);
			}
		}, 650 + Math.random() * 500);
	}

	function clearChat() {
		messages = [welcome()];
		persist();
		toast('Conversation cleared', 'info', '🧹');
	}

	function useSuggestion(s: string) {
		send(s);
	}

	function startVoice() {
		if (typeof window === 'undefined') return;
		const w = window as unknown as { SpeechRecognition?: new () => SpeechRec; webkitSpeechRecognition?: new () => SpeechRec };
		const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
		if (!Ctor) {
			toast('Voice input is not supported in this browser. You can type instead.', 'info', '🎙️');
			return;
		}
		if (listening) {
			recognition?.stop();
			return;
		}
		const rec = new Ctor();
		rec.lang = 'en-NG';
		rec.interimResults = false;
		rec.continuous = false;
		rec.onresult = (e) => {
			const transcript = e.results[0][0].transcript;
			input = transcript;
			listening = false;
			send(transcript);
		};
		rec.onend = () => (listening = false);
		recognition = rec;
		try {
			rec.start();
			listening = true;
		} catch {
			listening = false;
		}
	}

	const starters = [
		{ emoji: '🧮', label: 'Fractions', prompt: 'Explain fractions with a pizza example.' },
		{ emoji: '🔬', label: 'Plants', prompt: 'Why do plants need sunlight?' },
		{ emoji: '✍️', label: 'Story', prompt: 'Help me write a story opening set in a market.' },
		{ emoji: '🪙', label: 'Money', prompt: 'Help me make a budget for ₦5,000.' },
		{ emoji: '🤖', label: 'Coding', prompt: 'Explain loops with an everyday example.' },
		{ emoji: '🎯', label: 'Quiz me', prompt: 'Quiz me on science, one question at a time.' }
	];

	let topics = $derived([...new Set(messages.filter((m) => m.topic && m.topic !== 'greeting').map((m) => m.topic))].slice(-5));
</script>

<svelte:head><title>AI study buddy · Sabify</title></svelte:head>

<div class="space-y-4">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div class="flex items-center gap-3">
			<div class="relative">
				<Mascot size={52} expression="wink" />
				<span class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald ring-2 ring-cream"></span>
			</div>
			<div>
				<p class="display text-xl font-semibold">Sabi</p>
				<p class="text-[0.68rem] font-bold text-[#0b6b45]">Online · {user?.grade} mode · age-safe</p>
			</div>
		</div>
		<div class="flex items-center gap-1.5">
			<select class="input !min-h-9 !w-auto !rounded-full !py-1.5 text-xs" bind:value={level} aria-label="Explanation depth">
				<option>Simple</option>
				<option>Standard</option>
				<option>Deep dive</option>
			</select>
			<button class="btn btn-ghost btn-icon" onclick={() => (voiceOn = !voiceOn)} aria-label="Toggle voice replies">
				{#if voiceOn}<Volume2 size={17} />{:else}<VolumeX size={17} />{/if}
			</button>
			<button class="btn btn-ghost btn-icon" onclick={clearChat} aria-label="Clear conversation"><Trash2 size={17} /></button>
		</div>
	</div>

	<div class="grid gap-4 xl:grid-cols-[1.55fr_0.75fr]">
		<div class="card flex h-[calc(100dvh-230px)] min-h-[520px] flex-col overflow-hidden">
			<div class="flex items-center gap-2 border-b border-[#eee9dc] px-4 py-2.5">
				<span class="h-2 w-2 rounded-full bg-emerald"></span>
				<p class="text-[0.64rem] font-bold text-slate">Private learning conversation · filtered for ages {user?.age ?? 11}</p>
				<span class="ml-auto pill text-[0.56rem]">{level} mode</span>
			</div>

			<div class="flex-1 space-y-3 overflow-y-auto bg-[#fbf8ef] p-3 sm:p-4" bind:this={scroller}>
				{#each messages as m (m.id)}
					{#if m.role === 'user'}
						<div class="ml-auto w-fit max-w-[88%] rounded-2xl rounded-br-md bg-forest px-3.5 py-2.5 text-sm leading-relaxed text-white">{m.text}</div>
					{:else}
						<div class="flex w-fit max-w-[92%] gap-2">
							<span class="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-lime to-[#83e0b0] text-sm">🪄</span>
							<div class="rounded-2xl rounded-bl-md border border-[#e5e0d1] bg-white px-3.5 py-2.5 text-[0.84rem] leading-relaxed text-[#2f4a3d]">
								{@html rich(m.text)}
							</div>
						</div>
					{/if}
				{/each}
				{#if typing}
					<div class="flex w-fit gap-2">
						<span class="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-lime to-[#83e0b0] text-sm">🪄</span>
						<div class="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[#e5e0d1] bg-white px-4 py-3">
							<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate/50"></span>
							<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate/50 [animation-delay:120ms]"></span>
							<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-slate/50 [animation-delay:240ms]"></span>
						</div>
					</div>
				{/if}
			</div>

			<div class="border-t border-[#eee9dc] bg-white p-3">
				<div class="no-scrollbar mb-2 flex gap-1.5 overflow-x-auto">
					{#each suggestions as s}
						<button class="chip shrink-0 text-[0.64rem] hover:border-[#c9d7b8]" onclick={() => useSuggestion(s)}>{s}</button>
					{/each}
				</div>
				<form class="flex items-end gap-2" onsubmit={(e) => { e.preventDefault(); send(); }}>
					<button type="button" class={`btn btn-icon shrink-0 ${listening ? 'btn-primary pulse-ring' : 'btn-ghost'}`} onclick={startVoice} aria-label="Speak your question">
						<Mic size={17} />
					</button>
					<div class="relative flex-1">
						<textarea
							class="input max-h-28 min-h-11 resize-none !rounded-2xl !py-2.5 pr-10 text-sm"
							placeholder={listening ? 'Listening… speak now' : 'Ask Sabi anything about your lessons…'}
							bind:value={input}
							onkeydown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									send();
								}
							}}
							rows="1"
						></textarea>
					</div>
					<button type="submit" class="btn btn-primary btn-icon shrink-0" disabled={!input.trim() || typing} aria-label="Send">
						<Send size={17} />
					</button>
				</form>
				<p class="mt-1.5 text-center text-[0.58rem] font-semibold text-slate">Sabi can make mistakes. Check important facts with your teacher or textbook.</p>
			</div>
		</div>

		<div class="space-y-3.5">
			<div class="card p-4">
				<div class="flex items-center gap-2">
					<Lightbulb size={16} class="text-[#7a4f00]" />
					<p class="text-sm font-extrabold">Start with a topic</p>
				</div>
				<div class="mt-2.5 grid grid-cols-2 gap-1.5">
					{#each starters as s}
						<button class="rounded-xl border border-[#eee9dc] bg-white p-2.5 text-left transition hover:border-[#c9d7b8]" onclick={() => useSuggestion(s.prompt)}>
							<span class="text-lg">{s.emoji}</span>
							<p class="mt-1 text-[0.68rem] font-extrabold">{s.label}</p>
						</button>
					{/each}
				</div>
			</div>

			<div class="card p-4">
				<div class="flex items-center gap-2">
					<Brain size={16} class="text-forest" />
					<p class="text-sm font-extrabold">Your focus areas</p>
				</div>
				<div class="mt-2 space-y-2">
					{#each Object.entries($progress.skillMastery).sort((a, b) => a[1] - b[1]).slice(0, 3) as [skill, value]}
						<div>
							<div class="flex items-center justify-between text-[0.66rem] font-bold"><span>{skill}</span><span class="text-slate">{value}%</span></div>
							<div class="progress-track mt-1 h-1.5"><div class="progress-fill" style={`width:${value}%`}></div></div>
						</div>
					{/each}
				</div>
				<button class="mt-3 inline-flex items-center gap-1 text-[0.64rem] font-extrabold text-forest" onclick={() => useSuggestion('Help me improve my weakest skill with a short plan.')}>Ask for a plan <ArrowRight size={12} /></button>
			</div>

			{#if topics.length}
				<div class="card p-4">
					<p class="text-sm font-extrabold">Topics in this chat</p>
					<div class="mt-2 flex flex-wrap gap-1.5">
						{#each topics as t}<span class="pill text-[0.56rem]">{t}</span>{/each}
					</div>
				</div>
			{/if}

			<div class="rounded-[1.5rem] bg-[#eef6df] p-4">
				<div class="flex items-center gap-2">
					<ShieldCheck size={16} class="text-[#0b6b45]" />
					<p class="text-sm font-extrabold">Safe by design</p>
				</div>
				<ul class="mt-2 space-y-1.5 text-[0.68rem] leading-snug text-[#3f564b]">
					<li>• Age-filtered language and topics</li>
					<li>• No open chat with strangers</li>
					<li>• Hints before answers, always</li>
					<li>• Parents can review conversations</li>
				</ul>
			</div>

			<div class="flex items-center gap-2 rounded-2xl border border-[#e5e0d1] bg-white px-3 py-2.5">
				<Sparkles size={15} class="text-[#7a4f00]" />
				<p class="text-[0.64rem] font-semibold text-slate">Sabi works best with specific questions. Try “explain step by step” or “give me an example”.</p>
			</div>
		</div>
	</div>
</div>
