import { buildAbsoluteUrl } from '$lib/server/seo';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url, setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=3600'
	});

	const body = [
		'User-agent: *',
		'Allow: /',
		'Disallow: /api/',
		`Sitemap: ${buildAbsoluteUrl('/sitemap.xml', url)}`
	].join('\n');

	return new Response(body, {
		headers: {
			'content-type': 'text/plain; charset=utf-8'
		}
	});
};
