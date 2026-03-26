# Headless-WordPress-SvelteKit-Site

This project demonstrates a headless architecture in which WordPress stays read-only and SvelteKit owns the interactive rating feature. Content lives in WordPress and is rendered through SvelteKit using WPGraphQL.

## Architecture summary

- **WordPress**: read-only content source for cards
- **SvelteKit**: server-rendered app, rating API, CSRF/session enforcement
- **SQLite**: local rating, vote, and rate-limit storage at `.data/ratings.sqlite`

## Why ratings live in SvelteKit instead of WordPress

We explicitly chose to keep rating writes out of WordPress so we do not need an mu-plugin or another public WordPress write surface.

Benefits:

- keeps WordPress read-only for this demo
- avoids exposing anonymous WPGraphQL or REST mutations
- lets us enforce CSRF, signed sessions, and rate limiting in one place
- keeps the rating interaction fast for a simple local or low-traffic deployment

Tradeoffs:

- ratings are local to the SvelteKit app instance
- SQLite is best for one persistent server, not multi-instance/serverless hosting
- if we later need shared infrastructure or analytics-heavy querying, Postgres becomes the better fit

See [docs/decisions/ratings-storage.md](docs/decisions/ratings-storage.md) for the full decision record.

## Configuration

Copy `.env.example` to `.env` and adjust values as needed.

- `WP_GRAPHQL_URL`: WordPress GraphQL endpoint used by the SvelteKit server
- `PUBLIC_SITE_URL`: canonical public site URL used for metadata, sitemap, and robots output
- `SESSION_SECRET`: secret used to sign the session cookie in production
- `RATING_RATE_LIMIT_MAX_ATTEMPTS`: max rating actions allowed per window
- `RATING_RATE_LIMIT_WINDOW_MS`: rate-limit window in milliseconds

For this machine, the safest local default is `http://127.0.0.1:8882/graphql/`. If your WordPress site runs on a different port, update `.env`.
In development, the default rating limit is now 50 actions per minute so local demos do not get throttled too aggressively.

## Development

```bash
npm install
npm run check
npm run dev
```

Reset local ratings data:

```bash
npm run ratings:reset
```
