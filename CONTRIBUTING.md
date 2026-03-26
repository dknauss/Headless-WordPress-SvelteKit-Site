# Contributing

Thanks for your interest in contributing.

This fork is especially meant to be friendly to:
- **students** learning WordPress and JavaScript
- **Edmonton WordPress Meetup attendees** continuing the workshop on their own
- developers experimenting with headless WordPress ideas in a safe local environment

## What kinds of contributions are welcome?

Good contributions include:
- fixing bugs
- improving setup instructions
- clarifying workshop/tutorial steps
- improving accessibility
- improving SEO or performance in a measurable way
- cleaning up UI details
- documenting lessons learned from meetup experiments

## Especially welcome from students and attendees

You do **not** need to be an expert.

Helpful beginner/intermediate contributions include:
- fixing typos or confusing instructions
- improving comments in the code
- documenting what worked or failed in your local setup
- making the app easier to understand
- adding tests for behavior that already exists
- identifying accessibility issues
- suggesting better developer experience for workshop participants

## Before you start

Please read:
- `README.md`
- `PROJECT.md`
- `docs/decisions/ratings-storage.md`
- `docs/seo/roadmap.md`

These documents explain the project goals and the main architectural decisions.

## Local setup for contributors

1. Make sure your local WordPress site is running.
2. Make sure WPGraphQL is available.
3. Copy `.env.example` to `.env`.
4. Install dependencies:

```bash
npm install
```

5. Start the development server:

```bash
npm run dev
```

6. Run checks before submitting changes:

```bash
npm run check
npm run build
```

## Contribution guidelines

### Keep changes focused

Small, well-scoped changes are easier to review than giant mixed commits.

Examples of good small contributions:
- one accessibility improvement
- one README/tutorial update
- one performance fix
- one SEO enhancement

### Respect the architecture

For this project, we are intentionally keeping:
- **WordPress read-only** for front-end interactions
- interactive rating logic in **SvelteKit**
- ratings stored in the **local SvelteKit database**, not WordPress postmeta

If you want to propose a different architecture, please explain:
- why it is better
- what tradeoffs it changes
- how it affects security, performance, and tutorial clarity

### Prefer clear explanations

If you submit a PR or patch, include:
- what changed
- why it changed
- how you tested it
- whether it affects meetup/tutorial participants

## Good first contribution ideas

- improve local setup instructions for Windows, macOS, or Linux
- improve error messages when WordPress is unreachable
- improve keyboard/focus behavior
- improve image loading or placeholder behavior
- improve metadata and documentation
- add beginner-friendly code comments
- document common WPGraphQL setup mistakes

## Questions and discussion

If you are coming from the Edmonton WordPress Meetup, contributions can also start as:
- a question
- a learning note
- a suggested improvement
- a reproducible bug report from your local workshop setup

That is useful contribution too.

## Upstream vs. fork contributions

This fork is both:
- a learning/project space for meetup follow-up work
- a place to prepare selected improvements for upstream PRs

That means some changes are:
- **fork-only** improvements for tutorial clarity or local experimentation
- **upstreamable** improvements that may be proposed back to the original project

Please keep that distinction in mind when suggesting changes.

## Be kind to learners

This repo is intentionally educational.

Please write comments, issues, and reviews in a way that helps newer developers learn:
- explain jargon when possible
- suggest next steps
- assume good intent
- prefer constructive feedback over gatekeeping
