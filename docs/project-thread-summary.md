# Project Thread Summary

## Executive summary

This thread started with a headless WordPress + SvelteKit trading-card site that read card data directly from WordPress on the client, displayed non-interactive rating data, and did not yet include the later ratings architecture, accessibility work, SEO work, CI, or test scaffolding.

From there, the work moved through these stages:

1. a ratings architecture decision to keep WordPress read-only and move rating storage and logic into SvelteKit with SQLite
2. implementation of the ratings system, including session handling, CSRF protection, rate limiting, and reset/seeding utilities
3. debugging of the local WordPress GraphQL connection and environment assumptions
4. repeated card UI refinements for rating numerals, hover behavior, tilt behavior, and homepage CTA behavior
5. an accessibility pass, automated verification, and accessibility documentation
6. a documented SEO / AEO / GEO roadmap followed by SEO Phase 1 implementation
7. a card image loading and caching pass, including same-origin media proxying and responsive image handling
8. separate process, testing, and CI branches for GSD, TDD, BDD, and GitHub Actions
9. fork-specific README / CONTRIBUTING work for meetup/tutorial positioning
10. git remote, branch, and PR workflow restructuring into an upstream-first local setup plus fork-specific docs and app branches
11. integration of the test/process branch into the fork-only `app-main` branch

The dialogue was iterative and branch-oriented. The user repeatedly chose direction explicitly, asked whether particular approaches were secure or appropriate, requested that work be separated into branches and PRs, asked for both code and documentation, and then refined UI and workflow decisions after local inspection. The assistant generally proposed an implementation direction, made changes, reported verification steps, and kept track of what was committed, uncommitted, branched, pushed, or opened as a PR.

## Initial project state

At the beginning of the thread, the repo was a headless WordPress + SvelteKit app that:

- fetched card data directly from WordPress on the client
- displayed rating information but did not yet support secure interactive rating writes
- had not yet gained the later server-side loading, docs, CI, test, accessibility, SEO, or image-loading improvements

A separate local repo, `trading-cards-collection`, was used as a reference point for comparison and feature inspiration.

## Stage 1: ratings architecture decision

The first major question was how to add a star-rating interaction comparable to the reference repo.

The key decisions were:

- do **not** use an mu-plugin
- do **not** expose a public WordPress write surface for ratings
- keep **WordPress read-only**
- own rating logic in **SvelteKit**
- store ratings outside WordPress in a local SvelteKit-managed database

There was also a brief discussion of WordPress postmeta as a storage option. The conclusion was:

- storing values in postmeta is not inherently insecure
- but anonymous public write access would require a trusted server-side gatekeeper
- for this project, the selected design was still to keep ratings fully out of WordPress and manage them in SvelteKit

## Stage 2: SQLite-backed ratings implementation

A ratings system was implemented using SQLite.

That work included:

- server-side WordPress reads
- a local SQLite database for ratings and vote tracking
- signed session cookies
- CSRF validation
- rate limiting
- a same-origin SvelteKit rating endpoint
- vote/session tracking
- persisted random starting ratings for cards not yet seen
- a local reset script for demo use

The app also moved away from the original direct browser-to-WordPress fetch pattern toward server-side data loading.

## Stage 3: local GraphQL and environment debugging

Once the ratings work was in place, the local app failed to fetch data.

That debugging established that:

- the branch the app was running from still contained older hardcoded local GraphQL assumptions
- the live local WordPress GraphQL endpoint was on port `8882`
- the app had been attempting to use the wrong endpoint on some branches

Fixes included:

- updating WordPress endpoint handling
- adding or correcting local environment configuration
- documenting expected local values
- restarting the dev server on the correct working branch

## Stage 4: rating UI and card interaction refinements

After the ratings feature worked, the thread moved through a long series of UI refinements.

### Rating behavior and rate limiting

The local rate limit was loosened after the user found it too restrictive for repeated demo interactions.

The ratings data layer was also updated so that cards could receive a persisted random starting rating between 0 and 9.

### Rating numeral styling

A specific issue was noticed where one displayed `7` looked like `1`.

Several attempts were made to fix that while preserving the comic-book aesthetic:

- changing font treatment
- adding CSS-based glyph clarification attempts
- reverting visually unsatisfactory treatments
- moving to **Fira Sans Extra Condensed Italic** for the rating numerals
- later restoring the original smaller star/rating size after subsequent UI changes

### Hover, tilt, and card rest state

The user compared the current repo’s hover effect to the reference repo and requested changes.

The sequence was:

- matching the stronger scale/tilt/shadow hover behavior from the reference repo
- fixing an animation conflict that prevented hover transforms from appearing correctly
- changing direction so cards would start with slight random tilt at rest and straighten vertically on hover

That final resting/hover behavior was implemented.

### Homepage interaction changes

Later, the user requested removal of the old homepage expand/accordion interaction.

This resulted in:

- removal of the `CLICK ME` button
- removal of the homepage accordion-style rollout of text
- replacement with a more prominent `View Card` CTA on each card

## Stage 5: accessibility work

An accessibility pass was then requested.

The changes included:

- improved card semantics and interaction structure
- separation of controls for expansion and rating where applicable
- better accessible naming
- focus-visible styling improvements
- a `main` landmark and better page structure
- screen-reader support improvements
- live status text for rating changes
- cleaner handling of hidden collapsed content

Automated verification included:

- Lighthouse accessibility checks
- `npm run check`
- `npm run build`

Two accessibility docs were added:

- `docs/accessibility/manual-qa-checklist.md`
- `docs/accessibility/accessibility-changes.md`

The accessibility UI changes and the accessibility docs were committed separately.

## Stage 6: SEO / AEO / GEO planning

The thread then moved into search and answer-surface planning.

A roadmap was created in `docs/seo/roadmap.md` describing:

- current site state
- phased work
- the importance of per-card detail pages as the main SEO target
- later phases for taxonomy and related content

The user explicitly asked for two policy sections to be added to the roadmap:

### Taxonomy archive pages

The roadmap was updated to state that taxonomy archives are:

- not inherently bad for SEO
- problematic when thin or duplicative
- not recommended in Phase 1
- best added later only if they provide unique value

### Pagination

The roadmap was updated to state that pagination is:

- acceptable as support structure
- not the primary SEO surface
- secondary to the homepage and individual card pages

## Stage 7: SEO Phase 1 implementation

The first implementation phase of the SEO roadmap was then completed.

That work added:

- card detail pages at `/cards/[slug]`
- server-side fetch-by-slug support
- page-level metadata
- JSON-LD structured data
- homepage metadata and structured data
- canonical links from homepage cards to detail pages
- dynamic `robots.txt`
- dynamic `sitemap.xml`
- canonical URL cleanup driven by a configurable site URL

This phase also simplified homepage interaction:

- no more accordion rollout
- no more `CLICK ME`
- a stronger `View Card` CTA instead

A follow-up change restored the category/taxonomy text to the comic-style display font.

## Stage 8: card image loading and caching work

A separate defect came up after the SEO work:

- card images were slow to appear on refresh or first load
- blank blue/skeleton states were visible for too long
- cards appeared together rather than individually

A separate branch handled this in several passes.

### Loading behavior and reveal sequence

The initial fixes adjusted:

- loading behavior for visible cards
- placeholder styling
- image fade-in behavior

The user then asked for a staged appearance where cards would seem to land on the table one by one.

The final behavior was:

- image requests still happened in parallel
- cards were visually revealed one at a time as their images became ready

### Media caching

To improve repeat loads and navigation performance, a same-origin media proxy route was added.

This changed media handling by:

- proxying WordPress media through a SvelteKit route
- adding cache headers suitable for browser reuse
- avoiding session-cookie creation for proxied media requests

### Responsive image sizing

To improve first-load performance as well as cached performance, WordPress image handling was further updated to:

- prefer generated image sizes over oversized originals
- provide responsive `srcset` data
- keep images large enough for the card frames while reducing unnecessary transfer size

A follow-up commit restored the original smaller rating star size.

## Stage 9: GSD, TDD, and BDD work

A separate branch introduced process and testing scaffolding.

That work added:

- `.planning/` structure for GSD workflow
- process documentation in `docs/process/engineering-workflow.md`
- unit tests
- BDD feature files and tests
- package scripts for tests
- Node type shims needed by the tests

This was initially kept separate from the main feature branches.

Later, it was merged into the fork-only integrated app branch.

## Stage 10: GitHub Actions CI

A dedicated CI branch added a minimal GitHub Actions workflow:

- `.github/workflows/ci.yml`
- Node 22
- npm dependency caching
- a clear `Check and build` job
- commands to run `npm ci`, `npm run check`, and `npm run build`

A separate upstream PR was opened for this workflow.

## Stage 11: fork-facing README and meetup/tutorial positioning

The user wanted the fork to have a highly visible README distinct from upstream.

A fork-only README and CONTRIBUTING file were created to frame the project as:

- a meetup/tutorial project connected to the Edmonton WordPress Meetup
- a student- and attendee-oriented learning resource
- a fork that experiments while contributing selected work upstream

At first the README referenced an externally hosted screenshot from the meetup site. That did not render reliably on GitHub, so the image was later downloaded into the repo and referenced locally instead.

## Stage 12: remote and branch workflow restructuring

The git workflow changed multiple times during the thread.

### Initial state during the thread

For part of the thread, the repo became effectively fork-first, with local work centered on the fork.

### Later cleanup

The user then asked to return to the earlier upstream-first model.

The resulting structure became:

- `origin` = Clem’s upstream repository
- `dknauss` = the user’s fork
- local `main` tracking `origin/main`
- local `fork-main` tracking the fork’s docs-oriented `main`
- local `app-main` tracking the fork-only integrated app branch
- `codex/*` branches used for feature work

This arrangement was documented in `docs/branch-strategy.md`.

## Stage 13: PR and integration structure

Three upstream PRs were opened during the thread:

1. ratings / accessibility work
2. SEO + image loading work
3. CI workflow work

The user also wanted a clean fork-only integrated app baseline.

That led to:

- creation of `codex/integrated-app`
- creation of fork branch `app-main`
- merging CI into the integrated app branch
- later merging the GSD/TDD/BDD branch into `app-main`

After that merge, verification was rerun successfully:

- `npm run test`
- `npm run check`
- `npm run build`

## Process and dialogue characteristics

The dialogue was iterative and explicit.

The user regularly:

- chose architecture direction directly
- asked for security, workflow, and process clarification
- requested separate branches and PRs for distinct concerns
- asked for docs as well as code
- evaluated local behavior and asked for repeated UI refinements
- asked what remained uncommitted and what branch work lived on
- asked for recommendations before the next step

The assistant generally:

- proposed an implementation path
- made the requested changes
- reported what changed and what was verified
- kept track of branch and PR separation
- responded to runtime or local-environment problems when they appeared

## Local tooling, environment, and platform details

### WordPress Studio / local WordPress environment

The user explicitly instructed that local development should use the Studio app and that it was already running.

In practice, the thread repeatedly involved local WordPress environment assumptions, including:

- confirming the live local GraphQL endpoint rather than relying on older hardcoded values
- restarting the SvelteKit dev server on the correct working branch
- using the WordPress environment as a read-only content source while SvelteKit handled interaction state

A recurring snag here was that different branches contained different local endpoint assumptions. Upstream `main` still reflected older local GraphQL defaults, while the newer feature branches had the corrected environment handling.

### Local / Flywheel

The skill catalog available in the session included local-environment skills for both Studio and Local by Flywheel contexts, but this thread did not include factual evidence of Local by Flywheel being used directly. The local environment work described in the thread was centered on the existing Studio/local WordPress setup and local port/endpoint behavior.

### Xdebug

The skill catalog also exposed Studio/Xdebug support, but Xdebug was not used in the thread. No PHP step-debugging session was run, and no Xdebug-specific configuration or troubleshooting occurred.

### Abilities

The skill catalog included WordPress Abilities API support, but the Abilities API was not used in this project thread. No abilities registration, abilities REST work, or related client integration was implemented.

### MCP, GitHub integration, and remote operations

GitHub operations in the thread included:

- creating and updating branches
- opening upstream PRs
- checking PR status
- inspecting failed checks
- pushing branch updates to the fork

A notable snag was that the failing checks on the upstream PRs were not code-test failures. The only failing check visible on the open PRs was the Vercel integration reporting `Authorization required to deploy`. At that point, no GitHub Actions failures were present because upstream had not yet merged the CI workflow.

### Skills used in the session

The session explicitly referenced or used several local Codex skills, including:

- `$local-studio-env`
- `$studio`
- `$wp-accessibility`
- `$gsd-progress`
- `$github-repo`
- `$gh-fix-ci`

The user later asked that skills used be reflected in commit messages, PR descriptions, and related notes where appropriate.

## Problems and snags encountered

Across the thread, the main problems encountered were:

- local GraphQL endpoint mismatches between branches
- rate limiting initially being too aggressive for local demo use
- difficulty preserving comic-book typography while making rating numerals legible
- hover animation conflicts caused by transform/animation interactions
- blank/skeleton image states lasting too long on first load
- duplicate/nested local clone directories created accidentally during recloning
- reinstalling dependencies after recloning/resetting because `node_modules` was gone, leading to `vite: command not found`
- running the app from the wrong branch (`main`) and seeing no cards because that branch still had older endpoint assumptions
- failing Vercel PR checks caused by authorization/deployment configuration rather than code failures
- initial test/check failures on `app-main` right after merging the test branch, caused by missing local test dependencies until `npm install` was rerun

## Current project shape at the end of the thread

By the end of the thread, the work had produced:

- an upstream PR for ratings and accessibility
- an upstream PR for SEO foundations and card image loading improvements
- an upstream PR for minimal GitHub Actions CI
- a fork-facing docs branch
- a fork-only integrated app branch (`app-main`) containing:
  - ratings work
  - accessibility work
  - SEO Phase 1
  - image loading and caching improvements
  - CI
  - GSD / TDD / BDD scaffolding
  - branch strategy documentation

## Appendix: branch and PR timeline

### Upstream PRs

- **PR #1** — `Add SQLite-backed ratings with SvelteKit-owned vote handling`
  - head: `dknauss:codex/sveltekit-sqlite-ratings`
  - URL: <https://github.com/clementm8/Headless-WordPress-SvelteKit-Site/pull/1>

- **PR #2** — `Add SEO foundations and improve card image loading`
  - head: `dknauss:codex/card-image-loading`
  - URL: <https://github.com/clementm8/Headless-WordPress-SvelteKit-Site/pull/2>

- **PR #3** — `Add minimal GitHub Actions CI workflow`
  - head: `dknauss:codex/github-ci`
  - URL: <https://github.com/clementm8/Headless-WordPress-SvelteKit-Site/pull/3>

### Branch / commit timeline

#### `codex/sveltekit-sqlite-ratings`

- `b222faa` — Add SQLite-backed ratings in SvelteKit
- `41b0a6d` — Refine card tilt and rating badge styling
- `4ca2877` — Improve card interaction accessibility
- `d8bf550` — Add accessibility QA documentation

#### `codex/card-image-loading`

- `ddba029` — Add SEO phase roadmap
- `b98a4de` — Implement SEO Phase 1 card pages and metadata
- `9746832` — Improve card image loading and caching
- `7328aab` — Add sitemap, robots, and canonical URL cleanup
- `edfdd24` — Restore original rating star size

#### `codex/github-ci`

- `be827c3` — Add minimal GitHub Actions CI workflow

#### `codex/gsd-tdd-bdd`

- `e8f886d` — Add GSD, TDD, and BDD workflow scaffolding

#### `codex/fork-readme`

- `694479b` — Create fork-facing meetup tutorial docs

#### `codex/integrated-app`

- `ce3893c` — Merge CI into integrated app branch

#### `app-main`

- `64785a3` — Document branch strategy
- `00f7714` — Merge testing workflow into app-main

#### `fork-main` / fork docs branch lineage

- `3176b87` — Create fork-facing meetup tutorial docs
- `755f314` — Revise README for clarity and detail
- `3e5213f` — Revise README for clarity on features and improvements
- `f8e897d` — Update README with UX experimentation details
- `9b8d14a` — Host meetup screenshot in fork README
- `f276902` — Update README.md
