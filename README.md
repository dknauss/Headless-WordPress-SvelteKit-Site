# Headless WordPress + SvelteKit Workshop Project for the Edmonton WordPress Meetup

![Screenshot from the Edmonton WordPress Meetup headless WordPress workshop recap](https://wpyeg.org/wp-content/uploads/2026/02/Screenshot-2026-02-25-at-10.31.39-PM.png)

This is a fork of [Clem Omotosho’s headless WordPress workshop repo](https://github.com/clementm8/Headless-WordPress-SvelteKit-Site), a **hands-on tutorial project for the Edmonton WordPress Meetup**.

The upstream repo and this fork are intended for:
- YEG meetup attendees following along with the workshop series.
- Students learning modern WordPress development.
- Developers curious about **headless / decoupled WordPress** with **SvelteKit**, **WPGraphQL**, and a local WordPress install.

## Getting Started

[Clem's tutorial](https://amazing-questions-440483.framer.app/) provides the 5-step workshop path to create your own working version of the original demo site in his repo. You should work through the tutorial in your local development environment first. Then, if you want to share any changes you make, create a fork and make a pull request to Clem's upstream source. (You could also do that with this downstream repo if you prefer.) Since this is a purely educational project, please document your work excessively, explain what you've learned, and ask any questions you have. :-)

### What's unique to this fork?

I wanted to add a live rating interaction and originally did that in a very crude way that is insecure and not likely to do well under any kind of load: direct GraphQL mutations to WordPress `postmeta`. Later, this was modified so that read and write actions happened through the Svelte back end — more secure but also slowing down an already non-optimized demo. Finally, in this fork, WordPress remains entirely a read-only content source, while SvelteKit handles the front-end experience and interactive features by storing the changing rating figures per card in its own SQLite database. 

- Added live rating interactions and expanded/modified visual feedback. (See [`/docs/decisions/ratings-storage.md`](https://github.com/dknauss/Headless-WordPress-SvelteKit-Site/blob/codex/card-image-loading/docs/decisions/ratings-storage.md).)
- Replaced the "Click Me" button and card descriptive content that it rolls out in favour of clicking through to an individual card page.
  - Added a second page template for individual cards.
- Basic SEO framework and enhancements. (See [`/docs/seo/roadmap.md`](https://github.com/dknauss/Headless-WordPress-SvelteKit-Site/blob/codex/card-image-loading/docs/seo/roadmap.md).) 
- Basic Accessibility enhancements. (See [`/docs/accessibility/accessibility-changes.md`](https://github.com/dknauss/Headless-WordPress-SvelteKit-Site/blob/codex/card-image-loading/docs/accessibility/accessibility-changes.md) and [`manual-qa-checklist.md`](https://github.com/dknauss/Headless-WordPress-SvelteKit-Site/blob/codex/card-image-loading/docs/accessibility/manual-qa-checklist.md).

### What you get here

Clem's original Marvel-themed trading-card collection app where:
- **WordPress** stores the card content. (Sole content source)
- **WPGraphQL** exposes that content to the front end. (API layer for reading posts/card data from WordPress.)
- **SvelteKit** renders the collection and card detail pages. (Runtime JS front-end app, routes, UI, metadata, rating API)
- **SQLite** stores local demo-only ratings in the SvelteKit app. (Local ratings/vote storage at `.data/ratings.sqlite`)

### What this fork adds beyond the original workshop repo

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

## Why keep WordPress read-only?

For this demo/tutorial, that tradeoff keeps the architecture easier to reason about.

**Benefits:**
- no public anonymous write endpoint on WordPress
- no mu-plugin required for ratings
- easier experimentation in SvelteKit
- clearer separation between content management and front-end interaction

**Tradeoffs:**
- ratings are local to the SvelteKit app instance
- SQLite is best for simple local or low-traffic single-instance deployments
- if this grew into a larger production system, Postgres would be a better next step

**See:**
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
4. **Create your own fork** — this is not a private learning exercise: anyone can join. :-) 

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
- `/src/lib/server/wp.ts`

### SEO helpers
- `/src/lib/server/seo.ts`

### Ratings architecture
- `/src/lib/server/ratings.ts`
- `/src/routes/api/rating/+server.ts`

### Card UI
- `/src/components/Card.svelte`
- `/src/components/CardRow.svelte`

### Card detail pages
- `/src/routes/cards/[slug]/+page.server.ts`
- `/src/routes/cards/[slug]/+page.svelte`

## Good workshop discussion questions

- When is headless WordPress actually worth the complexity?
- When should WordPress remain monolithic instead?
- What belongs in WordPress vs. the front end?
- How do SEO, accessibility, and performance responsibilities change in a decoupled setup?
- When is a feature or architectural choice like the local SQLite rating store “good enough,” and when should it move to shared infrastructure with the CMS?

## Contributing

This fork welcomes contributions from:
- meetup attendees
- students
- WordPress developers learning headless architecture
- front-end developers curious about WordPress as a content platform

Please see [CONTRIBUTING.md](CONTRIBUTING.md).

## Upstream credit

Original workshop/tutorial concept and repo inspiration:
- [Clem Omotosho](https://github.com/clementm8/)

Meetup context and writeup:
- [Edmonton WordPress Meetup / WP YEG](https://wpyeg.org)

## Fork note

This is a fork-oriented README intended for visitors to **Dan Knauss’s fork**.
It is intentionally more tutorial- and meetup-facing than the upstream project documentation.
