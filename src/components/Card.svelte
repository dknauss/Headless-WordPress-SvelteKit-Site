<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { decrementRating, incrementRating } from '$lib/rating';
	import type { Card } from '$lib/types';

	export let card: Card;
	export let expanded = false;
	export let index = 0;

	const dispatch = createEventDispatcher();

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
	$: titleId = `card-title-${cardDomId}`;
	$: detailsId = `card-details-${cardDomId}`;
	$: ratingStatusId = `card-rating-status-${cardDomId}`;

	function toggleExpand() {
		dispatch('toggle');
	}

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

<article
	class="trading-card-shell"
	class:expanded={expanded}
	style:animation-delay={`${index * 80}ms`}
	style:--rest-rotation={`${restRotation}deg`}
>
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
		<button
			class="card-toggle"
			type="button"
			aria-expanded={expanded}
			aria-controls={detailsId}
			on:click={toggleExpand}
		>
			<div class="image-wrapper">
				{#if card.featuredImage?.node?.sourceUrl}
					<img src={card.featuredImage.node.sourceUrl} alt={card.title} loading="lazy" decoding="async" />
				{:else}
					<div class="no-image">NO HERO DATA</div>
				{/if}
			</div>

			<div class="card-body">
				<h2 id={titleId}>{card.title}</h2>

				<div class="card-meta">
					{#if card.categories?.nodes?.length}
						<span class="card-set">
							{card.categories.nodes[0].name}
						</span>
					{/if}

					<div class="expand-prompt" class:hidden={expanded} aria-hidden={expanded}>
						<span class="expand-prompt-desktop">CLICK ME</span>
						<span class="expand-prompt-mobile">TAP ME</span>
					</div>
				</div>
			</div>
		</button>

		{#if expanded}
			<div class="excerpt-accordion open" id={detailsId} role="region" aria-labelledby={titleId}>
				<div class="excerpt-content">
					<div class="excerpt">{@html card.excerpt}</div>
				</div>
			</div>
		{/if}
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

	.trading-card-shell.expanded {
		transform: scale(1.02) rotate(0deg);
		z-index: 15;
		box-shadow: 12px 12px 0px var(--color-hero-red);
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

	.trading-card-shell.expanded .card-content {
		border-color: var(--color-hero-red);
	}

	.card-toggle {
		display: block;
		width: 100%;
		padding: 0;
		border: 0;
		background: transparent;
		color: inherit;
		text-align: left;
		cursor: pointer;
	}

	.card-toggle:focus-visible,
	.rating-starburst:focus-visible {
		outline: 4px solid var(--color-hero-yellow);
		outline-offset: 6px;
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
		object-fit: cover;
		filter: contrast(1.1) brightness(1.05);
		will-change: transform;
	}

	.no-image {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-hero-white);
		font-family: var(--font-heading);
		font-size: 1.5rem;
		text-shadow: 2px 2px 0 #000;
	}

	.rating-starburst {
		position: absolute;
		top: -20px;
		right: -20px;
		width: 65px;
		height: 65px;
		display: flex;
		align-items: center;
		justify-content: center;
		filter: drop-shadow(3px 3px 0px black);
		z-index: 20;
		background: transparent;
		border: 0;
		padding: 0;
		cursor: pointer;
		transition:
			transform 0.2s ease-out,
			filter 0.2s ease-out,
			opacity 0.2s ease-out;
	}

	.rating-starburst:hover:not(:disabled) {
		transform: scale(1.04) rotate(-8deg);
	}

	.rating-starburst:active:not(:disabled) {
		transform: scale(0.98);
	}

	.rating-starburst.voted {
		filter: drop-shadow(3px 3px 0px var(--color-hero-black));
	}

	.rating-starburst.voting {
		opacity: 0.75;
	}

	.rating-starburst:disabled {
		cursor: progress;
	}

	.starburst-svg {
		position: absolute;
		width: 100%;
		height: 100%;
		animation: spin 10s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.rating-value {
		position: relative;
		display: inline-block;
		font-family: var(--font-rating);
		font-style: italic;
		font-size: 1.55rem;
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.01em;
		color: var(--color-hero-black);
		text-shadow:
			1px 0 var(--color-hero-white),
			-1px 0 var(--color-hero-white),
			0 1px var(--color-hero-white),
			0 -1px var(--color-hero-white);
		z-index: 2;
	}

	.rating-starburst.multi-digit .rating-value {
		font-size: 1.2rem;
		letter-spacing: -0.02em;
	}

	.card-body {
		padding: 1.2rem;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		min-height: 10rem;
		min-width: 220px;
	}

	h2 {
		margin: 0;
		min-height: 65px;
		font-size: 1.8rem;
		line-height: 1;
		color: var(--color-hero-red);
		-webkit-text-stroke: 1px black;
		text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
		justify-content: space-between;
	}

	.card-set {
		display: inline-block;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-hero-blue);
		padding: 0.2rem 0.8rem;
		border: 1px solid currentColor;
		transform: skew(-10deg);
	}

	.excerpt-accordion {
		display: grid;
		grid-template-rows: 1fr;
		overflow: hidden;
	}

	.excerpt-content {
		min-height: 0;
	}

	.excerpt {
		font-family: var(--font-comic-text);
		font-size: 1.1rem;
		color: #1a1a1a;
		line-height: 1.5;
		padding: 1rem 1.2rem 1.2rem;
		border-top: 2px dashed #ccc;
	}

	.excerpt :global(p) {
		margin: 0 0 1.2rem 0;
	}

	.excerpt :global(p:last-child) {
		margin-bottom: 0;
	}

	.expand-prompt {
		font-family: var(--font-heading);
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-hero-white);
		background-color: var(--color-hero-blue);
		text-align: center;
		border: 2px solid #000;
		padding: 0.2rem 0.6rem;
		opacity: 1;
		transition: opacity 0.3s ease-out;
	}

	.expand-prompt.hidden {
		opacity: 0;
		pointer-events: none;
	}

	.expand-prompt-mobile {
		display: none;
	}

	@media (hover: hover) {
		.trading-card-shell:hover .expand-prompt,
		.card-toggle:focus-visible .expand-prompt {
			color: var(--color-hero-red);
			border-color: var(--color-hero-red);
			background-color: rgba(239, 68, 68, 0.08);
		}
	}

	@media (max-width: 1024px) {
		.expand-prompt-desktop {
			display: none;
		}

		.expand-prompt-mobile {
			display: inline;
		}
	}

	@media (max-width: 768px) {
		h2 {
			font-size: 1.5rem;
		}

		.card-body {
			padding: 1rem;
			gap: 0.6rem;
			height: fit-content;
		}

		.excerpt {
			padding: 1rem;
		}

		.rating-starburst {
			top: -14px;
			right: -14px;
			width: 55px;
			height: 55px;
		}

		.rating-value {
			font-size: 1.3rem;
		}

		.rating-starburst.multi-digit .rating-value {
			font-size: 1.05rem;
		}

		.image-wrapper {
			border-bottom-width: 2px;
		}

		img {
			filter: none;
		}

		.rating-starburst {
			filter: none;
		}

		.starburst-svg {
			animation: none;
		}
	}

	@media (max-width: 480px) {
		h2 {
			font-size: 1.3rem;
			-webkit-text-stroke: 0.5px black;
		}

		.card-body {
			padding: 0.8rem;
			gap: 0.5rem;
			height: fit-content;
		}

		.no-image {
			font-size: 1.2rem;
		}

		.rating-starburst {
			top: -10px;
			right: -10px;
			width: 45px;
			height: 45px;
		}

		.rating-value {
			font-size: 1.1rem;
		}

		.rating-starburst.multi-digit .rating-value {
			font-size: 0.92rem;
		}

		.excerpt {
			font-size: 1rem;
			padding: 0.8rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.trading-card-shell,
		.expand-prompt,
		.rating-starburst {
			transition: none;
		}

		.starburst-svg,
		.card-content {
			animation: none;
		}

		.trading-card-shell,
		.trading-card-shell:hover,
		.trading-card-shell.expanded {
			transform: none;
		}
	}
</style>
