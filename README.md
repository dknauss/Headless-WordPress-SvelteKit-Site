# Headless WordPress + SvelteKit Workshop Project for the Edmonton WordPress Meetup

![Screenshot from the Edmonton WordPress Meetup headless WordPress workshop recap](https://wpyeg.org/wp-content/uploads/2026/02/Screenshot-2026-02-25-at-10.31.39-PM.png)

A fork of Clem Omotosho’s headless WordPress workshop repo, adapted as a **hands-on tutorial project for the Edmonton WordPress Meetup**.

This version is designed for:
- meetup attendees following along with the workshop series
- students learning modern WordPress development
- developers curious about **headless / decoupled WordPress** with **SvelteKit**, **WPGraphQL**, and a local WordPress install

## Why this fork exists

At the Edmonton WordPress Meetup, Clem Omotosho led a workshop series on building a decoupled WordPress application with a SvelteKit front end. This fork keeps that workshop spirit, but extends the project into a more polished tutorial/demo app.

In this fork, WordPress stays the **read-only content source**, while SvelteKit handles the front-end experience and interactive features.

## Workshop context

This repo is inspired by:
- the Edmonton WordPress Meetup recap: [What Is Headless WordPress? Jan-Feb Workshop Recap & What’s Next at the YEG WP Meetup](https://wpyeg.org/2026/02/26/what-is-headless-wordpress-jan-feb-workshop-recap-whats-next-at-the-yeg-wp-meetup/)
- Clem Omotosho’s tutorial: [Building a Headless Application with WordPress and SvelteKit](https://amazing-questions-440483.framer.app/)

The meetup recap explains the big-picture goal well: WordPress keeps doing content management, while a separate front end handles presentation. Clem’s tutorial provides the original 5-step workshop path.

## What you build here

A Marvel-themed trading-card collection app where:
- **WordPress** stores the card content
- **WPGraphQL** exposes that content to the front end
- **SvelteKit** renders the collection and card detail pages
- **SQLite** stores local demo-only ratings in the SvelteKit app

## What this fork adds beyond the original workshop repo

This fork goes beyond the initial workshop scaffold with:
- server-rendered card detail pages
- interactive star ratings stored in the SvelteKit app, not in WordPress
- accessibility improvements and documentation
- SEO foundations:
  - canonical card pages
  - metadata + JSON-LD
  - `robots.txt`
  - `sitemap.xml`
- improved image loading and caching for the card grid
- a safer architecture that keeps WordPress read-only

## Architecture at a glance

- **WordPress**: content source only
- **WPGraphQL**: API layer for reading posts/card data
- **SvelteKit**: front-end app, routes, UI, metadata, rating API
- **SQLite**: local ratings/vote storage at `.data/ratings.sqlite`

## Why keep WordPress read-only?

For this demo/tutorial, that tradeoff keeps the architecture easier to reason about.

Benefits:
- no public anonymous write endpoint on WordPress
- no mu-plugin required for ratings
- easier experimentation in SvelteKit
- clearer separation between content management and front-end interaction

Tradeoffs:
- ratings are local to the SvelteKit app instance
- SQLite is best for simple local or low-traffic single-instance deployments
- if this grew into a larger production system, Postgres would be a better next step

See:
- [docs/decisions/ratings-storage.md](docs/decisions/ratings-storage.md)
- [docs/seo/roadmap.md](docs/seo/roadmap.md)

## Recommended learning path

If you are coming from the meetup or starting fresh, this is the suggested path:

1. **Read the meetup recap** to understand what “headless” means in practical WordPress terms.
2. **Work through Clem’s tutorial** to understand the original workshop flow:
   - intro to headless
   - WordPress + WPGraphQL
   - setting up SvelteKit
   - building the UI
   - building the data layer
3. **Use this fork** to study how the project can be extended safely and incrementally.

## Local setup

### 1. Set up your WordPress site

Follow Clem’s tutorial and the meetup notes to create a local WordPress site and enable:
- WordPress
- WPGraphQL
- the workshop content/cards

The tutorial materials include the **trading-card content export data** used for the workshop. Import that into WordPress so your local site has the sample card content.

### 2. Confirm your GraphQL endpoint

You should be able to reach a local GraphQL endpoint such as:

```txt
http://127.0.0.1:8882/graphql/
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create your local environment file

Copy `.env.example` to `.env` and update as needed.

Example:

```env
WP_GRAPHQL_URL=http://127.0.0.1:8882/graphql/
PUBLIC_SITE_URL=http://localhost:5173
SESSION_SECRET=change-me-in-production
RATING_RATE_LIMIT_MAX_ATTEMPTS=50
RATING_RATE_LIMIT_WINDOW_MS=60000
```

### 5. Run the app

```bash
npm run dev
```

Then open:

```txt
http://localhost:5173
```

## Useful commands

Check the project:

```bash
npm run check
```

Build the project:

```bash
npm run build
```

Reset the local ratings database:

```bash
npm run ratings:reset
```

## What to explore in the codebase

If you are learning from this repo, these are good entry points:

### WordPress data access
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/src/lib/server/wp.ts`

### SEO helpers
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/src/lib/server/seo.ts`

### Ratings architecture
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/src/lib/server/ratings.ts`
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/src/routes/api/rating/+server.ts`

### Card UI
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/src/components/Card.svelte`
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/src/components/CardRow.svelte`

### Card detail pages
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/src/routes/cards/[slug]/+page.server.ts`
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/src/routes/cards/[slug]/+page.svelte`

## Good workshop discussion questions

If you are using this for meetup discussion or study, here are some useful questions to explore:
- When is headless WordPress actually worth the complexity?
- When should WordPress remain monolithic instead?
- What belongs in WordPress vs. the front end?
- How do SEO, accessibility, and performance responsibilities change in a decoupled setup?
- When is a local SQLite-backed feature “good enough,” and when should it move to shared infrastructure?

## Contributing

This fork welcomes contributions from:
- meetup attendees
- students
- WordPress developers learning headless architecture
- front-end developers curious about WordPress as a content platform

Please see [CONTRIBUTING.md](CONTRIBUTING.md).

## Upstream credit

Original workshop/tutorial concept and repo inspiration:
- Clem Omotosho

Meetup context and writeup:
- Edmonton WordPress Meetup / WP YEG

## Fork note

This is a fork-oriented README intended for visitors to **Dan Knauss’s fork**.
It is intentionally more tutorial- and meetup-facing than the upstream project documentation.
