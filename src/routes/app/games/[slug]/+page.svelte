<script lang="ts">
	import { page } from '$app/stores';
	import { getGame } from '$lib/data/games';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import NumberNebula from '$lib/components/games/NumberNebula.svelte';
	import WordForge from '$lib/components/games/WordForge.svelte';
	import TypeStorm from '$lib/components/games/TypeStorm.svelte';
	import MemoryMatch from '$lib/components/games/MemoryMatch.svelte';
	import QuizArena from '$lib/components/games/QuizArena.svelte';
	import LogicLab from '$lib/components/games/LogicLab.svelte';
	import MoneyQuest from '$lib/components/games/MoneyQuest.svelte';

	let slug = $derived($page.params.slug ?? '');
	let game = $derived(getGame(slug));
</script>

<svelte:head><title>{game?.name ?? 'Arcade game'} · Sabify</title></svelte:head>

{#if slug === 'number-nebula'}
	<NumberNebula />
{:else if slug === 'word-forge'}
	<WordForge />
{:else if slug === 'type-storm'}
	<TypeStorm />
{:else if slug === 'memory-match'}
	<MemoryMatch />
{:else if slug === 'quiz-arena'}
	<QuizArena />
{:else if slug === 'logic-lab'}
	<LogicLab />
{:else if slug === 'money-quest'}
	<MoneyQuest />
{:else}
	<EmptyState title="Game not found" body="That game may have moved. Head back to the arcade and pick a new challenge." cta="Back to arcade" href="/app/games" emoji="🎮" />
{/if}
