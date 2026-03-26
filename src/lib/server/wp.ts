import { dev } from '$app/environment';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import type { Card, CardsResponse, SingleCardResponse } from '$lib/types';

const DEFAULT_WP_GRAPHQL_URL = 'http://127.0.0.1:8882/graphql/';
const LOCAL_WP_GRAPHQL_FALLBACKS = [
	DEFAULT_WP_GRAPHQL_URL,
	'http://localhost:8882/graphql/',
	'https://trading-cards-collection-graphql.wp.local:8882/graphql/',
	'https://trading-cards-collection-graphql.wp.local/graphql/',
	'http://localhost:8887/graphql/'
];

const CARD_SUMMARY_FIELDS = `
	id
	title
	slug
	excerpt
	date
	featuredImage {
		node {
			sourceUrl
		}
	}
	categories {
		nodes {
			name
			slug
		}
	}
`;

const CARD_DETAIL_FIELDS = `
	${CARD_SUMMARY_FIELDS}
	content
`;

const GET_CARDS = `
	query GetCards {
		posts {
			nodes {
				${CARD_SUMMARY_FIELDS}
			}
		}
	}
`;

const GET_CARD_BY_SLUG = `
	query GetCardBySlug($slug: ID!) {
		post(id: $slug, idType: SLUG) {
			${CARD_DETAIL_FIELDS}
		}
	}
`;

type FetchLike = typeof fetch;
let resolvedWpGraphqlUrl: string | null = null;

function normalizeUrl(url: string) {
	return url.endsWith('/') ? url : `${url}/`;
}

function getConfiguredWpGraphqlUrl() {
	return privateEnv.WP_GRAPHQL_URL || publicEnv.PUBLIC_WP_GRAPHQL_URL || '';
}

function getCandidateWpGraphqlUrls() {
	if (resolvedWpGraphqlUrl) {
		return [resolvedWpGraphqlUrl];
	}

	const configuredUrl = getConfiguredWpGraphqlUrl().trim();

	if (configuredUrl) {
		return [normalizeUrl(configuredUrl)];
	}

	if (!dev) {
		return [DEFAULT_WP_GRAPHQL_URL];
	}

	return [...new Set(LOCAL_WP_GRAPHQL_FALLBACKS.map(normalizeUrl))];
}

function getErrorMessage(error: unknown) {
	if (error instanceof Error) {
		if (error.cause instanceof Error) {
			return `${error.message}: ${error.cause.message}`;
		}

		return error.message;
	}

	return String(error);
}

async function fetchGraphQL<T>(
	query: string,
	variables: Record<string, unknown> = {},
	fetchFn: FetchLike = fetch
): Promise<T> {
	const candidates = getCandidateWpGraphqlUrls();
	const failures: string[] = [];

	for (const endpoint of candidates) {
		try {
			const response = await fetchFn(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query,
					variables
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status} ${response.statusText}`);
			}

			const { data, errors } = await response.json();

			if (errors) {
				throw new Error(`GraphQL error: ${errors[0]?.message || 'Unknown error'}`);
			}

			resolvedWpGraphqlUrl = endpoint;

			return data as T;
		} catch (error) {
			failures.push(`${endpoint} -> ${getErrorMessage(error)}`);
		}
	}

	throw new Error(`Unable to reach WordPress GraphQL. Tried: ${failures.join(' | ')}`);
}

export async function getCards(fetchFn?: FetchLike): Promise<CardsResponse> {
	return fetchGraphQL<CardsResponse>(GET_CARDS, {}, fetchFn);
}

export async function getCardBySlug(slug: string, fetchFn?: FetchLike): Promise<Card | null> {
	const result = await fetchGraphQL<SingleCardResponse>(GET_CARD_BY_SLUG, { slug }, fetchFn);
	return result.post ?? null;
}
