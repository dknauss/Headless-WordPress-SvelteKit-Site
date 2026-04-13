import { dev } from '$app/environment';
import { env as privateEnv } from '$env/dynamic/private';
import crypto from 'node:crypto';
import type { Cookies, RequestEvent } from '@sveltejs/kit';

export const SESSION_COOKIE_NAME = 'tc_session';
export const CSRF_COOKIE_NAME = 'tc_csrf';

const DEV_SESSION_SECRET = 'dev-session-secret-change-me';

function getSessionSecret() {
	return privateEnv.SESSION_SECRET || (dev ? DEV_SESSION_SECRET : '');
}

function sign(value: string) {
	const secret = getSessionSecret();

	if (!secret) {
		throw new Error('SESSION_SECRET must be configured in production');
	}

	return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

export function createSignedSessionCookie(sessionId: string) {
	return `${sessionId}.${sign(sessionId)}`;
}

export function verifySignedSessionCookie(value: string | undefined) {
	if (!value) {
		return null;
	}

	const [sessionId, signature] = value.split('.');

	if (!sessionId || !signature) {
		return null;
	}

	const expected = sign(sessionId);
	const actualBuffer = Buffer.from(signature);
	const expectedBuffer = Buffer.from(expected);

	if (actualBuffer.length !== expectedBuffer.length) {
		return null;
	}

	if (!crypto.timingSafeEqual(actualBuffer, expectedBuffer)) {
		return null;
	}

	return sessionId;
}

export function ensureSession(cookies: Cookies) {
	const existing = verifySignedSessionCookie(cookies.get(SESSION_COOKIE_NAME));

	if (existing) {
		return existing;
	}

	const sessionId = crypto.randomUUID();

	cookies.set(SESSION_COOKIE_NAME, createSignedSessionCookie(sessionId), {
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secure: !dev,
		maxAge: 60 * 60 * 24 * 365
	});

	return sessionId;
}

export function ensureCsrfToken(cookies: Cookies) {
	const existing = cookies.get(CSRF_COOKIE_NAME);

	if (existing) {
		return existing;
	}

	const token = crypto.randomUUID();

	cookies.set(CSRF_COOKIE_NAME, token, {
		httpOnly: false,
		path: '/',
		sameSite: 'lax',
		secure: !dev,
		maxAge: 60 * 60 * 24 * 30
	});

	return token;
}

export function validateCsrf(event: RequestEvent) {
	const cookieToken = event.cookies.get(CSRF_COOKIE_NAME);
	const headerToken = event.request.headers.get('x-csrf-token');
	const origin = event.request.headers.get('origin');
	const requestOrigin = event.url.origin;

	if (!cookieToken || !headerToken || cookieToken !== headerToken) {
		return false;
	}

	if (origin && origin !== requestOrigin) {
		return false;
	}

	return true;
}

export function getClientIp(event: RequestEvent) {
	const forwarded = event.request.headers.get('x-forwarded-for');

	if (forwarded) {
		return forwarded.split(',')[0]?.trim() || 'unknown';
	}

	try {
		return event.getClientAddress();
	} catch {
		return 'unknown';
	}
}
