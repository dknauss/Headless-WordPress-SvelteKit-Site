# Trading Cards Collection - Project Management

## Project Overview
A headless WordPress + SvelteKit tutorial project for displaying a trading card collection. This demonstrates how to use WordPress as a headless CMS with WPGraphQL API and SvelteKit as the frontend framework.

**Content:** Trading Card Collection   
**Backend:** WordPress (headless, read-only)  
**Frontend:** SvelteKit  
**API:** WPGraphQL for content + SvelteKit API routes for interactions  
**Tutorial:** [Building a Headless Application with WordPress and SvelteKit](https://amazing-questions-440483.framer.app/)

## Tutorial Sections
1. Intro to Headless
2. WordPress and WPGraphQL
3. Setting up SvelteKit
4. Building the User Interface
5. The Data Layer

## Todo

### High Priority
- [ ] Implement search/filter functionality
- [ ] Add pagination or infinite scroll for large collections

### Medium Priority
- [ ] Add card sorting options (by rating, title, date, etc.)
- [ ] Implement category filtering
- [ ] Add individual card detail pages

### Low Priority
- [ ] Add card statistics/dashboard
- [ ] Implement favorites/bookmarks

## In Progress
- Currently working on: Polishing and testing the complete data flow

## Completed
- [x] Set up SvelteKit project
- [x] Create Card component with rating support
- [x] Move Card component to src/components folder
- [x] Set up TypeScript types for Card interface
- [x] Create homepage grid layout
- [x] Simplify container structure
- [x] Set up WordPress backend with WPGraphQL plugin
- [x] Configure WPGraphQL schema for cards
- [x] Create TypeScript response types (CardsResponse)
- [x] Create data fetching utilities
- [x] Replace sample data with real WPGraphQL API calls
- [x] Integrate API with homepage
- [x] Add loading and error states to UI
- [x] Display featured images from WordPress
- [x] Display categories from WordPress
- [x] Move ratings storage and vote logic into SvelteKit + SQLite
- [x] Add CSRF, signed session cookies, and rate limiting for ratings

## Project Structure
```
src/
├── components/
│   ├── Card.svelte
│   └── CardRow.svelte
├── lib/
│   ├── rating.ts
│   ├── server/
│   │   ├── ratings.ts
│   │   ├── security.ts
│   │   └── wp.ts
│   └── types.ts
└── routes/
    ├── api/
    │   └── rating/+server.ts
    ├── +layout.svelte
    ├── +page.server.ts
    └── +page.svelte
```

## Notes & Ideas
- WordPress serves as the headless CMS and stays read-only
- Cards are stored as WordPress posts
- WPGraphQL exposes card content
- Ratings, per-session votes, and rate limiting live in local SQLite managed by SvelteKit
- This keeps interactive writes out of WordPress while still allowing a public demo interaction

## Technical Decisions
- Using SvelteKit with TypeScript
- Headless architecture: WordPress for content, SvelteKit for app logic
- API split: WPGraphQL for reads, SvelteKit API routes for writes
- Storage split: WordPress for editorial content, SQLite for rating interactions
- Security controls: signed session cookies, CSRF token, per-session vote tracking, IP/session rate limiting
- Deployment target: local or low-traffic single-instance demo site

## Resources
- **Tutorial:** [Building a Headless Application with WordPress and SvelteKit](https://amazing-questions-440483.framer.app/)
- **WPGraphQL Docs:** https://www.wpgraphql.com/
- **SvelteKit Docs:** https://kit.svelte.dev/
- **Architecture decision:** [docs/decisions/ratings-storage.md](docs/decisions/ratings-storage.md)
