import { error } from '@sveltejs/kit';
import { fetchWpMedia } from '$lib/server/wp';

const CACHE_CONTROL = 'public, max-age=31536000, immutable';
const PASSTHROUGH_HEADERS = [
	'content-type',
	'content-length',
	'content-disposition',
	'etag',
	'last-modified',
	'accept-ranges'
] as const;

function buildHeaders(upstream: Response) {
	const headers = new Headers();

	for (const name of PASSTHROUGH_HEADERS) {
		const value = upstream.headers.get(name);
		if (value) {
			headers.set(name, value);
		}
	}

	headers.set('cache-control', CACHE_CONTROL);
	return headers;
}

export async function GET({ params, fetch }) {
	const mediaPath = params.path;

	if (!mediaPath) {
		throw error(404, 'Media not found');
	}

	try {
		const upstream = await fetchWpMedia(mediaPath, fetch);
		return new Response(upstream.body, {
			status: upstream.status,
			headers: buildHeaders(upstream)
		});
	} catch (cause) {
		console.error('Failed to proxy WordPress media:', cause);
		throw error(404, 'Media not found');
	}
}
