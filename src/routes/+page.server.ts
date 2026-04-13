import { buildHomepageSeo } from '$lib/server/seo';
import { ratingStore } from '$lib/server/ratings';
import { getCards } from '$lib/server/wp';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, locals, setHeaders, url }) => {
	setHeaders({
		'cache-control': 'private, no-store'
	});

	try {
		const result = await getCards(fetch);
		const ratings = ratingStore.ensureRatings(result.posts.nodes.map((card) => card.id));
		const votedCardIds = new Set(ratingStore.getVotesForSession(locals.sessionId));
		const cards = result.posts.nodes.map((card) => ({
			...card,
			rating: ratings.get(card.id) ?? 0,
			viewerHasVoted: votedCardIds.has(card.id)
		}));

		return {
			cards,
			error: '',
			seo: buildHomepageSeo(cards, url)
		};
	} catch (error) {
		return {
			cards: [],
			error: error instanceof Error ? error.message : 'Failed to load cards',
			seo: buildHomepageSeo([], url)
		};
	}
};
