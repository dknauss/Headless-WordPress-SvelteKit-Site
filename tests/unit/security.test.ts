import { describe, expect, it } from 'vitest';
import {
	createSignedSessionCookie,
	validateCsrf,
	verifySignedSessionCookie
} from '../../src/lib/server/security';

describe('security helpers', () => {
	it('creates and verifies signed session cookies', () => {
		const signed = createSignedSessionCookie('session-123');

		expect(verifySignedSessionCookie(signed)).toBe('session-123');
		expect(verifySignedSessionCookie(`${signed}tampered`)).toBeNull();
		expect(verifySignedSessionCookie('missing-dot')).toBeNull();
	});

	it('validates csrf only when cookie, header, and origin align', () => {
		const validEvent = {
			cookies: {
				get: (name: string) => (name === 'tc_csrf' ? 'token-1' : undefined)
			},
			request: {
				headers: new Headers({
					'x-csrf-token': 'token-1',
					origin: 'http://localhost:5173'
				})
			},
			url: new URL('http://localhost:5173/api/rating')
		};

		const invalidEvent = {
			...validEvent,
			request: {
				headers: new Headers({
					'x-csrf-token': 'wrong',
					origin: 'http://malicious.example'
				})
			}
		};

		expect(validateCsrf(validEvent as never)).toBe(true);
		expect(validateCsrf(invalidEvent as never)).toBe(false);
	});
});
