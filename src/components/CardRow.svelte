<script lang="ts">
	import Card from './Card.svelte';
	import type { Card as CardType } from '$lib/types';

	export let cards: CardType[];

	let readyIndexes = new Set<number>();
	let revealedCount = cards.length ? 1 : 0;
	let previousSignature = '';

	function getCardsSignature(nextCards: CardType[]) {
		return nextCards.map((card) => card.id).join('|');
	}

	function resetRevealState(nextCards: CardType[]) {
		readyIndexes = new Set();
		revealedCount = nextCards.length ? 1 : 0;
	}

	$: {
		const signature = getCardsSignature(cards);
		if (signature !== previousSignature) {
			previousSignature = signature;
			resetRevealState(cards);
		}
	}

	function flushRevealQueue() {
		while (revealedCount < cards.length && readyIndexes.has(revealedCount - 1)) {
			revealedCount += 1;
		}
	}

	function handleImageReady(index: number) {
		readyIndexes.add(index);
		flushRevealQueue();
	}
</script>

<div class="cards-row">
	{#each cards as card, i (card.id)}
		<Card {card} index={i} revealed={i < revealedCount} on:imageready={() => handleImageReady(i)} />
	{/each}
</div>

<style>
	.cards-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 3rem;
		align-items: start;
	}

	@media (max-width: 1024px) {
		.cards-row {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.5rem;
		}
	}

	@media (max-width: 768px) {
		.cards-row {
			grid-template-columns: 1fr;
			gap: 2.5rem;
		}
	}

	@media (max-width: 480px) {
		.cards-row {
			gap: 3rem;
		}
	}
</style>
