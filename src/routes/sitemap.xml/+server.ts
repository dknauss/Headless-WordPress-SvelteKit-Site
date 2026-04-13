import { buildAbsoluteUrl } from '$lib/server/seo';
import { getCards } from '$lib/server/wp';
import type { RequestHandler } from './$types';

function escapeXml(value: string) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export const GET: RequestHandler = async ({ fetch, url, setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=3600'
	});

	const cards = await getCards(fetch);
	const entries = [
		{
			loc: buildAbsoluteUrl('/', url),
			lastmod: undefined as string | undefined
		},
		...cards.posts.nodes
			.filter((card) => card.slug)
			.map((card) => ({
				loc: buildAbsoluteUrl(`/cards/${card.slug}`, url),
				lastmod: card.date ? new Date(card.date).toISOString() : undefined
			}))
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(entry) => `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>${entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ''}\n  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'content-type': 'application/xml; charset=utf-8'
		}
	});
};
