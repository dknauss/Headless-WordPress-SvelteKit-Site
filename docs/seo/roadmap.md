# SEO / AEO / GEO Roadmap

**Project:** `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site`  
**Status:** Planning document  
**Current intent:** Document the roadmap now; implement Phase 1 later.

## Terms

- **SEO**: Search Engine Optimization
- **AEO**: Answer Engine Optimization
- **GEO**: Generative Engine Optimization

For this project, all three point toward the same core strategy:
- create stable, crawlable, entity-focused pages
- provide strong metadata and structured content
- make facts easy for search engines and AI systems to extract

## Current state

Today, the site primarily exposes:
- a homepage card grid at `/`
- card summaries loaded from WordPress via server-side SvelteKit code
- local ratings stored in the SvelteKit SQLite database

Current strengths:
- server-side loading is already in place
- WordPress is cleanly read-only
- card entities already have useful fields like `title`, `slug`, `excerpt`, `date`, `featuredImage`, and `categories`

Current gaps:
- no dedicated URL per card
- minimal metadata
- no sitemap
- no robots.txt
- no structured data
- limited internal linking strategy
- no AI-oriented discoverability guidance such as `llms.txt`

## Guiding principles

1. **One URL per card**
   - each card should eventually have its own canonical page
2. **WordPress remains read-only**
   - content source stays in WordPress
   - public experience stays in SvelteKit
3. **SSR-first public content**
   - key content should be visible in server-rendered HTML
4. **Metadata and schema should be explicit**
   - do not rely on search engines to infer everything from a homepage grid
5. **AEO/GEO should follow from good content structure**
   - concise facts, strong headings, and stable URLs do most of the work

## Primary goal

Make this project discoverable and understandable as a collection of individual trading card entities, not just a single homepage grid.

## Secondary goals

- improve search visibility for individual cards
- improve sharing previews
- make the content easier for answer engines and LLMs to summarize accurately
- establish a clean foundation for future category/set pages

---

## Phase 1 — Card detail pages and metadata

**Status:** Planned, not yet implemented  
**Priority:** Highest

### Goal

Create canonical detail pages for individual cards and add the metadata needed for search engines and AI systems to understand them as first-class entities.

### Why this phase comes first

This is the single biggest multiplier for SEO, AEO, and GEO because it creates:
- one stable URL per entity
- better crawlability
- stronger metadata targeting
- better opportunities for structured data

### Scope

#### Routing
Add detail pages such as:
- `/cards/[slug]`

#### Data loading
Extend the WordPress data layer to support:
- fetching a single card by slug
- fetching full card content where available
- merging local rating data into the detail page payload

#### Metadata
Add per-page metadata for card detail pages:
- document title
- meta description
- canonical URL
- Open Graph tags
- Twitter/X card tags

#### Homepage linking
Update homepage cards so users and crawlers can navigate to the canonical card page.

#### Structured data
Add JSON-LD for:
- homepage: `CollectionPage` and `ItemList`
- card pages: `Thing` or `CreativeWork`

### Proposed files

Likely additions:
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/src/routes/cards/[slug]/+page.server.ts`
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/src/routes/cards/[slug]/+page.svelte`

Likely updates:
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/src/lib/server/wp.ts`
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/src/routes/+page.svelte`
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/src/routes/+page.server.ts`

### Deliverables

- canonical card detail page route
- card page metadata
- homepage links to card pages
- basic JSON-LD on homepage and card pages

### Success criteria

- every card can be visited directly by slug
- each card page has a unique title and description
- homepage cards link to their canonical pages
- structured data appears in page HTML
- page content is server-rendered and readable without client JS

---

## Phase 2 — Crawl surfaces and index hygiene

**Status:** Planned  
**Priority:** High

### Goal

Make the site easier to crawl and index systematically.

### Scope

#### Sitemap
Add:
- `/sitemap.xml`

Include:
- homepage
- all card detail pages
- later: any category or set pages

#### Robots
Add:
- `/robots.txt`

Clarify:
- public crawlable areas
- sitemap location

#### Canonical consistency
Ensure:
- homepage canonical points to homepage
- each card page canonical points to itself
- no duplicate public routes compete with the canonical card URLs

### Proposed files

Likely additions:
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/src/routes/sitemap.xml/+server.ts`
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/src/routes/robots.txt/+server.ts`

### Deliverables

- valid sitemap
- valid robots.txt
- canonical URL consistency across public pages

### Success criteria

- crawlers can enumerate the important public URLs easily
- sitemap includes card pages
- canonical tags are internally consistent

---

## Phase 3 — Entity enrichment for AEO and GEO

**Status:** Planned  
**Priority:** High

### Goal

Make each card page more extractable and summarizable for answer engines and LLM-based systems.

### Scope

#### Fact blocks
Add visible, structured facts to card pages, such as:
- card title
- category / set
- published date
- rating
- any other trustworthy card fields available from WordPress

#### Content shaping
Ensure each detail page has:
- a concise summary near the top
- clear headings
- readable body content
- image context

#### Internal knowledge cues
Consider adding:
- breadcrumbs
- related cards
- links to category or set pages once those exist

### Deliverables

- structured “card facts” section
- cleaner top-of-page summary content
- internal links that reinforce entity relationships

### Success criteria

- a human can quickly understand the key facts of a card page
- a search engine or LLM can extract those facts reliably from the rendered HTML

---

## Pagination guidance

Pagination pages are generally **fine**, not bad, but they should be treated as secondary SEO surfaces rather than primary targets.

### Recommendation for this project

Keep pagination for usability and collection browsing.

However:
- the homepage should remain the main collection landing page
- individual card detail pages should remain the main SEO targets
- paginated views should support discovery, not replace canonical entity pages

### Risks

Pagination becomes less useful for SEO when it creates:
- many near-duplicate pages
- weak metadata across deep pages
- competition with stronger canonical pages

### Rule of thumb

> Pagination is good support structure, but it is not the primary SEO value in this project.

## Taxonomy archive guidance

Taxonomy archive pages are **not inherently bad for SEO**.

They become risky when they are:
- thin
- near-duplicates
- automatically generated with little unique value

They become valuable when they have:
- a unique URL
- a clear purpose
- a useful intro or summary
- distinct metadata
- a meaningful list of relevant cards
- internal-linking value

### Recommendation for this project

Do **not** add category/taxonomy archive pages in Phase 1.

Why:
- the biggest win still comes from canonical card detail pages
- taxonomy pages should only be added once they can provide real user and search value
- otherwise they risk becoming thin archive pages with duplicative content

### Category labels on cards

For now, category labels on the homepage should remain non-link text unless and until real archive pages are implemented.

### Rule of thumb

> Taxonomy pages are good when curated; bad when automatic and thin.

## Phase 4 — Collection, set, and category landing pages

**Status:** Planned  
**Priority:** Medium

### Goal

Create additional indexable surfaces around card groupings.

### Scope

Potential route types:
- `/sets/[slug]`
- `/categories/[slug]`
- `/characters/[slug]` if the taxonomy/data model supports it later

These pages should include:
- descriptive intros
- item lists
- internal links to card pages
- page-level metadata and structured data

### Deliverables

- at least one grouping page type beyond the homepage
- internal linking between grouping pages and card pages

### Success criteria

- card pages are no longer the only entity entry points
- the site has useful, crawlable topic clusters

---

## Phase 5 — GEO-oriented discoverability extras

**Status:** Planned  
**Priority:** Medium / optional

### Goal

Add machine-readable guidance and public discoverability hints aimed at emerging AI retrieval patterns.

### Scope

#### `llms.txt`
Add a simple public file describing:
- the site purpose
- important canonical content areas
- the preferred public reading surfaces

#### Additional machine-readable hygiene
Ensure:
- stable canonical URLs
- clean public HTML
- predictable heading structure
- no unnecessary client-only content barriers

### Proposed files

Possible addition:
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/static/llms.txt`

### Deliverables

- `llms.txt`
- documented public content strategy for AI-oriented consumption

### Success criteria

- the site exposes an explicit machine-readable summary of what matters most
- public content remains stable and well-structured for downstream consumers

---

## Out of scope for now

These are intentionally not in the first implementation wave:
- advanced search features
- faceted browsing
- multilingual SEO
- product-commerce integrations
- aggressive keyword targeting
- automated content generation for card descriptions

## Recommended implementation order

1. **Phase 1** — card detail pages and metadata
2. **Phase 2** — sitemap, robots, canonical hygiene
3. **Phase 3** — card fact blocks and stronger AEO/GEO structure
4. **Phase 4** — set/category landing pages
5. **Phase 5** — `llms.txt` and additional GEO extras

## Risks and caveats

### Data quality from WordPress
If excerpts or content are weak, metadata quality and page usefulness will also be weak.

### Overusing schema types
Do not force `Product` schema if the page is not meaningfully product-like. Start simpler with `Thing` or `CreativeWork`.

### Duplicate-content risk
If the homepage exposes too much identical detail text, canonical page strategy becomes more important.

### Deployment assumptions
Sitemap, canonical URL generation, and metadata should eventually be driven by the real site base URL rather than local dev defaults.

## Phase 1 readiness checklist

When ready to start Phase 1, confirm:
- preferred public base URL strategy
- desired metadata title pattern
- whether card detail pages should show full content or excerpt-first content
- whether homepage cards should remain expandable after adding detail-page links
- whether related cards should wait until a later phase

## Skills used

- planning only; no specialized skill was required for this document
