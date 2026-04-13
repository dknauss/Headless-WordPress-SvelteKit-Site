import { dev } from '$app/environment';
import { env as privateEnv } from '$env/dynamic/private';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const DEFAULT_STORE_PATH = path.join(process.cwd(), '.data', 'ratings.sqlite');
const RATE_LIMIT_WINDOW_MS = Number(privateEnv.RATING_RATE_LIMIT_WINDOW_MS || 60_000);
const RATE_LIMIT_MAX_ATTEMPTS = Number(
	privateEnv.RATING_RATE_LIMIT_MAX_ATTEMPTS || (dev ? 50 : 15)
);

type VoteDirection = 'increment' | 'decrement';
type RatingRow = {
	card_id: string;
	rating: number;
};

type CountRow = {
	count: number;
};

type VoteResult = {
	rating: number;
	hasVoted: boolean;
	changed: boolean;
};

function ensureParentDir(storePath: string) {
	fs.mkdirSync(path.dirname(storePath), { recursive: true });
}

function createDatabase(storePath: string) {
	ensureParentDir(storePath);

	const db = new DatabaseSync(storePath);

	db.exec(`
		PRAGMA journal_mode = WAL;
		PRAGMA synchronous = NORMAL;
		PRAGMA busy_timeout = 5000;

		CREATE TABLE IF NOT EXISTS card_ratings (
			card_id TEXT PRIMARY KEY,
			rating INTEGER NOT NULL DEFAULT 0 CHECK (rating >= 0)
		);

		CREATE TABLE IF NOT EXISTS votes (
			session_id TEXT NOT NULL,
			card_id TEXT NOT NULL,
			PRIMARY KEY (session_id, card_id)
		);

		CREATE TABLE IF NOT EXISTS attempts (
			session_id TEXT NOT NULL,
			ip TEXT NOT NULL,
			timestamp INTEGER NOT NULL
		);

		CREATE INDEX IF NOT EXISTS idx_attempts_session_timestamp
			ON attempts (session_id, timestamp);

		CREATE INDEX IF NOT EXISTS idx_attempts_ip_timestamp
			ON attempts (ip, timestamp);
	`);

	return db;
}

export function createRatingStore(storePath = DEFAULT_STORE_PATH) {
	const db = createDatabase(storePath);

	const getRatingStatement = db.prepare(
		'SELECT rating FROM card_ratings WHERE card_id = ? LIMIT 1'
	);
	const getAllRatingsStatement = db.prepare(
		'SELECT card_id, rating FROM card_ratings'
	);
	const insertRatingStatement = db.prepare(
		'INSERT OR IGNORE INTO card_ratings (card_id, rating) VALUES (?, ?)'
	);
	const getVotesForSessionStatement = db.prepare(
		'SELECT card_id FROM votes WHERE session_id = ? ORDER BY card_id ASC'
	);
	const hasVoteStatement = db.prepare(
		'SELECT 1 FROM votes WHERE session_id = ? AND card_id = ? LIMIT 1'
	);
	const insertVoteStatement = db.prepare(
		'INSERT OR IGNORE INTO votes (session_id, card_id) VALUES (?, ?)'
	);
	const deleteVoteStatement = db.prepare(
		'DELETE FROM votes WHERE session_id = ? AND card_id = ?'
	);
	const upsertIncrementStatement = db.prepare(`
		INSERT INTO card_ratings (card_id, rating)
		VALUES (?, 1)
		ON CONFLICT(card_id) DO UPDATE SET rating = rating + 1
	`);
	const ensureRatingStatement = db.prepare(
		'INSERT OR IGNORE INTO card_ratings (card_id, rating) VALUES (?, 0)'
	);
	const decrementRatingStatement = db.prepare(
		'UPDATE card_ratings SET rating = MAX(rating - 1, 0) WHERE card_id = ?'
	);
	const pruneAttemptsStatement = db.prepare(
		'DELETE FROM attempts WHERE timestamp < ?'
	);
	const getSessionAttemptCountStatement = db.prepare(
		'SELECT COUNT(*) AS count FROM attempts WHERE session_id = ?'
	);
	const getIpAttemptCountStatement = db.prepare(
		'SELECT COUNT(*) AS count FROM attempts WHERE ip = ?'
	);
	const insertAttemptStatement = db.prepare(
		'INSERT INTO attempts (session_id, ip, timestamp) VALUES (?, ?, ?)'
	);

	function withTransaction<T>(callback: () => T): T {
		db.exec('BEGIN IMMEDIATE');

		try {
			const result = callback();
			db.exec('COMMIT');
			return result;
		} catch (error) {
			db.exec('ROLLBACK');
			throw error;
		}
	}

	function getRating(cardId: string) {
		const row = getRatingStatement.get(cardId) as RatingRow | undefined;

		return Number(row?.rating ?? 0);
	}

	function getRatings() {
		const rows = getAllRatingsStatement.all() as RatingRow[];

		return new Map(rows.map((row) => [row.card_id, Number(row.rating)]));
	}

	function createInitialRating() {
		return Math.floor(Math.random() * 10);
	}

	function ensureRatings(cardIds: string[]) {
		const uniqueCardIds = [...new Set(cardIds)];

		withTransaction(() => {
			for (const cardId of uniqueCardIds) {
				insertRatingStatement.run(cardId, createInitialRating());
			}
		});

		return getRatings();
	}

	function getVotesForSession(sessionId: string) {
		const rows = getVotesForSessionStatement.all(sessionId) as Array<{ card_id: string }>;

		return rows.map((row) => row.card_id);
	}

	function applyVote(sessionId: string, cardId: string, direction: VoteDirection): VoteResult {
		return withTransaction(() => {
			const hasVote = Boolean(hasVoteStatement.get(sessionId, cardId));

			if (direction === 'increment') {
				if (hasVote) {
					return {
						rating: getRating(cardId),
						hasVoted: true,
						changed: false
					};
				}

				insertVoteStatement.run(sessionId, cardId);
				upsertIncrementStatement.run(cardId);

				return {
					rating: getRating(cardId),
					hasVoted: true,
					changed: true
				};
			}

			if (!hasVote) {
				return {
					rating: getRating(cardId),
					hasVoted: false,
					changed: false
				};
			}

			deleteVoteStatement.run(sessionId, cardId);
			ensureRatingStatement.run(cardId);
			decrementRatingStatement.run(cardId);

			return {
				rating: getRating(cardId),
				hasVoted: false,
				changed: true
			};
		});
	}

	function pruneAttempts(cutoff: number) {
		pruneAttemptsStatement.run(cutoff);
	}

	function isRateLimited(sessionId: string, ip: string, now = Date.now()) {
		const cutoff = now - RATE_LIMIT_WINDOW_MS;

		pruneAttempts(cutoff);

		const sessionRow = getSessionAttemptCountStatement.get(sessionId) as CountRow | undefined;
		const ipRow = getIpAttemptCountStatement.get(ip) as CountRow | undefined;

		return (
			Number(sessionRow?.count ?? 0) >= RATE_LIMIT_MAX_ATTEMPTS ||
			Number(ipRow?.count ?? 0) >= RATE_LIMIT_MAX_ATTEMPTS
		);
	}

	function recordAttempt(sessionId: string, ip: string, now = Date.now()) {
		const cutoff = now - RATE_LIMIT_WINDOW_MS;

		pruneAttempts(cutoff);
		insertAttemptStatement.run(sessionId, ip, now);
	}

	return {
		getRating,
		getRatings,
		ensureRatings,
		getVotesForSession,
		applyVote,
		isRateLimited,
		recordAttempt
	};
}

export const ratingStore = createRatingStore();
