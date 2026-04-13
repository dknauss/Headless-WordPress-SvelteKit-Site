<script lang="ts">
	import { CARD_DETAIL_IMAGE_SIZES, getResponsiveImage } from '$lib/image';
	import type { PageData } from './$types';

	export let data: PageData;

	$: card = data.card;
	$: seo = data.seo;
	$: imageAsset = getResponsiveImage(card.featuredImage?.node);
	$: categoryNames = card.categories?.nodes?.map((category) => category.name) || [];
	$: bodyHtml = card.content || '';
	$: publishedDate = card.date ? new Date(card.date).toLocaleDateString() : '';
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<link rel="canonical" href={seo.canonical} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:url" content={seo.canonical} />
	{#if seo.image}
		<meta property="og:image" content={seo.image} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	{#if seo.image}
		<meta name="twitter:image" content={seo.image} />
	{/if}
	<script type="application/ld+json">{seo.jsonLd}</script>
</svelte:head>

<main class="detail-page">
	<p class="breadcrumb"><a href="/">← Back to collection</a></p>

	<article class="card-detail">
		<div class="detail-hero">
			<div class="detail-image-frame">
				{#if imageAsset?.src}
					<img src={imageAsset.src} srcset={imageAsset.srcSet} sizes={CARD_DETAIL_IMAGE_SIZES} width={imageAsset.width} height={imageAsset.height} alt={card.title} loading="eager" fetchpriority="high" decoding="async" />
				{:else}
					<div class="no-image">NO HERO DATA</div>
				{/if}
			</div>

			<div class="detail-meta">
				<h1>{card.title}</h1>
				<p class="lede">{seo.description}</p>

				<div class="fact-grid" aria-label="Card facts">
					<div class="fact-card">
						<span class="fact-label">Rating</span>
						<span class="fact-value">{card.rating ?? 0}</span>
					</div>
					{#if publishedDate}
						<div class="fact-card">
							<span class="fact-label">Published</span>
							<span class="fact-value">{publishedDate}</span>
						</div>
					{/if}
					{#if categoryNames.length}
						<div class="fact-card fact-card-wide">
							<span class="fact-label">Categories</span>
							<span class="fact-value">{categoryNames.join(', ')}</span>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="detail-body">
			{#if card.excerpt}
				<section class="detail-section">
					<h2>Summary</h2>
					<div class="rich-text">{@html card.excerpt}</div>
				</section>
			{/if}

			{#if bodyHtml}
				<section class="detail-section">
					<h2>Details</h2>
					<div class="rich-text">{@html bodyHtml}</div>
				</section>
			{/if}
		</div>
	</article>
</main>

<style>
	.detail-page {
		max-width: 1100px;
		margin: 0 auto;
		padding: 3rem 1.5rem 4rem;
	}

	.breadcrumb {
		margin: 0 0 1.5rem;
		font-family: var(--font-heading);
		font-size: 1.1rem;
	}

	.breadcrumb a {
		color: var(--color-hero-red);
		text-decoration: none;
	}

	.breadcrumb a:hover,
	.breadcrumb a:focus-visible {
		text-decoration: underline;
	}

	.card-detail {
		background: var(--color-hero-white);
		border: var(--comic-border);
		box-shadow: var(--comic-shadow);
	}

	.detail-hero {
		display: grid;
		grid-template-columns: minmax(250px, 360px) 1fr;
		gap: 2rem;
		padding: 2rem;
		align-items: start;
	}

	.detail-image-frame {
		border: var(--comic-border);
		background: var(--color-hero-blue);
		aspect-ratio: 3 / 4;
		overflow: hidden;
	}

	img,
	.no-image {
		width: 100%;
		height: 100%;
	}

	img {
		display: block;
		object-fit: cover;
	}

	.no-image {
		display: grid;
		place-items: center;
		color: var(--color-hero-white);
		font-family: var(--font-heading);
		font-size: 2rem;
		text-align: center;
		padding: 1rem;
	}

	.detail-meta h1 {
		margin: 0 0 1rem;
		font-size: clamp(2.2rem, 5vw, 4rem);
		color: var(--color-hero-yellow);
		-webkit-text-stroke: 2px var(--color-hero-black);
		text-shadow: 4px 4px 0 var(--color-hero-black);
		line-height: 0.95;
	}

	.lede {
		margin: 0 0 1.5rem;
		font-size: 1.1rem;
		line-height: 1.6;
	}

	.fact-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.fact-card {
		border: 3px solid var(--color-hero-black);
		padding: 0.9rem 1rem;
		background: rgba(251, 191, 36, 0.15);
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.fact-card-wide {
		grid-column: 1 / -1;
	}

	.fact-label {
		font-family: var(--font-heading);
		font-size: 1rem;
	}

	.fact-value {
		font-size: 1rem;
		line-height: 1.4;
	}

	.detail-body {
		padding: 0 2rem 2rem;
		display: grid;
		gap: 1.5rem;
	}

	.detail-section h2 {
		margin: 0 0 0.75rem;
		font-size: 1.6rem;
	}

	.rich-text {
		line-height: 1.7;
		font-size: 1.05rem;
	}

	.rich-text :global(p:first-child) {
		margin-top: 0;
	}

	.rich-text :global(p:last-child) {
		margin-bottom: 0;
	}

	@media (max-width: 768px) {
		.detail-page {
			padding: 2rem 1rem 3rem;
		}

		.detail-hero {
			grid-template-columns: 1fr;
			padding: 1.25rem;
		}

		.detail-body {
			padding: 0 1.25rem 1.25rem;
		}

		.fact-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
