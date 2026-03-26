<script lang="ts">
	import { decrementRating, incrementRating } from '$lib/rating';
	import type { Card } from '$lib/types';

	export let card: Card;
	export let index = 0;

	function getRestRotation(seed: string) {
		let hash = 0;

		for (let i = 0; i < seed.length; i += 1) {
			hash = (hash * 31 + seed.charCodeAt(i)) | 0;
		}

		const normalized = ((Math.abs(hash) % 1000) / 1000) * 4 - 2;

		if (Math.abs(normalized) < 0.35) {
			return normalized < 0 ? -0.6 : 0.6;
		}

		return Number(normalized.toFixed(2));
	}

	function toDomId(value: string) {
		return value
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	let hasVoted = card.viewerHasVoted ?? false;
	let isVoting = false;

	$: if (!isVoting) {
		hasVoted = card.viewerHasVoted ?? false;
	}
	$: restRotation = getRestRotation(card.id || card.slug || card.title || String(index));
	$: ratingText = String(card.rating ?? 0);
	$: isMultiDigitRating = ratingText.length > 1;
	$: cardDomId = toDomId(card.id || card.slug || card.title || `card-${index}`);
	$: ratingStatusId = `card-rating-status-${cardDomId}`;
	$: detailUrl = card.slug ? `/cards/${card.slug}` : '';

	async function handleRatingClick(event: MouseEvent) {
		event.stopPropagation();

		if (isVoting || !card.id) {
			return;
		}

		const previousRating = card.rating ?? 0;
		const previousHasVoted = hasVoted;
		const isRemovingVote = hasVoted;
		const optimisticRating = Math.max(0, previousRating + (isRemovingVote ? -1 : 1));

		isVoting = true;
		hasVoted = !isRemovingVote;
		card.viewerHasVoted = hasVoted;
		card.rating = optimisticRating;
		card = card;

		try {
			const result = isRemovingVote
				? await decrementRating(card.id)
				: await incrementRating(card.id);

			card.rating = result.rating;
			hasVoted = result.hasVoted;
			card.viewerHasVoted = result.hasVoted;
			card = card;
		} catch (error) {
			hasVoted = previousHasVoted;
			card.viewerHasVoted = previousHasVoted;
			card.rating = previousRating;
			card = card;
			console.error('Failed to update rating:', error);
		} finally {
			isVoting = false;
		}
	}
</script>

<article class="trading-card-shell" style:animation-delay={`${index * 80}ms`} style:--rest-rotation={`${restRotation}deg`}>
	<button
		class="rating-starburst"
		class:voted={hasVoted}
		class:voting={isVoting}
		class:multi-digit={isMultiDigitRating}
		on:click={handleRatingClick}
		aria-label={hasVoted ? `Remove rating for ${card.title}` : `Rate ${card.title}`}
		aria-pressed={hasVoted}
		aria-describedby={ratingStatusId}
		disabled={isVoting || !card.id}
		type="button"
	>
		<svg viewBox="0 0 100 100" class="starburst-svg" aria-hidden="true">
			<polygon
				points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"
				fill={hasVoted ? 'var(--color-hero-red)' : 'var(--color-hero-yellow)'}
				stroke="black"
				stroke-width="4"
			/>
		</svg>
		<span class="rating-value" aria-hidden="true">{ratingText}</span>
	</button>
	<span id={ratingStatusId} class="screen-reader-text" aria-live="polite">
		Rating {ratingText}. {hasVoted ? 'Your rating is currently applied.' : 'You have not rated this card yet.'}
	</span>

	<div class="card-content">
		<div class="image-wrapper">
			{#if card.featuredImage?.node?.sourceUrl}
				<img src={card.featuredImage.node.sourceUrl} alt={card.title} loading="lazy" decoding="async" />
			{:else}
				<div class="no-image">NO HERO DATA</div>
			{/if}
		</div>

		<div class="card-body">
			<h2>{card.title}</h2>

			<div class="card-meta">
				{#if card.categories?.nodes?.length}
					<span class="card-set">{card.categories.nodes[0].name}</span>
				{/if}

				{#if detailUrl}
					<a class="detail-link" href={detailUrl}>View Card</a>
				{/if}
			</div>
		</div>
	</div>
</article>

<style>
	.trading-card-shell {
		background: transparent;
		border: none;
		transition:
			transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275),
			box-shadow 0.15s ease;
		position: relative;
		overflow: visible;
		-webkit-tap-highlight-color: transparent;
		box-shadow: var(--comic-shadow);
		transform: rotate(var(--rest-rotation, 0deg));
		transform-origin: center center;
	}

	@keyframes card-enter {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (hover: hover) {
		.trading-card-shell:hover {
			transform: scale(1.02) rotate(0deg);
			z-index: 10;
			box-shadow: 10px 10px 0px var(--color-hero-black);
		}
	}

	.card-content {
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 1;
		animation: card-enter 1s ease-out both;
		border: 2px solid var(--color-hero-black);
		background: var(--color-hero-white);
		background-image: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.4) 25%,
			transparent 25%,
			transparent 50%,
			rgba(255, 255, 255, 0.4) 50%,
			rgba(255, 255, 255, 0.4) 75%,
			transparent 75%,
			transparent
		);
		background-size: 4px 4px;
	}

	.image-wrapper {
		aspect-ratio: 3 / 4;
		background-color: var(--color-hero-blue);
		overflow: hidden;
		border-bottom: var(--comic-border);
		position: relative;
	}

	img {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}

	.no-image {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		padding: 1rem;
		text-align: center;
		font-family: var(--font-heading);
		font-size: clamp(1.5rem, 3vw, 2rem);
		color: var(--color-hero-white);
	}

	.rating-starburst {
		position: absolute;
		top: -18px;
		right: -18px;
		width: 88px;
		height: 88px;
		padding: 0;
		background: transparent;
		border: 0;
		cursor: pointer;
		z-index: 3;
		transition: transform 0.18s ease-out;
	}

	.rating-starburst:disabled {
		cursor: wait;
		opacity: 0.85;
	}

	.rating-starburst:focus-visible,
	.detail-link:focus-visible {
		outline: 4px solid var(--color-hero-yellow);
		outline-offset: 4px;
	}

	.rating-starburst:hover:not(:disabled) {
		transform: scale(1.04) rotate(-8deg);
	}

	.starburst-svg {
		width: 100%;
		height: 100%;
		display: block;
		filter: drop-shadow(2px 2px 0 var(--color-hero-black));
	}

	.rating-value {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		font-family: var(--font-rating);
		font-style: italic;
		font-weight: 800;
		font-size: 2rem;
		line-height: 1;
		color: var(--color-hero-black);
		text-shadow: 1px 1px 0 var(--color-hero-white), -1px -1px 0 rgba(255, 255, 255, 0.4);
	}

	.rating-starburst.multi-digit .rating-value {
		font-size: 1.6rem;
	}

	.card-body {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.2rem;
		min-width: 220px;
	}

	h2 {
		margin: 0;
		min-height: 65px;
		font-size: 1.8rem;
		line-height: 0.95;
		color: var(--color-hero-yellow);
		-webkit-text-stroke: 1px black;
		text-shadow: 2px 2px 0 var(--color-hero-black);
	}

	.card-meta {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 0.8rem;
	}

	.card-set {
		font-family: var(--font-heading);
		font-size: 1rem;
		line-height: 1;
		letter-spacing: 0.05em;
		color: var(--color-hero-black);
	}

	.detail-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.45rem 0.95rem 0.35rem;
		border: 3px dashed var(--color-hero-red);
		background: rgba(239, 68, 68, 0.08);
		color: var(--color-hero-red);
		font-family: var(--font-heading);
		font-size: 1rem;
		letter-spacing: 0.05em;
		text-decoration: none;
		text-transform: uppercase;
		line-height: 1;
		transition:
			color 0.2s ease-out,
			background-color 0.2s ease-out,
			border-color 0.2s ease-out,
			transform 0.15s ease-out;
	}

	.detail-link:hover {
		color: var(--color-hero-white);
		background-color: var(--color-hero-red);
		border-color: var(--color-hero-red);
		transform: translateY(-1px);
	}

	@media (max-width: 768px) {
		h2 {
			font-size: 1.5rem;
		}

		.card-body {
			min-width: 0;
		}

		.rating-starburst {
			top: -14px;
			right: -14px;
			width: 76px;
			height: 76px;
		}
	}

	@media (max-width: 480px) {
		h2 {
			font-size: 1.3rem;
			-webkit-text-stroke: 0.5px black;
		}

		.card-meta {
			align-items: stretch;
			flex-direction: column;
		}

		.detail-link {
			width: 100%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.trading-card-shell,
		.rating-starburst,
		.detail-link {
			transition: none;
		}

		.starburst-svg,
		.card-content {
			animation: none;
		}

		.trading-card-shell,
		.trading-card-shell:hover {
			transform: none;
		}
	}
</style>
