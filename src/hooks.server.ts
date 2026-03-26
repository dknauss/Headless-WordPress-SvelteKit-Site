import { ensureCsrfToken, ensureSession, getClientIp } from '$lib/server/security';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.sessionId = ensureSession(event.cookies);
	event.locals.csrfToken = ensureCsrfToken(event.cookies);
	event.locals.clientIp = getClientIp(event);

	return resolve(event);
};
