import { error as svelteError } from '@sveltejs/kit';
import { buildCardSeo } from '$lib/server/seo';
import { ratingStore } from '$lib/server/ratings';
import { getCardBySlug } from '$lib/server/wp';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, locals, params, setHeaders, url }) => {
	setHeaders({
		'cache-control': 'private, no-store'
	});

	const card = await getCardBySlug(params.slug, fetch);

	if (!card) {
		throw svelteError(404, 'Card not found');
	}

	const ratings = ratingStore.ensureRatings([card.id]);
	const votedCardIds = new Set(ratingStore.getVotesForSession(locals.sessionId));
	const hydratedCard = {
		...card,
		rating: ratings.get(card.id) ?? 0,
		viewerHasVoted: votedCardIds.has(card.id)
	};

	return {
		card: hydratedCard,
		seo: buildCardSeo(hydratedCard, url)
	};
};
