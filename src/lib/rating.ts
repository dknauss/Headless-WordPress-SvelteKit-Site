type RatingDirection = 'increment' | 'decrement';

type RatingResult = {
	rating: number;
	hasVoted: boolean;
	recovered?: boolean;
	error?: string;
};

function getCookie(name: string) {
	const cookies = document.cookie.split(';');

	for (const cookie of cookies) {
		const [key, ...value] = cookie.trim().split('=');

		if (key === name) {
			return decodeURIComponent(value.join('='));
		}
	}

	return '';
}

async function updateRating(
	id: string,
	direction: RatingDirection
): Promise<RatingResult> {
	const csrfToken = getCookie('tc_csrf');

	const response = await fetch('/api/rating', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-csrf-token': csrfToken
		},
		body: JSON.stringify({ id, direction })
	});

	const payload = (await response.json()) as {
		rating?: number | null;
		hasVoted?: boolean;
		recovered?: boolean;
		error?: string;
	};

	if (
		payload.rating !== undefined &&
		payload.rating !== null &&
		typeof payload.hasVoted === 'boolean'
	) {
		return {
			rating: payload.rating,
			hasVoted: payload.hasVoted,
			recovered: payload.recovered,
			error: payload.error
		};
	}

	if (!response.ok || payload.rating === undefined || payload.rating === null) {
		throw new Error(payload.error || 'Failed to update rating');
	}

	return {
		rating: payload.rating,
		hasVoted: direction === 'increment'
	};
}

export function incrementRating(id: string): Promise<RatingResult> {
	return updateRating(id, 'increment');
}

export function decrementRating(id: string): Promise<RatingResult> {
	return updateRating(id, 'decrement');
}
