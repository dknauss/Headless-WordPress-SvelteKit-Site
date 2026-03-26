<script lang="ts">
	import Card from './Card.svelte';
	import type { Card as CardType } from '$lib/types';

	export let cards: CardType[];
</script>

<div class="cards-row">
	{#each cards as card, i (card.id)}
		<Card {card} index={i} />
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
