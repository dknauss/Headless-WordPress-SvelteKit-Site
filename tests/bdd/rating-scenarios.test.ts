import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createRatingStore } from '../../src/lib/server/ratings';

const tempDirs: string[] = [];

function createStore() {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ratings-bdd-'));
	tempDirs.push(dir);
	return createRatingStore(path.join(dir, 'ratings.sqlite'));
}

afterEach(() => {
	for (const dir of tempDirs.splice(0)) {
		fs.rmSync(dir, { recursive: true, force: true });
	}
});

describe('Feature: Rating interaction', () => {
	it('Scenario: A visitor rates a card once', () => {
		const store = createStore();

		// Given a card starts with no votes from the current session
		expect(store.getVotesForSession('session-1')).toEqual([]);
		expect(store.getRating('card-a')).toBe(0);

		// When the visitor rates the card
		const result = store.applyVote('session-1', 'card-a', 'increment');

		// Then the rating increases by one
		expect(result.rating).toBe(1);
		// And the session is recorded as having voted on that card
		expect(store.getVotesForSession('session-1')).toEqual(['card-a']);
	});

	it('Scenario: A visitor clicks rate twice on the same card', () => {
		const store = createStore();
		store.applyVote('session-1', 'card-a', 'increment');

		// Given the visitor has already rated the card
		expect(store.getVotesForSession('session-1')).toEqual(['card-a']);

		// When the visitor rates the same card again
		const result = store.applyVote('session-1', 'card-a', 'increment');

		// Then the rating does not increase again
		expect(result.rating).toBe(1);
		expect(result.changed).toBe(false);
		// And the stored vote remains singular for that session
		expect(store.getVotesForSession('session-1')).toEqual(['card-a']);
	});

	it('Scenario: A visitor removes an existing vote', () => {
		const store = createStore();
		store.applyVote('session-1', 'card-a', 'increment');

		// Given the visitor has already rated the card
		expect(store.getVotesForSession('session-1')).toEqual(['card-a']);

		// When the visitor removes the vote
		const result = store.applyVote('session-1', 'card-a', 'decrement');

		// Then the rating decreases by one
		expect(result.rating).toBe(0);
		// And the session no longer has a vote recorded for that card
		expect(store.getVotesForSession('session-1')).toEqual([]);
	});
});
