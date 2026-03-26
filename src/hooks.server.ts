import { ensureCsrfToken, ensureSession, getClientIp } from '$lib/server/security';
import type { Handle } from '@sveltejs/kit';

const SESSION_FREE_PATH_PREFIXES = ['/wp-media/'];
const SESSION_FREE_EXACT_PATHS = ['/robots.txt', '/sitemap.xml'];

export const handle: Handle = async ({ event, resolve }) => {
	const isSessionFreeRequest =
		SESSION_FREE_EXACT_PATHS.includes(event.url.pathname) ||
		SESSION_FREE_PATH_PREFIXES.some((prefix) => event.url.pathname.startsWith(prefix));

	if (!isSessionFreeRequest) {
		event.locals.sessionId = ensureSession(event.cookies);
		event.locals.csrfToken = ensureCsrfToken(event.cookies);
	}

	event.locals.clientIp = getClientIp(event);

	return resolve(event);
};
