import { validateCsrf } from '$lib/server/security';
import { ratingStore } from '$lib/server/ratings';
import { json } from '@sveltejs/kit';

type RatingRequest = {
	id?: unknown;
	direction?: unknown;
};

function isValidCardId(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0 && value.length <= 255;
}

export async function POST(event) {
	const { request, locals } = event;
	const body = (await request.json().catch(() => null)) as RatingRequest | null;
	const responseHeaders = {
		'cache-control': 'private, no-store'
	};

	if (
		!body ||
		!isValidCardId(body.id) ||
		(body.direction !== 'increment' && body.direction !== 'decrement')
	) {
		return json({ error: 'Invalid rating request' }, { status: 400, headers: responseHeaders });
	}

	if (!validateCsrf(event)) {
		return json({ error: 'Invalid CSRF token' }, { status: 403, headers: responseHeaders });
	}

	if (ratingStore.isRateLimited(locals.sessionId, locals.clientIp)) {
		return json(
			{ error: 'Too many rating attempts, please wait a moment' },
			{ status: 429, headers: responseHeaders }
		);
	}

	ratingStore.recordAttempt(locals.sessionId, locals.clientIp);

	try {
		const result = ratingStore.applyVote(locals.sessionId, body.id, body.direction);

		if (!result.changed) {
			return json(
				{
					error:
						body.direction === 'increment'
						? 'You have already voted for this card'
						: 'You have not voted for this card yet',
					rating: result.rating,
					hasVoted: result.hasVoted,
					recovered: true
				},
				{ status: 409, headers: responseHeaders }
			);
		}

		return json(
			{
				rating: result.rating,
				hasVoted: result.hasVoted
			},
			{ headers: responseHeaders }
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to update rating';

		return json({ error: message }, { status: 500, headers: responseHeaders });
	}
}
