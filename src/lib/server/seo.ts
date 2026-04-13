import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import type { Card } from '$lib/types';

type SeoPayload = {
	title: string;
	description: string;
	canonical: string;
	image?: string;
	jsonLd: string;
};

const SITE_URL_CANDIDATES = [
	privateEnv.SITE_URL,
	publicEnv.PUBLIC_SITE_URL,
	publicEnv.PUBLIC_APP_URL
].filter((value): value is string => Boolean(value?.trim()));

function stripHtml(value = '') {
	return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncate(value: string, maxLength = 160) {
	if (value.length <= maxLength) {
		return value;
	}

	return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

function getSiteOrigin(url: URL) {
	for (const candidate of SITE_URL_CANDIDATES) {
		try {
			return new URL(candidate).origin;
		} catch {
			continue;
		}
	}

	return url.origin;
}

export function buildAbsoluteUrl(path: string, url: URL) {
	return new URL(path, `${getSiteOrigin(url)}/`).toString();
}

export function buildCanonicalUrl(url: URL) {
	const path = url.pathname === '/' ? '/' : url.pathname;
	return buildAbsoluteUrl(path, url);
}

export function buildDescription(value: string | undefined, fallback: string) {
	const cleaned = stripHtml(value || '');
	return truncate(cleaned || fallback);
}

export function buildHomepageSeo(cards: Card[], url: URL): SeoPayload {
	const title = 'Trading Card Collection | The Hero Archive';
	const description =
		'Browse a server-rendered collection of superhero trading cards with ratings powered by SvelteKit while WordPress remains read-only.';
	const canonical = buildCanonicalUrl(url);
	const image = cards.find((card) => card.featuredImage?.node?.sourceUrl)?.featuredImage?.node?.sourceUrl;
	const itemListElement = cards
		.filter((card) => card.slug)
		.map((card, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: card.title,
			url: buildAbsoluteUrl(`/cards/${card.slug}`, url)
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
	const canonical = buildCanonicalUrl(url);
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
			url: buildAbsoluteUrl('/', url)
		}
	});

	return { title, description, canonical, image, jsonLd };
}
