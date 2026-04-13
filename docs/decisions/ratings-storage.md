# Ratings storage decision

**Date:** 2026-03-25

## Decision

Store public rating state in a local SQLite database owned by SvelteKit, while keeping WordPress read-only.

## Context

This repo needs a small public star-rating interaction similar to the earlier trading-card prototype work, but without relying on an mu-plugin and without exposing WordPress as a public write target.

The app is intended for local development and, at most, a low-traffic public demo deployment.

## Options considered

### Option A: Store ratings in WordPress postmeta

Pros:

- keeps all content in one CMS
- rating values are naturally queryable from WordPress
- convenient if ratings must appear in wp-admin

Cons:

- public voting still needs trusted server-side write controls
- requires custom WordPress code somewhere (plugin, theme, or snippet)
- increases the chance of exposing an unnecessary public write surface in WordPress
- makes the headless app less cleanly separated between editorial reads and app writes

### Option B: Store ratings in SvelteKit with SQLite

Pros:

- keeps WordPress read-only
- no mu-plugin required
- secure same-origin write path through SvelteKit
- easy to add CSRF, signed sessions, rate limiting, and vote tracking
- simple operational footprint for local and demo hosting

Cons:

- ratings are local to the SvelteKit deployment
- not suitable for multi-instance or serverless deployments with ephemeral storage
- SQLite is not the right long-term choice if traffic, write concurrency, or reporting needs grow significantly

## Decision outcome

Choose **Option B**.

## Implementation notes

- WordPress remains the source of truth for card content
- SvelteKit server loads cards from WPGraphQL in `src/lib/server/wp.ts`
- Ratings are stored in `.data/ratings.sqlite`
- Public rating writes go only through `src/routes/api/rating/+server.ts`
- Security controls include:
  - signed session cookie
  - CSRF token validation
  - origin check
  - per-session vote tracking
  - IP/session rate limiting

## Revisit this decision if

- the app needs to run on more than one instance
- the deployment target has no persistent filesystem
- ratings need to be managed or reported on inside WordPress
- traffic grows beyond a simple demo workload

At that point, the likely next step is moving rating storage to Postgres while keeping WordPress read-only.
