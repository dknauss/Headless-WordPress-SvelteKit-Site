import type { Card } from '$lib/types';

type SeoPayload = {
	title: string;
	description: string;
	canonical: string;
	image?: string;
	jsonLd: string;
};

function stripHtml(value = '') {
	return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncate(value: string, maxLength = 160) {
	if (value.length <= maxLength) {
		return value;
	}

	return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

export function buildDescription(value: string | undefined, fallback: string) {
	const cleaned = stripHtml(value || '');
	return truncate(cleaned || fallback);
}

export function buildHomepageSeo(cards: Card[], url: URL): SeoPayload {
	const title = 'Trading Card Collection | The Hero Archive';
	const description =
		'Browse a server-rendered collection of superhero trading cards with ratings powered by SvelteKit while WordPress remains read-only.';
	const canonical = url.toString();
	const image = cards.find((card) => card.featuredImage?.node?.sourceUrl)?.featuredImage?.node?.sourceUrl;
	const itemListElement = cards
		.filter((card) => card.slug)
		.map((card, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: card.title,
			url: new URL(`/cards/${card.slug}`, url.origin).toString()
		}));

	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: 'Trading Card Collection',
		description,
		url: canonical,
		mainEntity: {
			'@type': 'ItemList',
			itemListElement
		}
	});

	return { title, description, canonical, image, jsonLd };
}

export function buildCardSeo(card: Card, url: URL): SeoPayload {
	const title = `${card.title} | Trading Card Collection`;
	const description = buildDescription(
		card.excerpt || card.content,
		`Read more about ${card.title} in the Trading Card Collection.`
	);
	const canonical = url.toString();
	const image = card.featuredImage?.node?.sourceUrl;
	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: card.title,
		description,
		url: canonical,
		image,
		datePublished: card.date,
		keywords: card.categories?.nodes?.map((category) => category.name) || [],
		isPartOf: {
			'@type': 'CollectionPage',
			name: 'Trading Card Collection',
			url: new URL('/', url.origin).toString()
		}
	});

	return { title, description, canonical, image, jsonLd };
}
