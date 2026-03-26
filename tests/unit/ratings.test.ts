import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRatingStore } from '../../src/lib/server/ratings';

const tempDirs: string[] = [];

function createStore() {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ratings-store-'));
	tempDirs.push(dir);
	return createRatingStore(path.join(dir, 'ratings.sqlite'));
}

afterEach(() => {
	vi.restoreAllMocks();
	for (const dir of tempDirs.splice(0)) {
		fs.rmSync(dir, { recursive: true, force: true });
	}
});

describe('createRatingStore', () => {
	it('seeds missing cards with stable persisted initial ratings in the 0-9 range', () => {
		vi.spyOn(Math, 'random').mockReturnValue(0.73);
		const store = createStore();

		const ratings = store.ensureRatings(['card-a', 'card-b', 'card-a']);

		expect(ratings.get('card-a')).toBe(7);
		expect(ratings.get('card-b')).toBe(7);
		expect(store.getRating('card-a')).toBe(7);
		expect(store.getRating('card-b')).toBe(7);
	});

	it('increments only once per session for the same card', () => {
		const store = createStore();

		const first = store.applyVote('session-1', 'card-a', 'increment');
		const second = store.applyVote('session-1', 'card-a', 'increment');

		expect(first).toEqual({ rating: 1, hasVoted: true, changed: true });
		expect(second).toEqual({ rating: 1, hasVoted: true, changed: false });
		expect(store.getVotesForSession('session-1')).toEqual(['card-a']);
	});

	it('removes a vote and never lets rating drop below zero', () => {
		const store = createStore();

		store.applyVote('session-1', 'card-a', 'increment');
		const removed = store.applyVote('session-1', 'card-a', 'decrement');
		const removedAgain = store.applyVote('session-1', 'card-a', 'decrement');

		expect(removed).toEqual({ rating: 0, hasVoted: false, changed: true });
		expect(removedAgain).toEqual({ rating: 0, hasVoted: false, changed: false });
		expect(store.getRating('card-a')).toBe(0);
	});

	it('rate limits by session or IP within the configured window', () => {
		const store = createStore();
		const now = 1_000_000;

		for (let i = 0; i < 50; i += 1) {
			store.recordAttempt('session-1', '127.0.0.1', now + i);
		}

		expect(store.isRateLimited('session-1', '127.0.0.1', now + 51)).toBe(true);
		expect(store.isRateLimited('session-2', '127.0.0.1', now + 51)).toBe(true);
	});
});
